/* groovylint-disable DuplicateStringLiteral */
/* groovylint-disable-next-line CompileStatic */
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

  securityContext:
    runAsUser: 1000   # Đảm bảo quyền truy cập đúng
    fsGroup: 1000     # Đảm bảo quyền nhóm
'''
        }
    }

    environment {
        DOCKER_CONTEXT = '.'   // Đảm bảo đường dẫn chính xác
        DOCKERFILE     = 'Dockerfile'   // Tên Dockerfile của vocab-app
        KUSTOM_FILE    = 'k8s/kustomization.yaml'   // Cập nhật với đúng đường dẫn

        HARBOR_HOST    = 'harbor.watasoftware.com'
        /* groovylint-disable-next-line DuplicateStringLiteral */
        HARBOR_PROJECT = 'vocab-app'
        /* groovylint-disable-next-line DuplicateStringLiteral */
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
                    /* groovylint-disable-next-line NestedBlockDepth */
                    script {
                        sh '''
                            set -eu
                            apk add --no-cache git >/dev/null
                            git config --global --add safe.directory "$PWD"
                        '''

                        /* groovylint-disable-next-line VariableTypeRequired */
                        /* groovylint-disable-next-line NoDef, VariableTypeRequired */
                        def authorEmail = sh(
                            returnStdout: true,
                            script: 'git log -1 --pretty=format:%ae || true'
                        ).trim()

                        /* groovylint-disable-next-line NoDef, VariableTypeRequired */
                        def msg = sh(
                            returnStdout: true,
                            script: 'git log -1 --pretty=format:%s || true'
                        ).trim()

                        echo "Last commit author: ${authorEmail}"
                        echo "Last commit msg   : ${msg}"

                        /* groovylint-disable-next-line NestedBlockDepth */
                        if (authorEmail == env.BOT_EMAIL || msg.contains(env.SKIP_MARKER)) {
                            /* groovylint-disable-next-line DuplicateStringLiteral */
                            env.SKIP_BUILD = 'true'
                            echo "Skip build: detected bot commit or ${env.SKIP_MARKER}"
                        }
                    }
                }
            }
        }

        stage('Set Image Tag') {
            when {
                /* groovylint-disable-next-line DuplicateStringLiteral */
                expression { env.SKIP_BUILD != 'true' }
            }
            steps {
                script {
                    /* groovylint-disable-next-line NoDef, VariableTypeRequired */
                    def sha = env.GIT_COMMIT ?: ''
                    /* groovylint-disable-next-line DuplicateNumberLiteral */
                    env.IMAGE_TAG = (sha.length() >= 7) ? sha.substring(0, 7) : env.BUILD_NUMBER
                    echo "IMAGE_TAG=${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build & Push to Harbor (Kaniko)') {
            when {
                /* groovylint-disable-next-line DuplicateStringLiteral */
                expression { env.SKIP_BUILD != 'true' }
            }
            steps {
                container('kaniko') {
                    /* groovylint-disable-next-line LineLength, NestedBlockDepth */
                    withCredentials([usernamePassword(credentialsId: 'harbor-cred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        /* groovylint-disable-next-line GStringExpressionWithinString */
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
                /* groovylint-disable-next-line DuplicateStringLiteral */
                expression { env.SKIP_BUILD != 'true' }
            }
            steps {
                /* groovylint-disable-next-line DuplicateStringLiteral */
                container('tools') {
                    /* groovylint-disable-next-line NestedBlockDepth */
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        /* groovylint-disable-next-line GStringExpressionWithinString */
                        sh '''
                            set -eu
                            apk add --no-cache git yq >/dev/null
                            git config --global --add safe.directory "$PWD"

                            git config user.email "${BOT_EMAIL}"
                            git config user.name  "jenkins"

                            ORIGIN_URL=$(git remote get-url origin)
                            case "$ORIGIN_URL" in
                              https://* )
                                /* groovylint-disable-next-line LineLength */
                                git remote set-url origin "https://x-access-token:${GITHUB_TOKE_
