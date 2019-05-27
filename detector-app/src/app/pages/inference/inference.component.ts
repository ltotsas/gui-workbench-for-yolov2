import { Component, OnInit } from '@angular/core';
import {DetectorServiceClient} from '../../services/detector.service.client';
import {environment} from '../../../environments/environment';
import {DetectorServiceTfClient} from '../../services/detector-service-tf-client.service';
import {DetectorServiceYoloClient} from '../../services/detector-service-yolo-client.service';
import * as utils from '../../utils';
import {Predictions} from '../../models/predictions';

declare var jQuery: any;

@Component({
  selector: 'app-inference',
  templateUrl: './inference.component.html',
  styleUrls: ['./inference.component.css'],
  providers: [{
    provide: DetectorServiceClient,
    useClass: environment.useYoloDetectorApi ? DetectorServiceYoloClient : DetectorServiceTfClient }]
})
export class InferenceComponent implements OnInit {

  public items: Predictions[] = [];
  private fileReader = new FileReader();
  private imageOriginalWidth: number;
  private imageOriginalHeight: number;
  private ratioX: number;
  private ratioY: number;
  private predictionPromise: Promise<string>;
  constructor(private servingClient: DetectorServiceClient) { }

  ngOnInit() { }

  // Reads the image files when they are selected
  public imagePicked(files: FileList): void {
    this.items = [];
    if (files[0]) {
      this.readFiles(files, 0);
    }
  }

  /**
   * this is used to trigger the input
   */
  openInput() {
    // your can use ElementRef for this later
    document.getElementById('imageInput').click();
  }

  // Read each file and create an entry (image + class) to display
  private readFiles(files: FileList, idx: number) {
    this.fileReader.onload = () => {
      console.log(this.fileReader);
      const dog = this.createItemEntry(this.fileReader.result, files[idx]);

      this.items.push(dog);
      if (files[idx + 1]) {
        this.readFiles(files, idx + 1);
      } else {
        console.log('loaded all files');
      }
    };

    this.fileReader.readAsDataURL(files[idx]);
  }

  // Request prediction from client by creation
  private createItemEntry(imageData: any, imageFile: File): Predictions {
    const item = new Predictions();
    item.imageData = imageData;

    const base64ImageData = imageData.split(',')[1];
    this.predictionPromise =
      this.servingClient.makePrediction(imageFile, base64ImageData);

    this.predictionPromise.then((res: any) => {
      item.annotations = [];
      if (res instanceof Array) {
        for (const i in res) {
          if (res) {
            item.annotations.push(res[i]);
          }
        }
        console.log(item);
      } else {
        item.className = res;
      }
    });
    this.predictionPromise.catch((err) => {
      console.error(`Error by class prediction occurred: ${err}`);
      item.className = utils.UNKNOWN_CLASS;
    });

    return item;
  }

  initAnnotation(img) {
    this.imageOriginalWidth = img.naturalWidth;
    this.imageOriginalHeight = img.naturalHeight;
    this.ratioX = this.imageOriginalWidth / img.width;
    this.ratioY = this.imageOriginalHeight / img.height;
    jQuery(img).selectAreas('destroy');
    // jQuery(img).selectAreas('reset');
    jQuery(img).selectAreas({allowEdit: false});
    this.predictionPromise.then( (res: any) => {
      res.forEach( (element) => {
        console.log(element.xmin / this.ratioX + '\n',
          element.ymin / this.ratioY + '\n',
          element.xmax / this.ratioX + '\n',
          element.ymax / this.ratioY);
        const areaOptions = {
          x: element.xmin / this.ratioX,
          y: element.ymin / this.ratioY,
          width: (element.xmax - element.xmin) / this.ratioX,
          height: (element.ymax - element.ymin) / this.ratioY,
          tag: element.className + ' ' + element.accuracy,
        };
        // We have to convert x, y and size to image in the HTML page
        jQuery(img).selectAreas('add', areaOptions);
      });
    });
  }
}
