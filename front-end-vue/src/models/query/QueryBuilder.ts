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


    public _loaded = false;


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


    loadJSON(file: any): QueryBuilder {

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
        this._queries = file["entities"].filter((entity: any) => entity["rdf:type"][0]["@id"] === "im:Query");

        //query tree


        this._loaded = true;
        return this;
    }


    private _hierarchyTree: any;
    private _lastTopLevelEntity: any;
    hierarchyTree(topLevelEntity: any): any[] | null {

        if (!this._loaded) return null;


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

