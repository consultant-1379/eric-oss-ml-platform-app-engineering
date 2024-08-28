#!/usr/bin/env bash

model1_image_name="eric-oss-ml-platform-app-test-model1";
model2_image_name="eric-oss-ml-platform-app-test-model2";
model3_image_name="eric-oss-ml-platform-app-test-model3";
registry="armdocker.rnd.ericsson.se";
crane="${registry}/gcr-ericsson-remote/go-containerregistry/crane";
version_armdocker="latest";
version_container_registry="build-${BUILD_NUMBER}";

docker run --rm --mount "source=ml-test-volume-${BUILD_NUMBER},target=/home/nonroot" ${crane} \
auth login ${registry} -u ${FUNCTIONAL_USERNAME} \
-p ${FUNCTIONAL_PWD}

docker run --rm --mount "source=ml-test-volume-${BUILD_NUMBER},target=/home/nonroot" ${crane} \
auth login ${APPMGR_HOSTNAME} \
-u ${DOCKER_USER} -p ${DOCKER_PWD} --insecure

docker run --rm --mount "source=ml-test-volume-${BUILD_NUMBER},target=/home/nonroot" ${crane} \
copy ${registry}/proj-eric-oss-dev-test/${model1_image_name}:${version_armdocker} \
${APPMGR_HOSTNAME}/${registry}/proj-eric-oss-dev-test/${model1_image_name}:${version_container_registry} \
--insecure

docker run --rm --mount "source=ml-test-volume-${BUILD_NUMBER},target=/home/nonroot" ${crane} \
copy ${registry}/proj-eric-oss-dev-test/${model2_image_name}:${version_armdocker} \
${APPMGR_HOSTNAME}/${registry}/proj-eric-oss-dev-test/${model2_image_name}:${version_container_registry} \
--insecure

docker run --rm --mount "source=ml-test-volume-${BUILD_NUMBER},target=/home/nonroot" ${crane} \
copy ${registry}/proj-eric-oss-dev-test/${model3_image_name}:${version_armdocker} \
${APPMGR_HOSTNAME}/${registry}/proj-eric-oss-dev-test/${model3_image_name}:${version_container_registry} \
--insecure

docker volume rm "ml-test-volume-${BUILD_NUMBER}"