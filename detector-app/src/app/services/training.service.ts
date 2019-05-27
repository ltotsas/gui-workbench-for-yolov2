import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as utils from '../utils';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class TrainingService {
  private url = utils.BASE_URL + '/training-management';
  private _trainingStarted = false;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private http: HttpClient) {
  }

  getConfiguration(): Observable<any> {
    return this.http.get(this.url + '/config', this.httpOptions);
  }

  sendConfiguration(value: any): Observable<any>  {
    const body = {
      'config': value
    };
    return this.http.post(this.url + '/config/update', body, this.httpOptions);
  }


  get trainingStarted(): boolean {
    return this._trainingStarted;
  }

  set trainingStarted(value: boolean) {
    this._trainingStarted = value;
  }

  datasetInit(): Observable<any> {
    return this.http.get(this.url + '/dataset', this.httpOptions);
  }

  start(): Observable<any> {
    return this.http.get(this.url + '/start', this.httpOptions);
  }

  killProcess(pid: number): Observable<any> {
    const body = {
      'PID': pid
    };
    return this.http.post(this.url + '/stop', body, this.httpOptions);
  }

  initTB(): Observable<any> {
    return this.http.get(this.url + '/init-tb', this.httpOptions);
  }
}
