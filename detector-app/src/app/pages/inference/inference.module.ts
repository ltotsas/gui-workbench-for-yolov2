import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/index';
import {InferenceRoutingModule} from './inference-routing.module';
import {InferenceComponent} from './inference.component';
import {MatButtonModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    InferenceRoutingModule
  ],
  declarations: [
    InferenceComponent
  ]
})
export class InferenceModule { }
