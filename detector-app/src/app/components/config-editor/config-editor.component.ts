import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Validators} from '@angular/forms';
import {TrainingService} from '../../services/training.service';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-config-editor',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.css']
})
export class ConfigEditorComponent implements OnInit {
  private datasetReady = false;
  private configUpdated = false;
  private currentPID: number;
  configForm = this.fb.group({
    training_times: ['', Validators.required],
    batch: ['', Validators.required],
    learn_rate: ['', Validators.required],
    epochs: ['', Validators.required],
    warmup: ['', Validators.required],
    model: ['', Validators.required],
    weights: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    public trainingService: TrainingService,
    private projectService: ProjectService) {
  }

  ngOnInit() {
    console.log('init');
    this.trainingService.getConfiguration().subscribe((res) => {
      this.configForm.patchValue({
        training_times: res.train_times,
        batch: res.batch_size,
        learn_rate: res.learning_rate,
        epochs: res.nb_epochs,
        warmup: res.warmup_epochs,
        model: this.extractModelName(res.saved_weights_name)
      });
    });
    this.projectService.currentMessage.subscribe( (res) => {
      console.log(res);
    });
  }

  extractModelName(absoluteModelPath) {
    return absoluteModelPath.substring(
      absoluteModelPath.lastIndexOf('/') + 1,
      absoluteModelPath.lastIndexOf('.')
    );
  }

  onSubmit() {
    console.warn(this.configForm.value);
    this.configUpdated = true;
    this.trainingService.sendConfiguration(this.configForm.value).subscribe( () => {
      this.trainingService.datasetInit().subscribe( () => {
        this.datasetReady = true;
      });
    });
  }

  // prepareDataset() {
  //   this.datasetReady = true;
  //   this.trainingService.datasetInit().subscribe( () => {
  //     this.datasetReady = true;
  //   });
  // }

  startTraining() {
    this.trainingService.trainingStarted = true;
    this.trainingService.start().subscribe( (pid) => {
      this.currentPID = pid;
    });
  }

  stopTraining() {
    this.trainingService.trainingStarted = false;
    this.trainingService.killProcess(this.currentPID).subscribe();
  }
}
