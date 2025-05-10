#!/bin/bash
#
# Performs the cleanup of cloud resources.

source config_env.sh
source common.sh

#######################################
# Cleanup cloud resources of VERIFIER.
# Globals:
#   VERIFIER_PROJECT_ID
#   VERIFIER_ARTIFACT_REPOSITORY
#   VERIFIER_PROJECT_REPOSITORY_REGION
#   VERIFIER_WORKLOAD_SERVICE_ACCOUNT
# Arguments:
#   None
#######################################
delete_verifier_resources() {
  if [ ! -z "${VERIFIER_PROJECT_ID}" ]; then
    echo "VERIFIER_PROJECT_ID is set to ${VERIFIER_PROJECT_ID}"
  else
    err "VERIFIER_PROJECT_ID is not set, please set the VERIFIER_PROJECT_ID with GCP project-id of VERIFIER."
  fi
  set_gcp_project "${VERIFIER_PROJECT_ID}"
  delete_artifact_repository "${VERIFIER_ARTIFACT_REPOSITORY}" "${VERIFIER_PROJECT_REPOSITORY_REGION}"

  gcloud compute instances delete verifier --zone "$VERIFIER_PROJECT_ZONE"

  delete_service_account "${VERIFIER_WORKLOAD_SERVICE_ACCOUNT}"@"${VERIFIER_PROJECT_ID}".iam.gserviceaccount.com
}

#######################################
# Cleanup cloud resources of APP.
# Globals:
#   APP_PROJECT_ID
#   APP_ARTIFACT_REPOSITORY
#   APP_PROJECT_REPOSITORY_REGION
#   APP_WORKLOAD_SERVICE_ACCOUNT
# Arguments:
#   None
#######################################
delete_app_resources() {
  if [ ! -z "${APP_PROJECT_ID}" ]; then
    echo "APP_PROJECT_ID is set to ${APP_PROJECT_ID}"
  else
    err "APP_PROJECT_ID is not set, please set the APP_PROJECT_ID with GCP project-id of APP."
  fi

  set_gcp_project "${APP_PROJECT_ID}"
  delete_artifact_repository "${APP_ARTIFACT_REPOSITORY}" "${APP_PROJECT_REPOSITORY_REGION}"

  gcloud compute instances delete app --zone "${APP_PROJECT_ZONE}"

  delete_service_account "${APP_WORKLOAD_SERVICE_ACCOUNT}"@"${APP_PROJECT_ID}".iam.gserviceaccount.com
}

main() {
  delete_verifier_resources
  delete_app_resources
}

main "$@"
