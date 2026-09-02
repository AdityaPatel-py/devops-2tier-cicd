pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker compose up -d --build'
            }
        }

        stage('Check Application') {
            steps {
                sh 'sleep 10'
                sh 'curl -f http://localhost/api/health'
            }
        }

    }

    post {

        success {
            echo 'Deployment successful!'
        }

        failure {
            echo 'Deployment failed!'
        }

    }
}
