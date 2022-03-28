import { v4 } from "uuid";
import _ from "lodash";

import Templates from "@/models/query/Templates";


export class QueryBuilder {


    //properties without getters/setters belonging to this class
    'Loaded' = false;

    //all other properties belonging to this class

    // all entities
    public entities = new Map<string, any>();

    // #todo use Set to hold unique items?
    // all filetypes (rdf:type) 
    private _entityTypes = [] as any[];
    get entityTypes(): any[] {
        return this._entityTypes;
    }


    // profiles
    private _profiles = new Map<string, any>();
    get profiles(): Map<string, any> {
        return this._profiles;
    }
    // set profiles(): Map<string, any> {
    //     this_.profiles
    // }

    // get profilesAsArray(): any {
    //     return [...this._profiles.values()];
    // }


    // (keys) iri i.e. '@id'  -> (values) mapped to clauses i.e. ':and', ':or'
    private _clauses = new Map<string, any>();
    get clauses(): Map<string, any> {
        return this._clauses;

    }


    private reset(): void {
        this.entities.clear();
        this._entityTypes = [] as any[];
        this._profiles = new Map<string, any>()
        this._clauses = new Map<string, any>();
    }




    private addEntity(entity: any): void {
        const _type = entity["rdf:type"][0]["@id"];

        // add entities
        this.entities.set(entity["@id"], entity);

        // entitiesTypes - useful for filtering
        if (!this._entityTypes.includes(_type)) {
            this._entityTypes.push(_type);
        }

        // instantiate profiles
        if (_type === "im:Profile") {
            this._profiles.set(entity['@id'], new Profile(entity));
        }
    }


    // loads JSON file 

    load(entities: any): void {


        try {

            //if json parse
            if (typeof (entities) == "string" ) {
                entities = JSON.parse(entities)
            }


            if (Array.isArray(entities)) {
                // all entities in array
                entities.forEach((entity: any) => this.addEntity(entity));
            } else {
                // single entity
                this.addEntity(entities)
            }

            // console.log("this._profiles", this._profiles)
        } catch (error) {
            console.log("Error loading  :", error)
        }
    }

}

// Entity
class Entity {
    public '@id'?: string | null;
    public 'rdfs:label'?: string | null;
    public 'rdf:type'?: Entity | null;
    public 'rdfs:comment'?: string | null;
    public 'im:isContainedIn'?: Entity | null;


    constructor(entity?: any)
    constructor(entity: any) {
        this["@id"] = entity["@id"] ? entity["@id"] : "";
        this["rdf:type"] = entity["rdf:type"] ? entity["rdf:type"] as Entity : null;
        this["rdfs:label"] = entity["rdfs:label"] ? entity["rdfs:label"] : "";
        this["rdfs:comment"] = entity["rdfs:comment"] ? entity["rdfs:comment"] : "";
        this["im:isContainedIn"] = entity["im:isContainedIn"] ? entity["im:isContainedIn"] as Entity : null;
        return this;
    }
}


// Profile\\\\\
export class Profile extends Entity {
    public 'im:definition'?: any | null;

    constructor(entity?: any)
    constructor(entity: any) {
        super(entity);

        //parse definition 
        if (entity["im:definition"]) {
            const _definition = JSON.parse(entity["im:definition"]);
            this["im:definition"] = _definition;
            // populate definitionTree (this is the UI's object model and maps 1 to 1 onto Profiles written in RDF) 
            this.convertToDefinitionTree(_definition);

        }

        return this;
    }


    get mainEntity(): any {

        return this["im:definition"]["entityType"];

        // const _id = this["im:definition"]["entityType"]["@id"];

        // const _name = this["im:definition"]["entityType"]["rdfs:label"]
        //     ? this["im:definition"]["entityType"]["rdfs:label"]
        //     : this["im:definition"]["entityType"]["@id"].split("#")[1];

        // const _entityType = this["im:definition"]["entityType"]["rdf:type"]
        //     ? this["im:definition"]["entityType"]["rdf:type"]
        //     : "http://www.w3.org/ns/shacl#Nodeshape";

        // return {
        //     "@id": _id,
        //     "name": _name,
        //     "entityType": _entityType

        // };
    }
    set mainEntity(value: any): void {
        this["im:definition"].entityType = value;
    }


    private _definitionTree: any;
    get definitionTree(): any {

        return this._definitionTree;
        // return this._definitionTree;
    }


