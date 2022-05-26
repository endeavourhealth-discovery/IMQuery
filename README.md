# IM Query



## Run Frontend 

### Setup (you only have to do this once) 

`cd frontend-vue`

`npm install` 

<br>

### Ensure you have the following environment variables

`
VITE_IMAPI="http://localhost:8080/"
VITE_NODE_API="http://localhost:3000/"
VITE_ONTOLOGY_URL="https://ds0esjp1tzujt.cloudfront.net/CoreOntology.json"
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
