import * as config from 'config';
import { Request, Response } from 'express';
import { IncomingForm } from 'formidable';
import * as HttpStatus from 'http-status';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import * as multer from 'multer';
import { AnnotationClient } from '../services/annotation.client';
import TYPES from '../types';
import { imageFilter, WorkspaceSingleton } from '../utils';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${WorkspaceSingleton.getInstance().currentProject}/images/`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({storage: storage, fileFilter: imageFilter});
const maxAllowed: number = 12;

@controller(`${config.get<string>('api.base_path')}` + `/image-management`)
export class AnnotationController implements interfaces.Controller {

    public constructor(
        @inject(TYPES.AnnotationClient) private annotationClient: AnnotationClient) {
    }

    @httpPost('/upload', upload.array('file', maxAllowed))
    public uploadIMGs(req: Request, res: Response) {
        try {
            AnnotationClient.uploadImages(req.files);
            res.json('Images uploaded');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpGet('/images')
    public getImages(req: Request, res: Response) {
        try {
            const col = WorkspaceSingleton.getInstance().currentImagesCollection;
            res.send(col.data);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/annotate/new')
    public newAnnotation(req: Request, res: Response) {
        try {
            AnnotationClient.createAnnotation(req.body);
            res.json('new annotation created');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/annotate/delete')
    public deleteAnnotation(req: Request, res: Response) {
        try {
            AnnotationClient.deleteAnnotation(req.body);
            res.json('req for annotation deletion');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/annotate/update')
    public updateAnnotation(req: Request, res: Response) {
        try {
            AnnotationClient.updateAnnotation(req.body);
            res.json('req for updating an annotation');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpGet('/annotate/list/:name')
    public async getAnnotations(req: Request, res: Response): Promise<void> {
        try {
            const col = WorkspaceSingleton.getInstance().currentImagesCollection;
            const table = col.findObject({'originalname': req.params.name});
            if (!table.hasOwnProperty('annotation')) {
                table['annotation'] = [];
            }
            const annotations = table['annotation'];
            res.json(annotations);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }
}