    private convertToDefinitionTree(definition: any): void {



        let _definitionTree: any[] = [];

        const _operators = ["and", "or", "not"];

        // change rdf to UI-model
        // only works if the first clause in the definition is wrapped with and: [] / or: [] 
        const _keys = Object.keys(definition);

        // console.log(definition.name, " keys: ", _keys)
        for (let i = 0; i < _keys.length; i++) {
            if (_operators.includes(_keys[i])) {

                const _currentIndex = _definitionTree.length;
                const _currentKey = _keys[i];

                _definitionTree.push(
                    {
                        uuid: `urn:uuid:${v4()}`,
                        type: "operator",
                        include: _currentKey != "not",
                        name: _currentKey,
                        currentPath: `[${_currentIndex}]`,
                        originalName: `[${_currentKey}]`,
                        originalLocation: "",
                        childPath: `[${_currentKey}]`,
                        json: definition,
                        templates: [],
                        children: [],
                    }
                )

            }
        }

        if (!_definitionTree.length) {
            console.error("JSON Profile Definition must contain and 'and' or 'or' operator clause at the root of the definition")
            return;
        }

        // gets children for each operator clause in UI-model format
        const getChildren = (parent: any): any => {

            //match clauses don't have "children" 
            if (parent.type == "match") {
                return null;
            }


            let _key = Object.keys(parent.json).filter((_childKey: string) => _operators.includes(_childKey))[0];
            let _childPath = parent.childPath;
            let _children = parent.json[_key];


            _children = _children.map((item: any, index: number) => {

                const _isMatchClause = item["property"] || item["pathTo"];

                let _key = Object.keys(item).filter((_childKey: string) => _operators.includes(_childKey))[0];

                let _name;
                if (_isMatchClause) {
                    _name = ""; //item["name"] ? item["name"] : ""
                } else {
                    _name = _key; //parent.jsons.and ? "and" : "or";
                }


                const _currentKey = (_isMatchClause ? `[${_key}]` : `[${index}]`)


                let _include;
                if (_isMatchClause) {
                    _include = (item["notExist"] == true) ? false : true;
                } else {
                    _include = (_key == "not") ? false : true;

                }


                let _childPath = _isMatchClause ? "" : parent.childPath + `[${index}]` + `[${_key}]`

                // console.log("currentkey", _currentKey)

                return {
                    uuid: `urn:uuid:${v4()}`,
                    type: _isMatchClause ? "match" : "operator",
                    include: _include,
                    name: _name,
                    currentPath: parent.currentPath + ".children" + + `[${index}]`,
                    originalName: `[${index}]`,
                    originalLocation: parent.childPath + `[${index}]`,
                    childPath: _childPath,
                    json: item,
                    templates: [],
                    children: [],

                }
            })


            // populates children's currentpath (a key that tells you the path to the current object) required below by _currentItem['currentPath'] to set children
            // path is either children[i] (first item)
            // or [parentPath].children[i] (the rest) 
            _children.forEach((item: any, index: number) => {
                if (parent['currentPath'] == '') {
                    _children[index]['currentPath'] = `children[${index.toString()}]`
                } else {
                    _children[index]['currentPath'] = `${parent['currentPath']}.children[${index.toString()}]`
                }
            });

            return _children;
        };




        //recursive addition of json clauses and their children to the definition tree:
        const _queue = _.cloneDeep(_definitionTree); //adds top level operator clauses to the queue
        while (_queue.length > 0) {

            const _currentItem = _queue.shift(); // gets the next item from the queue
            let _children = getChildren(_currentItem);


            // add children to .children[] key in new object-model            
            if (_children && _currentItem['currentPath'] == "") {
                // root path
                _.set(_definitionTree, 'children', _children)

            } else if (_children) {

                // all other paths 
                _.set(_definitionTree, _currentItem['currentPath'] + '.children', _children)

            }

            // pushes children to queue if they're not match clauses
            if (_children && _children.length) {
                for (const _child of _children) {
                    const _isMatchClause = _child["property"] || _child["pathTo"];
                    if (!_isMatchClause) {
                        _queue.push(_child);
                    }
                }
            }

        }

        console.log("definition Tree", _definitionTree);

        this._definitionTree = _definitionTree;



    };


    public toTemplates(clausePath: string): void {
        console.log("this.mainEntity",this.mainEntity )
        const _templates = Templates.toTemplates(this.mainEntity, this._definitionTree, clausePath)

        // console.log("templates", _templates);
        return _templates;
    }


    get asString(): string {

        //stringified  
        return JSON.stringify(this);
        // if prettification is desired e.g. for tex editor
        // return QueryUtils.prettifyJSON(JSON.stringify(this));
    }

    //#todo create json() getter to return Profile in RDF format for storage, ensure im:definition is JSONified

}


