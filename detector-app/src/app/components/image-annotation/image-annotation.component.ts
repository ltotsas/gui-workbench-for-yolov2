import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import * as utils from '../../utils';
import {ImageAnnotationService} from '../../services/image.annotation.service';
import {Annotations} from '../../models/annotations';
import {ProjectService} from '../../services/project.service';

declare var jQuery: any;

@Component({
  selector: 'app-image-annotation',
  templateUrl: './image-annotation.component.html',
  styleUrls: ['./image-annotation.component.css']
})
export class ImageAnnotationComponent implements OnInit, OnDestroy {
  url = utils.IMG_STATIC;
  private currentIMG: ImageBitmap;
  private imageName: string;
  private imgIsReady = false;
  private imageOriginalWidth: number;
  private imageOriginalHeight: number;
  private ratioX: number;
  private ratioY: number;
  private areas: any[];
  private annotations: Annotations[] = [];
  private currentAreaId: number;
  private annotationsId: number;
  private classes = [];
  private annotationClass = '';
  private deleteAnnotationId: number;

  constructor(private imageAnnotationService: ImageAnnotationService,
              private el: ElementRef,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.projectService.currentMessage.subscribe( (res) => {
      console.log(res);
      this.ngOnDestroy();
    });
    this.imageAnnotationService.currentMessage.subscribe(newIMG => {
      this.getCLasses();
      this.imgIsReady = true;
      this.imageName = newIMG;
    });
    this.registerMouseDown();
  }

  getCLasses() {
    if (this.classes.length === 0) {
      this.imageAnnotationService.getClassesAPI().subscribe((res: any[]) => {
        res.forEach((annotationClass) => {
          this.classes.push(annotationClass.name);
        });
      });
    }
  }

  ngOnDestroy() {
    this.imgIsReady = false;
    this.imageName = 'empty';
    this.classes = [];
  }

  addClass(newClass: any) {
    this.classes.push(newClass.value);
    this.imageAnnotationService.newClassAPI(newClass.value).subscribe((res) => console.log(res));
    newClass.value = '';
  }

  deleteClass(delClass: any) {
    this.imageAnnotationService.deleteClassAPI(delClass.value).subscribe((res) => console.log(res));
    const index = this.classes.indexOf(delClass.value, 0);
    if (index > -1) {
      this.classes.splice(index, 1);
    }
  }

  onClassSelection(selectedClass: any) {
    this.annotationClass = selectedClass.value;
  }

  initAnnotation(img) {
    this.currentIMG = img;
    this.imageOriginalWidth = img.naturalWidth;
    this.imageOriginalHeight = img.naturalHeight;
    this.ratioX = this.imageOriginalWidth / img.width;
    this.ratioY = this.imageOriginalHeight / img.height;
    jQuery(img).selectAreas('destroy');
    jQuery(img).selectAreas('reset');
    this.loadListOfAnnotations(this.imageName, img).then((imageAnnotations) => {
      this.annotations = imageAnnotations;
    });
    jQuery(img).on('changed', (event, id, areas) => {
      return new Promise((resolve, reject) => {
        resolve(id);
        reject(0);
      }).then(() => {
        this.currentAreaId = id;
        console.log(id);
        this.areas = areas;
      }).catch(() => {
        this.currentAreaId = 0;
      });
    });
  }

  loadListOfAnnotations(imageName, img): Promise<any> {
    return new Promise(async resolve => {
      const imageAnnotations = await this.imageAnnotationService.getAnnotationAPI(imageName);
      imageAnnotations.forEach( (element) => {
        const areaOptions = {
          x: element.x / this.ratioX,
          y: element.y / this.ratioY,
          width: element.width / this.ratioX,
          height: element.height / this.ratioY,
          tag: element.class,
        };
        // We have to convert x, y and size to image in the HTML page
        jQuery(img).selectAreas('add', areaOptions);
      });
      resolve(imageAnnotations);
    });

  }

  annotate() {
    for (let i = 0; i < this.areas.length; i++) {
      if (this.areas[i].id === this.currentAreaId) {
        this.annotationsId = i;
      }
    }
    jQuery(this.currentIMG).selectAreas('setTag', this.currentAreaId, this.annotationClass);
    const annotationObject: Annotations = {
      id: this.currentAreaId,
      class: this.annotationClass,
      x: (this.areas[this.annotationsId].x * this.ratioX),
      y: (this.areas[this.annotationsId].y * this.ratioY),
      width: (this.areas[this.annotationsId].width * this.ratioX),
      height: (this.areas[this.annotationsId].height * this.ratioY),
      imgHeight: this.imageOriginalHeight,
      imgWidth: this.imageOriginalWidth
    };
    if (!this.annotations.some(e => e.id === this.currentAreaId) || this.annotations.length === 0) {
      this.annotations.push(annotationObject);
      this.imageAnnotationService.newAnnotationAPI(
        this.annotations[this.annotations.findIndex( e => e.id === this.currentAreaId)],
        this.imageName);
    } else {
      this.annotations[this.annotationsId] = annotationObject;
      this.imageAnnotationService.updateAnnotationAPI(
        this.annotations[this.currentAreaId],
        this.imageName);
    }
  }

  registerMouseDown() {
    this.el.nativeElement.removeEventListener('mousedown', this.OnMouseDown.bind(this));
    this.el.nativeElement.addEventListener('mousedown', this.OnMouseDown.bind(this));
  }

  OnMouseDown(event: any) {
    if (event.target != null && event.target.className === 'select-areas-delete-area') {
      jQuery(this.currentIMG).selectAreas('remove', this.currentAreaId);
      this.areas = jQuery(this.currentIMG).selectAreas('areas');
      for (let i = 0; i < this.annotations.length; i++) {
        if (this.annotations[i].id === this.currentAreaId) {
          this.deleteAnnotationId = i;
        }
      }
      if (this.annotations[this.deleteAnnotationId]) {
        this.imageAnnotationService.deleteAnnotationAPI(
          this.annotations[this.currentAreaId],
          this.imageName);
      }
      this.annotations.splice(this.deleteAnnotationId, 1);
    }
  }
}
