
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

export default createStore({
  // update stateType.ts when adding new state!
  state: {
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
    activeProfile: { uuid: "", activeClausePath: "" },
    JSONContent: "",
    LabelContent: [] as any[],
    isLoading: false,
    theme: "",
    activeFileIri: [] as any[],
    openFiles: [] as any[],
    userFiles: [] as any[],
    activeQueryId: "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf",
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
        name: "View",
        icon: "newspaper",
        visible: false
      },
      {
        name: "Create",
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

  },
  mutations: {
    loadFile(state, fileIri) {

      if (state.openFiles.some(file => file.iri === fileIri)) {
        alert("File already open!");
        state.activeTabName = "View";
        state.isLoading = false;

        return;
      }




      // recursive delay until ontology has loaded (require for pre-population)
      function delayFileLoad() {
        if (!state.ontology._entities) {
          setTimeout(delayFileLoad, 100);
        } else {
          loadEntity();
        }
      }

      if (!state.ontology._entities) {
        setTimeout(delayFileLoad, 100);
      } else {

        loadEntity();
      }



      async function loadEntity() {

        try {
          const entity = await QueryService.getDefinition(fileIri).then(res => {
            // this.mutations.updateUserFiles(res.data);
            console.log("opened file:", res.data);
            const _prefixedEntity = QueryUtils.toPrefixedIri(res.data.entity);
            return _prefixedEntity;
          })
            .catch(err => {
              console.error("Failed to load file from the server", err);
            });

          if (entity) {
            //upon successful load make view tab visible and active


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
                // alert("in")
                // console.log("ontology", _.cloneDeep(state.ontology)) 
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
              entity["im:definition"] = JSON.stringify(_json);

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



              entity["entityReferences"] = _entityReferences;
              entity["entitiesWithoutData"] = _entitiesWithoutData;

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


            // ensures 1 item is active
            // const _isAnyFileVisible = state.openFiles.some((file: any) => file.isVisible);


            const toggleAllInvisible = () => state.openFiles.forEach((file: any, index: any) => state.openFiles[index].isVisible = false);

            //makes the latest file visible
            if (state.openFiles.length > 0) {
              toggleAllInvisible();
              state.openFiles[state.openFiles.length - 1].isVisible = true;


            }


            // console.log()
            console.log("openFiles", state.openFiles)

            state.tabs[3].visible = true;
            state.activeTabName = "View";



          }
          state.isLoading = false;


        } catch (error) {
          console.log("error occurred in loadEntity", error)
          state.isLoading = false;

        }





      }


    },
    updateActiveTabName(state, value) {
      state.activeTabName = value;
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
      const _defaultTheme = "dark";
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