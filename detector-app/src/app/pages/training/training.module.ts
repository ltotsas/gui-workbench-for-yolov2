import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/index';
import {TrainingComponent} from './training.component';
import {TrainingRoutingModule} from './training-routing.module';
import {ConfigEditorModule} from '../../components/config-editor/config-editor.module';
import {TrainingService} from '../../services/training.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TrainingRoutingModule,
    ConfigEditorModule
  ],
  declarations: [
    TrainingComponent
  ],
  providers: [TrainingService]
})
export class TrainingModule { }
