#!/bin/bash
#
# Create Confidential Space instance for APP

source config_env.sh
source common.sh

gcloud config set project "$APP_PROJECT_ID"

gcloud compute instances create \
 --confidential-compute-type=SEV \
 --shielded-secure-boot \
 --maintenance-policy=MIGRATE \
 --scopes=cloud-platform --zone="${APP_PROJECT_ZONE}" \
 --image-project=confidential-space-images \
 --image-family=confidential-space \
 --service-account="${APP_WORKLOAD_SERVICE_ACCOUNT}@${APP_PROJECT_ID}".iam.gserviceaccount.com \
 --metadata ^~^tee-image-reference="${APP_PROJECT_REPOSITORY_REGION}-docker.pkg.dev/${APP_PROJECT_ID}/${APP_ARTIFACT_REPOSITORY}/${APP_WORKLOAD_IMAGE_NAME}:${APP_WORKLOAD_IMAGE_TAG}"~tee-restart-policy=Never~tee-container-log-redirect=true application


