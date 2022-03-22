import { entityTypes } from './OntologyTools';
import { v4 } from "uuid";
import _ from "lodash";
// import jmp from "jmp";
import jsonpath from "jsonpath";
import prettier from "prettier/standalone";
import prettierBabylon from "prettier/parser-babylon";

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
            if (typeof (entities) == "string") {
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
export class Entity {
    public '@id'?: string | null;
    public 'rdfs:label'?: string | null;
    public 'rdf:type'?: Entity | null;
    public 'rdfs:comment'?: string | null;
    public 'im:isContainedIn'?: Entity | null;
    // public 'children'?: Entity | null;


    constructor(entity?: any)
    constructor(entity: any) {
        this["@id"] = entity["@id"] ? entity["@id"] : "";
        this["rdf:type"] = entity["rdf:type"] ? entity["rdf:type"] as Entity : null;
        this["rdfs:label"] = entity["rdfs:label"] ? entity["rdfs:label"] : "";
        this["rdfs:comment"] = entity["rdfs:comment"] ? entity["rdfs:comment"] : "";
        this["im:isContainedIn"] = entity["im:isContainedIn"] ? entity["im:isContainedIn"] as Entity : null;
        // this["iri"] = entity["iri"] ? entity["iri"] : null;
        // this["name"] = entity["name"] ? entity["name"] : null;
        // this["type"] = entity["type"] ? entity["type"] : null;
        // this["description"] = entity["description"] ? entity["description"] : null;
        // this["children"] = entity["children"] ? entity["children"] : null;

        return this;
    }
}


// Profile\\\\\
export class Profile extends Entity {
    public 'im:definition'?: any | null;

    //outstanding problems user must solve in order to ensure validity of Profile
    // public "problems": any[];
    // public addProblem(type, description, meta): Profile {
    //     this.problems.push({ id: `urn:uuid:${v4()}`, type: type, description: description, meta: meta })
    //     return this;
    // }

    // public removeProblem(id): Profile {
    //     this.problems = this.problems.filter((problem: any) => problem.id != id);
    //     return this;
    // }



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


    // public mainEntity: string;

    get mainEntity(): any {
        return {
            "@id": this["im:definition"]["entityType"]["@id"],
            "name": this["im:definition"]["entityType"]["@id"].split("#")[1] //###todo: populate name from Ontology
        };
    }
    set mainEntity(value: any): void {
        this["im:definition"].entityType[0] = value;
    }


    private _definitionTree: any;
    get definitionTree(): any {
        return _.cloneDeep(this._definitionTree);
        // return this._definitionTree;
    }


    private convertToDefinitionTree(definition: any): void {


        //###todo populate names and types at runtime

        // console.log("definition", definition);
        let _definitionTree: any[] = [];

        const _operators = ["and", "or", "not"];
        // let _firstClauses: any[];

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
                        include: _currentKey != "not",  //###todo:code dynamically once profile model is corrected 
                        name: _currentKey,
                        currentPath: `[${_currentIndex}]`,
                        originalName: `[${_currentKey}]`,
                        originalLocation: "",
                        childPath: `[${_currentKey}]`,
                        // childPath: `[${_currentKey}]`,
                        data: definition,
                        children: [],
                        english: [],
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
            // console.log(" definition[name]", definition["name"])

            //match clauses don't have "children" 
            if (parent.type == "match") {
                return null;
            }


            // console.log("parent.childPath", parent.originalLocation)

            // parent.originalPath = _path;


            // const _childPath = parent.originalLocation == "" ? parent.originalPath : parent.originalPath +  `[${_key}]`
            // const _currentClause =  _.get(definition, parent.originalLocation);
            // console.log(" parent", parent.data)

            let _key = Object.keys(parent.data).filter((_childKey: string) => _operators.includes(_childKey))[0];
            let _childPath = parent.childPath;
            let _children = parent.data[_key];
            // let _children = _.get(definition, _childPath) //.and || parent.data.or || parent.data.not;

            // console.log("_childPath", _childPath)
            // console.log(" parent key", _key)
            // console.log("children", _children)

            _children = _children.map((item: any, index: number) => {

                const _isMatchClause = item["property"] || item["pathTo"];

                let _key = Object.keys(item).filter((_childKey: string) => _operators.includes(_childKey))[0];

                let _name;
                if (_isMatchClause) {
                    _name = ""; //item["name"] ? item["name"] : ""
                } else {
                    _name = _key; //parent.data.and ? "and" : "or";
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
                    include: _include,//###todo:code dynamically once profile model is corrected 
                    name: _name,
                    currentPath: parent.currentPath + ".children" + + `[${index}]`,
                    // originalObjectPath: "",
                    originalName: `[${index}]`,
                    originalLocation: parent.childPath + `[${index}]`,
                    childPath: _childPath,
                    data: item,
                    children: [],
                    english: [],

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


        //  const _visited = new Set();


        //breadth-first addition of  items and children to the definition  tree:
        const _queue = _.cloneDeep(_definitionTree); //adds top level operator clauses to the queue
        // console.log("_queue", _.cloneDeep(_queue))
        while (_queue.length > 0) {

            const _currentItem = _queue.shift(); // gets the next item from the queue
            let _children = getChildren(_currentItem);


            // add children to .children[] key in new object-model            
            if (_children && _currentItem['currentPath'] == "") {
                // root path
                _.set(_definitionTree, 'children', _children)

            } else if (_children) {
                // console.log("_definitionTree", _definitionTree);
                // console.log("_currentItem ", _currentItem)
                // console.log("children", _children)
                // console.log("_currentItem['currentPath'] ", _currentItem['currentPath'] + '.children')
                // console.log("_currentItem  at objectpath", _.get(_definitionTree, _currentItem['currentPath'] + '.children'))
                // all other paths (almost always)
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

        // console.log("_firstClause", _firstClause)
        // console.log("children", getChildren(_firstClause));


    };


    public toTemplates(clausePath: string): void {
        const _templates = Templates.toTemplates(this.mainEntity, this._definitionTree, clausePath)
        console.log("templates", _templates);
    }


    get asString(): string {

        //stringified  and prettified (e.g. for text-editor)
        return QueryUtils.prettifyJSON(JSON.stringify(this));
    }

    //#todo create json() getter to return Profile in RDF format for storage, ensure im:definition is JSONified

}


export default class QueryUtils {

    // https://stackoverflow.com/questions/15502629/regex-for-mustache-style-double-braces
    public static findPlaceholders(text: string): any {

        // eslint-disable-next-line
        const _regExPlaceholders = /{{\s*[\S\.]+\s*}}/g;
        // eslint-disable-next-line
        const _regExPlaceholderIri = /[\w+\:\w]+/;


        return text.match(_regExPlaceholders)
            .map(function (x) { return x.match(_regExPlaceholderIri)[0]; });


        // const escapeRegExp = (expString: string) => {
        //     return expString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        // }
        // return text.match(/{{\s*[\S\.]+\s*}}/g)
        // .map(function(x) { return x.match(/\s*[\S\.]+\s*/g)[0]; })
        // return text.match(/{{\s*[\w\.]+\s*}}/g)
        //     .map((x: string) => x.match(/[\w\.]+/)[0]);
    }


    //flattens a JS object to its constituent paths (lodash compatible)
    public static flattenObject(object: any): any {

        const result = {} as any;
        function recurse(cur: any, prop: any) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                // for (var i = 0, l = cur.length; i < l; i++)
                for (let i = 0; i < cur.length; i++)
                    recurse(cur[i], prop + "[" + i + "]");
                // if (l == 0)
                if (cur.length == 0)
                    result[prop] = [];
            } else {
                let isEmpty = true;
                for (const p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop + "." + p : p);
                }
                if (isEmpty && prop)
                    result[prop] = {};
            }
        }
        recurse(object, "");
        console.log("flattened result", result)
        return result;



    }

    //unflattens JS object
    // public static unflattenObject(object: any): any {
    //     if (Object(object) !== object || Array.isArray(object))
    //         return object;
    //     var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    //         resultholder = {} as any;
    //     for (var p in object) {
    //         var cur = resultholder as any,
    //             prop = "",
    //             m;
    //         while (m = regex.exec(p)) {
    //             cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
    //             prop = m[2] || m[1];
    //         }
    //         cur[prop] = object[p];
    //     }
    //     return resultholder[""] || resultholder;
    // }





    // prettify JSON
    public static prettifyJSON(value: string): string {
        const _json = prettier.format(value, {
            parser: "json",
            plugins: [prettierBabylon],
        }) as string;
        return _json;

    }


    //replaces all ":"" and "@" with __ and ___ respectively to enable JMESPath and JsonPath tools
    public static replaceKeys(object: any): any {


        // deep nested replacement of keys if they are string
        const replaceKeysDeep = (o: any) => {
            return _.transform(o, function (result: any, value: any, key: any) {
                const _currentKey = typeof (key) == "string" ? QueryUtils.replaceChars(key) : key;
                result[_currentKey] = _.isObject(value) ? replaceKeysDeep(value) : value; // if the key is an object run it through the inner function - replaceKeys
            });
        }


        return replaceKeysDeep(object);
    }


    //characters and their replacements
    private static _characterMap: any = {
        ':': "__c__",
        '@': "__a__",
    };


    //replaces all keys in an object using  key-value pairs in character map
    public static replaceChars = (text: string) => {
        let _text = text;
        Object.keys(QueryUtils._characterMap).forEach((key: string) => {
            _text = _text.replaceAll(key, QueryUtils._characterMap[key])
        });
        return _text;
    };

    // adds random uuid only used in frontend to provide a :key for v-for iterators in UI components  
    private addUUID(array: any): any {
        return array.map((item: any) => {
            return {
                'temp_id': `urn:uuid${v4()}`,
                'item': item
            }
        })
    }

}

