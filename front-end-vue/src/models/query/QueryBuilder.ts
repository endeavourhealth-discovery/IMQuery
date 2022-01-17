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
    
    // queries 
    private _queryEntities = [] as any[];
    get queryEntities(): any[] {
        return this._queryEntities;
    }
    
    
    
    private _queryDefinitions = new Map<string, Query>();
    // im:Folder iri (keys) -> im:queryDefinition (values)
    get queryDefinitions(): Map<string, Query> {
        return this._queryDefinitions;
    }
    
    private _step = new Map<string, Step>();
    // im:queryDefinitions (keys) -> mapped to step
    get step(): Map<string, Step> {
        return this._step;

    }
    
    // all the variables stored as key-value pairs - where keys are variable names (e.g. entityVar or valueVar) and values are  the path to the query/definition/step/where (for editing)  
    private _variables: any;
    
    
    // adjency list acting as a graph containing "triples" found in  WHERE statements
    private _graph = new Map<string, Couple[]>(); 
    get graph() : Map<string, Couple[]> {
        return this._graph;
    }




   
    
    'Loaded' = false;
    'JSONContentType'? : "entityDefinitions" | "queryDefinitions" | null;

    '_@context': any;
    '_@graph': any;


    private reset(): void {
        this._entities = [] as any[];
        this._entityTypes = [] as any[];
        this._queryEntities = [] as any[];
        this._queryDefinitions = new Map<string, Query>(); 
        this._step = new Map<string, Step>();
        this._graph = new Map<string, Couple[]>(); 
    }


    loadJSON(file: any): QueryBuilder {
        
            
        if (this.Loaded) this.reset();
        
        // file
        file = JSON.parse(file);


        if (file["entities"]) {
            this.JSONContentType =  "entityDefinitions";
            if (this.loadEntityDefinitions(file) == false) throw new Error ("JSON content structure not recognised");
        } else if (file["query"]) {
            this.JSONContentType =  "queryDefinitions";
            if (this.loadQueryDefinitions(file) == false) throw new Error ("JSON content structure not recognised");
        } else {
            throw new Error ("JSON content structure not recognised");
        }
        

        

       



        return this;
    }

    private loadEntityDefinitions(file: any): boolean {

            try {
                this['_@context'] = file["@context"];
                this['_@graph'] = file["@graph"];
                this['_entities'] = file["entities"];
        
                // separate out types, queries, definitions and step
                file["entities"].forEach((entity: any) => {
                    //types
                    const _type = entity["rdf:type"][0]["@id"];
                    if (!this._entityTypes.includes(_type)) {
                        this._entityTypes.push(_type);
                    }
        
                    if (_type === "im:Query") {
                        //queries 
                        this._queryEntities.push(entity);
        
        
                        if (entity['im:queryDefinition']) {
        
                            // query definitions
                            const _queryDefinition = JSON.parse(entity['im:queryDefinition']);
                            this._queryDefinitions.set(entity['iri'], _queryDefinition as Query);
        
                            // step
                            if(_queryDefinition['step'] ){ 
                                this._step.set(entity['iri'], _queryDefinition['step'] as Step)
                            }
                        
                        } 
        
                    }
        
                });

                //dev
                console.log("entityTypes:", this._entityTypes);
                console.log("queryEntities:", this._queryEntities);
                console.log("queryDefinitions:", this._queryDefinitions);
                console.log("step:", this._step);
                
                return true;
            } catch (error) {
                return false;
            }

       

    }

    private loadQueryDefinitions(file: any): boolean {

        try {



//separate out queries
            file["query"].forEach((query: any) => {
                // this._queryDefinitions.set(query as Query);
            });
            console.log("queryDefinitions:", this._queryDefinitions);
            console.log("step:", this._step);


            return true;
        } catch (error) {
            return false;
        }

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

            for (let i = 0; i < _children.length; i++) {
                if (targetEntity['currentPath'] == '') {
                    _children[i]['currentPath'] = `${targetEntity['currentPath']}children[${i.toString()}]`
                } else {
                    _children[i]['currentPath'] = `${targetEntity['currentPath']}.children[${i.toString()}]`
                }


            }

            return _children;
        };


        // breadth-first addition of children
        const _added = new Set();
        const _queue = [this._hierarchyTree]

        while (_queue.length > 0) {

            const _currentItem = _queue.shift(); // gets the next item from the queue
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
                if (!_added.has(_child['@id'])) {
                    _added.add(_child['@id']);
                    _queue.push(_child); 
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

//groupsort


// step
export class Step extends Entity {
    public operator: "AND" | "OR" | "NOTOR" | "NOTAND" | null = "AND";
    public step?: Step[] | null;
    public where?: Where[] | null;
}


// couple
export class Couple extends Entity {
    public property?: Entity | null;
    public valueVar?: string | null;
    public filter?: Filter[] | null;
    public valueEntity?: Entity | null;
}

//triple
export class Where extends Couple {
    public entityVar?: string | null;
}


//// add these to _graph### #todo: next
export class WhereNode extends Where {
    public graphUUID: string =  v4();
    public propertyPath?: string | null; // #todo: leave a reference to queryEntity.iri and property path in order to edit to allow for editing  
}


export class Filter {
    public in?: Entity[] | null;
    public range?: Range| null;
    public notIn?: Entity[] | null;
    public function?: QueryFunction | null;
    public comparison?: string | null;
    public value?: string | null;
    
}


export class Range {
    public from?: {comparison: string, value: string} | null;
    public to?: {comparison: string, value: string}  | null;

}

// compatible with: name -> im:TimeDifference
export class QueryFunction {
    public name?: Entity | null;
    public argument?: [{paramater: string, value: string}] | null;

}

export class Selection {
    public var?: string | null;
}


export class Query extends Entity {
    public mainEntityType?: Entity | null;
    public mainEntityVar?: string | null;
    public prefix?: any | null;
    public operator: "AND" | "OR" | "NOTOR" | "NOTAND" | null = "AND";
    public step?: Step[] | null;
    public select?: Selection[] | null;



    constructor(query?: Query)
    constructor(query: Query) {
        super()
        this["mainEntityType"] = query["mainEntityType"] ? query["mainEntityType"] : null;
        this["mainEntityVar"] = query["mainEntityVar"] ? query["mainEntityVar"] : null;
        this["prefix"] = query["prefix"] ? query["prefix"] : null;
        this["operator"] = query["operator"] ? query["operator"] : null;
        this["step"] = query["step"] ? query["step"] : null;
        this["select"] = query["select"] ? query["select"] : null;
    }

}




// export class Node {
//     // Vertices node key
//     public id: number;
//     public next: Node | null;
//     constructor(id: number) {
//         // Set value of node key
//         this.id = id;
//         this.next = null;
//     }
// }




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


