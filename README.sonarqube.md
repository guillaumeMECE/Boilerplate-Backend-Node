# How does it work once you setup Sonar?

Sonar comes in addition to the test you run with Jest.

Sonar gives you graphical interface for Smell code, code coverage etc. 

1. Generate your test report with Jest for Sonar

    $ npm t
    $ sonar-scanner

    It will create a report + coverage folder

    You can configure the report folder in package.json by editing 'jestSonar' attribute

2. Open localhost:9000 to obtain analyze reports of Sonar.

    It will check the reports and analyze all files except the one specified in README.sonarqube.md

# How to set up Sonarqube to work with jest

## 0. Pre-requisites:

- node & npm
- java 11+ _(**java -version** to check)_
    * [MacOs/Windows/Linux] Install: 
    <https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html>
    
    * [MacOs] Install java 11+ 
    <https://www.youtube.com/watch?v=pNDLX2KUYwk>

## 1. Download sonarqube server

<https://www.sonarqube.org/downloads>

- sonarqube 7.9.1 _Community EDITION_

## 2. Start server...

### ...for Windows

C:\path\to\sonarqube-7.9.1\bin\windows-x86-64\StartSonar.bat

### ...for MacOS

C:\path\to\sonarqube-7.9.1\bin\macosx-universal-64\sonar.sh

### ...for Linux

C:\path\to\sonarqube-7.9.1\bin\linux-x86-64\sonar.sh

## 3. Troubleshoot with java

### Add java command:
Option 1: Add java to your system path
Option 2: Add absolute path of your java bin:
    _C:\path\to\java\jdk-11.x.x\bin_
in the wrapper.conf file:
    _C:\path\to\sonarqube-7.9.1\conf\wrapper.conf_

### If your sonarqube server crash after a few seconds
=> Make sure you have enough RAM and cache available, JVM takes a lot of resources.
## 4. Create sonar-project.properties at the root of your project:

    # required metdata
    sonar.projectKey=xxxxxxxxxx
    sonar.projectVersion=X.X
    sonar.language=js
    sonar.eslint.eslintconfigpath=./eslintrc.json

    #----- Default SonarQube server
    sonar.host.url=http://localhost:9000

    #----- Default source code encoding
    sonar.sourceEncoding=UTF-8

    # path to source directories
    sonar.tests=./test/
    sonar.sources=./src/

    # excludes
    sonar.exclusions=node_modules/*,coverage/*,**/*.test.*

    # coverage reporting
    sonar.testExecutionReportPaths=./reports/test-reporter.xml
    sonar.javascript.lcov.reportPaths=./coverage/lcov.info

## 5. Run npm dependencies
    $ npm install

### Sonarqube-scanner

    $ npm install sonarqube-scanner --save-dev

### Jest-sonar-reporter

    $ npm install jest-sonar-reporter --save-dev

## 6. Config jestSonar config in 'package.json'

    "jestSonar": {
        "reportPath": "reports",
        "reportFile": "test-reporter.xml",
        "indent": 4,
        "sonar56x": true
    }
## 7. Add this project now into a git repo

> otherwise sonarqube scanner will give blame error messages and may not work

    $ git init
    $ git add .
    $ git commit -m "my updated sonar-project.properties file and other stuff"

## 6. Setup Jest config

### Option 1: Create Jest.config.js

> A sample of jest.config.js : <https://github.com/facebook/jest/blob/master/jest.config.js>

    collectCoverage: true,
    collectCoverageFrom: [ "src/**" ],
    testResultsProcessor": "jest-sonar-reporter

### Option 2: Add in Package.json

    jest{
        "collectCoverage": true,
        "collectCoverageFrom": [
            "src/**"
        ],
        "testResultsProcessor": "jest-sonar-reporter"
    }

    $ git add .
    $ git commit -m "Config Jest"

## 7. Run tests & sonar-scanner

    $ npm t
    $ sonar-scanner

## 8. Open sonarqube server in browser

http://localhost:9000/dashboard?id=**_sonar.projectKey_**

make sure you can see visible unit tests and coverage with a percentage greater than zero.

## 8. Troubleshoot coverage not showing anything?

- make sure you have spelt sonar-project.properties paths exactly correct.
  One letter out and it won't tell give useful debug error messages.


    sonar.tests=./tests/
    sonar.sources=./src/
    sonar.testExecutionReportPaths=./reports/test-reporter.xml
    sonar.javascript.lcov.reportPaths=./coverage/lcov.info

note:

- sonar.testExecutionReportPath will not work (You could spend days and hours scratching your head if you miss this)
- sonar.testExecutionReportPaths will work

# complete !

_Thanks to **Inspiraller** link to his GitHub Repo : <https://github.com/inspiraller/jest-sonar-coverage-boilerplate-working>_
