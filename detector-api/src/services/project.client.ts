import * as fs from 'fs';
import { injectable } from 'inversify';
import * as path from 'path';
import { UPLOAD_PATH, WorkspaceSingleton, YOLO } from '../utils';

const projects = Array();
const dynamicStatic = require('express-dynamic-static')();

@injectable()
export class ProjectClient {

    constructor() {
        this.initFoldersList();
    }

    initFoldersList() {
        fs.readdir(`${UPLOAD_PATH}`, function (err, files) {
            if (err) {
                throw err;
            }
            files.map((file) => {
                return path.join(`${UPLOAD_PATH}`, file);
            }).filter((file) => {
                return fs.statSync(file).isDirectory();
            }).forEach((files) => {
                const file = files.replace(`${UPLOAD_PATH}/`, '');
                if (projects.indexOf(file) === -1 || projects.length === 0){
                    projects.push(file);
                }
            });
        });
    }

    returnFolderList() {
        return projects;
    }

    createNewProject(name: string) {
        const dir = `${UPLOAD_PATH}/` + name;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                fs.mkdirSync(dir + '/images');
                fs.copyFile(YOLO + '/config.json', dir + '/config.json' , (err) => {
                    if (err) { throw err; }
                });
                WorkspaceSingleton.getInstance().currentProject = dir;
                dynamicStatic.setPath(path.resolve(`${dir}/images`));
                return 'req for new project received';
            } else {
                return 'project name already exists';
            }
    }
}
