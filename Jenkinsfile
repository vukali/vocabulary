pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent'
            defaultContainer 'jnlp'
            containers {
                // Thêm container Docker-in-Docker
                containerTemplate(name: 'docker', image: 'docker:19.03.12-dind', ttyEnabled: true, command: 'cat')
            }
        }
    }

    environment {
        REGISTRY = 'harbor.watasoftware.com'
        IMAGE_NAME = 'vocab-app'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Sử dụng Docker-in-Docker
                    container('docker') {
                        sh 'docker build -t $REGISTRY/$IMAGE_NAME:$IMAGE_TAG .'
                    }
                }
            }
        }

        stage('Push to Harbor') {
            steps {
                script {
                    container('docker') {
                        withCredentials([usernamePassword(credentialsId: 'harbor-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh "echo $DOCKER_PASSWORD | docker login $REGISTRY -u $DOCKER_USERNAME --password-stdin"
                            sh "docker push $REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
                        }
                    }
                }
            }
        }
    }
}
