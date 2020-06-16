#!/bin/bash

# to push docker build to dockerhub in travis pipeline
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t seng350team301/webserver .
docker push seng350team301/webserver
