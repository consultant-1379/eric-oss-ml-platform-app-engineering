# ML Execution Environment Application Staging Tests

## Use Cases
* [Description of the use cases](https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/IDUN/ML+Execution+Environment+Use+Cases)

## Test Repository
* [eric-oss-ml-platform-app-engineering](https://gerrit.ericsson.se/#/admin/projects/OSS/com.ericsson.oss.appEngineering/eric-oss-ml-platform-app-engineering)

## Test Reports
* [K6 Test Reports](http://seliius22639.seli.gic.ericsson.se/dev/staging-reports/#execution-reports?stagingType=Application%20Staging&application=eric-oss-ml-platform-app-test&theme=dark)

## Jenkins Jobs
* [Pre Code Review](https://fem1s11-eiffel216.eiffel.gic.ericsson.se:8443/jenkins/job/eric-oss-ml-platform-app-engineering_PreCodeReview/)
* [Publish](https://fem1s11-eiffel216.eiffel.gic.ericsson.se:8443/jenkins/job/eric-oss-ml-platform-app-engineering_Publish/)
* [Testware Pipeline](https://fem8s11-eiffel052.eiffel.gic.ericsson.se:8443/jenkins/view/ML/job/ml-k6-testsuite/)

## Required Variables

The following variables are required to run the use cases:

| Variable Name | Path on Values.yaml | Description                                    | Sample Value           |
|---------------|---------------------|------------------------------------------------|------------------------|
| ml_hostname   | env.GAS_HOSTNAME    | Hostname URL for the endpoints                 | 
https://gas.namespace.cluster.rnd.gic.ericsson.se |
| eic_hostname  | env.EIC_HOSTNAME    | Hostname URL for the endpoints                 |
https://eic.namspace.cluster.rnd.gic.ericsson.se  |
| namespace     | env.NAMESPACE       | Namespace for the application                  | ns                                                |
| ml_username   | env.ML_USER         | Username for the user of the application       | username                                          |
| ml_password   | env.ML_PASSWORD     | Password for the user of the application       | PassWord111#                                      |
| rapp_username | env.RAPP_USERNAME   | Username for the rApp user of the application  | username                                          |
| rapp_password | env.RAPP_PASSWORD   | Password for the rApp user of the application  | PassWord111#                                      |


## Prerequisites to Run the Testware

### Deploying the Sample rApp
One of use cases verifies that the model services of the application can be indeed invoked by an rApp. To be able
to run that use case, the sample rApp needs to be deployed beforehand.
The image of the rApp can be found here: [eric-simple-ml-demo](https://arm.seli.gic.ericsson.se/artifactory/docker-v2-global-local/proj-smoke-dev/eric-simple-ml-demo/)

#### Required Variables
The following variables are required to deploy the sample rApp:

| Variable Name | Path on Values.yaml  | Description                                   | Sample Value                               |
|---------------|----------------------|-----------------------------------------------|--------------------------------------------|
| iam_hostname  | global.hosts.iam     | Hostname for IAM/Keycloak                      | iam.namespace.cluster.rnd.gic.ericsson.se   |
| rapp_username | mxe.credentials.user | Username for the rApp user of the application | username                                   |
| rapp_password | mxe.credentials.pwd  | Password for the rApp user of the application | PassWord111#                               |


#### Deploying the Sample rApp
The sample rApp can be deployed with the following command:
```shell
helm install ml-demo ./simple-ml-demo/charts/eric-simple-ml-demo \
--set nameOverride=simple-ml-demo \
--set mxe.credentials.user=RAPP_USERNAME \
--set mxe.credentials.pwd=RAPP_PASSWORD \
--set global.hosts.iam=IAM_HOSTNAME \
--set mxe.modelServiceUri=https://GAS_HOSTNAME/seldon/NAMESPACE/ml-test-service/api/v1.0/predictions \
--set mxe.accessTokenUri=https://IAM_HOSTNAME/auth/realms/master/protocol/openid-connect/token \
--set apiGatewayRoute.routes[0].id=simplemldemo \
--set apiGatewayRoute.routes[0].url=https://GAS_HOSTNAME/ \
--set apiGatewayRoute.routes[0].hosts={GAS_HOSTNAME} \
--set apiGatewayRoute.routes[0].tag=-i --set apiGatewayRoute.routes[0].path=/simplemldemo \
-n NAMESPACE --kubeconfig KUBECONFIG
```

## Build the Testware Images

Run the following command:
```shell
./gradlew package
```

## Run the Testware

Run the following command:
````shell
./gradlew run
````

## Ownership
Team Bragi is the owner of the testware (PDLBRAGITE@pdl.internal.ericsson.com).

