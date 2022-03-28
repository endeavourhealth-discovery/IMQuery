import { v4 } from "uuid";
import _ from "lodash";
// import jmp from "jmp";
import jsonpath from "jsonpath";
import axios, { AxiosResponse } from "axios";
import DataService from "@/services/DataService";

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
        if (value["@context"] && value["@graph"] || value["entities"]) {
            this["_@context"] = value["@context"];
            this["_@graph"] = value["@graph"];
            this["_entities"] = value["entities"];
        } else {

            throw new Error("Unrecognised Ontology file content");
        }
    }


    public '_@context': any;

    public '_@graph': any;

    private '_entities': any;


    public loadEntities(entities: any) {
        this._entities = [...this._entities, ...entities];
    }

    public entities = new class {

        constructor(public superThis: Ontology) {
            return superThis._entities;
        }

        public byIri(iri: string): any {
            if (iri != "") {
                const _results = this.superThis._entities.filter((entity: any) => entity["@id"] == iri);
                // console.log("", )
                return _results;
                // return jmp.search(this.superThis._entities, `[?"@id" == \`${iri}\`]`)[0]
            }
            else {
                throw new Error("Iri parameter is an empty string");
            }
        }



        // public byType(entityType: entityTypes | string): any {
        //     console.log("entityType", entityType)

        //     const _results = this._entities.filter((entity: any) => {
        //         // console.log(entity["rdf:type"])
        //         return entity["rdf:type"]?.includes(entityType)
        //     });
        //     // const _results = this._entities.filter((entity: any) => entity["rdf:type"]?.includes(entityType));
        //     return _results;
        //     // return jmp.search(this.superThis._entities, `[?"rdf:type"[?"@id" == \`${entityType}\`]]`)
        // }

    }(this);


    constructor() {
        const _filenames = ["CoreOntology.json", "AdditionalOntology.json"]; //can add your own definitions e.g. for profiles and random concept sets.

        _filenames.forEach(async (filename: string) => {
            await DataService.getData(filename)
                .then(data => {
                    if (data["entities"]) {
                        this._entities = data["entities"]
                    } else {
                        data.forEach((item: any) => this._entities.push(item));
                    }

                })
                .catch(err => {
                    console.error("Failed to fetch userdata", err);
                });
        });
    }



    // if you want to load the file from cloud
    // the url to the cloudfront url / S3 bucket containing the ontology file
    // constructor(ontologyURL = import.meta.env.VITE_ONTOLOGY_URL as string) {

    //     if (!ontologyURL || ontologyURL == "") {

    //         throw new Error("No Ontology URL specified on instantiation. Pass a URL to entities in your ontology in JSON-LD format i.e. '@context', '@graph' and 'entities'");
    //     }

    //     this.fetchOntology(ontologyURL)
    //         .then((res) => {
    //             this.ontology = res;
    //             console.log("ontology loaded", res);
    //         })
    //         .catch((err) => {
    //             throw new Error("Failed to fetch Ontology from specified URL. Error message:" + err);
    //         });;
    //     return this;
    // }


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


