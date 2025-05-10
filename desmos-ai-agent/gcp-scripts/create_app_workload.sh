#!/bin/bash
#
# Creates artifact repository and workload image. It also publishes the workload image to artifact repository.

source config_env.sh
source common.sh
source create_workload.sh

create_workload "$APP_PROJECT_ID" "$APP_PROJECT_REPOSITORY_REGION" "$APP_ARTIFACT_REPOSITORY" "$APP_WORKLOAD_IMAGE_NAME" "$APP_WORKLOAD_IMAGE_TAG" "$APP_WORKLOAD_SERVICE_ACCOUNT" "application"
