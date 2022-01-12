import { prefix } from '@fortawesome/free-solid-svg-icons';
import { nice } from 'd3';
import { PropertiesContext } from './../../discovery-syntax/DiscoverySyntaxParser';
const { v4 } = require('uuid');
const _ = require('lodash')
// import * as ceg_c19_vac_2nd from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_c19_vac_booster from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_c19_pregant from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';
// import ceg_smi from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';



//todo: check available DBID with opensearch first before accepting a random number as DBID
// const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;


export default class QueryBuilder {


    public Loaded = false;


    public _context: any;
    public _graph: any;
    public _entities = [] as any[];
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


    private _queryDefinitions = [] as any[];
    get queryDefinitions(): any[] {
        return this._queryDefinitions;
    }





    loadJSON(file: any): QueryBuilder {


        // this._hierarchyTree = [];
        // this._lastTopLevelEntity = [];

        // file
        // file = JSON.parse(file);
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
        file["entities"].forEach((entity: any) => {
            if (entity["rdf:type"][0]["@id"] === "im:Query") {
                this._queries.push(entity);
            }
        });

        //queryDefinitions

        this._queries.forEach((query: any) => {
            // this._queryDefinitions.push(query['im:queryDefinition']);
            // const definition = JSON.parse(JSON.stringify(query['im:queryDefinition']));
            const definition = query['im:queryDefinition'];
            // console.log("query['im:queryDefinition']", definition);
            console.log("query['im:queryDefinition']", definition);
        });


        //query tree


        this.Loaded = true;
        return this;
    }


    private _hierarchyTree: any;
    private _lastTopLevelEntity: any;
    hierarchyTree(topLevelEntity: any): any[] | null {

        if (!this.Loaded) return null;


        //prevents expensive recomputation with each computed() call
        if (this._lastTopLevelEntity && this._lastTopLevelEntity.iri == topLevelEntity.iri) {
            return this._hierarchyTree;
        } else {
            this._lastTopLevelEntity = topLevelEntity;
        }

        const _hierarchyTree = { ...topLevelEntity, currentPath: '', children: [] };


        // const _currentChildren = [] as any[];
        // let _currentDepth = 0;
        // const _currentEntity = topLevelEntity;
        // const _maxDepth = 1;

        // while (_currentDepth < _maxDepth) {
        //     _currentDepth += 1;
        //     // const _currentChildren = this.getChildren(_currentEntity);
        //     // console.log(_currentChildren);

        // }
        this._hierarchyTree = _hierarchyTree;

        this.getFolders();
        console.log("_hierarchyTree", _hierarchyTree);
        return _hierarchyTree;
    }


    item(iri: string) {
        return this.entities.filter((ent: any) => ent["@id"] == iri);
    }


    private getFolders() {


        const _added = new Set();
        const _queue = [this._hierarchyTree]
        const _itemPaths = {};


        // .set(state.openQueries[_activeQueryIndex], payload.propertyPath + ".name", payload.name)
        const getChildren = (targetEntity: any): any => {
            let _children = this.entities.filter((ent: any) => ent["im:isContainedIn"] && ent["im:isContainedIn"][0]["@id"] == targetEntity["@id"])
            _children = _children.map((item: any) => {
                return {
                    ...item,
                    currentPath: '',
                    children: [] as any[]

                }
            })

            console.log("children length:", _children.length)



            for (let i = 0; i < _children.length; i++) {
                if (targetEntity['currentPath'] == '') {
                    _children[i]['currentPath'] = `${targetEntity['currentPath']}children[${i.toString()}]`
                } else {
                    _children[i]['currentPath'] = `${targetEntity['currentPath']}.children[${i.toString()}]`
                }


            }


            return _children;


        };


        while (_queue.length > 0) {



            const _currentItem = _queue.shift(); // mutates the queue

            // console.log("1. _currentItem", _currentItem)


            const _children = getChildren(_currentItem);


            if (_currentItem['@id'] == this._hierarchyTree['@id']) {

                _.set(this._hierarchyTree, 'children', _children)
                // console.log("2.children: ", _children)
                // console.log("3. path: ", 'children')
                // console.log("4. tree: ", this._hierarchyTree)
            } else {

                _.set(this._hierarchyTree, _currentItem['currentPath'] + '.children', _children)
                // console.log("2.children: ", _children)
                // console.log("3. path: ", _currentItem['currentPath'] + '.children')
                // console.log("4. tree: ", this._hierarchyTree)
            }




            //get children of children
            for (const _child of _children) {


                if (!_added.has(_child)) {
                    _added.add(_child);
                    _queue.push(_child);
                    // __itemPaths[_child['id']] = 
                }

            }


        }





    }

}


