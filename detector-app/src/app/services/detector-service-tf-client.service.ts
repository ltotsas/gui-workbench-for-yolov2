/**
 * Detector service client issues requests to the detector service via REST interface
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as utils from '../utils';
import { DetectorServiceClient } from './detector.service.client';

/**
 * Implements detector service client interface - sends REST requests to the API service
 * The client reads configuration from the environment and issues a predict request
 */
@Injectable()
export class DetectorServiceTfClient implements DetectorServiceClient {
    private url = utils.BASE_URL + '/prediction-management';

    constructor(private http: HttpClient) {
    }

    // Request for a dog breed prediction. We append file as multipart/form data
    // and post it to the detector service.
    // Angular HttpClient rests on the XMLHttpRequest interface exposed by browsers
    // So it issues here a cross-origin request (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
    // The detector service must set the access control for it properly in response headers.
    // E.g. 'Access-Control-Allow-Origin': '*'
    public async makePrediction(imageFile: File, imageData: string): Promise<string> {

        console.log(`Will call API at ${this.url}`);

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');

        const formData = new FormData();
        formData.append('dog_image', imageFile, imageFile.name);

        try {
            const data = await this.http.post(this.url + '/predict_tf', formData, { headers: headers }).toPromise();

            console.log(`Received response from API:` + data);

            return (data.hasOwnProperty('predictions') ? data['predictions'] : utils.UNKNOWN_CLASS);
        } catch (err) {
            console.log(err);
            return utils.UNKNOWN_CLASS;
        }
    }
}
