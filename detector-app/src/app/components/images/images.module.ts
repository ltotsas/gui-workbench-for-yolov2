import {ImagesService} from '../../services/images.service';
import {NgModule} from '@angular/core';
import {ImagesComponent} from './images.component';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material';
import {ImageAnnotationService} from '../../services/image.annotation.service';

@NgModule({
  imports: [
    CommonModule,
    MatGridListModule],
  declarations: [ImagesComponent],
  exports: [ImagesComponent],
  providers: [ImagesService, ImageAnnotationService]
})
export class ImagesModule {}
