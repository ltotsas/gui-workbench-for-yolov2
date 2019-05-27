import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as utils from '../utils';
import {Images} from '../models/images';
import {Subject} from 'rxjs/internal/Subject';

@Injectable()
export class ImagesService {
  private _files = [];
  private messageSource = new Subject();
  url = utils.BASE_URL + '/image-management';
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient) {}

  public getImagesFromApi() {
      return this.http.get(this.url + '/images');
  }

  private containsObject(obj, list) {
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i].filename === obj.filename) {
        return true;
      }
    }
    return false;
  }

  public initializeImages(): Promise<any> {
    return new Promise((resolve) => {
      this._files = [];
      this.getImagesFromApi().subscribe((res: Images[]) => {
        res.forEach((img: Images) => {
            // console.log('init: ', img);
            this._files.push(img);
        });
      });
      resolve(this._files);
      this.messageSource.next(this._files);
    });
  }

  public updateImages() {
    this.getImagesFromApi().subscribe((res: Images[]) => {
      res.forEach((img: Images) => {
        if (this._files === [] || !this.containsObject(img, this._files)) {
          console.log('update: ', img);
          this._files.push(img);
        }
      });
    });
    this.messageSource.next(this._files);
  }
}
