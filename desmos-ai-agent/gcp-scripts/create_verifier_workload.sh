#!/bin/bash
#
# Creates artifact repository and workload image. It also publishes the workload image to artifact repository.

source config_env.sh
source common.sh
source create_workload.sh

create_workload "$VERIFIER_PROJECT_ID" "$VERIFIER_PROJECT_REPOSITORY_REGION" "$VERIFIER_ARTIFACT_REPOSITORY" "$VERIFIER_WORKLOAD_IMAGE_NAME" "$VERIFIER_WORKLOAD_IMAGE_TAG" "$VERIFIER_WORKLOAD_SERVICE_ACCOUNT" "verifier"
