pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ["/busybox/busybox", "cat"]
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker

  - name: tools
    image: alpine:3.20
    command: ["/bin/sh", "-c", "cat"]
    tty: true

  volumes:
  - name: docker-config
    emptyDir: {}
'''
        }
    }

    environment {
        DOCKER_CONTEXT = '.'   // Đảm bảo đường dẫn chính xác
        DOCKERFILE     = 'Dockerfile'   // Tên Dockerfile của vocab-app
        KUSTOM_FILE    = 'k8s/kustomization.yaml'   // Cập nhật với đúng đường dẫn

        HARBOR_HOST    = 'harbor.watasoftware.com'
        HARBOR_PROJECT = 'vocab-app'
        IMAGE_NAME     = 'vocab-app'
        IMAGE_REPO     = "${HARBOR_HOST}/${HARBOR_PROJECT}/${IMAGE_NAME}"

        SKIP_MARKER    = '[skip-jenkins]'
        BOT_EMAIL      = 'jenkins@local'
        SKIP_BUILD     = 'false'
    }

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Anti-loop (skip bot commit)') {
            steps {
                container('tools') {
                    script {
                        sh '''
                            set -eu
                            apk add --no-cache git >/dev/null
                            git config --global --add safe.directory "$PWD"
                        '''

                        def authorEmail = sh(
                            returnStdout: true,
                            script: 'git log -1 --pretty=format:%ae || true'
                        ).trim()

                        def msg = sh(
                            returnStdout: true,
                            script: 'git log -1 --pretty=format:%s || true'
                        ).trim()

                        echo "Last commit author: ${authorEmail}"
                        echo "Last commit msg   : ${msg}"

                        if (authorEmail == env.BOT_EMAIL || msg.contains(env.SKIP_MARKER)) {
                            env.SKIP_BUILD = 'true'
                            echo "Skip build: detected bot commit or ${env.SKIP_MARKER}"
                        }
                    }
                }
            }
        }

        stage('Set Image Tag') {
            when {
                expression { env.SKIP_BUILD != 'true' }
            }
            steps {
                script {
                    def sha = env.GIT_COMMIT ?: ''
                    env.IMAGE_TAG = (sha.length() >= 7) ? sha.substring(0, 7) : env.BUILD_NUMBER
                    echo "IMAGE_TAG=${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build & Push to Harbor (Kaniko)') {
            when {
                expression { env.SKIP_BUILD != 'true' }
            }
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

        stage('Bump image tag in kustomization.yaml & push Git') {
            when {
                expression { env.SKIP_BUILD != 'true' }
            }
            steps {
                container('tools') {
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        sh '''
                            set -eu
                            apk add --no-cache git yq >/dev/null
                            git config --global --add safe.directory "$PWD"

                            git config user.email "${BOT_EMAIL}"
                            git config user.name  "jenkins"

                            ORIGIN_URL=$(git remote get-url origin)
                            case "$ORIGIN_URL" in
                              https://* )
                                git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@${ORIGIN_URL#https://}"
                                ;;
                            esac

                            FILE="${KUSTOM_FILE}"

                            if ! yq '.images' "$FILE" >/dev/null 2>&1; then
                              yq -i '.images = []' "$FILE"
                            fi

                            if ! yq -e '.images[] | select(.name=="'"${IMAGE_REPO}"'")' "$FILE" >/dev/null 2>&1; then
                              yq -i '.images += [{"name":"'"${IMAGE_REPO}"'","newTag":"'"${IMAGE_TAG}"'"}]' "$FILE"
                            else
                              yq -i '(.images[] | select(.name=="'"${IMAGE_REPO}"'") | .newTag) = "'"${IMAGE_TAG}"'"' "$FILE"
                            fi

                            git add "$FILE"
                            git commit -m "chore(vocab-app): bump image tag to ${IMAGE_TAG} ${SKIP_MARKER}" || true
                            git push origin HEAD:main
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "OK: pushed ${IMAGE_REPO}:${IMAGE_TAG} + updated ${KUSTOM_FILE}. ArgoCD autosync sẽ rollout."
        }
        always {
            script {
                if (env.SKIP_BUILD == 'true') {
                    echo 'Build was skipped by anti-loop logic.'
                }
            }
        }
    }
}















// pipeline {
//     agent {
//         kubernetes {
//             label 'jenkins-agent'
//             defaultContainer 'jnlp'
//             containerTemplate(name: 'docker', image: 'docker:19.03.12-dind', ttyEnabled: true, command: 'cat')
//         }
//     }

//     environment {
//         REGISTRY = 'harbor.watasoftware.com'
//         IMAGE_NAME = 'vocab-app'
//         IMAGE_TAG = 'latest'
//     }

//     stages {
//         stage('Build') {
//             steps {
//                 script {
//                     // Sử dụng Docker-in-Docker container
//                     container('docker') {
//                         sh 'docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} .'
//                     }
//                 }
//             }
//         }

//         stage('Push to Harbor') {
//             steps {
//                 script {
//                     container('docker') {
//                         withCredentials([usernamePassword(credentialsId: 'vudt', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
//                             sh "echo ${DOCKER_PASSWORD} | docker login ${REGISTRY} -u ${DOCKER_USERNAME} --password-stdin"
//                             sh "docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }
