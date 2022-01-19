import { prefix } from '@fortawesome/free-solid-svg-icons';
import { nice } from 'd3';
import { PropertiesContext } from './../../discovery-syntax/DiscoverySyntaxParser';
const { v4 } = require('uuid');
const _ = require('lodash')

export default class QueryBuilder {


    //properties without getters/setters
    'Loaded' = false;
    'JSONContentType'?: "entityDefinitions" | "populationDefinitions" | null;


    // properties dependenet on entities loaded from JSON
    '_@context': any;
    '_@graph': any;


    //all other properties:

    // all entities
    public _entities = [] as any[];
    get entities(): any[] {
        return this._entities;
    }


    // all filetypes (rdf:type) 
    private _entityTypes = [] as any[];
    get entityTypes(): any[] {
        return this._entityTypes;
    }


    // profiles
    private _profileEntities = [] as any[];
    get profileEntities(): any[] {
        return this._profileEntities;
    }


    // (keys) iri i.e. '@id'  -> (values) mapped to clauses i.e. ':and', ':or'
    private _clauses = new Map<string, any>();
    get clauses(): Map<string, any> {
        return this._clauses;

    }

    // each key and value from the JSON acts as a "node" with a temporarily generated UUID that is mapped against the property path (where it originated from) (useful for editing)
    // temporary iris examples are (@id = "urn:tempuuid_")   
    private _path = new Map<string, string>();
    private getPath(id: string): any {
        //example #todo traverse Map above 
        return ':Q_RegisteredGMS.:and.:match.'
    }


    // adjency list  as a graph containing the desired  
    private _graph = new Map<string, any>();
    get graph(): Map<string, any> {
        return this._graph;
    }




    //maps terms terms -> matched (see examples below)
    private _compoundTerms = new Map<string, string>();

    // example (should ideally be loaded from API)
    private _terms = [
        { '@id': ' http://endhealth.info/im#Q_term_IssuedPrescription', 'term': 'Issued Prescription for' },
        { '@id': ' http://endhealth.info/im#Q_term_InvestigationRequestOrResult', 'term': 'Investigation' }
    ];

    // example 
    private _matches = [
        // a medication that has been prescribed and issued -> Medication Authorisation + Medication Order  
        ['http://endhealth.info/im#Q_term_IssuedPrescription', 'http://endhealth.info/im#MedicationOrder'],
        ['http://endhealth.info/im#Q_term_IssuedPrescription', 'http://endhealth.info/im#MedicationAuthorisationsOrCourses'],
        // A referral/request for investigation or its results -> Diagnostic Report, Ovservation, Precedure, Request etc.  
        ['http://endhealth.info/im#Q_term_InvestigationRequestOrResult', 'http://endhealth.info/im#DiagnosticReport'],
        ['http://endhealth.info/im#Q_term_InvestigationRequestOrResult', 'http://endhealth.info/im#Observation'],
        ['http://endhealth.info/im#Q_term_InvestigationRequestOrResult', 'http://endhealth.info/im#Procedure'],
        ['http://endhealth.info/im#Q_term_InvestigationRequestOrResult', 'http://endhealth.info/im#ReferralRequestOrProcedureRequest'],

    ];




    private reset(): void {
        this._entities = [] as any[];
        this._entityTypes = [] as any[];
        this._profileEntities = [] as any[];
        this._clauses = new Map<string, any>();
        this._path = new Map<string, string>();
        this._graph = new Map<string, any>();
    }


    loadJSON(file: any): QueryBuilder {


        if (this.Loaded) this.reset();

        // file
        file = JSON.parse(file);


        if (file["entities"]) {
            this.JSONContentType = "entityDefinitions";
            if (this.loadEntityDefinitions(file) == false) throw new Error("JSON content structure not recognised");
        } else if (file[":and"] || file[":or"]) {
            this.JSONContentType = "populationDefinitions";
            // if (this.loadQueryDefinitions(file) == false) throw new Error ("JSON content structure not recognised");
        } else {
            throw new Error("JSON content structure not recognised");
        }

        return this;
    }

    private loadEntityDefinitions(file: any): boolean {



        try {
            this['_@context'] = file["@context"];
            this['_@graph'] = file["@graph"];
            this['_entities'] = file["entities"];

            // separate out types, queries, definitions and _clauses
            file["entities"].forEach((entity: any) => {
                //types
                const _type = entity["rdf:type"][0]["@id"];
                if (!this._entityTypes.includes(_type)) {
                    this._entityTypes.push(_type);
                }

                console.log("entity:", entity);
                console.log("entityTypes:", this._entityTypes);

                if (_type === ":Profile") {
                    //profiles 
                    this._profileEntities.push(entity);
                    // _clauses - looks for AND/OR
                    if (entity[':and']) {
                        this._clauses.set(entity['@id'], { ':and': entity[':and'] })
                    } else if (entity[':or']) {
                        this._clauses.set(entity['@id'], { ':or': entity[':or'] })
                    }

                }

            });

            console.log("_clauses:", this._clauses);

            return true;
        } catch (error) {
            console.log("Error with loadEntityDefinitions:", error)
            return false;
        }



    }

}





