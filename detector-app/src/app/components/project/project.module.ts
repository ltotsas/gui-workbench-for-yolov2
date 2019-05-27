import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule,
  MatSelectModule
} from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import {ProjectService} from '../../services/project.service';

@NgModule({
  imports: [CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatGridListModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSelectModule],
  declarations: [ProjectComponent, DialogComponent],
  exports: [ProjectComponent],
  entryComponents: [DialogComponent], // Add the DialogComponent as entry component
  providers: [ProjectService]
})
export class ProjectModule {}
