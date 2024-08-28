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
    stages {
        stage('Prepare') {
            steps {
                sh "chmod +x -R ${env.WORKSPACE}"
                sh "rm -rf ./summary.json artifact.properties execution-status.properties"
            }
        }
        stage('Post Onboarding Testing') {
            steps {
                withCredentials([file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG'),
                    usernamePassword(credentialsId: 'bragi_functional_user', passwordVariable: 'FUNCTIONAL_USER_PASSWORD', usernameVariable: 'FUNCTIONAL_USER_USERNAME'),
                    usernamePassword(credentialsId: 'bragi_idun_user', passwordVariable: 'RAPP_PASSWORD', usernameVariable: 'RAPP_USERNAME')]) {
                        echo "Running Post Onboarding Tests"
                        //Login
                        //Onboard the model
                        //List the models
                        //Create the model service
                        //List the model services
                }
            }
        }
    }
    post {
        always {
            withCredentials( [file(credentialsId: env.KUBE_CREDENTIALS, variable: 'KUBECONFIG')]) {
                echo "Running Post Steps"
                //verify results
            }
        }
    }
}

