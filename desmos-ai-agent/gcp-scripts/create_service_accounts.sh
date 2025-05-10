#!/bin/bash
#
# Creates workload service-account.

source config_env.sh
source common.sh
source create_workload_service_account.sh

set_gcp_project "${APP_PROJECT_ID}"

echo "Creating workload service-account ${APP_WORKLOAD_SERVICE_ACCOUNT} under project ${APP_PROJECT_ID}..."
create_service_account "${APP_WORKLOAD_SERVICE_ACCOUNT}"
grant_service_account_user_role_to_workload_operator "${APP_WORKLOAD_SERVICE_ACCOUNT}" "${APP_PROJECT_ID}"
grant_workload_user_role_to_service_account "${APP_WORKLOAD_SERVICE_ACCOUNT}" "${APP_PROJECT_ID}"
grant_log_writer_role_to_service_account "${APP_WORKLOAD_SERVICE_ACCOUNT}" "${APP_PROJECT_ID}"

set_gcp_project "${VERIFIER_PROJECT_ID}"

echo "Creating workload service-account ${VERIFIER_WORKLOAD_SERVICE_ACCOUNT} under project ${VERIFIER_PROJECT_ID}..."
create_service_account "${VERIFIER_WORKLOAD_SERVICE_ACCOUNT}"
grant_service_account_user_role_to_workload_operator "${VERIFIER_WORKLOAD_SERVICE_ACCOUNT}" "${VERIFIER_PROJECT_ID}"
grant_workload_user_role_to_service_account "${VERIFIER_WORKLOAD_SERVICE_ACCOUNT}" "${VERIFIER_PROJECT_ID}"
grant_log_writer_role_to_service_account "${VERIFIER_WORKLOAD_SERVICE_ACCOUNT}" "${VERIFIER_PROJECT_ID}"