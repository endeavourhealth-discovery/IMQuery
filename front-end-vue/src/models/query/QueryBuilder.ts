const { v4 } = require('uuid');
const _ = require('lodash')
const jmp = require('jmespath');
const jp = require('jsonpath');

export default class QueryBuilder {


    //properties without getters/setters
    'JSONContentType'?: "entityDefinitions" | "profileDefinitions" | null;
    'Loaded' = false;


    // properties dependenet on entities loaded from JSON
    '_@context': any;
    '_@graph': any;
    '_file': any;


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
    private _profileEntities = new Map<string, any>();
    get profileEntities(): Map<string, any> {
        return this._profileEntities;
    }

    get profileEntitiesAsArray(): any {
        return [...this._profileEntities.values()];
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


    public getProfiles(folderIri: string): any {
        const _q = `entities[?
            "rdf:type"[?"@id" == \`im:Profile\`] && 
            "im:isContainedIn"[?"@id" == \`${folderIri}\`]]
                ."im:definition" 
                | [] 
                | {"im:Profile": @}`; //optional

        const _result = jmp.search(this._file, _q);
        console.log("_result:", _result)

        return _result;
    }




    public getProfile(profileIri: string): any {
        return this._profileEntities.get(profileIri);
    }

    //returns all the paths to rdfs:label and assigns a temp uuid as key for v-for iteration
    public getLabelPaths(profileIri: string): any {


        const _definitionIri = "im:definition";

        const _profile = this.getProfile(profileIri);
        const _definition = _profile[_definitionIri];
        const _jsonLabels = jp.query(_definition, '$..["rdfs:label"]');
        const _jsonPaths1 = jp.paths(_definition, '$..["rdfs:label"]');
        const _jsonPaths2 = [] as any[];

        // console.log("_jsonPaths1", _jsonPaths1);
        // console.log("_jsonLabels", _jsonLabels);

        for (let i = 0; i < _jsonPaths1.length; i++) {


            //required to concatenate correct path to profile's rdfs:label
            _jsonPaths1[i].splice(1, 0, _definitionIri);

            //imquery refers to this application i.e. temporary object keys used only within the frontend application (and are not part of the query model)
            _jsonPaths2.push({
                'imquery:uuid': `urn:uuid${v4()}`,
                'rdfs:label': _jsonLabels[i],
                'imquery:jsonPath': {
                    'imquery:asArray': this.withUUID(_jsonPaths1[i]),
                    'imquery:asString': this.toPath(_jsonPaths1[i]),
                },
            })
        }


        console.log("_jsonPaths2", _jsonPaths2);
        return _jsonPaths2;

    }

    private withUUID(array: any): any {
        return array.map((item: any) => {
            return {
                'imquery:uuid': `urn:uuid${v4()}`,
                'rdfs:label': item
            }
        })
    }


    private toPath(array: any): string {
        let _path = "";

        for (let i = 0; i < array.length; i++) {
            if (typeof (array[i]) == "number") {
                _path = _path + `[${array[i]}]`
            } else if (typeof (array[i]) == "string") {
                _path = _path + (i != 0 ? '.' : '') + array[i];
            }
        }
        console.log("_path", _path);

        return _path;
    }

    public getGraphData(profileIri: string): any {


        //group numbers:
        // 0 = main entity node
        // 1 = and/or/not node 
        // 2 = leaf node


        const _profile = this.getProfile(profileIri);
        const _definition = _profile["im:definition"];
        //the path to all labels
        const _paths = jp.paths(_definition, '$..["rdfs:label"]');
        console.log("_paths", _paths);







        const _nodes = [] as any[];
        const _links = [] as any[];

        //add main entity



        return {
            nodes: _nodes,
            links: _links
        }

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
        this._profileEntities = new Map<string, any>()
        this._clauses = new Map<string, any>();
        this._path = new Map<string, string>();
        this._graph = new Map<string, any>();
    }


    loadJSON(file: any): QueryBuilder {


        if (this.Loaded) this.reset();

        // file
        file = JSON.parse(file);
        console.log("file", file)
        this._file = file;

        if (file["entities"]) {
            this.JSONContentType = "entityDefinitions";
            if (this.loadEntityDefinitions(file) == false) {
                throw new Error("JSON content structure not recognised");
            } else {
                this.Loaded = true;
            }
        } else if (file[":and"] || file[":or"]) {
            this.JSONContentType = "profileDefinitions";
            this.Loaded = true;
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

                if (_type === "im:Profile") {
                    //profiles 
                    this._profileEntities.set(entity['@id'], entity);

                    // _clauses - looks for AND/OR
                    // if (entity[':and']) {
                    //     this._clauses.set(entity['@id'], { ':and': entity[':and'] })
                    // } else if (entity[':or']) {
                    //     this._clauses.set(entity['@id'], { ':or': entity[':or'] })
                    // }

                }

            });

            return true;

        } catch (error) {

            console.log("Error with loadEntityDefinitions:", error)
            return false;

        } finally {
            console.log("_entities:", this._entities);
            console.log("_profileEntities:", this._profileEntities);
            console.log("profileEntitiesAsArray", this.profileEntitiesAsArray);
            console.log("_clauses:", this._clauses);

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
        this._hierarchyTree = _hierarchyTree;

        this.populateHierarchyTree();
        console.log("_hierachyTree:", this._hierarchyTree);
        return _hierarchyTree;
    }


    item(iri: string) {
        return this.entities.filter((ent: any) => ent["@id"] == iri);
    }


    private populateHierarchyTree() {



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





