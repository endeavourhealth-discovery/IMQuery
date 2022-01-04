# IM Query
![Version](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild-output/badges/front-end-vue/version.svg)
![Build Status](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild-output/badges/front-end-vue/build.svg)
![Unit Tests](https://s3.eu-west-2.amazonaws.com/endeavour-codebuild-output/badges/front-end-vue/unit-test.svg)


## Run Frontend 

### Setup (you only have to do this once) 

`cd frontend-vue`

`npm install` 

<br>

### Ensure you have the following environment variables

`
VUE_APP_OSS_URL=""
VUE_APP_OSS_AUTH_BASICTOKEN=""
VUE_APP_INDEX_IM="dev-im"
`

<br>

### Run local server

`cd frontend-vue`

`npm run serve`

Navigate your browser to `http://localhost:8081`

The proxy expects IM API to be running on localhost:8080

<br>

## Build Frontend (production)

`npm run build`
