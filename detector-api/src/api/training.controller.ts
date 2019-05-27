import * as config from 'config';
import { Request, Response } from 'express';
import * as HttpStatus from 'http-status';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { TrainingClient } from '../services/training.client';
import TYPES from '../types';

@controller(`${config.get<string>('api.base_path')}` + `/training-management`)
export class TrainingController implements interfaces.Controller {
    public constructor(
        @inject(TYPES.TrainingClient) private trainingClient: TrainingClient) {
    }

    @httpGet('/config')
    public async getConfiguration(req: Request, res: Response) {
        try {
            const config = await this.trainingClient.getTrainingConfig();
            res.send(config);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/config/update')
    public setConfiguration(req: Request, res: Response) {
        try {
            this.trainingClient.setTrainingConfig(req.body);
            res.json('config updated');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpGet('/start')
    public async start(req: Request, res: Response) {
        try {
            const PID = await this.trainingClient.startTraining();
            res.json(PID);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpGet('/init-tb')
    public async initTB(req: Request, res: Response) {
        try {
            const PID = await this.trainingClient.initTB();
            res.json(PID);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/stop')
    public async killProcess(req: Request, res: Response) {
        try {
            await this.trainingClient.killProcess(req.body.PID);
            res.json('TB stopped');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpGet('/dataset')
    public async dataset(req: Request, res: Response): Promise<void> {
        try {
            const val: string = await this.trainingClient.prepareDataset();
            res.json(val);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }
}
