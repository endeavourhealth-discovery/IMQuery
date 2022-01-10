const { v4 } = require('uuid');
// import * as ceg_c19_vac_2nd from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_c19_vac_booster from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_c19_pregant from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_smi from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';



//todo: check available DBID with opensearch first before accepting a random number as DBID
// const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;


export default class QueryBuilder {

    private static _queries = [] as any[];

    private static _file: any;

    static get queries(): any[] {
        return this._queries;
    }
    // static set queries(value: any) {
    //     this._queries = value;
    // }


    public static loadFile(file: any) {


        const fr = new FileReader();
        fr.onload = (e: any) => {
            this._file = JSON.parse(e.target.result);
        };
        fr.readAsText(file);

        console.log("file", this._file)


        //loads queries
        this._queries = this._file["entities"].filter((entity: any) => entity["rdf:type"][0]["@id"] == "im:Query");

        // const fr = new FileReader();
        // console.log(`File loaded: ${file.name}`);
        // fr.onload = (e: any) => {
        //     this.openFiles = [...this.openFiles, JSON.parse(e.target.result)];
        //     console.log("File content: ", JSON.parse(e.target.result));
        // };
        // fr.readAsText(file);

    }
}


export class Query {
    public id?: number | null;
    public iri?: string | null;
    public name?: string | null;
    public description?: string | null;
    public data?: any | null;

    // constructor(id?: string, iri?: string, name?: string, description?: string, data?: any) {
    constructor(query?: Query)
    constructor(query: Query) {
        this.iri = query.iri ? query.iri : "im:Q_{0}";
        this.name = query.name ? query.name : "Untitled Dataset";
        this.description = query.description ? query.description : null;
        this.data = query.data ? query.data : null;
    }
    // use setters to check  validity of value, otherwise threw new Error('Iri is invalid');e.g. datamodel entity iri.

}

export class Folder {

    public "@id"?: string | null;
    public "rdf:type"?: string | null;
    public "rdfs:label"?: string | null;
    public "im:isContainedIn"?: any | null;
    public "im:contains"?: any | null;

    constructor(folder?: Folder)
    constructor(folder: Folder) {

        this["@id"] = folder["@id"] ? folder["@id"] : "im:Q_{0}";
        this["rdf:type"] = folder["rdf:type"] ? folder["rdf:type"] : "Untitled Dataset";
        this["rdfs:label"] = folder["rdfs:label"] ? folder["rdfs:label"] : null;
        this["im:isContainedIn"] = folder["im:isContainedIn"] ? folder["im:isContainedIn"] : null;
        this["im:contains"] = folder["im:contains"] ? folder["im:contains"] : null;

        return this;
    }

    load(iri: string): void {

        //hardcoded example        
        if (iri = "http://endhealth.info/ceg/qry#Q_CEGQueries") {
            // console.log("ceg_c19_vac_2nd", ceg_c19_vac_2nd);
        }

        //todo: fetch folder content using Workflow Service/API 
    }

}


// export default class QueryBuilder {

//     public static getExamples(): any {
//         return [ceg_c19_vac_2nd.Example1]
//         // ceg_c19_vac_booster, ceg_c19_pregant, ceg_smi];

//     }


// }


export class Examples {


    public static ceg_c19_vac_2nd = {

    }

    public static ceg_c19_vac_booster = {

    }

    public static ceg_c19_pregant = {

    }

    public static ceg_smi = {

    }
}