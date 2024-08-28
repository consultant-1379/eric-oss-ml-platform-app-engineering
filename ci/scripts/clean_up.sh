#!/usr/bin/env bash

echo "---remove ml-platform-app-test release---"
helm uninstall eric-oss-ml-platform-app-test -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} || true