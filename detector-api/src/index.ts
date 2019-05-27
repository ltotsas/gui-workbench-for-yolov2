/**
 * Entry point:
 * - create Tensorflow Serving client instance
 * - initialiye NodeJS express application
 */

import * as config from 'config';

import { createApplication } from './app';
import { DetectorClient } from './services/detector.client';

(function () {
    // initialize express application
    const port: number = config.get<number>('service.port');
    const expressApp = createApplication();
    expressApp.listen(port);

    console.log(`Server listening on port ${port}.`);
})();
