import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import * as utils from '../utils';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {Annotations} from '../models/annotations';

@Injectable()
export class ImageAnnotationService {

  PROJECT_MANAG_URL = utils.BASE_URL + '/project-management';
  IMAGE_MANAG_URL = utils.BASE_URL + '/image-management';
  private messageSource = new BehaviorSubject('empty');
  currentMessage = this.messageSource.asObservable();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) {
  }

  changeImage(message: string) {
    this.messageSource.next(message);
  }

  newClassAPI(value: any): Observable<any> {
    const body = {
      'classname': value
    };
    return this.http.post(this.PROJECT_MANAG_URL + '/class/new', body, this.httpOptions);
  }

  deleteClassAPI(value: any): Observable<any> {
    const body = {
      'classname': value
    };
    return this.http.post(this.PROJECT_MANAG_URL + '/class/delete', body, this.httpOptions);
  }

  getClassesAPI(): Observable<any> {
    return this.http.get(this.PROJECT_MANAG_URL + '/class/list');
  }

  newAnnotationAPI(annotation: Annotations, img: string) {
    const body = {
      'name': img,
      'id': annotation.id,
      'class': annotation.class,
      'imgWidth': annotation.imgWidth,
      'imgHeight': annotation.imgHeight,
      'x': annotation.x,
      'y': annotation.y,
      'width': annotation.width,
      'height': annotation.height
    };
    return this.http.post(this.IMAGE_MANAG_URL + '/annotate/new', body, this.httpOptions).subscribe();
  }

  updateAnnotationAPI(annotation: Annotations, img: string) {
    console.log(annotation);
    const body = {
      'name': img,
      'id': annotation.id,
      'class': annotation.class,
      'imgWidth': annotation.imgWidth,
      'imgHeight': annotation.imgHeight,
      'x': annotation.x,
      'y': annotation.y,
      'width': annotation.width,
      'height': annotation.height
    };
    return this.http.post(this.IMAGE_MANAG_URL + '/annotate/update', body, this.httpOptions).subscribe();
  }

  deleteAnnotationAPI(annotation: Annotations, img: string) {
    const body = {
      'id': annotation.id,
      'name': img
    };
    return this.http.post(this.IMAGE_MANAG_URL + '/annotate/delete', body, this.httpOptions).subscribe();
  }

  getAnnotationAPI(img: string): Promise<Annotations[]> {
    return this.http.get(this.IMAGE_MANAG_URL + '/annotate/list/' + img, this.httpOptions)
      .toPromise()
      .then(response => response as Annotations[]);
  }
}
