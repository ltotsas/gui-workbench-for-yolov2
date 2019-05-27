import { NgModule } from '@angular/core';

import { DatasetComponent } from './dataset.component';
import { SharedModule } from '../../shared/index';
import { DatasetRoutingModule } from './dataset-routing.module';
import { UploadModule } from '../../components/upload/upload.module';
import {ImagesModule} from '../../components/images/images.module';
import {ImageAnnotationModule} from '../../components/image-annotation/image-annotation.module';
import {ProjectModule} from '../../components/project/project.module';
import {ProjectService} from '../../services/project.service';

@NgModule({
  imports: [
    SharedModule,
    DatasetRoutingModule,
    UploadModule,
    ProjectModule,
    ImagesModule,
    ImageAnnotationModule
  ],
  declarations: [DatasetComponent],
  providers: [ProjectService]

})
export class DatasetModule {}
