import * as del from 'del';
import * as fs from 'fs';
import * as Loki from 'lokijs';
import * as path from 'path';

const PROJECT_DB = 'project_db.json';
const COLLECTIONS = ['images', 'classes'];
const UPLOAD_PATH = 'projects';
const CONFIG_FILE = '/config.json';
const YOLO = path.resolve(`../yolov2`);

const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const loadCollection = function (colNames: string[], db: Loki): Promise<Collection<any>[]> {
    return new Promise(resolve => {
        const _collection: Collection<any>[] = [];
        db.loadDatabase({}, () => {
            colNames.forEach((collection) => {
                _collection.push(db.addCollection(collection));
            });
            resolve(_collection);
        });
    });
};

const cleanFolder = function (folderPath) {
    // delete files inside folder but not the folder itself
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
};

const projectWeights = function () {
    // return the best weights of the project, if exists always mAP
    return new Promise<any>((resolve, reject) => {
        if (fs.existsSync(WorkspaceSingleton.getInstance().currentProject)) {
            return fs.readdir(WorkspaceSingleton.getInstance().currentProject, function (err, files) {
                if (err) {
                    throw err;
                }
                const _noOfDir = files.map((file) => {
                    return path.join(`${WorkspaceSingleton.getInstance().currentProject}`, file);
                }).filter((file) => {
                    return !fs.statSync(file).isDirectory() && file.includes('best') || file.includes('.h5');
                });
                resolve(_noOfDir[0]);
            });
        }
    });
};

export class WorkspaceSingleton {
    private static instance: WorkspaceSingleton;
    private _currentImagesCollection: any;
    private _currentClassesCollection: any;
    private _currentDB: any;
    private _currentProject: string;

    constructor() {
    }

    static getInstance() {
        if (!WorkspaceSingleton.instance) {
            WorkspaceSingleton.instance = new WorkspaceSingleton();
        }
        return WorkspaceSingleton.instance;
    }

    get currentImagesCollection() {
        return this._currentImagesCollection;
    }

    get currentClassCollection() {
        return this._currentClassesCollection;
    }

    get currentDB() {
        return this._currentDB;
    }

    get currentProject() {
        return this._currentProject;
    }

    set currentProject(projectFolder: string) {
        this.loadProject(projectFolder);
        this._currentProject = projectFolder;
    }

    private loadProject(currentProject: string) {
        this._currentProject = currentProject;
        this._currentDB = new Loki(`${this._currentProject}/${PROJECT_DB}`, {persistenceMethod: 'fs'});
        loadCollection(COLLECTIONS, this._currentDB).then((collection) => {
            collection.forEach((col) => {
                if (col.name === 'images') {
                    this._currentImagesCollection = col;
                } else {
                    this._currentClassesCollection = col;
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}

export { imageFilter, loadCollection, cleanFolder, projectWeights, UPLOAD_PATH, CONFIG_FILE, YOLO };

