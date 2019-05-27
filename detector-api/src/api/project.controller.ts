import * as config from 'config';
import { Request, Response } from 'express';
import { IncomingForm } from 'formidable';
import * as HttpStatus from 'http-status';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, interfaces, response } from 'inversify-express-utils';
import * as path from 'path';
import { ProjectClient } from '../services/project.client';
import TYPES from '../types';
import { UPLOAD_PATH, WorkspaceSingleton } from '../utils';

const dynamicStatic = require('express-dynamic-static')();

@controller(`${config.get<string>('api.base_path')}` + `/project-management`)
export class ProjectController implements interfaces.Controller {
    public constructor(
        @inject(TYPES.ProjectClient) private projectClient: ProjectClient) {
    }

    @httpPost('/new')
    newProject(req: Request, res: Response) {
        try {
            // const dir = `${UPLOAD_PATH}/` + req.body['projectname'];
            // if (!fs.existsSync(dir)){
            //     fs.mkdirSync(dir);
            //     fs.mkdirSync(dir + '/images');
            //     fs.copyFile(YOLO + '/config.json', dir + '/config.json' , (err) => {
            //         if (err) { throw err; }
            //     });
            //     res.json('req for new project received');
            //     WorkspaceSingleton.getInstance().currentProject = dir;
            //     dynamicStatic.setPath(path.resolve(`${dir}/images`));
            // } else {
            //     res.json('project name already exists');
            // }
            const response: string = this.projectClient.createNewProject(req.body['projectname']);
            res.json(response);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/select')
    public selectProject(req: Request, res: Response) {
        try {
            const dir = `${UPLOAD_PATH}/` + req.body['projectname'];
            WorkspaceSingleton.getInstance().currentProject = dir;
            dynamicStatic.setPath(path.resolve(`${dir}/images`));
            res.json('req for project selection');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpGet('/list')
    public getProjects(req: Request, res: Response) {
        try{
            res.send(this.projectClient.returnFolderList());
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpGet('/current')
    public getCurrentProject(req: Request, res: Response) {
        try{
            res.send(WorkspaceSingleton.getInstance().currentProject);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/class/new')
    public newClass(req: Request, res: Response) {
        try {
            const col = WorkspaceSingleton.getInstance().currentClassCollection;
            col.insert({name : req.body['classname'] });
            WorkspaceSingleton.getInstance().currentDB.saveDatabase();
            res.json('req for class creation');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpPost('/class/delete')
    public deleteClass(req: Request, res: Response) {
        try {
            const col = WorkspaceSingleton.getInstance().currentClassCollection;
            col.chain().find({name: req.body['classname']}).remove();
            WorkspaceSingleton.getInstance().currentDB.saveDatabase();
            res.json('req for class deletion');
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }

    @httpGet('/class/list')
    public getClasses(req: Request, res: Response) {
        try {
            const col = WorkspaceSingleton.getInstance().currentClassCollection;
            res.send(col.data);
        } catch (err) {
            res.status(HttpStatus.SERVICE_UNAVAILABLE).send({
                error: err,
            });
        }
    }
}
