#!/bin/bash -e
aws sts get-caller-identity > /dev/null 2>&1
if [[ "$?" != "0" ]]; then
  echo "error: credentials -- make sure the access key is configured respectivly"
  exit 1
fi
if [[ -z "$1" ]]; then
  echo "error: missing argument - version tag"
  exit 1
fi
PATTERN="[0-9]+[.][0-9]+[.][0-9]+"
if [[ ! "$1" =~ $PATTERN ]]; then
  echo "error: invalid version format - use an x.x.x version format"
  exit 1
fi

MAJOR=`echo $1 | cut -d '.' -f 1`
MINOR=`echo $1 | cut -d '.' -f 2`
PATCH=`echo $1 | cut -d '.' -f 3`

ACCOUNT_ID=`aws sts get-caller-identity --query "Account" --output text`
IMAGE_NAME='bokuto'

SRC_IMAGE="${IMAGE_NAME}:latest"
DST_IMAGE_MAJOR="${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/${IMAGE_NAME}:v${MAJOR}"
DST_IMAGE_MINOR="${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/${IMAGE_NAME}:v${MAJOR}.${MINOR}"
DST_IMAGE_PATCH="${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/${IMAGE_NAME}:v${MAJOR}.${MINOR}.${PATCH}"
DST_IMAGE_LATEST="${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/${IMAGE_NAME}:latest"

docker-compose build
docker image tag $SRC_IMAGE $DST_IMAGE_MAJOR
docker image tag $SRC_IMAGE $DST_IMAGE_MINOR
docker image tag $SRC_IMAGE $DST_IMAGE_PATCH
docker image tag $SRC_IMAGE $DST_IMAGE_LATEST

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com

docker push $DST_IMAGE_MAJOR
docker push $DST_IMAGE_MINOR
docker push $DST_IMAGE_PATCH
docker push $DST_IMAGE_LATEST

docker logout ${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com
