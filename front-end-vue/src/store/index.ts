import { SearchRequest } from "./../models/search/SearchRequest";
import { createStore } from "vuex";
import EntityService from "../services/EntityService";
import { HistoryItem } from "../models/HistoryItem";
import { User } from "../models/user/User";
import AuthService from "@/services/AuthService";
import { avatars } from "@/models/user/Avatars";
import LoggerService from "@/services/LoggerService";
import { CustomAlert } from "@/models/user/CustomAlert";
import { IM } from "@/vocabulary/IM";
import { ConceptSummary } from "@/models/search/ConceptSummary";
import { ConceptReference } from "@/models/TTConcept/ConceptReference";
import axios from "axios";

export default createStore({
  // update stateType.ts when adding new state!
  state: {
    loading: new Map<string, boolean>(),
    cancelSource: axios.CancelToken.source(),
    conceptIri: "http://endhealth.info/im#DiscoveryOntology",
    history: [] as HistoryItem[],
    searchResults: [] as ConceptSummary[],
    currentUser: {} as User,
    registeredUsername: "" as string,
    isLoggedIn: false as boolean,
    snomedLicenseAccepted: localStorage.getItem(
      "snomedLicenseAccepted"
    ) as string,
    historyCount: 0 as number,
    focusTree: false as boolean,
    treeLocked: true as boolean,
    sideNavHierarchyFocus: {
      name: "Ontology",
      fullName: "Ontologies",
      iri: "http://endhealth.info/im#DiscoveryOntology"
    } as { name: string; iri: string },
    selectedEntityType: "",
    filters: {
      selectedStatus: ["Active", "Draft"],
      selectedSchemes: [
        {
          iri: IM.DISCOVERY_CODE,
          name: "Discovery code"
        },
        {
          iri: IM.CODE_SCHEME_SNOMED,
          name: "Snomed-CT code"
        },
        {
          iri: IM.CODE_SCHEME_TERMS,
          name: "Term based code"
        }
      ],
      selectedTypes: [
        "Class",
        "ObjectProperty",
        "DataProperty",
        "DataType",
        "Annotation",
        "Individual",
        "Record",
        "ValueSet",
        "Folder",
        "Legacy"
      ]
    } as {
      selectedStatus: string[];
      selectedSchemes: ConceptReference[];
      selectedTypes: string[];
    },
    activeQueryId: "9ee8061d-267f-4b4d-95ad-1a435db7fdc5",
    openQueries: [
      {
        id: "06523b6c-d9dd-4aae-baca-a0c5afbf44da",
        name: "Untitled Dataset",
        description: "The percentage of patients with diabetes, on the register, and a history of CVD (excluding haemorrhagic stroke) who are currently treated with a statin.",
        data: {
          mainDataTypeIri: "im:Patient",
          selectedOrganisations: "",
          selectedOrganisationLists: [],
          snippets: [],
          output: [],
          export: {
            format: "",
          },
        }
      },
      {
        id: "9ee8061d-267f-4b4d-95ad-1a435db7fdc5",
        iri: "dds:QRI_QOF_CHD005",
        name: "QOF 2020 CHD005",
        description: "The percentage of patients with coronary heart disease with a record in the preceding 12 months that aspirin, an alternative anti-pl atelet therapy, or an anti-coagulant is being taken.",
        data: {
          mainDataTypeIri: "im:Patient",
          selectedOrganisationsIri: "im:VSET_OrgAllAllowable",
          selectedOrganisationsListIris: [],
          steps: [
            {
              id: "56d94da4-1bd0-4a87-86e9-4d3a74e28060",
              name: "Registered patients",
              searchterms: ["registered", "actively registered", "currently registered", "GMS register"],
              keyword: "Include all healthrecords from",
              copy: [
                {
                  name: "Discovery Data Service",
                  iri: "im:DDS",
                },
              ],
              meta: {
                viewCount: 32,
                patientCount: "1.3M"
              },
              inclusionCriteria: [
                {
                  id: "6fa641ee-cb6b-4137-b510-6b314ff3e353",
                  modifier: {
                    iri: "im:modifier_latest",
                    name: "Latest",
                  },
                  datamodelEntity: {
                    iri: "im:EpisodeOfCare",
                    name: "Registration History"
                  },
                  constraints: [
                    {
                      id: "96b161cd-f16c-4d2f-8e59-719aa7b505d3",
                      itemType: "collection",
                      booleanOperator: "and",
                      children: [
                        {
                          id: "7666bfc5-18cf-4411-8438-d47939e563bf",
                          itemType: "item",
                          booleanOperator: "",
                          children: [
                            {
                              id: "7c432f33-36e3-4132-9563-25464b43047e",
                              datamodelProperty: {
                                property: {
                                  iri: "im:Concept",
                                  name: "Codeable Concept",
                                },
                                type: {
                                  iri: "http://endhealth.info/im#894281000252100",
                                  name: "Ontological Concept",
                                },
                              },
                              comparisons: [{
                                comparisonOperator: "is",
                                comparators: [
                                  {
                                    value: {
                                      iri: "im:CSET_Registered",
                                      name: "Registered",
                                    },
                                    type: {
                                      iri: "im:Concept",
                                      name: "Ontological Concept",
                                    },
                                  },
                                ],
                              }],
                            }
                          ]
                        },
                        {
                          id: "fcbe6b9a-5484-404c-81b2-c105e519269c",
                          itemType: "collection",
                          booleanOperator: "or",
                          children: [
                            {
                              id: "3fff11b2-1603-491d-9b83-41f0b04f5bef",
                              itemType: "item",
                              booleanOperator: "",
                              children: [
                                {
                                  datamodelProperty: {
                                    property: {
                                      iri: "im:effectiveDate",
                                      name: "Effective Date",
                                    },
                                    type: {
                                      iri: "im:DateTime",
                                      name: "Date Time",
                                    },
                                  },
                                  comparisons: [{
                                    comparisonOperator: "does not exist",
                                    comparators: []
                                  }],
                                }
                              ]
                            },
                            {
                              id: "35f79f3e-61fb-43b3-97a3-5c4b2f2a5924",
                              itemType: "item",
                              booleanOperator: "",
                              children: [
                                {
                                  datamodelProperty: {
                                    property: {
                                      iri: "im:endDate",
                                      name: "End Date",
                                    },
                                    type: {
                                      iri: "im:DateTime",
                                      name: "Date Time",
                                    },
                                  },
                                  comparisons: [{
                                    comparisonOperator: "is before",
                                    comparators: [
                                      {
                                        value: {
                                          iri: "im:UserInput",
                                          name: "01/04/2020",
                                        },
                                        type: {
                                          iri: "im:DateTime",
                                          name: "Date Time",
                                        },
                                      },
                                    ],
                                  }],
                                }
                              ]
                            },
                          ]
                        },
                      ]
                    },

                  ]

                }
              ],
              exclusionCriteria: [],
            },
            {
              id: "e55d01bb-8e14-4256-ac0e-de74bb0a047d",
              name: "Diagnosis of CHD",
              searchterms: ["chd"],
              keyword: "Include all healthrecords from",
              targets: [
                {
                  name: "Registered patients",
                  iri: "dds:QRI_QOF_CHD005",
                },
              ],
              meta: {
                viewCount: 32,
                patientCount: "1.3M"
              },
              inclusionCriteria: [
                {
                  id: "e2f19e1c-e31e-414d-9815-6e4d8e282290",
                  modifier: {
                    iri: "im:modifier_any",
                    name: "Any",
                  },
                  datamodelEntity: {
                    iri: "im:ProblemOrCondition",
                    name: "Problem or Condition"
                  },
                  constraints: [
                    {
                      id: "271724a8-44ad-4893-9094-246980c4cb15",
                      itemType: "item",
                      booleanOperator: "",
                      children: [
                        {
                          id: "7c432f33-36e3-4132-9563-25464b43047e",
                          datamodelProperty: {
                            property: {
                              iri: "im:Concept",
                              name: "Codeable Concept",
                            },
                            type: {
                              iri: "http://endhealth.info/im#894281000252100",
                              name: "Ontological Concept",
                            },
                          },
                          comparisons: [{
                            comparisonOperator: "is",
                            comparators: [
                              {
                                value: {
                                  iri: "im:CSET_CHD",
                                  name: "Coronary Artery Disease (excl Haemorrhagic Stroke)",
                                },
                                type: {
                                  iri: "im:Concept",
                                  name: "Ontological Concept",
                                },
                              },
                            ],
                          }],
                        }
                      ]
                    },

                  ]

                }
              ],
              exclusionCriteria: [],
            },
          ],
          output: [],
          export: {
            format: "",
          },
        }
      },
      {
        id: "0c14d146-964e-4e42-bcb5-2999f345f1f7",
        name: "DM0023",
        description: "The percentage of patients with diabetes, on the register, and a history of CVD (excluding haemorrhagic stroke) who are currently treated with a statin.",
        data: {
          mainDataTypeIri: "im:Patient",
          selectedOrganisations: "",
          selectedOrganisationLists: [],
          snippets: [],
          output: [],
          export: {
            format: "",
          },
        }
      },
    ],
    datamodel: [] as any[],
  },
  mutations: {
    updateConceptIri(state, conceptIri) {
      state.conceptIri = conceptIri;
    },
    updateCancelSource(state) {
      state.cancelSource = axios.CancelToken.source();
    },
    updateHistory(state, historyItem) {
      state.history = state.history.filter(function (el) {
        return el.conceptName !== historyItem.conceptName;
      });
      state.history.splice(0, 0, historyItem);
    },
    updateSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    },
    updateFilters(state, filters) {
      state.filters = filters;
    },
    updateLoading(state, loading) {
      state.loading.set(loading.key, loading.value);
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
    updateHistoryCount(state, count) {
      state.historyCount = count;
    },
    updateFocusTree(state, bool) {
      state.focusTree = bool;
    },
    updateTreeLocked(state, bool) {
      state.treeLocked = bool;
    },
    updateSideNavHierarchyFocus(state, focus) {
      state.sideNavHierarchyFocus = focus;
    },
    updateSelectedEntityType(state, type) {
      state.selectedEntityType = type;
    },
    updateOpenQueries(state, openQueries) {
      //if no active file exists, create one
      // console.log("openPQLFiles.some((file: any) => file.uuid == state.activePQLFile)", openPQLFiles.some((file: any) => file.uuid == state.activePQLFile));
      state.openQueries = openQueries;
    },
    updateActiveQueryId(state, activeQueryId) {
      state.activeQueryId = activeQueryId;
    },
    updateActiveQuery(state, activeQuery) {
      let _activeIndex = -1;

      for (let i = 0; i < state.openQueries.length - 1; i++) {
        if (state.openQueries[i].id == state.activeQueryId) {
          _activeIndex = i;
        }
      }
      if (_activeIndex != -1) {
        state.openQueries[_activeIndex] = activeQuery;
      }
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
        }
      });

    }
  },
  actions: {
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
    async fetchDatamodel({ commit }) {
      const datamodelIris = [
        // "http://endhealth.info/im#Activity",
        // "http://endhealth.info/im#Event",
        // "http://endhealth.info/im#Patient",
        "http://endhealth.info/im#AllergyIntoleranceAndAdverseReaction",
        "http://endhealth.info/im#CarePlan",
        "http://endhealth.info/im#DiagnosticReport",
        "http://endhealth.info/im#Encounter",
        "http://endhealth.info/im#AccidentAndEmergencyEncounter",
        "http://endhealth.info/im#CriticalCareEncounter",
        "http://endhealth.info/im#HospitalAdmission",
        "http://endhealth.info/im#HospitalDischarge",
        "http://endhealth.info/im#HospitalInpatientStay",
        "http://endhealth.info/im#HospitalOutpatientEncounter",
        "http://endhealth.info/im#EpisodeOfCare",
        "http://endhealth.info/im#Immunisation",
        "http://endhealth.info/im#MedicationOrder",
        "http://endhealth.info/im#Observation",
        "http://endhealth.info/im#ProblemOrCondition",
        "http://endhealth.info/im#Procedure",
        "http://endhealth.info/im#ReferralRequestOrProcedureRequest",
        "http://endhealth.info/im#Appointment",
      ];

      datamodelIris.forEach(async (iri: string) => {
        commit("addDataModelItem", {
          iri: iri,
          summary: {},
          properties: {},
        });

        await EntityService.getDataModelProperties(iri)
          .then((res) => {
            commit("updateDatamodelProperties", {
              iri: iri,
              data: res.data
            });
          })
          .catch((err) => {
            console.log(
              "Failed to get data model properties from server",
              err
            );
          }
          );
        await EntityService.getEntitySummary(iri)
          .then((res) => {
            console.log("datamodel summary fetched " + iri + " :", res.data);
            commit("updateDatamodelSummary", {
              iri: iri,
              data: res.data
            });
          })
          .catch((err) => {
            console.log(
              "Failed to get data model properties from server",
              err
            );
          }
          );


      });
      // this.getEntitySummary(iri);
      // this.getDataModelProperties(iri);

    }
  },
  modules: {}
});
