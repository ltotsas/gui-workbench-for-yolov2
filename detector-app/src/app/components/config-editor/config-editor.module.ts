import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfigEditorComponent} from './config-editor.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule,
    ReactiveFormsModule,
],
  declarations: [ConfigEditorComponent],
  exports: [ConfigEditorComponent],
  entryComponents: [ConfigEditorComponent],
  providers: []
})
export class ConfigEditorModule {}
