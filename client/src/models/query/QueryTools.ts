import { entityTypes } from './OntologyTools';
import { v4 } from "uuid";
import _ from "lodash";
// import jmp from "jmp";
import jsonpath from "jsonpath";
import prettier from "prettier/standalone";
import prettierBabylon from "prettier/parser-babylon";
import SearchService from "@/services/SearchService";
import axios, { AxiosResponse, CancelToken } from "axios";


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

    load(entities: any): QueryBuilder {


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



    // get profile by iri
    // special characters in keys are replaced for JSON queries
    // public loadProfile(profileIri: string, replaceKeys = true, prettify = true): any {
    //     const _profile = this._profiles.get(profileIri);
    //     this._activeProfile = new Profile(_profile as Entity);
    //     this._openProfiles.push(new Profile(_profile as Entity));
    //     // temporarily convert if JSON queries are required
    //     // if (replaceKeys) _profile = QueryUtils.replaceKeys(_profile);
    // }

    private _activeProfile: Entity;

    get activeProfile(): any {
        return this._activeProfile;
    }
    set activeProfile(value: any) {
        this._activeProfile = value;
    }

    private _openProfiles: Profile[] = [];

    get openProfiles(): any {
        return this._openProfiles;
    }

    //the clause that is currently being edited 
    private _activePath: string;
    get activePath(): string {
        return this._activePath;
    }
    set activePath(propertyPath: string) {
        // if (typeof (propertyPath) == "string") {
        if (propertyPath != "") {
            //find clause using JSON properyPath
            this._activePath = propertyPath;
            this._activeClause = _.get(this.activeProfile, propertyPath);
            this.interpolateTemplate({ "@id": this._activeProfile["@id"], propertyPath: propertyPath }, this._activeClause)
            // this.interpolateTemplate2(this._activeClause)
        }
    }



    private _activeClause: any;
    get activeClause(): any {
        return this._activeClause;
    }


    //examples of templates
    private _interpolationTemplates: any = [
        {
            "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf",
            propertyPath: "im:definition[0].im:and[2]",
            text: `<p><span class="font-bold text-indigo-700">Include</span> a <span class="font-bold text-indigo-700">Person</span> if they </p>
                <p style="margin-left: 30px;">had a <span class="font-bold text-indigo-700">Health Record</span> with</p>
                <p style="margin-left: 60px;">a <span class="font-bold text-indigo-700">Clinical Code</span> that is part of the list of codes in the value set</p>
                <p style="margin-left: 90px;"><span class="font-semibold text-black border border-transparent border-b-2 border-b-indigo-700">{{0}}</span></p>
                <p style="margin-left: 90px;"><span class="font-bold text-indigo-700">or</span> <span class="font-semibold text-black border border-transparent border-b-2 border-b-indigo-700">{{1}}</span></p>
                <p style="margin-left: 30px;">and the <span class="font-bold text-indigo-700">latest</span> <span class="font-semibold text-black border border-transparent border-b-2 border-b-indigo-700">1</span> entry had </p> 
                <p style="margin-left: 60px;">a <span class="font-bold text-indigo-700">Clinical Code</span> that is part of the list of codes in the value set</p>
                <p style="margin-left: 90px;"><span class="font-semibold text-black border border-transparent border-b-2 border-b-indigo-700">{{2}}</span></p>`,
            variables: [
                "im:function[0].im:argument[3].im:valueMatch[0].im:and[0].im:valueIn[0].rdfs:label",
                "im:function[0].im:argument[3].im:valueMatch[0].im:and[0].im:valueIn[1].rdfs:label",
                "im:test[0].im:valueIn[0].rdfs:label"
            ]
        },
        {
            "iri": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf",
            "name": "disease status",
            "description": "",
            "code": "",
            "entityType": [
                {
                    "@id": "http://endhealth.info/im#TextTemplate",
                    "name": "UI Text Interpolation Template"
                }
            ],
            "scheme": {
                "@id": "http://endhealth.info/im#"
            },
            "status": {
                "@id": "http://endhealth.info/im#Draft",
                "name": "Draft"
            },
            "target": [
                {
                    "pathTo": "im:isSubjectOf",
                    "entityType": "im:event",
                    "property": "",
                    "propertyPaths": [
                        {
                            "path": "im:function[0].im:functionIri[0].@id",
                            "value": "im:OrderLimit"
                        },
                        {
                            "path": "im:function[0].im:argument[1].im:valueIrI[0].@id",
                            "value": "im:effectiveDate"
                        },
                        {
                            "path": "im:test[0].im:property[0].@id",
                            "value": "im:concept"
                        }
                    ]
                }
            ],
            "template": [
                {
                    "text": "they had a health record coded as either {{0}} or {{1}} but the most recent record was: {{2}} ",
                    "variables": [
                        "im:function[0].im:argument[3].im:valueMatch[0].im:and[0].im:valueIn[0].rdfs:label",
                        "im:function[0].im:argument[3].im:valueMatch[0].im:and[0].im:valueIn[1].rdfs:label",
                        "im:test[0].im:valueIn[0].rdfs:label"
                    ]
                }
            ]
        },

    ];

    private _interpolatedTemplate: any;
    get interpolatedTemplate(): any {
        return this._interpolatedTemplate;
    }

    private _activeTemplate: any;
    get activeTemplate(): any {
        return this._activeTemplate;
    }

    public interpolateTemplate(meta: any, activeClause: any): any {
        const _template = this._interpolationTemplates.filter((item: any) => item["@id"] == meta["@id"] && item["propertyPath"] == meta["propertyPath"])[0];
        // console.log("activeClause", activeClause);
        // console.log("_template1", _template)


        this._activeTemplate = _template.text
        let _interpolatedTemplate = _template.text;


        _template.variables.forEach((item: any, index: number) => {

            _interpolatedTemplate = _interpolatedTemplate.replaceAll(`{{${index}}}`, _.get(activeClause, _template.variables[index]));
            // console.log(`lodash get: ${_template.variables[index]}`, _.get(activeClause, _template.variables[index] ));

        });

        this._interpolatedTemplate = _interpolatedTemplate;

    }


    private static _relevantPaths = [
        "im:function[0].im:functionIri[0].@id",
        "im:function[0].im:argument[1].im:valueIrI[0].@id",
        "im:test[0].im:property[0].@id",
    ];

    public interpolateTemplate2(activeClause: any): any {
        const _template = this.findTemplate(activeClause);

        // console.log("template found", _template)
        // this._activeTemplate = _template.template[0].text
        // let _interpolatedTemplate = _template.template[0].text;

        // _template.template[0].variables.forEach((item: any, index: number) => {
        //     _interpolatedTemplate = _interpolatedTemplate.replaceAll(`{{${index}}}`, _.get(activeClause, _template.template[0].variables[index]));
        //     // console.log(`lodash get: ${_template.variables[index]}`, _.get(activeClause, _template.variables[index] ));

        // });

        // this._interpolatedTemplate = _interpolatedTemplate;

    }

    private async findTemplate(activeClause: any): Promise<any> {
        const _q = {
            "bool": {
                "filter": [
                    {
                        "bool": {
                            "must": [
                                {
                                    "match_phrase": {
                                        "target.pathTo": "im:isSubjectOf"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "target.entityType": "im:event"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "target.propertyPaths.path": "im:function[0].im:functionIri[0].@id"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "target.propertyPaths.value": "im:OrderLimit"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "target.propertyPaths.path": "im:function[0].im:argument[1].im:valueIrI[0].@id"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "target.propertyPaths.value": "im:effectiveDate"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "target.propertyPaths.path": "im:test[0].im:property[0].@id"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "target.propertyPaths.value": "im:concept"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };

        await SearchService.oss_search_templates(_q, 1)
            .then((res: any) => {
                console.log("fetched opensearch results: ", res);
                return res;
            })
            .catch((err: any) => {
                console.log("Could not load opensearch results", err);
                return err;
            });



    }









    //returns all the paths to rdfs:label and assigns a temp uuid as key for v-for iteration
    public getClausePaths(profileIri: string, pathToClause = `["rdfs:label"]`): any {



        const _profile = this.loadProfile(profileIri);
        const _clauseLabels = jp.query(_profile, `$..${pathToClause}`);
        const _clauseNodes1 = jp.nodes(_profile, `$..${pathToClause}`);
        const _clauseNodes2 = [] as any[];


        const _pathItems = new Set();

        console.log("_definition", _clauseLabels);
        console.log("_clauseLabels", _clauseLabels);

        console.log("_clauseNodes1", _clauseNodes1);
        for (let i = 0; i < _clauseNodes1.length; i++) {

            //imquery refers to this application i.e. temporary object keys used only within the frontend application (and are not part of the query model)
            const _node = {
                'imquery:uuid': `urn:uuid${v4()}`,
                'rdfs:label': _clauseNodes1[i].value,
                'imquery:jsonPath': {
                    'imquery:asArray': _clauseNodes1[i].path,
                    'imquery:asString': jp.stringify((_clauseNodes1[i].path)),
                }
            };


            //determine path items as keys and arrays
            // _clauseNodes1[i].path.forEach((item: any) => {

            //     if (!_pathItems.has(item)) {


            //     }

            // });


            // remove definition path
            // _node['imquery:jsonPath']['imquery:asString'].replace(`["im:definition"]`, "")

            _clauseNodes2.push(_node);


        }


        console.log("_clauseNodes2", _clauseNodes2);
        return { nodes: _clauseNodes2, pathItems: [] };

    }


    // one way conversion for display as nodges/edges in d3.js (Network.vue component)
    public getGraphData(profileIri: string): any {






        //group numbers:
        // 0 = main entity node
        // 1 = and/or/not node 
        // 2 = leaf node


        const _profile = this.loadProfile(profileIri);
        const _definition = _profile["im:definition"];
        //the path to all labels
        const _paths = jp.nodes(_definition, '$..["rdfs:label"]');
        console.log("_paths", _paths);

        const _nodes = [] as any[];
        const _links = [] as any[];

        //add main entity



        return {
            nodes: _nodes,
            links: _links
        }

    }




    // displaying folders as a hierarchy tree 
    private _hierarchyTree: any;
    private _lastTopLevelFolder: any;
    hierarchyTree(topLevelFolder: any): any[] | null {

        if (!this.Loaded) return null;


        //prevents expensive recomputation with each computed() call
        if (this._lastTopLevelFolder && this._lastTopLevelFolder.iri == topLevelFolder.iri) {
            return this._hierarchyTree;
        } else {
            this._lastTopLevelFolder = topLevelFolder;
        }

        const _hierarchyTree = { ...topLevelFolder, currentPath: '', children: [] };
        this._hierarchyTree = _hierarchyTree;

        this.populateHierarchyTree();
        console.log("_hierachyTree:", this._hierarchyTree);
        return _hierarchyTree;
    }


    private populateHierarchyTree() {
        // .set(state.openQueries[_activeQueryIndex], payload.propertyPath + ".name", payload.name)
        const getChildren = (parent: any): any => {

            let _children = this.entities.filter((ent: any) => ent["im:isContainedIn"] && ent["im:isContainedIn"][0]["@id"] == parent["@id"])
            _children = _children.map((item: any) => {
                return {
                    ...item,
                    currentPath: '',
                    children: [] as any[]
                }
            })
            // populates children's currentpath (a key that tells you the path to the current object) required by _currentItem['currentPath' ]
            // path is either children[i] (first item)
            // or [parentPath].children[i] (the rest) 
            for (let i = 0; i < _children.length; i++) {
                if (parent['currentPath'] == '') {
                    _children[i]['currentPath'] = `children[${i.toString()}]`
                } else {
                    _children[i]['currentPath'] = `${parent['currentPath']}.children[${i.toString()}]`
                }
            }
            return _children;
        };


        // breadth-first addition of children
        const _visited = new Set();
        const _queue = [this._hierarchyTree]

        while (_queue.length > 0) {

            const _currentItem = _queue.shift(); // gets the next item from the queue
            const _children = getChildren(_currentItem);

            // add children to .children[] key in new object-model            
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
            //add children to queue if they're not already visited
            for (const _child of _children) {
                if (!_visited.has(_child['@id'])) {
                    _visited.add(_child['@id']);
                    _queue.push(_child);
                }
            }
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
    public "problems": any[];
    public addProblem(type, description, meta): Profile {
        this.problems.push({ id: `urn:uuid:${v4()}`, type: type, description: description, meta: meta })
        return this;
    }

    public removeProblem(id): Profile {
        this.problems = this.problems.filter((problem: any) => problem.id != id);
        return this;
    }



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
        return this._definitionTree;
    }


    private convertToDefinitionTree(definition: any): void {

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
            console.log(" definition[name]", definition["name"])

            //match clauses don't have "children" 
            if (parent.type == "match") {
                return null;
            }


            // console.log("parent.childPath", parent.originalLocation)

            // parent.originalPath = _path;


            // const _childPath = parent.originalLocation == "" ? parent.originalPath : parent.originalPath +  `[${_key}]`
            // const _currentClause =  _.get(definition, parent.originalLocation);
            console.log(" parent", parent.data)

            let _key = Object.keys(parent.data).filter((_childKey: string) => _operators.includes(_childKey))[0];
            console.log(" parent key", _key)



            let _childPath = parent.childPath;

            console.log("_childPath", _childPath)

            let _children = parent.data[_key];

            // let _children = _.get(definition, _childPath) //.and || parent.data.or || parent.data.not;

            console.log("children", _children)

            _children = _children.map((item: any, index: number) => {

                const _isMatchClause = item["property"] || item["pathTo"];

                //log conversion problem (e.g. non-match clauses should not have a name)
                //###todo connect details in meta key to UI
                // if (!_isMatchClause && item["name"]) {
                //     this.addProblem("conversion", "The following labels were generated automatically, please double check their meaning.", { parent: parent, item: item, index: index })
                //     console.log("conversion problem", { parent: parent, item: item, index: index })
                // }

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
        console.log("_queue", _.cloneDeep(_queue))
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




// export class Graph {


//     private '_graph'?: any | null;



//     constructor(input?: any)
//     constructor(input: any) {
//         this["_graph"] = Graph.convertToGraph(input);
//         return this;
//     }



//     public static convertToGraph(input: any) {



//         // must populate a map
//         // iterate until named clause         // v-if="!item['rdfs:label
//         // ensure every key has _uuid, path, childnode




//         const inputTree = { _childNode: [], _originalPath: '', ...input }




//         const getChildren = (propertyPath: string): any | null => {

//             const _expectedChildKeys = ['im:and', 'im:or', 'im:not'];



//             // get node at current property path
//             const _node = _.get(input, propertyPath);
//             if (_node) {
//                 // check if node has children
//                 const _childKey = _expectedChildKeys.filter((key: any) => _node.some((child: any) => child[key]));
//                 if (_childKey.length) {
//                     // return first child
//                     return _node[_childKey[0]];
//                 }
//             }

//             return null;
//         }


//         // const populateTree = () => {

//         //     // breadth-first addition of children
//         //     const _visited = new Set();
//         //     const _queue = ['']

//         //     while (_queue.length > 0) {

//         //         const _currentItem = _queue.shift(); // gets the next item from the queue
//         //         const _children = getChildren(_currentItem);

//         //         if (_currentItem['@id'] == this._hierarchyTree['@id']) {

//         //             _.set(this._hierarchyTree, 'children', _children)
//         //             // console.log("2.children: ", _children)
//         //             // console.log("3. path: ", 'children')
//         //             // console.log("4. tree: ", this._hierarchyTree)
//         //         } else {

//         //             _.set(this._hierarchyTree, _currentItem['currentPath'] + '.children', _children)
//         //             // console.log("2.children: ", _children)
//         //             // console.log("3. path: ", _currentItem['currentPath'] + '.children')
//         //             // console.log("4. tree: ", this._hierarchyTree)
//         //         }

//         //         //add current item to queue if its not a duplicate
//         //         for (const _child of _children) {
//         //             if (!_visited.has(_child['@id'])) {
//         //                 _visited.add(_child['@id']);
//         //                 _queue.push(_child);
//         //             }
//         //         }
//         //     }

//         // }




//         return;


//     }



// }
