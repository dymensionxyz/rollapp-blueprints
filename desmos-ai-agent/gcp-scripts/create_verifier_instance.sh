#!/bin/bash
#
# Create Confidential Space instance for VERIFIER

source config_env.sh
source common.sh

gcloud config set project "$VERIFIER_PROJECT_ID"

gcloud compute instances create \
 --confidential-compute-type=SEV \
 --shielded-secure-boot \
 --maintenance-policy=MIGRATE \
 --scopes=cloud-platform --zone="${VERIFIER_PROJECT_ZONE}" \
 --image-project=confidential-space-images \
 --image-family=confidential-space \
--service-account="${VERIFIER_WORKLOAD_SERVICE_ACCOUNT}@${VERIFIER_PROJECT_ID}.iam.gserviceaccount.com" \
 --metadata ^~^tee-image-reference="${VERIFIER_PROJECT_REPOSITORY_REGION}-docker.pkg.dev/${VERIFIER_PROJECT_ID}/${VERIFIER_ARTIFACT_REPOSITORY}/${VERIFIER_WORKLOAD_IMAGE_NAME}:${VERIFIER_WORKLOAD_IMAGE_TAG}"~tee-restart-policy=Never~tee-container-log-redirect=true~tee-env-remote_ip_addr="$APP_EXTERNAL_IP" verifier