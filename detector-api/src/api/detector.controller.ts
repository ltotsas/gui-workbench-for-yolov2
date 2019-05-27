/**
 * Detector controller thta implements our REST API
 */

import * as config from 'config';
import { Request, Response } from 'express';
import * as HttpStatus from 'http-status';
import { inject } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import * as multer from 'multer';

import { DetectorClient } from '../services/detector.client';
import TYPES from '../types';
import { imageFilter, WorkspaceSingleton } from '../utils';

const UPLOAD_PATH = 'uploads';

/**
 * We use multer library for the image upload
 */
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({
    dest: `${UPLOAD_PATH}/`,
    storage: memoryStorage,
});

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${WorkspaceSingleton.getInstance().currentProject}/`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const diskUpload = multer({storage: diskStorage, fileFilter: imageFilter});

/**
 * Controller for the Inversify express server
 */
@controller(`${config.get<string>('api.base_path')}` + `/prediction-management`)
export class DetectrorController implements interfaces.Controller {

    public constructor(
        @inject(TYPES.DetectorClient) private detectorClient: DetectorClient,
    ) {
    }

    @httpPost('/predict_tf', memoryUpload.single('dog_image'))
    public async predictWithTF(req: Request, res: Response): Promise<void> {
        try {
            console.log(`original file name: ${req.file.originalname}`);
            console.log(req.file.buffer);
            const dogBreed: string = await this.detectorClient.predictWithServing(req.file.buffer);
            res.status(HttpStatus.OK)
                .header({
                    'Access-Control-Allow-Origin': '*',
                })
                .send({
                    breed: dogBreed,
                });
        }
        catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/predict_yolo', diskUpload.single('image'))
    public async predictCustom(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.file);
            const prediction: string =  await this.detectorClient.predictWithYolo(req.file.path);
            res.status(HttpStatus.OK)
                .header({
                    'Access-Control-Allow-Origin': '*',
                })
                .send({
                    predictions: prediction,
                });
        }
        catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }
}
