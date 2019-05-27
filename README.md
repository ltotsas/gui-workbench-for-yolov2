# Graphical user interface (GUI) for Yolov2

As a master thesis, this project tries to minimize/eliminate the necessary knowledge that is required to develop (train, test) an Object Detection model [Yolov2](https://pjreddie.com/darknet/yolov2/) using a GUI.
The project structure follows a 3-Tier architecture, where the presentation layer sends rest api commands to the application layer to control and utilize the ML algorithm. The data layer includes the database and the algorithm itself. 
  - Python/[Keras](https://keras.io/)/[Tensorflow](https://www.tensorflow.org/)
  - Typescript/[Angular7](https://angular.io/)/[NodeJS](https://nodejs.org/en/)/[ExpressJS](https://expressjs.com/)/[InversifyJS](http://inversify.io/)
  - NoSQL/[LokiJS](http://lokijs.org/)

# Installation
- detector-api and detector-app must be build. On each folder inside execute and access it throught http://localhost:4200
```sh
$ npm install
$ nnpm build
$ npm run start
```

- For using yolov2 the current implementation is using conda as virtual environment, thus it is a must. Therefore, anaconda installation must be present. On the root of the folder where the "environment.yml" file is, execute "conda env create -f environment.yml"
- Lastly, the weights of the backend Yolo must be downloaded and placed inside the folder Yolov2
https://drive.google.com/file/d/1Vk4wXj4EfNOZxvQJNR5WhKgiZlhqrhRy/view?usp=sharing

# Special thanks 
@rodrigo2019 for his help and ML scriptings and extending @experiencor project
@experiencor for starting the Keras-Yolo2 project
