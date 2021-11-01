#!/usr/bin/env groovy
@Library('jenkins-pipeline-library@develop')
import com.openwt.jenkins.pipeline.lib.*

properties([
    [$class: 'jenkins.model.BuildDiscarderProperty', strategy: [$class: 'LogRotator', numToKeepStr: '5']],
    disableConcurrentBuilds()
])

final String APP_NAME = 'coronapp-frontend'
final String JENKINS_SLAVE_BUILD = 'linux'
final String SDT_DOCKER_REGISTRY = 'registry.openwt.com'

Slack teamSlack = new Slack('#bag-covid19-dev-ci', this)
String initialVersion
String artifactVersion
String dockerTag

final Git git = new Git(this, CommandType.SH)
final GitBranch gitBranch = new GitBranch(this)

final boolean isMaster = gitBranch.currentIsMaster()
final boolean isDevelop = gitBranch.currentIsDevelop()
final String dockerTagPrefix = "$SDT_DOCKER_REGISTRY/coronapp"
final String dockerImageName = "${dockerTagPrefix}/${APP_NAME}"

// Timeout your whole process, keep some margin. If total exec time exceeds it, Jenkins will kill it and you
// will avoid blocking this slave for everyone else.
timeout(time: 20, unit: 'MINUTES') {

  node(JENKINS_SLAVE_BUILD) {

    // Surround everything with a try catch to make sure no uncaught errors happen
    try {

      env.NODEJS_HOME = "${tool 'nodejs-10.14.2'}"
      env.PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
      sh 'node --version'
      sh 'npm --version'

      // Split work units in stages - Jenkins will nicely display and track exec time and progress of these stages
      stage('Init and Checkout') {
        teamSlack.send "🚧 ${APP_NAME} BUILD STARTED"
        cleanWs()
        checkout scm
        stash name: 'sources', exclude: 'dist/*'
        notifyBitbucket()
      }

      stage('Prepare') {
        initialVersion = sh(script: 'npm run version --silent', returnStdout: true).trim()
        if (isMaster) {
          artifactVersion = initialVersion.replace('-SNAPSHOT', "")
        } else {
          artifactVersion = initialVersion + "-${git.getShortCommit()}"
        }
        dockerTag = "${dockerImageName}:${artifactVersion}"
        echo "Artifact version: $artifactVersion"
        echo "Docker tag: $dockerTag"
      }

      stage('Install modules') {
        sh 'npm ci'
      }

      stage('Build') {
        sh 'npm run build'
      }

      stage('Build Docker') {
        withCredentials([usernamePassword(credentialsId: 'coronapp-jenkins', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          sh "docker login -u ${USERNAME} -p ${PASSWORD} ${SDT_DOCKER_REGISTRY}"
        }
        sh "docker build -t $dockerTag ."
        if (isDevelop) {
          sh "docker build -t $dockerImageName:latest ."
        }
      }

      stage('Push to SDT Registry') {
        withCredentials([usernamePassword(credentialsId: 'coronapp-jenkins', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          sh "docker login -u ${USERNAME} -p ${PASSWORD} ${SDT_DOCKER_REGISTRY}"
        }
        sh "docker push $dockerTag"
        if (isDevelop) {
          sh "docker push $dockerImageName:latest"
        }
        teamSlack.send "🐳 Pushed Docker images to OWT registry (tag: ${dockerTag})"
      }

      if (isMaster) {
        stage('Git Push and Tag') {
          git.createAndPushTag(artifactVersion)
        }
      }

      currentBuild.result = "SUCCESS"
    } catch (e) {
      currentBuild.result = "FAILURE"
      teamSlack.send "It looks like someone broke the build pipeline, beers on him! 🍻"
      throw e
    } finally {
      teamSlack.send "🏁 ${APP_NAME} BUILD FINISHED"
      notifyBitbucket()
    }
  }
}
