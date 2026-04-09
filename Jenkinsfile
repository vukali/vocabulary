pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: vocab-app
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ["/busybox/busybox", "cat"]
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker
    - name: workspace-volume
      mountPath: /home/jenkins/agent
      readOnly: false
  - name: tools
    image: alpine:3.20
    command: ["/bin/sh", "-c", "apk add --no-cache git && sleep infinity"]
    tty: true
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent
      readOnly: false
  - name: node
    image: node:22-alpine
    command: ["/bin/sh", "-c", "sleep infinity"]
    tty: true
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent
      readOnly: false
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli:11.1
    command: ["/bin/sh", "-c", "sleep infinity"]
    tty: true
    env:
    - name: SONAR_USER_HOME
      value: /tmp/sonar
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent
      readOnly: false
  volumes:
  - name: docker-config
    emptyDir: {}
  - name: workspace-volume
    emptyDir: {}
'''
        }
    }

    environment {
        DOCKER_CONTEXT = '.'
        DOCKERFILE = 'Dockerfile'
        KUSTOM_FILE = 'k8s/kustomization.yaml'
        HARBOR_HOST = 'harbor.watasoftware.com'
        HARBOR_PROJECT = 'vocab-app'
        IMAGE_NAME = 'vocab-app'
        IMAGE_REPO = "${HARBOR_HOST}/${HARBOR_PROJECT}/${IMAGE_NAME}"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        SONAR_PROJECT_KEY = 'vocab-app'
        SONAR_PROJECT_NAME = 'vocab-app'
        SKIP_MARKER = '[skip-jenkins]'
        BOT_EMAIL = 'jenkins@local'
        SKIP_BUILD = 'false'
    }

    stages {
        stage('Checkout') {
            steps {
                retry(3) {  // Retry checkout up to 3 times
                    checkout scm
                }
            }
        }

        stage('Code Quality') {
            steps {
                container('node') {
                    sh '''
                        set -eu
                        npm ci
                        npm run build
                    '''
                }
                container('sonar-scanner') {
                    withSonarQubeEnv('sonarqube') {
                        sh '''
                            set -eu
                            sonar-scanner \
                              -Dsonar.projectKey="${SONAR_PROJECT_KEY}" \
                              -Dsonar.projectName="${SONAR_PROJECT_NAME}" \
                              -Dsonar.projectVersion="${BUILD_NUMBER}"
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Push to Harbor') {
            steps {
                container('kaniko') {
                    withCredentials([usernamePassword(credentialsId: 'harbor-cred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            set -eu
                            cat > /kaniko/.docker/config.json <<EOF
{ "auths": { "${HARBOR_HOST}": { "username": "${DOCKER_USERNAME}", "password": "${DOCKER_PASSWORD}" } } }
EOF
                            /kaniko/executor \
                              --context "${WORKSPACE}/${DOCKER_CONTEXT}" \
                              --dockerfile "${WORKSPACE}/${DOCKERFILE}" \
                              --destination "${IMAGE_REPO}:${IMAGE_TAG}" \
                              --destination "${IMAGE_REPO}:latest"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Build and push to Harbor completed."
        }
        failure {
            echo "Build failed. Please check the logs for more details."
        }
    }
}
