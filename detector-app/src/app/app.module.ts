/**
 * The application root module
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import {FooterComponent, HeaderComponent} from './shared/layout';
import {AppRoutingModule} from './app-routing.module';
import {DatasetModule} from './pages/dataset/dataset.module';
import {InferenceModule} from './pages/inference/inference.module';
import {SharedModule} from './shared';
import {ProjectModule} from './components/project/project.module';
import { TrainingComponent } from './pages/training/training.component';
import {TrainingModule} from './pages/training/training.module';

@NgModule({
  declarations: [
    AppComponent, FooterComponent, HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    InferenceModule,
    SharedModule,
    ProjectModule,
    TrainingModule,
    DatasetModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
