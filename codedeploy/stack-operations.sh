#!/bin/sh

OPERATION=$1
STACK_NAME=$2
FILE_NAME=$3
PROFILE=$4

if [ $OPERATION == 1 ]
then

    echo "Creating stack... ${STACK_NAME}"

    STACK_ID=$( \
    aws cloudformation create-stack \
    --stack-name ${STACK_NAME} \
    --template-body file://${FILE_NAME}.yaml \
    --capabilities CAPABILITY_NAMED_IAM \
    --profile ${PROFILE}
    )

    printf "Waiting on: \n ${STACK_ID} \n create completion...\n"
fi

if [ $OPERATION == 2 ]
then

    echo "Updating stack... ${STACK_NAME}"

    STACK_ID=$( \
    aws cloudformation update-stack \
    --stack-name ${STACK_NAME} \
    --template-body file://${FILE_NAME}.yaml \
    --capabilities CAPABILITY_NAMED_IAM \
    --profile ${PROFILE}
    )

    printf "Waiting on: \n ${STACK_ID} \n update completion...\n"
fi