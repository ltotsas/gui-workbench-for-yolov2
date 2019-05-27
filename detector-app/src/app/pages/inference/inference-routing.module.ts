import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InferenceComponent } from './inference.component';

const routes: Routes = [
  {
    path: 'inference',
    component: InferenceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InferenceRoutingModule {}
