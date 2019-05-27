/**
 * The main component represents the main page of the application
 * Allows to select dog images and displazs prediction results
 */
import { Component, OnInit } from '@angular/core';
import {ProjectService} from './services/project.service';

/**
 * Main application component
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  private currentProject = '';
  constructor (private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.projectInformer.subscribe(value => {
      this.currentProject = value;
    });
  }
}
