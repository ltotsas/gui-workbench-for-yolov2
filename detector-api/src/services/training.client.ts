import { injectable } from 'inversify';
import { cleanFolder, CONFIG_FILE, UPLOAD_PATH, WorkspaceSingleton, YOLO } from '../utils';

const jsonfile = require('jsonfile');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const killOrder = require('tree-kill');


@injectable()
export class TrainingClient {

    constructor() {
    }

    public async getTrainingConfig(): Promise<string> {
        const configFile = WorkspaceSingleton.getInstance().currentProject + CONFIG_FILE;
        const configuration: Promise<any> = new Promise<any>((resolve, reject) => {
            jsonfile.readFile(configFile)
                .then(obj => {
                    resolve(obj.train);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return configuration;
    }

    public setTrainingConfig(config: any) {
        const configFile = WorkspaceSingleton.getInstance().currentProject + CONFIG_FILE;
        jsonfile.readFile(configFile, async (err, obj) => {
            obj.train.train_csv_file = this.updateModelName(path.resolve(configFile), 'annotations.csv');
            obj.train.train_csv_base_path = this.updateModelName(path.resolve(configFile), 'images/');
            obj.train.tensorboard_log_dir = this.updateModelName(path.resolve(configFile), await this.incrementalLogs());
            if (config.config.weights === 'init') {
                obj.train.pretrained_weights = '';
            } else {
                obj.train.pretrained_weights = this.updateModelName(path.resolve(configFile), config.config.model + '_bestMap.h5');
            }
            obj.train.train_times = config.config.training_times;
            obj.train.batch_size = config.config.batch;
            obj.train.learning_rate = config.config.learn_rate;
            obj.train.nb_epochs = config.config.epochs;
            obj.train.warmup_epochs = config.config.warmup;
            obj.train.saved_weights_name = this.updateModelName(path.resolve(configFile), config.config.model + '.h5');
            jsonfile.writeFile(configFile, obj, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            if (err) {
                console.error(err);
            }
        });
    }

    updateModelName(absoluteModelPath, modelName) {
        return absoluteModelPath.replace('config.json', modelName);
    }

    async startTraining() {
        const configFile = WorkspaceSingleton.getInstance().currentProject + CONFIG_FILE;
        try {
            const child = childProcess.spawn(`${YOLO}/external_process.sh`, ['-n', 'train', '-c', `${path.resolve(configFile)}`, '-p', `${YOLO}`], {detached: true});
            child.on('exit', () => {
                console.log('exit');
            });
            child.on('error', (err) => {
                console.log('Oh godddd: ' + err);
            });
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
            child.stdin.pipe(process.stdin);
            console.log('training' + child.pid);
            return child.pid;
        } catch (err) {
            console.log('exception: ' + err);
        }
    }

    async initTB() {
        const logsDir = WorkspaceSingleton.getInstance().currentProject + '/logs';
        try {
            const child = childProcess.spawn(`${YOLO}/external_process.sh`, ['-n', 'tensorboard', '-l', `${path.resolve(logsDir)}`]);
            child.on('exit', () => {
                console.log('exit');
            });
            child.on('error', (err) => {
                console.log('Oh godddd: ' + err);
            });
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
            child.stdin.pipe(process.stdin);
            console.log('TB: ' + child.pid);
            return child.pid;
        } catch (err) {
            console.log('exception: ' + err);
        }
    }

    async killProcess(PID: any) {
        killOrder(PID, function (err) {
            console.log(err);
        });
    }

    async prepareDataset(): Promise<string> {
        const csv = WorkspaceSingleton.getInstance().currentProject + '/annotations.csv';
        if (fs.existsSync(csv)) {
            fs.unlinkSync(csv);
        }
        const records = [];
        const col = WorkspaceSingleton.getInstance().currentImagesCollection;
        return new Promise<any>((resolve, reject) => {
            for (let i = 0; i < col.data.length; i++) {
                if (col.data[i].annotation) {
                    col.data[i].annotation.forEach((anno) => {
                        records.push({
                            path: col.data[i].originalname,
                            xmin: TrainingClient.floorIT(anno.xmin),
                            ymin: TrainingClient.floorIT(anno.ymin),
                            xmax: TrainingClient.floorIT(anno.xmax),
                            ymax: TrainingClient.floorIT(anno.ymax),
                            class: anno.class,
                        });
                    });
                }
            }
            const csvWriter = createCsvWriter({
                path: csv,
                header: ['path', 'xmin', 'ymin', 'xmax', 'ymax', 'class'],
            });

            csvWriter.writeRecords(records)       // returns a promise
                .then(() => {
                    resolve('done');
                });

        });
    }

    static floorIT(float: number) {
        if (float === 0) {
            return float;
        } else {
            return Math.floor(float);
        }
    }

    incrementalLogs() {
        const logsDir = WorkspaceSingleton.getInstance().currentProject + '/logs';
        return new Promise<any>((resolve, reject) => {
            if (fs.existsSync(logsDir)) {
                return fs.readdir(logsDir, function (err, files) {
                    if (err) {
                        throw err;
                    }
                    let _noOfDir = files.map((file) => {
                        return path.join(`${logsDir}`, file);
                    }).filter((file) => {
                        return fs.statSync(file).isDirectory();
                    }).length;
                    _noOfDir += 1;
                    fs.mkdirSync(logsDir + `/${_noOfDir}/`);
                    resolve(`logs/${_noOfDir}/`);
                });
            } else {
                fs.mkdirSync(logsDir);
                fs.mkdirSync(logsDir + '/1/');
                resolve('logs/1/');
            }
        });
    }
}
