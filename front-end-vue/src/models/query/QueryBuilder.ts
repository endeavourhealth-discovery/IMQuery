const { v4 } = require('uuid');
// import * as ceg_c19_vac_2nd from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_c19_vac_booster from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_c19_pregant from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_smi from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';



//todo: check available DBID with opensearch first before accepting a random number as DBID
// const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;





export default class QueryBuilder {


    private _loaded = false;


    private _context: any;
    private _graph: any;
    private _entities = [] as any[];
    get entities(): any[] {
        return this._entities;
    }



    private _entityTypes = [] as any[];
    get entityTypes(): any[] {
        return this._entityTypes;
    }



    private _queries = [] as any[];
    get queries(): any[] {
        return this._queries;
    }


    // private _queryTree: any;
    queryTree(topLevelEntity: any): any[] | null {

        if (!this._loaded) {
            return null;
        }

        const _node = {
            children: [] as any[]
        }



        const _queryTree = { ...topLevelEntity, children: [] };
        const _currentChildren = [] as any[];

        let _currentDepth = 0;
        const _currentEntity = topLevelEntity;
        const _maxDepth = 1;

        while (_currentDepth < _maxDepth) {
            _currentDepth += 1;
            const _currentChildren = this.getChildren(_currentEntity);
            // console.log(_currentChildren);
            _queryTree.children = _currentChildren;

        }
        console.log("_queryTree", _queryTree);
        return _queryTree;
    }


    private getChildren(targetEntity: any) {

        const _type = targetEntity["rdf:type"][0]["@id"];
        console.log("_type", _type);
        if (_type == "im:Folder") {
            const _ent = this.entities.filter((ent: any) => ent["im:isContainedIn"] && ent["im:isContainedIn"][0]["@id"] == targetEntity["@id"]);

            return _ent.map((entity: any) => {
                return {
                    ...entity,
                    children: [] as any[]
                }
            })

        } else if (_type == "im:Query") {
            // return this._entities.filter((entity: any) => entity["im:isContainedIn"][0]["@id"] == _currentEntity);
            return null;
        }
    }




    loadFile(file: any): QueryBuilder {

        // file
        this._context = file["@context"];
        this._graph = file["@graph"];
        this._entities = file["entities"];

        //types
        file["entities"].forEach((entity: any) => {
            const _type = entity["rdf:type"][0]["@id"];
            if (!this._entityTypes.includes(_type)) {
                this._entityTypes.push(_type);
            }
        });

        //queries
        this._queries = file["entities"].filter((entity: any) => entity["rdf:type"][0]["@id"] === "im:Query");

        //query tree


        this._loaded = true;
        return this;
    }
}

//entity["rdf:type"][0]["@id"]


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
        if (iri == "http://endhealth.info/ceg/qry#Q_CEGQueries") {
            // console.log("ceg_c19_vac_2nd", ceg_c19_vac_2nd);
        }

        //todo: fetch folder content using Workflow Service/API 
    }

}


export class Node
{
	// Vertices node key
	public id: number;
	public next: Node | null;
	constructor(id: number)
	{
		// Set value of node key
		this.id = id;
		this.next = null;
	}
}

