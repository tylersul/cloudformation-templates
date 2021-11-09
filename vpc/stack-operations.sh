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
    --capabilities CAPABILITY__NAMED_IAM \
    --profile ${PROFILE}
    )

    echo "Waiting on ${STACK_ID} create completion..."
fi

if [ $OPERATION == 2 ]
then

    echo "Updating stack... ${STACK_NAME}"

    STACK_ID=$( \
    aws cloudformation update-stack \
    --stack-name ${STACK_NAME} \
    --template-body file://app-ecosystem.yaml \
    --capabilities CAPABILITY_NAMED_IAM \
    --profile ${PROFILE}
    )

    echo "Waiting on ${STACK_ID} update completion..."
fi