#!/bin/bash

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
	-l|--logs)
    LOGS="$2"
    shift # past argument
    shift # past value
    ;;
	-p|--yolo)
    YOLO="$2"
    shift # past argument
    shift # past value
    ;;
    -c|--config)
    CONFIG="$2"
    shift # past argument
    shift # past value
    ;;
    -w|--weights)
    WEIGHTS="$2"
    shift # past argument
    shift # past value
    ;;
    -i|--image)
    IMAGE="$2"
    shift # past argument
    shift # past value
    ;;
    -n|--name)
    NAME="$2"
    shift # past argument
    shift # past value
    ;;
    --default)
    DEFAULT=YES
    shift # past argument
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters


if [ $NAME == 'train' ]; then 
	/bin/zsh -c ". /anaconda3/bin/activate tensor; exec python ${YOLO}/train.py -c ${CONFIG}"
elif [ $NAME == 'predict' ]; then
	/bin/zsh -c ". /anaconda3/bin/activate tensor; exec python ${YOLO}/predict.py -c ${CONFIG} -w ${WEIGHTS} -i ${IMAGE}"
elif [ $NAME == 'tensorboard' ]; then	
	/bin/zsh -c ". /anaconda3/bin/activate tensor; exec tensorboard --logdir ${LOGS}"
else 
	echo "No fileName man!!"
fi 