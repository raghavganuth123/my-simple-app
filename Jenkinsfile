pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "701893741052"
        AWS_REGION = "ap-south-2"
        ECR_REPO = "my-simple-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        ECR_URL = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    options {
        timeout(time: 10, unit: 'MINUTES') // prevents forever waiting
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies (Cached)') {
            steps {
                sh """
                if [ -d node_modules ]; then
                    echo 'Using cached node_modules...'
                else
                    echo 'Installing Node dependencies...'
                    npm install --no-audit --no-fund
                fi
                """
            }
        }

        stage('Build Docker Image (Fast Cache)') {
            steps {
                sh """
                docker build \
                  --cache-from=${ECR_URL}/${ECR_REPO}:latest \
                  -t ${ECR_REPO}:${IMAGE_TAG} .
                """
            }
        }

        stage('Login to ECR (Fast)') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} \
                | docker login --username AWS --password-stdin ${ECR_URL}
                """
            }
        }

        stage('Tag & Push Image') {
            steps {
                sh """
                docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_URL}/${ECR_REPO}:${IMAGE_TAG}
                docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_URL}/${ECR_REPO}:latest

                docker push ${ECR_URL}/${ECR_REPO}:${IMAGE_TAG}
                docker push ${ECR_URL}/${ECR_REPO}:latest
                """
            }
        }
    }
}
