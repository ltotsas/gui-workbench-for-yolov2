import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImagesService} from '../../services/images.service';
import * as utils from '../../utils';
import {ImageAnnotationService} from '../../services/image.annotation.service';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit, OnDestroy {

  url = utils.IMG_STATIC;
  message: string;
  images: any;
  private currentProject;


  constructor(public imagesService: ImagesService,
              private imageAnnotationService: ImageAnnotationService,
              private projectService: ProjectService) {
    this.currentProject = this.projectService.getCurrentProject();
    if (this.currentProject !== '') {
      console.log('dataset init');
      this.imagesService.initializeImages().then((_images) => {
        this.images = _images;
      });
    }
  }

  ngOnInit() {
    this.imageAnnotationService.currentMessage.subscribe(message => this.message = message);
    this.imagesService.currentMessage.subscribe(message => this.images = message);
  }

  ngOnDestroy() {
    this.imageAnnotationService.changeImage('empty');
  }

  newImage(img) {
    this.imageAnnotationService.changeImage(img);
  }
}
