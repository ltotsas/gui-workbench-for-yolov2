/**
 * Detector service client issues requests to the detector service via REST interface
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import * as utils from '../utils';
import { DetectorServiceClient } from './detector.service.client';
import { IndexToBreedMap } from './index.to.breed.map';
import {Observable} from 'rxjs/internal/Observable';

/**
 * Implements detector service client interface - sends REST requests directly to
 * TensorFlow server
 */
@Injectable()
export class DetectorServiceYoloClient implements DetectorServiceClient {
  private url = utils.BASE_URL + '/prediction-management';

  constructor(private http: HttpClient) {
    }

    public async makePrediction(imageFile: File, imageData: string): Promise<string> {
      console.log(`Will call API at ${this.url}`);

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      const formData = new FormData();
      formData.append('image', imageFile, imageFile.name);

      try {
        const data = await this.http.post(this.url + '/predict_yolo', formData, { headers: headers }).toPromise();
        console.log(data);
        return (data.hasOwnProperty('predictions') ? data['predictions'] : utils.UNKNOWN_CLASS);
      } catch (err) {
        console.log(err);
        return utils.UNKNOWN_CLASS;
      }
    }
}
