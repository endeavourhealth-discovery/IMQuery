# IM Query
![Version](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild-output/badges/front-end-vue/version.svg)
![Build Status](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild-output/badges/front-end-vue/build.svg)
![Unit Tests](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild-output/badges/front-end-vue/unit-test.svg)


## Run Frontend (development)

Checkout from GIT

`cd frontend-vue`

`npm install` (you only have to do this once)

Copy the environment.js file and paste your variables within it (you only have to do this once)
cp environment_example.js environment.js 


Run local server

`npm run serve`

Navigate your browser to `http://localhost:8081`

The proxy expects IM API to be running on localhost:8080

## Build Frontend (production)

`npm run build`
