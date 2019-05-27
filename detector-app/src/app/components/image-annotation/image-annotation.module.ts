import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImageAnnotationComponent} from './image-annotation.component';
import {MatButtonModule, MatGridListModule, MatIconModule, MatListModule, MatSelectModule} from '@angular/material';

@NgModule({
  imports: [CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSelectModule],
  declarations: [ImageAnnotationComponent],
  exports: [ImageAnnotationComponent],
  entryComponents: [ImageAnnotationComponent],
  providers: []
})
export class ImageAnnotationModule {}
