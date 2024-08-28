#!/usr/bin/env groovy
package pipeline

pipeline {
    agent {
        label "common_agents"
    }
    options {
        timestamps ()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20'))
    }
    parameters {
        string(name: 'NAMESPACE', defaultValue: 'oss', description: 'K8s namespace of the deployment')
        string(name: 'GAS_HOSTNAME', defaultValue: 'gas.oss.hall020.rnd.gic.ericsson.se', description: 'Common ingress hostname')
        string(name: 'IAM_HOSTNAME', defaultValue: 'iam.oss.hall020.rnd.gic.ericsson.se', description: 'IAM ingress hostname')
        string(name: 'GERRIT_REFSPEC', defaultValue: 'master', description: 'Gerrit refspec of the commit to test')
        string(name: 'KUBE_CREDENTIALS', defaultValue: 'hall020_config', description: 'Kube config for cluster access')
    }
    environment {
        HELM_CONFIG_HOME = "${env.HOME}/${env.BUILD_TAG}/config"
        HELM_CACHE_HOME = "${env.HOME}/${env.BUILD_TAG}/cache"
    }
    stages {
        stage('Prepare') {
            steps {
                sh "chmod +x -R ${env.WORKSPACE}"
                sh "rm -rf ./summary.json artifact.properties execution-status.properties *.log"
            }
        }
        stage('Deploy simple-ml-demo rApp') {
            steps {
                withCredentials([file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG'),
                    usernamePassword(credentialsId: 'bragi_functional_user', passwordVariable: 'FUNCTIONAL_USER_PASSWORD', usernameVariable: 'FUNCTIONAL_USER_USERNAME'),
                    usernamePassword(credentialsId: 'bragi_idun_user', passwordVariable: 'RAPP_PASSWORD', usernameVariable: 'RAPP_USERNAME')]) {
                        echo "Target kubernetes system: ${env.KUBE_CREDENTIALS}"
                        echo "gas hostname: ${env.GAS_HOSTNAME}"
                        echo "iam hostname: ${env.IAM_HOSTNAME}"
                        echo "eic hostname: ${env.EIC_HOSTNAME}"
                        echo "namespace: ${env.NAMESPACE}"
                        //TODO: run tests with SEF and API GW separately
                       // echo "sero_user: ${env.SERO_BRAGI_USERNAME}"
                        //sh "./ci/scripts/deploy_rApp.sh"
                        //sleep 60
                }
            }
        }
        stage('K6 Testing') {
            steps {
                echo "Start functional tests"
                withCredentials( [file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG'),
                        usernamePassword(credentialsId: 'bragi_ml_user', passwordVariable: 'MXE_PASSWORD',usernameVariable: 'MXE_USERNAME'),
                        usernamePassword(credentialsId: 'bragi_idun_user', passwordVariable: 'RAPP_PASSWORD', usernameVariable: 'RAPP_USERNAME'),
                            usernamePassword(credentialsId: 'bragi_functional_user', passwordVariable: 'FUNCTIONAL_USER_PASSWORD', usernameVariable: 'FUNCTIONAL_USER_USERNAME')]) {
                        echo "build url: ${env.BUILD_URL}"
                        echo "test version: ${env.TEST_VERSION}"
                        //TODO: run tests with SEF and API GW separately
                        //sh "./ci/scripts/install_testsuite.sh"
                }
            }
        }
        stage('Copy Report') {
            steps {
                echo "Copying report"
                script {
                    withCredentials( [file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG')]) {
                        //TODO: run tests with SEF and API GW separately
                        //sh "./ci/scripts/copy_report_k6.sh ."
                    }
                }
            }
        }
    }
    post {
        always {
            withCredentials( [file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG')]) {
                // sh "./ci/scripts/clean_up.sh"
                // sh "./ci/scripts/generate_status_report.sh"
                // getBuildStatus()
                // archiveArtifacts artifacts: 'summary.json, *.log, artifact.properties, execution-status.properties', allowEmptyArchive: true
                // dir("${env.HOME}/${env.BUILD_TAG}") {
                //     deleteDir()
                // }
                // verifyResult()
            }
        }
    }
}

def getBuildStatus() {
    if ( !fileExists('execution-status.properties') ) {
        echo "execution-status.properties file not found"
    }
    def props = readProperties(file: 'execution-status.properties') 
    def data = "status=${props['status']}\ntestwareVersion=${props['testwareVersion']}\njobDetailsUrl=${props['reportLink']}"
    writeFile(file: 'artifact.properties', text: data)
}

def verifyResult() {
    if ( !fileExists('execution-status.properties') ) {
        echo "execution-status.properties file not found"
    }
    def props = readProperties(file: 'execution-status.properties')
    if (props['status'] == 'SUCCESSFUL') {
        echo 'Test Execution is successful: ' + props['status']
    } else {
        error 'Testware Failed: ' + props['status']
    }
}
