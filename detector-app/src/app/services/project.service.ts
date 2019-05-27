import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as utils from '../utils';
import {Observable} from 'rxjs/internal/Observable';
import {Subject} from 'rxjs/internal/Subject';

@Injectable()
export class ProjectService {
  private url = utils.BASE_URL + '/project-management';
  private _projectInformer = new Subject<string>();
  private messageSource = new Subject();
  private currentProject = '';
  currentMessage = this.messageSource.asObservable();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(private http: HttpClient) {
  }

  newProjectAPI(value: string): Observable<any> {
    const body = {
      'projectname': value
    };
    return this.http.post(this.url + '/new', body, this.httpOptions);
  }

  getProjectsAPI(): Observable<Object> {
    return this.http.get(this.url + '/list');
  }

  selectProjectAPI(selectedProject: any): Observable<any> {
    console.log(selectedProject.value);
    const body = {
      'projectname': selectedProject.value
    };
    return this.http.post(this.url + '/select', body, this.httpOptions);
  }

  set projectInformer(value: any) {
    this.currentProject = value;
    this.messageSource.next(value);
    this._projectInformer.next(value);
  }

  get projectInformer() {
    return this._projectInformer;
  }

  getCurrentProject() {
    return this.currentProject;
  }
}
