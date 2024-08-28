#!/usr/bin/env bash
REPORT_PATH=$1

export NAMESPACE
export BUILD_NUMBER

[ -d "${REPORT_PATH}" ] && \rm -f "${REPORT_PATH}"/*.log
mkdir -p "${REPORT_PATH}"

retries="30";
test_pod="eric-oss-ml-platform-app-test";
echo "test_pod: ${test_pod}"
simple_ml_demo_pod=$(kubectl get pod -n ${NAMESPACE} -l app.kubernetes.io/name=eric-simple-ml-demo --template '{{range .items}}{{.metadata.name}}{{end}}');
echo "simple_ml_demo_pod: ${simple_ml_demo_pod}"

sleep 25
echo "list SeldonDeployments"
kubectl get seldondeployments.machinelearning.seldon.io -n ${NAMESPACE} --show-kind --no-headers \
  > ${REPORT_PATH}/seldondeployments.log
kubectl get seldondeployments.machinelearning.seldon.io -n ${NAMESPACE} --show-labels --no-headers \
  | sed -r 's:^.*/requestReceivedTime=([0-9]*)...,.*$:date -d @"\1":e' >> ${REPORT_PATH}/seldondeployments.log

echo "describe pods: "
kubectl describe pods -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} > ${REPORT_PATH}/describe-pods.log

while [ $retries -ge 0 ]
do
    kubectl --kubeconfig ${KUBECONFIG} cp ${NAMESPACE}/${test_pod}:/reports/summary.json ${REPORT_PATH}/summary.json
    if [[ "$retries" -eq "0" ]]
    then
        echo no report file available
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${test_pod} > ${REPORT_PATH}/${test_pod}.log
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${simple_ml_demo_pod} > ${REPORT_PATH}/simple-ml-demo.log
        exit 1
    elif ! test -f ${REPORT_PATH}/summary.json ;
    then
        let "retries-=1"
        echo report not available, Retries left = $retries :: Sleeping for 60 seconds
        sleep 60
    else
        echo report copied
        sleep 120
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${test_pod} > ${REPORT_PATH}/${test_pod}.log
        kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs ${simple_ml_demo_pod} > ${REPORT_PATH}/simple-ml-demo.log
        break
    fi
done