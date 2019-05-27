import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ProjectService} from '../../../services/project.service';
import {ImagesService} from '../../../services/images.service';
import {timeInterval} from 'rxjs/operators';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  private projects: Object = [];
  private currentProject = '';
  constructor(public dialogRef: MatDialogRef<DialogComponent>, public projectService: ProjectService, private imgService: ImagesService) {
  }

  ngOnInit() {
    this.projectService.projectInformer.subscribe(value => {
      this.currentProject = value;
    });
    this.initProjectList();
  }

  initProjectList() {
    this.projectService.getProjectsAPI().subscribe( (res) => {
      this.projects = res;
    });
  }

  closeDialog() {
    return this.dialogRef.close();
  }

  createProject(newProject: HTMLInputElement) {
    this.currentProject = newProject.value;
    this.projectService.projectInformer = newProject.value;
    this.projectService.newProjectAPI(newProject.value).subscribe( () => this.initProjectList());
  }

  onProjectSelection(selectedProject: HTMLInputElement) {
    this.currentProject = selectedProject.value;
    this.projectService.projectInformer = selectedProject.value;
    this.projectService.selectProjectAPI(selectedProject).subscribe(() => this.imgService.initializeImages());
  }
}