export class Entity {
    public '@id'?: string | null;
    public 'rdfs:label'?: string | null;
    public 'rdf:type'?: Entity | null;
    public 'rdfs:comment'?: string | null;
    public 'im:isContainedIn'?: Entity | null;
    public 'iri'?: string | null;
    public 'name'?: string | null;
    public 'type'?: Entity | null;
    public 'description'?: string | null;
    public 'children'?: Entity | null;


    constructor(entity?: Entity)
    constructor(entity: Entity) {

        this["@id"] = entity["@id"] ? entity["@id"] : null;
        this["rdf:type"] = entity["rdf:type"] ? entity["rdf:type"] : null;
        this["rdfs:label"] = entity["rdfs:label"] ? entity["rdfs:label"] : null;
        this["rdfs:comment"] = entity["rdfs:comment"] ? entity["rdfs:comment"] : null;
        this["im:isContainedIn"] = entity["im:isContainedIn"] ? entity["im:isContainedIn"] : null;
        this["iri"] = entity["iri"] ? entity["iri"] : null;
        this["name"] = entity["name"] ? entity["name"] : null;
        this["type"] = entity["type"] ? entity["type"] : null;
        this["description"] = entity["description"] ? entity["description"] : null;
        this["children"] = entity["children"] ? entity["children"] : null;

        return this;
    }
}


export class Clause extends Entity {
    public clause?: Clause[] | null;
    public where?: Where[] | null;
}

export class Where extends Entity {
    public entityVar?: string | null;
    public property?: Entity | null;
    public valueVar?: string | null;
    public filter?: Filter[] | null;
    public valueEntity?: Entity | null;
}

export class Filter {
    public in?: Entity[] | null;
}


export class Selection {
    public var?: string | null;
}


export class Query extends Entity {
    public mainEntityType?: Entity | null;
    public mainEntityVar?: string | null;
    public prefix?: any | null;
    public operator: "AND" | "OR" | "NOTOR" | "NOTAND" = "AND";
    public clause?: Clause[] | null;
    public select?: Selection[] | null;



    constructor(query?: Query)
    constructor(query: Query) {
        super()
        this["mainEntityType"] = entity["mainEntityType"] ? entity["mainEntityType"] : null;
        this["mainEntityVar"] = entity["mainEntityVar"] ? entity["mainEntityVar"] : null;
        this["prefix"] = entity["prefix"] ? entity["prefix"] : null;
        this["operator"] = entity["operator"] ? entity["operator"] : null;
        this["clause"] = entity["clause"] ? entity["clause"] : null;
        this["select"] = entity["select"] ? entity["select"] : null;
    }

}




export class Node {
    // Vertices node key
    public id: number;
    public next: Node | null;
    constructor(id: number) {
        // Set value of node key
        this.id = id;
        this.next = null;
    }
}




// export class Folder {

//     public "@id"?: string | null;
//     public "rdf:type"?: string | null;
//     public "rdfs:label"?: string | null;
//     public "im:isContainedIn"?: any | null;
//     public "im:contains"?: any | null;

//     constructor(folder?: Folder)
//     constructor(folder: Folder) {
        
//         this["@id"] = folder["@id"] ? folder["@id"] : "im:Q_{0}";
//         this["rdf:type"] = folder["rdf:type"] ? folder["rdf:type"] : "Untitled Dataset";
//         this["rdfs:label"] = folder["rdfs:label"] ? folder["rdfs:label"] : null;
//         this["im:isContainedIn"] = folder["im:isContainedIn"] ? folder["im:isContainedIn"] : null;
//         this["im:contains"] = folder["im:contains"] ? folder["im:contains"] : null;

//         return this;
//     }

//     load(iri: string): void {

//         //hardcoded example        
//         if (iri == "http://endhealth.info/ceg/qry#Q_CEGQueries") {
//             // console.log("ceg_c19_vac_2nd", ceg_c19_vac_2nd);
//         }

//         //todo: fetch folder content using Workflow Service/API 
//     }

// }


