#!/usr/bin/env bash

echo "---Directory ${HELM_CONFIG_HOME} is set as HELM_CONFIG_HOME---"
env | sort

echo "---remove release and secret if exists---"
helm uninstall eric-oss-ml-platform-app-test -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} || true
kubectl delete secret eric-simple-ml-demo-mxe-user --ignore-not-found -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} || true

echo "---remove existing eric-oss-ml-platform-app-test---"
rm -rf ./eric-oss-ml-platform-app-test

echo "---add proj-eric-oss-drop-helm repo---"
helm repo add proj-eric-oss-drop-helm-bragi https://arm.seli.gic.ericsson.se/artifactory/proj-eric-oss-drop-helm-local --username ${FUNCTIONAL_USER_USERNAME} --password ${FUNCTIONAL_USER_PASSWORD}

echo "---update helm repos---"
helm repo update proj-eric-oss-drop-helm-bragi

echo "---install testware---"
helm install eric-oss-ml-platform-app-test proj-eric-oss-drop-helm-bragi/eric-oss-ml-platform-app-test \
--set env.GAS_HOSTNAME=${GAS_HOSTNAME} \
--set env.EIC_HOSTNAME=${EIC_HOSTNAME} \
--set env.APPMGR_HOSTNAME=${APPMGR_HOSTNAME} \
--set env.SYSTEM_USER=${MXE_USERNAME} \
--set env.SYSTEM_USER_PASSWORD=${MXE_PASSWORD} \
--set env.BUILD_URL=${BUILD_URL} \
--set env.BUILD_NUMBER=${BUILD_NUMBER} \
--set env.NAMESPACE=${NAMESPACE} \
--set env.SEF_STATUS=${SEF_STATUS} \
--set env.TESTSTAGE=${TESTSTAGE} \
--set env.GAS_USER=${GAS_USER} \
--set env.GAS_PWD=${GAS_PWD} \
--set env.ML_ADMIN_USERNAME=${ML_ADMIN_USERNAME} \
--set env.ML_ADMIN_PWD=${ML_ADMIN_PWD} \
--set env.ML_MODEL_USERNAME=${ML_MODEL_USERNAME} \
--set env.ML_MODEL_PWD=${ML_MODEL_PWD} \
--set global.hosts.iam=${IAM_HOSTNAME} \
--set eric-simple-ml-demo.mxe.credentials.user=${ML_MODEL_USERNAME} \
--set eric-simple-ml-demo.mxe.credentials.pwd=${ML_MODEL_PWD} \
--set eric-simple-ml-demo.mxe.modelServiceUri=https://${EIC_HOSTNAME}/model-endpoints/ml-test-service \
--set eric-simple-ml-demo.mxe.accessTokenUri=https://${EIC_HOSTNAME}/auth/realms/master/protocol/openid-connect/token \
--set eric-simple-ml-demo.apiGatewayRoute.routes[0].id=simplemldemo \
--set eric-simple-ml-demo.apiGatewayRoute.routes[0].url=https://${GAS_HOSTNAME}/ \
--set eric-simple-ml-demo.apiGatewayRoute.routes[0].hosts={${GAS_HOSTNAME}} \
--set eric-simple-ml-demo.apiGatewayRoute.routes[0].tag=-i \
--set eric-simple-ml-demo.apiGatewayRoute.routes[0].path=/simplemldemo \
--wait --wait-for-jobs \
-n ${NAMESPACE} --kubeconfig ${KUBECONFIG}