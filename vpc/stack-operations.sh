#!/bin/sh

OPERATION=$1
STACK_NAME=$2
PROFILE=$3

if [ $OPERATION == 1 ]
then

    echo "Creating stack... ${STACK_NAME}"

    STACK_ID=$( \
    aws cloudformation create-stack \
    --stack-name ${STACK_NAME} \
    --template-body file://app-ecosystem.yaml \
    --capabilities CAPABILITY_IAM \
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
    --template-body file://app-ecosystem.yaml \
    --capabilities CAPABILITY_IAM \
    --profile ${PROFILE}
    )

    printf "Waiting on: \n ${STACK_ID} \n update completion...\n"
fi