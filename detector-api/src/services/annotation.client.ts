import { IncomingForm } from 'formidable';
import { injectable } from 'inversify';
import { WorkspaceSingleton } from '../utils';


@injectable()
export class AnnotationClient {
    constructor() {
    }

    static uploadImages(images: any) {
        const col = WorkspaceSingleton.getInstance().currentImagesCollection;
        col.insert(images);
        WorkspaceSingleton.getInstance().currentDB.saveDatabase();
    }


    static createAnnotation(data: any) {
        const col = WorkspaceSingleton.getInstance().currentImagesCollection;
        const table = col.findObject({'originalname': data.name});

        if (!table.hasOwnProperty('width')) {
            table['width'] = data.imgWidth;
            table['height'] = data.imgHeight;
        }
        table['annotation'].push({
            'id': data.id,
            'class': data.class,
            'xmin': data.x,
            'xmax': data.x + data.width,
            'ymax': data.y,
            'ymin': data.y + data.height,
            'x': data.x,
            'y': data.y,
            'width': data.width,
            'height': data.height,
        });
        col.update(table);
        WorkspaceSingleton.getInstance().currentDB.saveDatabase();
    }

    static deleteAnnotation(data: any) {
        const col = WorkspaceSingleton.getInstance().currentImagesCollection;
        const table = col.findObject({'originalname': data.name});
        const annotations = table['annotation'];
        annotations.forEach((annotation) => {
            if (annotation.id === data.id) {
                console.log(annotation.class);
                annotations.splice(annotation, 1);
            }
        });
        table['annotation'] = annotations;
        col.update(table);
        WorkspaceSingleton.getInstance().currentDB.saveDatabase();
    }

    static updateAnnotation(data: any) {
        const col = WorkspaceSingleton.getInstance().currentImagesCollection;
        const table = col.findObject({'originalname': data.name});
        const annotations = table['annotation'];
        annotations.forEach((annotation) => {
            if (annotation.id === data.id) {
                annotation.class = data.class;
                annotation.xmin = data.x;
                annotation.xmax = data.x + data.width;
                annotation.ymin = data.y;
                annotation.ymax = data.y + data.height;
                annotation.x = data.x;
                annotation.y = data.y;
                annotation.width = data.width;
                annotation.height = data.height;
            }
        });
        table['annotation'] = annotations;
        col.update(table);
        WorkspaceSingleton.getInstance().currentDB.saveDatabase();
    }
}
