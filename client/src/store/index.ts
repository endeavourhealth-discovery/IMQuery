
import { SearchRequest } from "./../models/search/SearchRequest";
import { createStore } from "vuex";
import { User } from "../models/user/User";
import { avatars } from "@/models/user/Avatars";
import { CustomAlert } from "@/models/user/CustomAlert";
import EntityService from "../services/EntityService";
import QueryService from "../services/QueryService";
import AuthService from "@/services/AuthService";
import LoggerService from "@/services/LoggerService";


import { QueryBuilder } from "@/models/query/QueryBuilder";
import QueryUtils from "@/helpers/QueryUtils";
import Ontology, { entityTypes } from "@/models/query/OntologyTools";

import _ from "lodash";
import { v4 } from "uuid";
import jp from 'jsonpath';

import axios from "axios";
import Graph from "@/logic/Graph";
import { active } from "d3";

export default createStore({
  // update stateType.ts when adding new state!
  state: {
    activeViewerTab: "Query Definition",
    datamodelGraph: new Graph(),
    debug: true,
    searchData: {} as any,
    searchResults: [] as any[],
    historyCount: 0 as number,
    currentUser: {} as User,
    registeredUsername: "" as string,
    isLoggedIn: false as boolean,
    snomedLicenseAccepted: localStorage.getItem(
      "snomedLicenseAccepted"
    ) as string,
    JSONContent: "",
    LabelContent: [] as any[],
    isLoading: false,
    theme: "",
    activeProfile: "",
    activeFileIri: [] as any[],
    activeQueryId: "",
    activeClausePath: "",
    activePropertyPath: "",
    targetType: "",
    targetAction: "",
    // activeClausePath: {},
    openFiles: [] as any[],
    userFiles: [] as any[],
    // activeQueryIdId: "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf",
    datamodel: [] as any[],
    datamodelIris: [] as any[],
    queryBuilder: new QueryBuilder(),
    ontology: new Ontology(),
    isCardDragged: false,
    tabs: [
      {
        name: "Home",
        icon: "home",
        visible: true
      },
      {
        name: "Find",
        icon: "search",
        visible: true
      },
      {
        name: "Data",
        icon: "newspaper",
        visible: false
      },
      {
        name: "Edit",
        icon: "newspaper",
        visible: false
      },
      {
        name: "Schedule",
        icon: "newspaper",
        visible: true,
        command: () => {
          //#todo
          alert("Coming soon! Stay tuned.");
        }
      },
      {
        name: "Learn",
        icon: "academic_cap",
        visible: true
      },
      {
        name: "Developer",
        icon: "",
        visible: false
      },
      {
        name: "Explore2",
        icon: "globe",
        visible: false
      },
      {
        name: "Sources",
        icon: "office_building",
        visible: false
      },
      {
        name: "Resources",
        icon: "newspaper",
        visible: false
      }
    ],
    activeTabName: "Home", //Options #Home #SearchResults #View #Explore
    activeQueryCategory: "definition", //#mainEntity #definition  #output #sources #sql ,

  },
  mutations: {
    updateActiveViewerTab(state, payload) {
      console.log("updateSearchString", payload);
      state.activeViewerTab = payload;
    },
    updateTarget(state, payload) {
      // console.log("updateTarget", payload);
      payload?.clausePath ? state.openFiles.find(file => file.iri == state.activeQueryId).activeClausePath = payload?.clausePath : null;
      payload?.propertyPath ? state.openFiles.find(file => file.iri == state.activeQueryId).activePropertyPath = payload?.propertyPath : null;
      payload?.targetType ? state.openFiles.find(file => file.iri == state.activeQueryId).targetType = payload?.targetType : null;
      payload?.targetAction ? state.openFiles.find(file => file.iri == state.activeQueryId).targetAction = payload?.targetAction : null;
      payload?.clausePath ? state.activeClausePath = payload?.clausePath : null;
      payload?.propertyPath ? state.activePropertyPath = payload?.propertyPath : null;
      payload?.targetType ? state.targetType = payload?.targetType : null;
      payload?.targetAction ? state.targetAction = payload?.targetAction : null;
    },
    updateSearchString(state, payload) {
      console.log("updateSearchString", payload);

    },
    createClause(state, payload) {
      // console.log("payload", payload)
      //if activePath is empty -> create new item at path first!  //OR you can do this upon pressing "back";
      const newClause = {
        "@id": `urn:uuid:${v4()}`,
        "pathTo": [
          // {
          //   "name": "is subject of ",
          //   "@id": "http://endhealth.info/im#isSubjectOf"
          // }
        ],
        "entityType": {
          // "name": "Observation (entry type)",
          // "@id": "http://Fendhealth.info/im#Observation"
        },
        "property": [

        ],

        "displayText": "Untitled"
      }
      const activeQuery = state.queryBuilder.dataSet.get(state.activeQueryId);
      const cloneQuery = _.cloneDeep(activeQuery);
      let parentClause = _.get(cloneQuery, payload.path);
      // console.log("parentClause", _.cloneDeep(parentClause))
      parentClause.splice(payload.index, 0, newClause);
      // console.log("parentClause", _.cloneDeep(parentClause))

      _.set(cloneQuery, payload.path, parentClause);
      // console.log("cloneQuery", _.cloneDeep(parentClause))

      state.queryBuilder.dataSet.set(state.activeQueryId, cloneQuery);
      // console.log("cloneQuery", cloneQuery)

      // state.activeClausePath[state.activeQueryId] = payload.path + `[${payload.index}]`;
    },
    setActiveClausePath(state, payload) {
      state.openFiles.find(file => file.iri == state.activeQueryId).activeClausePath = payload;
      state.activeClausePath = payload;
    },
    updateProperty(state, payload) {
      const activeQuery = state.queryBuilder.dataSet.get(state.activeQueryId);
      let newQuery = _.cloneDeep(activeQuery);




      console.log("updateProperty", payload);

      if (payload.action = "deleteClause") {

        if (payload?.propertyPath == "property") {
          let currentProperty = _.get(newQuery, `${payload.clausePath}.property`)
          console.log("currentProperty", _.cloneDeep(currentProperty)[payload.index]);
          currentProperty.splice(payload.index, 1);

        }

      }

      state.queryBuilder.dataSet.set(state.activeQueryId, newQuery);
      // alert("emit")

    },
    updateActiveProperty(state, payload) {
      switch (payload.action) {

        case "delete":

        case "add":

        case "update":
          const activeQuery = state.queryBuilder.dataSet.get(state.activeQueryId);
          const cloneQuery = _.cloneDeep(activeQuery);
          const path = state.activeClausePath + "." + payload.propertyPath;
          _.set(cloneQuery, path, payload.data);
          state.queryBuilder.dataSet.set(state.activeQueryId, cloneQuery);
          break;
      }
    },
    updateActiveClause(state, payload) {
      // console.log("state update updateActiveClause", payload)
      // console.log("state.activeClausePath", state.activeClausePath)
      const activeQuery = state.queryBuilder.dataSet.get(state.activeQueryId);
      let activeClausePath = state.activeClausePath;
      let newQuery = _.cloneDeep(activeQuery);
      const currentFile = state.openFiles.find(file => file.iri == state.activeQueryId);
      // console.log("currentFile.activeClausePath", currentFile.activeClausePath)
      if (payload.action == "new") {
        // console.log("activeClausePath", currentFile.activeClausePath)
        // console.log("display", payload.data.displayText)
        if (!payload.data.displayText || payload.data.displayText == "") {
          payload.data.displayText = currentFile.searchResults.find(result => result.activeClausePath == currentFile.activeClausePath).searchString;
        }


        let newItem = payload.data;
        if (payload.dataType == "directProperty") {
          //if active clause path is a property -> encapsulate newItem in and do not change activeClausePath
          // (payload.data?.property && payload.data?.property.length > 0) || (payload.data?.pathTo)

          if (!QueryUtils.isPathDirectProperty(activeClausePath)) {
            newItem =
            {
              "@id": "urn:uuid:daaa2db1-a973-40d7-a573-65178c5b7c7c",
              "property": [payload.data],
            };

          }
          // else do not change newItem and do not change
        } else if (payload.dataType == "clause" || payload.dataType == "entityInSet") {
          // acitiveClausePath is a property -> change activeClausePath to parent + do not change newItem
          if (QueryUtils.isPathDirectProperty(activeClausePath)) {
            activeClausePath = QueryUtils.getParentPath(activeClausePath)
            state.targetAction = "new"
          }
        }
        // console.log("activeClausePath", activeClausePath)

        if (state.targetAction == "addTo") {

          let { path, index } = QueryUtils.splitPath(activeClausePath);
          console.log("path index", path, index);

          let parentArray = _.get(newQuery, path);
          parentArray.splice(index + 1, 0, newItem);
          state.queryBuilder.dataSet.set(state.activeQueryId, newQuery);

          const newIndex = parseInt(index) + 1;
          state.activeClausePath = path + `[${newIndex}]`;

        } else if (state.targetAction = "new") {
          _.set(newQuery, activeClausePath, newItem);
          state.queryBuilder.dataSet.set(state.activeQueryId, newQuery);
          state.activeClausePath = activeClausePath;
        }

      }
    },
    updateActiveClausePath(state, payload) {
      console.log("click", payload)
      switch (payload.action) {

        case "delete":
          const activeQuery1 = state.queryBuilder.dataSet.get(state.activeQueryId);
          const cloneQuery1 = _.cloneDeep(activeQuery1);
          // _.set(cloneQuery1, payload.path, null);
          let clause = _.get(cloneQuery1, payload.path)
          clause.splice(payload.index, 1)
          if (clause.length == 0) {
            _.set(cloneQuery1, payload.path, null);

          } else {
            _.set(cloneQuery1, payload.path, clause);

          }
          state.queryBuilder.dataSet.set(state.activeQueryId, cloneQuery1);
          // console.log("clause splice", clause)
          //todo if array is empty -> delete array.

          break;
        case "view":
          state.openFiles.find(file => file.iri == state.activeQueryId).activeClausePath = payload.path;
          state.activeClausePath = payload.path;
          break;

        case "update":
          // console.log("payload", payload)
          //if activePath is empty -> create new item at path first!  //OR you can do this upon pressing "back";
          const newClause = {
            "@id": "urn:uuid:b46ee284-fbb2-4d0e-b766-25cb5e7e32a9",
            "displayText": "Untitled",
            // "displayText": "",
            "property": {
              "name": "is subject of ",
              "@id": "http://endhealth.info/im#isSubjectOf"
            },
            "match": {
              "subselect": {
                "property": [
                  {
                    "@id": "http://endhealth.info/im#effectiveDate",
                    "alias": "effectiveDate8"
                  }
                ],
                "match": {
                  "property": {
                    "name": "codeable expression",
                    "alias": "concept7",
                    "@id": "http://endhealth.info/im#concept"
                  },
                  "inSet": [
                    {
                      "name": "Hypertension",
                      "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
                    }
                  ]
                },
                "orderLimit": {
                  "orderBy": {
                    "@id": "http://endhealth.info/im#effectiveDate",
                    "alias": "effectiveDate8"
                  },
                  "direction": "DESCENDING",
                  "count": 1
                }
              },
              "notExist": true,
              "entityType": {
                "name": "Observation (entry type)",
                "@id": "http://endhealth.info/im#Observation"
              },
              "and": [
                {
                  "property": {
                    "name": "codeable expression",
                    "alias": "concept9",
                    "@id": "http://endhealth.info/im#concept"
                  },
                  "isConcept": [
                    {
                      "name": "Hypertension (not resolved)",
                      "@id": "urn:uuid:aafda1f0-02fc-45bc-bd6f-b899efe9547d"
                    }
                  ]
                },
                {
                  "property": {
                    "alias": "effectiveDate87",
                    "@id": "http://endhealth.info/im#effectiveDate"
                  },
                  "value": {
                    "comparison": "GREATER_THAN",
                    "valueVariable": "effectiveDate8"
                  }
                }
              ]
            }
          };
          const activeQuery = state.queryBuilder.dataSet.get(state.activeQueryId);
          const cloneQuery = _.cloneDeep(activeQuery);
          let parentClause = _.get(cloneQuery, payload.path);
          // console.log("parentClause", _.cloneDeep(parentClause))
          parentClause.splice(payload.index, 0, newClause);
          // console.log("parentClause", _.cloneDeep(parentClause))

          _.set(cloneQuery, payload.path, parentClause);
          // console.log("cloneQuery", _.cloneDeep(parentClause))

          state.queryBuilder.dataSet.set(state.activeQueryId, cloneQuery);
          // console.log("cloneQuery", cloneQuery)

          state.activeClausePath = payload.path + `[${payload.index}]`;
          break;
      }

    },
    startEdit(state, fileIri) {
      state.openFiles.find(file => file.iri == fileIri).state = "edit";
    },
    async loadFile(state, fileIri) {

      if (state.openFiles.some(file => file.iri === fileIri)) {
        state.activeTabName = "Edit";
        state.isLoading = false;
        return;
      }

      // try {
      // const entity = await QueryService.querySummary(fileIri).then(res => {
      // const entity = await QueryService.definition(fileIri).then(res => {
      // const entity = await QueryService.summariseLocalQuery(fileIri).then(res => {
      const entity = await QueryService.summariseQuery(fileIri).then(res => {
        console.log("## res:", res); //?res.data if backend
        const data = res?.data || res
        state.queryBuilder.loadDataSet(data);
        return data
      })
        .catch(err => {
          console.error("Failed to load file from the server", err);
        });
      // console.log("## entity:", entity); //?res.data if backend

      const file = {
        iri: entity["@id"],
        activeClausePath: "",
        isVisible: true,
        state: "view",
        data: entity,
        searchResults: [
        ]
      };

      state.openFiles.forEach((file: any, index: number) => state.openFiles[index].isVisible = false);
      state.openFiles.push(file); //alternative states are: loading, edit
      state.activeQueryId = entity["@id"];
      state.tabs.find(tab => tab.name === "Edit").visible = true;
      state.activeTabName = "Edit";
      // } catch (error) {
      //   console.log("error occurred in loadEntity", error)
      // }
      state.isLoading = false;




    },
    setSearchData(state, payload) {
      // console.log("setSearchData", payload,)

      const activeClausePath = payload.path;

      // const activeFile = state.openFiles.find(file => file.iri == state.activeQueryId);

      //removes previous results for active path
      // ###todo (optional): remove only results if 
      // (activeClausePath OR activePropertyPath) && targetAction are the same 
      // targetType determines if clausePath or propertyPath is used i.e. depending on which is being edited
      let newResults = _.cloneDeep(state.openFiles.find(file => file.iri == state.activeQueryId).searchResults)
      newResults = newResults.filter(result => {
        if (result.activeClausePath == activeClausePath) { // see todo above
          return false;
        } else {
          return true;
        }
      });
      state.openFiles.find(file => file.iri == state.activeQueryId).searchResults = newResults;


      // cached result for active path
      let searchResult = {
        activeClausePath: activeClausePath,
        searchString: payload?.searchString,
        results: [],
        existingQuery: [],
        existingClause: [],
        nodeShape: [],
        property: [],

      };


      function separateResults(results: any) {
        if (Array.isArray(results) && results.length > 0) {
          results.forEach(result => {
            if (QueryUtils.isQuery(result)) {
              searchResult.existingQuery.push(result);
            } else if (QueryUtils.isClause(result)) {
              searchResult.existingClause.push(result);
            } else if (QueryUtils.isEntity(result)) {
              searchResult.nodeShape.push(result);
            } else if (QueryUtils.isProperty(result)) {
              searchResult.property.push(result);
            }
          });
        }
      }
      searchResult.results = payload.data;
      separateResults(payload.data);

      state.openFiles.find(file => file.iri == state.activeQueryId).searchResults.push(searchResult);
    },
    createNew(state, entityType) {

      let data = {};
      // function createMatchClause() { }
      function createQuery() {
        data = {
          "@id": `urn:uuid:${v4()}`,
          "name": "New Query",
          "description": "",
          "mainEntity": {
            "@id": "http://endhealth.info/im#Person"
          },
          "select": {
            "entityType": {
              "name": "Person",
              "@id": "http://endhealth.info/im#Person"
            },
            "match": [
              {
                "@id": `urn:uuid:${v4()}`,
              }
            ]
          }
        };
      }
      switch (entityType) {

        case "im:MatchClause":
          break;
        case "im:Query":
          createQuery();
          break;
        default:
          createQuery();
          break;
      }


      state.queryBuilder.loadDataSet(data);


      console.log("Create new empty dataset".data); //?res.data if backend


      const file = {
        iri: data["@id"],
        activeClausePath: "select.match[0]",
        activePropertyPath: "",
        targetType: "",
        targetAction: "",
        isVisible: true,
        state: "view",
        data: data,
        searchResults: [
        ]
      };
      state.openFiles.forEach((file: any, index: number) => state.openFiles[index].isVisible = false);
      state.openFiles.push(file); //alternative states are: loading, edit
      state.activeQueryId = data["@id"];
      state.tabs.find(tab => tab.name === "Edit").visible = true;
      state.activeTabName = "Edit";
      state.activeQueryCategory = "mainEntity";



    },
    nextQueryCategory(state): void {
      switch (state.activeQueryCategory) {
        case "mainEntity":
          state.activeQueryCategory = "definition";
          break;
        case "definition":
          state.activeQueryCategory = "output";
          break;
        case "output":
          state.activeQueryCategory = "sources";
          break;
        case "sources":
          state.activeQueryCategory = "sql";
          break;
        default:
          break;
      }
    },
    previousQueryCategory(state): void {
      switch (state.activeQueryCategory) {
        case "definition":
          state.activeQueryCategory = "mainEntity";
          break;
        case "output":
          state.activeQueryCategory = "definition";
          break;
        case "sources":
          state.activeQueryCategory = "output";
          break;
        case "sql":
          state.activeQueryCategory = "sources";
          break;
        default:
          break;
      }
    },
    updateActiveTabName(state, value) {
      state.activeTabName = value;
    },
    updateActiveQueryCategory(state, value) {
      state.activeQueryCategory = value;
    },
    updateSearchData(state, value) {
      state.searchData = value;
    },
    updateSearchResults(state, value) {
      state.searchResults = value;
    },
    updateActiveProfile(state, value) {
      state.activeProfile = value;
    },
    updateTheme(state, newTheme) {
      // const _currentTheme = state.theme;
      state.theme = newTheme;
      const _rootElement = document.getElementById("html");

      const _currentStoredTheme: string = localStorage.getItem(
        "themeName",
      ) as string;

      if (_currentStoredTheme && _currentStoredTheme != "") {
        _rootElement?.classList.remove(_currentStoredTheme);
      }


      localStorage.setItem("themeName", newTheme);
      _rootElement?.classList.add(newTheme);






    },
    updateUserFiles(state, entities) {
      // state.openFiles = [...state.openFiles, file];

      // dont load if already loaded
      if (state.userFiles.length > 0) return;


      entities.forEach((entity: any, index: number) => {

        //populate name and entityType in JSON definition

        if (entity["im:definition"]) {
          const _json = JSON.parse(entity["im:definition"]);

          state.debug && console.log("JSON definition", _json)
          let _entityReferences = jp.paths(_json, `$..[?(@.@id)]`);
          //filters out paths that are UUIDs for clauses (and not UUID's of entities);
          _entityReferences = _entityReferences.filter((reference: any) => reference[reference.length - 1] != "id");

          // populates each path with entity from ontology
          _entityReferences = _entityReferences.map((reference: any) => {

            const jpPath = jp.stringify(reference);
            const _path = jp.stringify(reference).substring(2);
            let _entityIri = _.get(_json, _path)["@id"];


            // changes http//endhealth.info/im#effectiveDate to im:effectiveDate (as an example)
            if (_entityIri.substring(0, 4) == "http") {
              _entityIri = QueryUtils.toIri(_entityIri);
            }


            // console.log("_entityIri", _entityIri)

            const _entity = state.ontology.entities.byIri(_entityIri)
            // console.log("_entity", _entity)


            let _shortEntity;
            if (_entity && _entity.length > 0) {
              // console.log(_entity)
              _shortEntity = {
                "@id": _entity[0]["@id"],
                "rdf:type": _entity[0]["rdf:type"],
                "rdfs:label": _entity[0]["rdfs:label"],
                "rdfs:comment": _entity[0]["rdfs:comment"]
              };


              //populate range for each property based on the datamodel (entityType inside the same clause)
              const _propertyTypes = ["owl:ObjectProperty", "owl:DatatypeProperty"];
              // console.log("_shortEntity", _shortEntity)
              const _isObjectProperty = _shortEntity["rdf:type"].some((rdfType: any) => _propertyTypes.includes(rdfType["@id"]));
              if (_isObjectProperty) {
                // console.log("reference", reference)
                // console.log("_path", _path)


                //get datamodel entity
                const _pathQueue = _.cloneDeep(reference);
                // console.log("_pathQueue", jp.stringify(_pathQueue))



                //finds nearest parent that is datamodel entity (i.e. has entityType json path)
                let _parentIri = "";
                while (_pathQueue.length > 1) {

                  const _valueAtPath = jp.query(_json, jp.stringify(_pathQueue))[0];
                  // console.log("_valueAtPath", _valueAtPath)

                  if (_valueAtPath["entityType"]) {
                    // console.log("entityType", _valueAtPath)
                    // console.log("entityType id", _valueAtPath["entityType"]["@id"])

                    _parentIri = _valueAtPath["entityType"]["@id"];
                    // console.log("_parentIri", _parentIri)


                    if (_parentIri.substring(0, 4) == "http") {
                      _parentIri = QueryUtils.toIri(_parentIri);
                    }
                    break;
                  }

                  _pathQueue.pop();
                }

                // if datamodel entity found, find the the range 
                if (_parentIri != "") {



                  const _datamodelEntity = state.ontology.entities.byIri(_parentIri);

                  // console.log("_parentIri", _parentIri)
                  // console.log("_datamodelEntity", _datamodelEntity)

                  // find the properties range

                  if (_datamodelEntity.length) {
                    const _rangeProperty = _datamodelEntity[0]["sh:property"].filter((_property: any) => {
                      return _property["sh:path"].some((path: any) => {
                        const _isMatch = path["@id"] == _shortEntity["@id"]
                        // console.log("_match", _property)
                        return _isMatch;
                      })
                    });

                    if (_rangeProperty.length > 0) {

                      _shortEntity["rdfs:range"] = _.get(_rangeProperty, "0.sh:datatype.0");
                    }

                  }

                }
              }


            }



            return {
              uuid: `urn:uuid:${v4()}`,
              jpPath: jpPath,
              path: _path,
              iri: _entityIri,
              entityData: _shortEntity, //state.ontology.entities.byIri(entityIri)
              pathArray: reference,
            }
          })


          //populates definition with entities
          _entityReferences.forEach((reference: any) => {

            // console.log("reference.path", reference.path)
            // console.log("reference.path", referenc?e.path.substring(reference.path.length - 5, reference.path.length - 2))
            // if (reference.path.substring(-10, -2) )
            if (reference.entityData != undefined) _.set(_json, reference.path, reference.entityData);
          });

          // console.log("1", JSON.stringify(_json) )
          entities[index]["im:definition"] = JSON.stringify(_json);

          // console.log("_entityReferences", _entityReferences)

          state.debug && console.log("JSON definition (populated)", _json)

          //for debugging
          let _entitiesWithoutData = _entityReferences.filter((entity: any) => entity.entityData == undefined);

          _entitiesWithoutData = _entitiesWithoutData.map((entity: any) => {
            return {
              "@id": entity["iri"],
              "rdf:type": [],
              "rdfs:label": "",
              "rdfs:comment": ""
            }
          })

          //removes duplicates
          const unique = new Set()
          _entityReferences = _entityReferences.filter((item: any) => {
            if (unique.has(item.iri)) {
              return false;
            } else {
              unique.add(item.iri)
              return true;
            }
          });



          entities[index]["entityReferences"] = _entityReferences;
          entities[index]["entitiesWithoutData"] = _entitiesWithoutData;

          // console.log("entity", entity)
          state.debug && console.log("Entities References", _entityReferences)
          state.debug && console.log("Entities without data", _entitiesWithoutData)


        }




        //any file belonging to the user
        const _userFile = {
          uuid: `urn:uuid:${v4()}`,
          iri: entity["@id"],
          name: entity["rdfs:label"],
          comment: entity["rdfs:comment"],
          folder: entity["im:isContainedIn"] ? entity["im:isContainedIn"] : "",
          type: entity["rdf:type"][0]["@id"],
        };

        //files after their content is fetched via service (i.e. when the user opens them)
        const _openFile = {
          ..._userFile,
          isVisible: false,
          content: entity
        };


        state.userFiles.push(_userFile);



        //#todo let user decide which profiles they want to open
        //opens all profiles
        //loads querybuilder
        state.openFiles.push(_openFile);
        // console.log("entity", entity)
        state.queryBuilder.load(entity);


      });


      // ensures 1 item is active
      if (state.openFiles.length > 0 && state.activeFileIri.length == 0) {
        state.activeFileIri = state.openFiles[0].iri;
      }


      // console.log()
      console.log("openFiles", state.openFiles)


    },
    queryBuilder(state, { action, payload }) {
      switch (action) {
        case "load":
          state.queryBuilder.load(payload);
          break;
        case "option":
          break;
      }

    },

    updateCurrentUser(state, user) {
      state.currentUser = user;
    },
    updateRegisteredUsername(state, username) {
      state.registeredUsername = username;
    },
    updateIsLoggedIn(state, status) {
      state.isLoggedIn = status;
    },
    updateSnomedLicenseAccepted(state, status: string) {
      state.snomedLicenseAccepted = status;
      localStorage.setItem("snomedLicenseAccepted", status);
    },
    updateOpenFiles(state, openFiles) {
      //if no active file exists, create one
      // console.log("openPQLFiles.some((file: any) => file.uuid == state.activePQLFile)", openPQLFiles.some((file: any) => file.uuid == state.activePQLFile));
      state.openFiles = openFiles;

    },
    closeOpenFile(state, fileIri) {
      // component does not update?
      let _state = _.cloneDeep(state.openFiles);
      _state = _state.filter((item: any) => {
        if (item.iri == fileIri) {
          alert("true " + fileIri);
          alert(state.openFiles.length)
          return false;
        } else {
          return true;
        }
      })
      state.openFiles = _state;
      alert(state.openFiles.length)
    },
    toggleVisibleOpenFile(state, fileIri) {
      state.openFiles.forEach((item: any, index) => {
        if (item.iri == fileIri) {
          // console.log(item.iri)
          // console.log(fileIri)
          state.openFiles[index].isVisible = true;
        } else {
          state.openFiles[index].isVisible = false

        }
      })
      state.activeQueryId = fileIri;
    },
    updateActiveFileIri(state, activeFileIri) {
      if (state.activeFileIri.includes(activeFileIri)) {
        state.activeFileIri = state.activeFileIri.filter((item: any) => item.iri != activeFileIri)
      } else {
        state.activeFileIri.push(activeFileIri)
      }
      console.log("  state.activeFileIri", state.activeFileIri)

    },
    addDataModelItem(state, item) {
      state.datamodel.push(item);
    },
    updateDatamodelProperties(state, payload) {
      state.datamodel.forEach((entity: any) => {
        if (entity.iri == payload.iri) {
          entity.properties = payload.data;
        }
      });
    },
    updateDatamodelSummary(state, payload) {
      state.datamodel.forEach((entity: any) => {
        if (entity.iri == payload.iri) {
          entity.summary = payload.data;
          entity.name = payload.data.name;
        }
      });

    },
    updateDatamodelIris(state, datamodelIris) {
      state.datamodelIris = datamodelIris;

    },
    updateIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    updateJSONContent(state, JSONContent) {
      state.JSONContent = JSONContent;
    },
    updateLabelContent(state, LabelContent) {
      state.LabelContent = LabelContent;
    },
    updateIsCardDragged(state, val) {
      state.isCardDragged = val;

    },
    updateHistoryCount(state, count) {
      state.historyCount = count;
    },

  },
  actions: {

    async loadTheme({ commit, dispatch }) {
      const _storedTheme = localStorage.getItem("themeName");
      const _defaultTheme = "light";
      const _themeName = (_storedTheme && _storedTheme != "") ? _storedTheme : _defaultTheme;
      commit("updateTheme", _themeName);
    },
    async loadUserData({ commit, dispatch }) {

      //example  
      // const _filenames = ["userdata_profiles1707.json"];
      const _filenames = ["userdata_profiles1705.json"];
      // const _filenames = ["raw/COVID 2nd Vaccine-profiles-ld.json"];
      // const _filenames = ["raw/UCLP-CEG SMI EMIS v5-profiles-ld.json"];


      _filenames.forEach(async (filename: string) => {
        await EntityService.getData(filename)
          .then(data => {
            commit("updateUserFiles", data)
            console.log("opened file:", data);

          })
          .catch(err => {
            console.error("Failed to fetch userdata", err);
          });


        // useful if you want to filter the entities
        // this.filterTypes = this.queryBuilder.entityTypes.map((item: any) => {
        //   const _label = item.substring(0, 1) == ":" ? item.substring(1) : item.split(":")[1];

        //   return {
        //     value: item,
        //     label: _label
        //   };
        // });
      });
    },
    async fetchSearchResults(
      { commit },
      data: { searchRequest: SearchRequest; cancelToken: any }
    ) {
      let searchResults: any;
      let success = "true";
      await EntityService.advancedSearch(data.searchRequest, data.cancelToken)
        .then(res => {
          searchResults = res.data.entities;
          commit("updateSearchResults", searchResults);
        })
        .catch(err => {
          if (!err.message) {
            success = "cancelled";
            LoggerService.info(undefined, "axios request cancelled");
          } else {
            success = "false";
            LoggerService.error(undefined, err);
          }
        });
      return success;
    },
    async logoutCurrentUser({ commit }) {
      let result = new CustomAlert(500, "Logout (store) failed");
      await AuthService.signOut().then(res => {
        if (res.status === 200) {
          commit("updateCurrentUser", null);
          commit("updateIsLoggedIn", false);
          result = res;
        } else {
          result = res;
        }
      });
      return result;
    },
    async authenticateCurrentUser({ commit, dispatch }) {
      const result = { authenticated: false };
      await AuthService.getCurrentAuthenticatedUser().then(res => {
        if (res.status === 200 && res.user) {
          commit("updateIsLoggedIn", true);
          const loggedInUser = res.user;
          const foundAvatar = avatars.find(
            avatar => avatar.value === loggedInUser.avatar.value
          );
          if (!foundAvatar) {
            loggedInUser.avatar = avatars[0];
          }
          commit("updateCurrentUser", loggedInUser);
          result.authenticated = true;
        } else {
          dispatch("logoutCurrentUser").then(res => {
            if (res.status === 200) {
              LoggerService.info(undefined, "Force logout successful");
            } else {
              LoggerService.error(undefined, "Force logout failed");
            }
          });
        }
      });
      return result;
    },
  },
  modules: {}
});
