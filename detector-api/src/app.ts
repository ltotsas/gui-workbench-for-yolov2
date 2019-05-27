/**
 * NodeJS express application builder
 */

import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as logger from 'morgan';
import './api/annotation.controller';
import './api/detector.controller';
import './api/project.controller';
import './api/training.controller';
import { AnnotationClient } from './services/annotation.client';
import { DetectorClient } from './services/detector.client';
import { ProjectClient } from './services/project.client';
import { TrainingClient } from './services/training.client';
import { default as TYPES } from './types';

const dynamicStatic = require('express-dynamic-static')();

/**
 * Exported function to create express application
 */
export function createApplication(): express.Application {
    const applicationBuilder = new ApplicationBuilder();
    return applicationBuilder.build();
}

/**
 * Application builder is responsible for creation of the inversify express server
 * that provides and maintains dependency injection capabilities and the concept of
 * controllers for REST API implementation
 */
class ApplicationBuilder {
    // Create NodeJS express aplication instance
    public build(): express.Application {
        const inversifyContainer = this.createInversifyContainer();
        const server = new InversifyExpressServer(inversifyContainer);

        server.setConfig((app: express.Application) => {
            this.middleware(app);
        });

        return server.build();
    }

    // Configure a middleware of the express application
    private middleware(app: express.Application): void {
        const corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200,
        };
        app.use('/static', dynamicStatic);
        app.use(cors(corsOptions));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
    }

    // Create container for dependency injection
    private createInversifyContainer(): Container {
        const container = new Container();
        container.bind<AnnotationClient>(TYPES.AnnotationClient).to(AnnotationClient);
        container.bind<ProjectClient>(TYPES.ProjectClient).to(ProjectClient);
        container.bind<TrainingClient>(TYPES.TrainingClient).to(TrainingClient);
        container.bind<DetectorClient>(TYPES.DetectorClient).to(DetectorClient);

        return container;
    }
}
