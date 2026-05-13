pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/sonamwangmo9/sonamwangmo_02250370_DSO101_A1.git'
            }
        }
        stage('Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                dir('backend') {
                    sh 'npm run build'
                }
            }
        }
        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit 'backend/junit.xml'
                }
            }
        }
    }
}