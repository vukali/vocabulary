pipeline {
    agent any

    environment {
        REGISTRY = 'harbor.watasoftware.com'  // URL của Harbor registry
        IMAGE_NAME = 'vocab-app'              // Tên Docker image
        IMAGE_TAG = 'latest'                  // Tag của image (có thể dùng git commit hoặc các chiến lược khác)
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Xây dựng Docker image
                    sh "docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push to Harbor') {
            steps {
                script {
                    // Đăng nhập vào Harbor bằng Jenkins credentials
                    withCredentials([usernamePassword(credentialsId: 'harbor-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        // Đăng nhập vào Harbor registry
                        sh """echo ${DOCKER_PASSWORD} | docker login ${REGISTRY} -u ${DOCKER_USERNAME} --password-stdin"""
                    }

                    // Đẩy Docker image lên Harbor
                    sh "docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }
}
