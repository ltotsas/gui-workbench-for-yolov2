import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  constructor(public dialog: MatDialog) {}

  public openProjectDialog() {
    const dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '50%' });
  }
}
