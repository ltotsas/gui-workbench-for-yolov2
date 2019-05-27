import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css'],

})
export class DatasetComponent implements OnInit {
  private currentProject;
  constructor(private projectService: ProjectService) {
    this.currentProject = this.projectService.getCurrentProject();
  }

  ngOnInit() {
    this.projectService.projectInformer.subscribe(value => {
      this.currentProject = value;
    });
  }
}
