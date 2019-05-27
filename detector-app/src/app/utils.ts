import {environment} from '../environments/environment';

/**
 * Contains helpers and constants
 */
export const UNKNOWN_CLASS = '<Unknown Class>';
export const BASE_URL = `http://${environment.detectorServiceHost}:${environment.detectorServicePort}${environment.detectorApiBasePath}`;
export const IMG_STATIC = `http://${environment.detectorServiceHost}:${environment.detectorServicePort}${environment.imgFolder}`;
