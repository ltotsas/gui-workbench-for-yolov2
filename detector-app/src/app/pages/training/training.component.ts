import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {TrainingService} from '../../services/training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  private isRefreshing;
  private tbPID: number;
  public currentProject;
  constructor(private projectService: ProjectService,
              private trainingService: TrainingService) {
    this.currentProject = this.projectService.getCurrentProject();
    this.refreshIframe();
  }

  ngOnInit() {
    if (this.currentProject) {
      this.trainingService.initTB().subscribe((pid) => {
        this.tbPID = pid;
      });
    }
    this.projectService.projectInformer.subscribe(value => {
      this.currentProject = value;
    });
  }

  ngOnDestroy(): void {
    this.trainingService.killProcess(this.tbPID).subscribe();
  }

  refreshIframe() {
    this.isRefreshing = true;

    setInterval(a => {
      this.isRefreshing = false;
    }, 5000, []);
  }
}
