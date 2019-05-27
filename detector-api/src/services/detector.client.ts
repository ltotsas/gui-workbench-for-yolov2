import * as config from 'config';
import * as grpc from 'grpc';
import { injectable } from 'inversify';
import { CONFIG_FILE, projectWeights, WorkspaceSingleton, YOLO } from '../utils';
import { IndexToBreedMap, UNKNOWN_BREED } from './index.to.breed.map';

const childProcess = require('child_process');
const path = require('path');

/**
 * Serving client implementation
 */
@injectable()
export class DetectorClient {
    private readonly PROTO_PATH = __dirname + '/../protos/prediction_service.proto';
    private tfServing: any;
    private tfServerUrl: string;
    private modelName: string;
    private signatureName: string;
    private client: any;

    constructor() {
        console.log('Constructing Tensorflow Seving Client');

        // read the configuration
        this.modelName = config.get<string>('model.name');
        this.signatureName = config.get<string>('model.signature_name');
        this.tfServerUrl = config.get<string>('tf_serving.host') + ':' +
            config.get<number>('tf_serving.port').toString();

        // load protobufs and create prediction service instance
        this.tfServing = grpc.load(this.PROTO_PATH).tensorflow.serving;
        this.client = new this.tfServing.PredictionService(
            this.tfServerUrl, grpc.credentials.createInsecure());
    }

    // For breed prediction we create a request object and issue the request against a server
    // tslint:disable-next-line:no-any
    public async predictWithServing(imageData: any): Promise<string> {
        // create image buffer for prediction - it must be an array of images
        // tslint:disable-next-line:no-any
        const buffer = new Array<any>(imageData);
        // build protobuf for predict request
        const predictRequest = this.buildPredictRequest(buffer);
        // issue a request
        // tslint:disable-next-line:no-any
        const predictResult: Promise<any> = new Promise<any>((resolve, reject) => {
            this.client.predict(predictRequest, (error, response) => {
                if (error) {
                    console.log(`Error occurred: ${error}`);
                    reject(error);
                } else {
                    const res = response.outputs.sequential_1.float_val;
                    const maxProb = Math.max(...res);

                    const indexOfMaxProb = res.indexOf(maxProb);

                    if (indexOfMaxProb in IndexToBreedMap) {
                        resolve(IndexToBreedMap[indexOfMaxProb]);
                    } else {
                        resolve(UNKNOWN_BREED);
                    }
                }
            });
        });
        return predictResult;
    }

    // Create a protobuf for Tensorflow Serving predict request
    // tslint:disable-next-line:no-any
    private buildPredictRequest(buffer: Array<any>): Object {
        const request = {
            model_spec: {
                name: this.modelName,
                signature_name: this.signatureName,
            },
            inputs: {
                examples: {
                    dtype: 'DT_STRING',
                    tensor_shape: {
                        dim: {
                            size: buffer.length,
                        },
                    },
                    string_val: buffer,
                },
            },
        };
        return request;
    }

    public async predictWithYolo(imageData: any): Promise<string> {
        const buffer = new Array<any>(imageData);
        const configFile = WorkspaceSingleton.getInstance().currentProject + CONFIG_FILE;
        const weights = await projectWeights();
        const predictResult: Promise<any> = new Promise<any>((resolve, reject) => {

            const child = childProcess.spawn(`${YOLO}/external_process.sh`,
                ['-n', 'predict', '-c', `${path.resolve(configFile)}`, '-p', `${YOLO}`, '-w', `${weights}`, '-i', `${buffer}`]);
            child.stdout.on('data', (data) => {
                resolve(this.parseDetections(data.toString()));
            });

            child.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });
        });
        return predictResult;
    }

    private parseDetections(data) {
        const detections = [];
        const parser = [];
        const n = data.split('\n');
        let parsePoint: any;
        for (const x in n) {
            if (n[x] === 'detection') {
                parsePoint = x;
            }
            if (x > parsePoint && n[x] !== '') {
                parser.push(n[x]);
            }
        }
        let ticker: number = 0;
        for (let i = 0; i < parser.length; i ++) {
            ticker += 1;
            if (ticker === Number('6')) {
                const as = {
                    accuracy: parser[i - Number('5')],
                    className: parser[i - Number('4')],
                    xmin: parser[i - Number('3')],
                    ymin: parser[i - Number('2')],
                    xmax: parser[i - Number('1')],
                    ymax: parser[i - Number('0')],
                };
                detections.push(as);
                ticker = 0;
            }
        }
        return detections;
    }
}
