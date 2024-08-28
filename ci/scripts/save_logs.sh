# #!/usr/bin/env bash
# REPORT_PATH=$1

# export NAMESPACE

# echo "checking labels: "
# kubectl get pods --show-labels -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} > ${REPORT_PATH}/pods-with-label.log

# echo "eric-oss-app-onboarding"
# kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-oss-app-onboarding --all-containers > ${REPORT_PATH}/eric-oss-app-onboarding.log

# echo "eric-oss-app-lcm"
# kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-oss-app-lcm --all-containers > ${REPORT_PATH}/eric-oss-app-lcm.log

# echo "eric-lcm-container-registry-registry"
# kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-lcm-container-registry-registry --all-containers > ${REPORT_PATH}/eric-lcm-container-registry-registry.log

# echo "eeric-data-object-storage-mn"
# kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-data-object-storage-mn --all-containers > ${REPORT_PATH}/eric-data-object-storage-mn.log

# echo "eric-aiml-model-lcm"
# kubectl --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} logs --tail=1000000 --selector=app.kubernetes.io/name=eric-aiml-model-lcm --all-containers > ${REPORT_PATH}/eric-aiml-model-lcm.log
