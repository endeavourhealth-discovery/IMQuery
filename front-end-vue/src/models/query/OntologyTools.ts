const { v4 } = require('uuid');
const _ = require('lodash')
const jmp = require('jmespath');
const jp = require('jsonpath');
import axios, { AxiosResponse } from "axios";

export enum entityTypes {
    datamodel = 'sh:NodeShape',
    function = 'sh:Function',
    concept = 'im:Concept',
}

// An extract of CoreOntology that is cached in the browsers localStorage
export default class Ontology {




    private _ontology: any;
    public get ontology(): any {
        return this["_ontology"];
    }
    public set ontology(value: any) {
        if (value["_@context"] && value["_@graph"] || value["entities"]) {
            this["@context"] = value["@context"];
            this["@graph"] = value["@graph"];
            this["_entities"] = value["entities"];
        } else {

            throw new Error("Unrecognised Ontology file content");
        }
    }


    public '@context': any;

    public '@graph': any;

    private '_entities': any;



    public entities = new class {

        constructor(public superThis: Ontology) {
            return superThis._entities;
        }

        public byIri(iri: string): any {
            if (iri != "") {
                return jmp.search(this.superThis._entities, `[?"@id" == \`${iri}\`]`)[0]
            }
            else {
                throw new Error("Iri parameter is an empty string");
            }
        }

        public byType(entityType: entityTypes): any {
            return jmp.search(this.superThis._entities, `[?"rdf:type"[?"@id" == \`${entityType}\`]]`)
        }

    }(this);





    // the url to the cloudfront url / S3 bucket containing the ontology file 
    constructor(ontologyURL = import.meta.env.VUE_APP_ONTOLOGY_URL as string) {

        if (!ontologyURL || ontologyURL == "") {
            throw new Error("No Ontology URL specified on instantiation. Pass a URL to entities in your ontology in JSON-LD format i.e. '@context', '@graph' and 'entities'");
        }

        this.fetchOntology(ontologyURL)
            .then((res) => {
                this.ontology = res;
                console.log("ontology loaded", res);
            })
            .catch((err) => {
                throw new Error("Failed to fetch Ontology from specified URL. Error message:" + err);
            });;


        return this;


    }


    public async fetchOntology(ontologyURL: string): Promise<AxiosResponse<any>> {


        const _fileName = ontologyURL.substring(ontologyURL.lastIndexOf('/') + 1); //CoreOntology.json

        let _shouldCacheRefresh = true;

        //checks a file's last modified timestamp found in the response header to determine if cache needs to be refreshed
        await axios.head(ontologyURL).then((res => {

            // console.log("localStorage.getItem(`cache_last_modified_${_fileName}`)", localStorage.getItem(`cache_last_modified_${_fileName}`))
            // console.log(" res.headers[last-modified]", res.headers["last-modified"])


            if ((localStorage.getItem(`cache_last_modified_${_fileName}`) != res.headers["last-modified"])) {
                _shouldCacheRefresh = true;
                localStorage.setItem(`cache_last_modified_${_fileName}`, res.headers["last-modified"])
            } else {
                _shouldCacheRefresh = false;
            }

        }))

        if (_shouldCacheRefresh) {

            console.log("Ontology fetched from server");
            const _res = await axios.get(ontologyURL);
            localStorage.setItem(`cache_data_${_fileName}`, JSON.stringify(_res.data));
            return _res.data;


        } else {
            console.log("Ontology fetched from localstorage");
            return JSON.parse(localStorage.getItem(`cache_data_${_fileName}`) as string);
        }
    };


}


