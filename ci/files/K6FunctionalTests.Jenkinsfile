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
        stage('Push Model Images to the Container Registry') {
            steps {
                script {
                    withCredentials([file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG')]) {
                        env.DOCKER_USER = sh(script: "kubectl get secrets/eric-oss-app-mgr-container-registry-secret --template={{.data.name}} -n ${env.NAMESPACE} | base64 -d", returnStdout: true)
                        env.DOCKER_PWD = sh(script: "kubectl get secrets/eric-oss-app-mgr-container-registry-secret --template={{.data.password}} -n ${env.NAMESPACE} | base64 -d", returnStdout: true)
                        echo "docker user: ${env.DOCKER_USER}"
                        echo "APPMGR hostname: ${env.APPMGR_HOSTNAME}"
                        echo "smokefun_user: ${env.FUNCTIONAL_USERNAME}"
                        sh "./ci/scripts/push_model_images_to_CR.sh"
                    }
                }
            }
        }
        stage('K6 Testing') {
            steps {
                echo "Start functional tests"
                withCredentials( [file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG'),
                    usernamePassword(credentialsId: 'bragi_ml_user', passwordVariable: 'MXE_PASSWORD',usernameVariable: 'MXE_USERNAME'),
                    usernamePassword(credentialsId: 'bragi_functional_user', passwordVariable: 'FUNCTIONAL_USER_PASSWORD', usernameVariable: 'FUNCTIONAL_USER_USERNAME')]) {
                        echo "build url: ${env.BUILD_URL}"
                        sh "./ci/scripts/install_testsuite.sh"
                }
            }
        }
        stage('Copy Report') {
            steps {
                echo "Copying report"
                script {
                    withCredentials( [file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG')]) {
                        sh "./ci/scripts/copy_report_k6.sh ."
                    }
                }
            }
        }
    }
    post {
        always {
            withCredentials( [file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG')]) {
                script {
                    env.RPT_API_URL = sh(script: "kubectl get secrets/testware-resources-secret --template={{.data.api_url}} -n ${env.NAMESPACE} | base64 -d", returnStdout: true)
                    env.RPT_GUI_URL = sh(script: "kubectl get secrets/testware-resources-secret --template={{.data.gui_url}} -n ${env.NAMESPACE} | base64 -d", returnStdout: true)
                }
                sh "./ci/scripts/clean_up.sh"
                sh "./ci/scripts/generate_status_report.sh"
                getBuildStatus()
                archiveArtifacts artifacts: 'summary.json, *.log, artifact.properties, execution-status.properties', allowEmptyArchive: true
                dir("${env.HOME}/${env.BUILD_TAG}") {
                    deleteDir()
                }
                verifyResult()
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
