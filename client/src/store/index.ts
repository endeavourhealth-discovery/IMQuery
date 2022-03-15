import { Description } from '@/components/concept/Description.vue';
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
import SearchClient from "@/services/SearchClient";
import SearchService from "@/services/SearchService";
import { QueryBuilder } from "@/models/query/QueryTools";
import Ontology from "@/models/query/OntologyTools";
import _ from "lodash";
import DataService from "@/services/DataService";
import { v4 } from "uuid";

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
    JSONContent: "",
    LabelContent: [] as any[],
    isLoading: false,
    activeFileIri: "",
    openFiles: [] as any[],
    userFiles: [] as any[],
    activeQueryId: "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf",
    openQueries: [
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
              iri: "dds:Step_RegisteredPatients",
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
                    name: "latest",
                  },
                  datamodelEntity: {
                    iri: "http://endhealth.info/im#EpisodeOfCare",
                    name: "Episode of Care"
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
              iri: "dds:Step_DiagnosisCHD",
              searchterms: ["chd"],
              keyword: "Include all healthrecords from",
              copy: [
                {
                  name: "Registered patients",
                  iri: "dds:Step_RegisteredPatients",
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
                    name: "any",
                  },
                  datamodelEntity: {
                    iri: "http://endhealth.info/im#ProblemOrCondition",
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
        iri: "dds:QRI_QOF_DM023",
        description: "The percentage of patients with diabetes, on the register, and a history of CVD (excluding haemorrhagic stroke) who are currently treated with a statin.",
        data: {
          mainDataTypeIri: "im:Patient",
          selectedOrganisations: "",
          selectedOrganisationLists: [],
          steps: [],
          output: [],
          export: {
            format: "",
          },
        }
      },

    ],
    datamodel: [] as any[],
    datamodelIris: [] as any[],
    prefetched_datamodel: [
      {
        iri: "http://endhealth.info/im#AllergyIntoleranceAndAdverseReaction",
        name: "Allergy, intolerance and adverse reaction  (record type)",
        summary: {
          name: "Allergy, intolerance and adverse reaction  (record type)",
          iri: "http://endhealth.info/im#AllergyIntoleranceAndAdverseReaction",
          description:
            'Allergies, intolerance and adverse substance reactions are grouped together and are extensions of simple observations whereby the simple observation code includes the full concept of the allergy e.g.... "allergy to penicillin"<p>The additional data relates to more specific information about the substance and reaction.',
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Allergy, intolerance and adverse reaction  (record type)",
        },
        properties: [
          {
            property: {
              name: "manifestation",
              "@id": "http://endhealth.info/im#manifestation",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "manifestation description",
              "@id": "http://endhealth.info/im#manifestationDescription",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "observations",
              "@id": "http://endhealth.info/im#observations",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "severity",
              "@id": "http://endhealth.info/im#severity",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "substance",
              "@id": "http://endhealth.info/im#substance",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Value set - allergy and adverse reactions",
              "@id": "http://endhealth.info/im#VSET_RecordType_Allergy",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#CarePlan",
        name: "Care plan (record type)",
        summary: {
          name: "Care plan (record type)",
          iri: "http://endhealth.info/im#CarePlan",
          description:
            "A dynamic document that notes the plan regarding the care of a patient. As in the document structure they tend to specialise and thus this highlights only the generic sections.",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Care plan  (record type)",
        },
        properties: [
          {
            property: {
              name: "associated practitioners",
              "@id": "http://endhealth.info/im#associatedPractitioners",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "associated teams",
              "@id": "http://endhealth.info/im#associatedTeams",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "document Status",
              "@id": "http://endhealth.info/im#documentStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "linked activities",
              "@id": "http://endhealth.info/im#linkedActivities",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "linked episodes",
              "@id": "http://endhealth.info/im#linkedEpisodes",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "linked Headings",
              "@id": "http://endhealth.info/im#linkedHeadings",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "parent plan",
              "@id": "http://endhealth.info/im#parentPlan",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "time period",
              "@id": "http://endhealth.info/im#timePeriod",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "type of plan",
              "@id": "http://endhealth.info/im#typeOfPlan",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "description",
              "@id": "http://endhealth.info/im#description",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#DiagnosticReport",
        name: "Diagnostic report  (record type)",
        summary: {
          name: "Diagnostic report  (record type)",
          iri: "http://endhealth.info/im#DiagnosticReport",
          description:
            "A diagnostic report is the set of information that is typically provided by a diagnostic service when investigations are complete. It includes a mix of component events often arranged hierarchically, some structured, some unstructured.<p>A diagnostic report has a header and set of components",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Diagnostic report  (record type)",
        },
        properties: [
          {
            property: {
              name: "diagnostic service",
              "@id": "http://endhealth.info/im#diagnosticService",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "identifier",
              "@id": "http://endhealth.info/im#identifier",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "report type",
              "@id": "http://endhealth.info/im#reportType",
            },
            type: {
              name: "Concept set - Value set - Diagnostic report categories",
              "@id": "http://endhealth.info/im#VSET_1000001",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "service category",
              "@id": "http://endhealth.info/im#serviceCategory",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "report issue date",
              "@id": "http://endhealth.info/im#reportIssueDate",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#Encounter",
        name: "Encounter (record type)",
        summary: {
          name: "Encounter (record type)",
          iri: "http://endhealth.info/im#Encounter",
          description:
            "An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Encounter (record type)",
        },
        properties: [
          {
            property: {
              name: "additional Practitioners",
              "@id": "http://endhealth.info/im#additionalPractitioners",
            },
            type: {
              name: "Practitioner in role  (record type)",
              "@id": "http://endhealth.info/im#PractitionerInRole",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "completion Status",
              "@id": "http://endhealth.info/im#completionStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "duration",
              "@id": "http://endhealth.info/im#duration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            minExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has section",
              "@id": "http://endhealth.info/im#hasSection",
            },
            type: {
              name: "Section (structural)",
              "@id": "http://endhealth.info/im#Section",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "linked appointment",
              "@id": "http://endhealth.info/im#linkedAppointment",
            },
            type: {
              name: "Appointment  (record type)",
              "@id": "http://endhealth.info/im#Appointment",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "linked care episode",
              "@id": "http://endhealth.info/im#linkedCareEpisode",
            },
            type: {
              name: "Episode of care  (record type)",
              "@id": "http://endhealth.info/im#EpisodeOfCare",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "location",
              "@id": "http://endhealth.info/im#location",
            },
            type: {
              name: "Location  (record type)",
              "@id": "http://endhealth.info/im#Location",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "providing Organisation/ services or departments",
              "@id":
                "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "is subencounter of",
              "@id": "http://endhealth.info/im#isSubEncounterOf",
            },
            type: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Encounter",
              "@id": "http://endhealth.info/im#1741000252102",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#AccidentAndEmergencyEncounter",
        name: "Accident and emergency encounter (record type)",
        summary: {
          name: "Accident and emergency encounter (record type)",
          iri: "http://endhealth.info/im#AccidentAndEmergencyEncounter",
          description:
            "An entry recording an encounter in the A&E unit. Specialised properties.<p>common data model attributes for Accident and emergency encounter",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Accident and emergency encounter (record type)",
        },
        properties: [
          {
            property: {
              name: "a&e department type",
              "@id": "http://endhealth.info/im#aAndeDepartmentType",
            },
            type: {
              name: "Accident and emergency (setting)",
              "@id": "http://endhealth.info/im#651000252108",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has a&e attendance source of",
              "@id": "http://endhealth.info/im#hasAandeAttendanceSourceOf",
            },
            type: { "@id": "http://snomed.info/sct#999002991000000109" },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has a&e category of attendance of",
              "@id": "http://endhealth.info/im#hasAandeCategoryOfAttendanceOf",
            },
            type: {
              name: "Accident and emergency attendance or follow up",
              "@id": "http://endhealth.info/im#461000252108",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has arrival mode",
              "@id": "http://endhealth.info/im#hasArrivalMode",
            },
            type: { "@id": "http://snomed.info/sct#999002981000000107" },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "treatment function for service for which admitted",
              "@id":
                "http://endhealth.info/im#treatmentFunctionForServiceForWhichAdmitted",
            },
            type: {
              name: "Services (qualifier value)",
              "@id": "http://snomed.info/sct#224930009",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Accident and emergency encounter",
              "@id": "http://endhealth.info/im#1151000252104",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "additional Practitioners",
              "@id": "http://endhealth.info/im#additionalPractitioners",
            },
            type: {
              name: "Practitioner in role  (record type)",
              "@id": "http://endhealth.info/im#PractitionerInRole",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "completion Status",
              "@id": "http://endhealth.info/im#completionStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "duration",
              "@id": "http://endhealth.info/im#duration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            minExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "has section",
              "@id": "http://endhealth.info/im#hasSection",
            },
            type: {
              name: "Section (structural)",
              "@id": "http://endhealth.info/im#Section",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked appointment",
              "@id": "http://endhealth.info/im#linkedAppointment",
            },
            type: {
              name: "Appointment  (record type)",
              "@id": "http://endhealth.info/im#Appointment",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked care episode",
              "@id": "http://endhealth.info/im#linkedCareEpisode",
            },
            type: {
              name: "Episode of care  (record type)",
              "@id": "http://endhealth.info/im#EpisodeOfCare",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "location",
              "@id": "http://endhealth.info/im#location",
            },
            type: {
              name: "Location  (record type)",
              "@id": "http://endhealth.info/im#Location",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "providing Organisation/ services or departments",
              "@id":
                "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "is subencounter of",
              "@id": "http://endhealth.info/im#isSubEncounterOf",
            },
            type: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#CriticalCareEncounter",
        name: "Critical care encounter (record type)",
        summary: {
          name: "Critical care encounter (record type)",
          iri: "http://endhealth.info/im#CriticalCareEncounter",
          description:
            "An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Critical care encounter (record type)",
        },
        properties: [
          {
            property: {
              name: "has admission source",
              "@id": "http://endhealth.info/im#hasAdmissionSource",
            },
            type: {
              name: "Critical care admission source",
              "@id": "http://endhealth.info/im#1041000252100",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has critical care unit function",
              "@id": "http://endhealth.info/im#hasCriticalCareUnitFunction",
            },
            type: {
              name: "Critical care unit function",
              "@id": "http://endhealth.info/im#211000252109",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Critical care encounter",
              "@id": "http://endhealth.info/im#841000252107",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "additional Practitioners",
              "@id": "http://endhealth.info/im#additionalPractitioners",
            },
            type: {
              name: "Practitioner in role  (record type)",
              "@id": "http://endhealth.info/im#PractitionerInRole",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "completion Status",
              "@id": "http://endhealth.info/im#completionStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "duration",
              "@id": "http://endhealth.info/im#duration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            minExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "has section",
              "@id": "http://endhealth.info/im#hasSection",
            },
            type: {
              name: "Section (structural)",
              "@id": "http://endhealth.info/im#Section",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked appointment",
              "@id": "http://endhealth.info/im#linkedAppointment",
            },
            type: {
              name: "Appointment  (record type)",
              "@id": "http://endhealth.info/im#Appointment",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked care episode",
              "@id": "http://endhealth.info/im#linkedCareEpisode",
            },
            type: {
              name: "Episode of care  (record type)",
              "@id": "http://endhealth.info/im#EpisodeOfCare",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "location",
              "@id": "http://endhealth.info/im#location",
            },
            type: {
              name: "Location  (record type)",
              "@id": "http://endhealth.info/im#Location",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "providing Organisation/ services or departments",
              "@id":
                "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "is subencounter of",
              "@id": "http://endhealth.info/im#isSubEncounterOf",
            },
            type: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#HospitalAdmission",
        name: "Hospital admission (record type)",
        summary: {
          name: "Hospital admission (record type)",
          iri: "http://endhealth.info/im#HospitalAdmission",
          description:
            "An entry recording the event of a hospital admission. Has specialised properties.<p>common data model attributes for Hospital admission",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Hospital admission (record type)",
        },
        properties: [
          {
            property: {
              name: "administrative category",
              "@id": "http://endhealth.info/im#administrativeCategory",
            },
            type: {
              name: "Administrative category code (NHS DD)",
              "@id": "http://endhealth.info/im#2451000252104",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has admission classification of patient",
              "@id": "http://endhealth.info/im#hasAdmissionClassificationOfPatient",
            },
            type: {
              name: "Admitted patient classification",
              "@id": "http://endhealth.info/im#161000252101",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has admission method",
              "@id": "http://endhealth.info/im#hasAdmissionMethod",
            },
            type: {
              name: "Admission method",
              "@id": "http://endhealth.info/im#1581000252101",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has admission source",
              "@id": "http://endhealth.info/im#hasAdmissionSource",
            },
            type: {
              name: "Admission source",
              "@id": "http://endhealth.info/im#1391000252106",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "is component of",
              "@id": "http://endhealth.info/im#isComponentOf",
            },
            type: {
              name: "Hospital inpatient stay (record type)",
              "@id": "http://endhealth.info/im#HospitalInpatientStay",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Hospital admission",
              "@id": "http://endhealth.info/im#1281000252104",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "additional Practitioners",
              "@id": "http://endhealth.info/im#additionalPractitioners",
            },
            type: {
              name: "Practitioner in role  (record type)",
              "@id": "http://endhealth.info/im#PractitionerInRole",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "completion Status",
              "@id": "http://endhealth.info/im#completionStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "duration",
              "@id": "http://endhealth.info/im#duration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            minExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "has section",
              "@id": "http://endhealth.info/im#hasSection",
            },
            type: {
              name: "Section (structural)",
              "@id": "http://endhealth.info/im#Section",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked appointment",
              "@id": "http://endhealth.info/im#linkedAppointment",
            },
            type: {
              name: "Appointment  (record type)",
              "@id": "http://endhealth.info/im#Appointment",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked care episode",
              "@id": "http://endhealth.info/im#linkedCareEpisode",
            },
            type: {
              name: "Episode of care  (record type)",
              "@id": "http://endhealth.info/im#EpisodeOfCare",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "location",
              "@id": "http://endhealth.info/im#location",
            },
            type: {
              name: "Location  (record type)",
              "@id": "http://endhealth.info/im#Location",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "providing Organisation/ services or departments",
              "@id":
                "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "is subencounter of",
              "@id": "http://endhealth.info/im#isSubEncounterOf",
            },
            type: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#HospitalDischarge",
        name: "Hospital discharge (record type)",
        summary: {
          name: "Hospital discharge (record type)",
          iri: "http://endhealth.info/im#HospitalDischarge",
          description:
            "An entry describing the event of a hospital discharge. Has specialised encounter properties.<p>common data model attributes for Hospital discharge (entry)",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Hospital discharge (record type)",
        },
        properties: [
          {
            property: {
              name: "has discharge destination",
              "@id": "http://endhealth.info/im#hasDischargeDestination",
            },
            type: {
              name: "Discharge destination",
              "@id": "http://endhealth.info/im#921000252109",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has discharge method",
              "@id": "http://endhealth.info/im#hasDischargeMethod",
            },
            type: {
              name: "Discharge method",
              "@id": "http://endhealth.info/im#731000252105",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "is component of",
              "@id": "http://endhealth.info/im#isComponentOf",
            },
            type: {
              name: "Hospital inpatient stay (record type)",
              "@id": "http://endhealth.info/im#HospitalInpatientStay",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Hospital discharge",
              "@id": "http://endhealth.info/im#411000252105",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "additional Practitioners",
              "@id": "http://endhealth.info/im#additionalPractitioners",
            },
            type: {
              name: "Practitioner in role  (record type)",
              "@id": "http://endhealth.info/im#PractitionerInRole",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "completion Status",
              "@id": "http://endhealth.info/im#completionStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "duration",
              "@id": "http://endhealth.info/im#duration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            minExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "has section",
              "@id": "http://endhealth.info/im#hasSection",
            },
            type: {
              name: "Section (structural)",
              "@id": "http://endhealth.info/im#Section",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked appointment",
              "@id": "http://endhealth.info/im#linkedAppointment",
            },
            type: {
              name: "Appointment  (record type)",
              "@id": "http://endhealth.info/im#Appointment",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked care episode",
              "@id": "http://endhealth.info/im#linkedCareEpisode",
            },
            type: {
              name: "Episode of care  (record type)",
              "@id": "http://endhealth.info/im#EpisodeOfCare",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "location",
              "@id": "http://endhealth.info/im#location",
            },
            type: {
              name: "Location  (record type)",
              "@id": "http://endhealth.info/im#Location",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "providing Organisation/ services or departments",
              "@id":
                "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "is subencounter of",
              "@id": "http://endhealth.info/im#isSubEncounterOf",
            },
            type: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#HospitalInpatientStay",
        name: "Hospital inpatient stay (record type)",
        summary: {
          name: "Hospital inpatient stay (record type)",
          iri: "http://endhealth.info/im#HospitalInpatientStay",
          description:
            "An entry describing the stay of a patient in hospital. As well as spcialised properties it has sub component encounters of admission and discharge.<p>common data model attributes for Hospital inpatient stay",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Hospital inpatient stay (record type)",
        },
        properties: [
          {
            property: {
              name: "administrative category",
              "@id": "http://endhealth.info/im#administrativeCategory",
            },
            type: {
              name: "Administrative category code (NHS DD)",
              "@id": "http://endhealth.info/im#2451000252104",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "treatment function type",
              "@id": "http://endhealth.info/im#treatmentFunctionType",
            },
            type: {
              name: "Services (qualifier value)",
              "@id": "http://snomed.info/sct#224930009",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Hospital inpatient stay",
              "@id": "http://endhealth.info/im#2551000252103",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "additional Practitioners",
              "@id": "http://endhealth.info/im#additionalPractitioners",
            },
            type: {
              name: "Practitioner in role  (record type)",
              "@id": "http://endhealth.info/im#PractitionerInRole",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "completion Status",
              "@id": "http://endhealth.info/im#completionStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "duration",
              "@id": "http://endhealth.info/im#duration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            minExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "has section",
              "@id": "http://endhealth.info/im#hasSection",
            },
            type: {
              name: "Section (structural)",
              "@id": "http://endhealth.info/im#Section",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked appointment",
              "@id": "http://endhealth.info/im#linkedAppointment",
            },
            type: {
              name: "Appointment  (record type)",
              "@id": "http://endhealth.info/im#Appointment",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked care episode",
              "@id": "http://endhealth.info/im#linkedCareEpisode",
            },
            type: {
              name: "Episode of care  (record type)",
              "@id": "http://endhealth.info/im#EpisodeOfCare",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "location",
              "@id": "http://endhealth.info/im#location",
            },
            type: {
              name: "Location  (record type)",
              "@id": "http://endhealth.info/im#Location",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "providing Organisation/ services or departments",
              "@id":
                "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "is subencounter of",
              "@id": "http://endhealth.info/im#isSubEncounterOf",
            },
            type: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#HospitalOutpatientEncounter",
        name: "Hospital outpatient encounter (record type)",
        summary: {
          name: "Hospital outpatient encounter (record type)",
          iri: "http://endhealth.info/im#HospitalOutpatientEncounter",
          description:
            "An entry describing a hospital outpatient attendance.<p>common data model attributes for Hospital outpatient encounter",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Hospital outpatient encounter (record type)",
        },
        properties: [
          {
            property: {
              name: "has attendance outcome",
              "@id": "http://endhealth.info/im#hasAttendanceOutcome",
            },
            type: {
              name: "Attendance outcome",
              "@id": "http://endhealth.info/im#2171000252103",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "has attendance status",
              "@id": "http://endhealth.info/im#hasAttendanceStatus",
            },
            type: {
              name: "Attended or not attended",
              "@id": "http://endhealth.info/im#2231000252106",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "treatment function type",
              "@id": "http://endhealth.info/im#treatmentFunctionType",
            },
            type: {
              name: "Services (qualifier value)",
              "@id": "http://snomed.info/sct#224930009",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Hospital outpatient encounter",
              "@id": "http://endhealth.info/im#2331000252104",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "additional Practitioners",
              "@id": "http://endhealth.info/im#additionalPractitioners",
            },
            type: {
              name: "Practitioner in role  (record type)",
              "@id": "http://endhealth.info/im#PractitionerInRole",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "completion Status",
              "@id": "http://endhealth.info/im#completionStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "duration",
              "@id": "http://endhealth.info/im#duration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            minExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "has section",
              "@id": "http://endhealth.info/im#hasSection",
            },
            type: {
              name: "Section (structural)",
              "@id": "http://endhealth.info/im#Section",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked appointment",
              "@id": "http://endhealth.info/im#linkedAppointment",
            },
            type: {
              name: "Appointment  (record type)",
              "@id": "http://endhealth.info/im#Appointment",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "linked care episode",
              "@id": "http://endhealth.info/im#linkedCareEpisode",
            },
            type: {
              name: "Episode of care  (record type)",
              "@id": "http://endhealth.info/im#EpisodeOfCare",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "location",
              "@id": "http://endhealth.info/im#location",
            },
            type: {
              name: "Location  (record type)",
              "@id": "http://endhealth.info/im#Location",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "providing Organisation/ services or departments",
              "@id":
                "http://endhealth.info/im#providingOrganisation_ServicesOrDepartments",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "is subencounter of",
              "@id": "http://endhealth.info/im#isSubEncounterOf",
            },
            type: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Encounter (record type)",
              "@id": "http://endhealth.info/im#Encounter",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#EpisodeOfCare",
        name: "Episode of care  (record type)",
        summary: {
          name: "Episode of care  (record type)",
          iri: "http://endhealth.info/im#EpisodeOfCare",
          description:
            "A care episode is an association between a patient and a healthcare provider during which time care is provided. The association implies that the provider has some responsibility for the provision of care during the period of time covered by the episode.<p>A care episode may be a concept that is explicitly stated. For example, GP registration is an explicit process by which the patient registers for care and in due course may be de-registered when they move elsewhere.<p>A care episode may otherwise be deduced from the data provided , usually relating to encounters. For example the acceptance of a referral or the attendance at accident and emergency provide episode of care start points. Discharge from an outpatient clinical may be used to deduce the end of a care episode.",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" },
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Episode of care  (record type)",
        },
        properties: [
          {
            property: {
              name: "patient type",
              "@id": "http://endhealth.info/im#patientType",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "initiating Referral",
              "@id": "http://endhealth.info/im#initiatingReferral",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "linked Entries",
              "@id": "http://endhealth.info/im#linkedEntries",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#Immunisation",
        name: "Immunisation  (record type)",
        summary: {
          name: "Immunisation  (record type)",
          iri: "http://endhealth.info/im#Immunisation",
          description:
            "Immunisation extends a simple observation by providing more information about the immunisation procedure and vaccine used.<p>This is a summary of immunisation, (expected to be extended)",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            { name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" },
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Immunisation  (record type)",
        },
        properties: [
          {
            property: {
              name: "manufacturer",
              "@id": "http://endhealth.info/im#manufacturer",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "reaction",
              "@id": "http://endhealth.info/im#reaction",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "vaccination procedure",
              "@id": "http://endhealth.info/im#vaccinationProcedure",
            },
            type: {
              name: "Value set Immunisations - Care connect",
              "@id": "http://endhealth.info/im#VSET_Immunisations_CareConnect",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "vaccine product",
              "@id": "http://endhealth.info/im#vaccineProduct",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "batch number",
              "@id": "http://endhealth.info/im#batchNumber",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "dose sequence",
              "@id": "http://endhealth.info/im#doseSequence",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "doses required",
              "@id": "http://endhealth.info/im#dosesRequired",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "expiry date",
              "@id": "http://endhealth.info/im#expiryDate",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#MedicationOrder",
        name: "Medication order  (record type)",
        summary: {
          name: "Medication order  (record type)",
          iri: "http://endhealth.info/im#MedicationOrder",
          description:
            "A medication order is the actual prescription for a medication item. It represents the instance of the order derived from the medication statement. It inherits MOST fields from medication and has some additional items. However, field values for the order may be different from the field values of the medication statement so they are repeated for clarity",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" },
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Medication order  (record type)",
        },
        properties: [
          {
            property: {
              name: "course type",
              "@id": "http://endhealth.info/im#courseType",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "medication",
              "@id": "http://endhealth.info/im#medication",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "order Quantity- units",
              "@id": "http://endhealth.info/im#orderQuantity-Units",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {},
          },
          {
            property: {
              name: "prescription duration",
              "@id": "http://endhealth.info/im#prescriptionDuration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "prescription duration units",
              "@id": "http://endhealth.info/im#prescriptionDurationUnits",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "additional instructions",
              "@id": "http://endhealth.info/im#additionalInstructions",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: { name: "dosage", "@id": "http://endhealth.info/im#dosage" },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "number from authorised count",
              "@id": "http://endhealth.info/im#numberFromAuthorisedCount",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "order quantity  number of units",
              "@id": "http://endhealth.info/im#orderQuantityNumberOfUnits",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#integer" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "pharmacy instructions",
              "@id": "http://endhealth.info/im#pharmacyInstructions",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#Observation",
        name: "Observation (record type)",
        summary: {
          name: "Observation (record type)",
          iri: "http://endhealth.info/im#Observation",
          description:
            "An observation is considered a type of health event that records some characteristic of the patient or some procedure performed on the patient, excluding the specialised events such as medication.<p>An observation in Discovery is much broader than an observation in FHIR. Because observations may be highly specialised, like encounters, only the generic properties are illustrated in this document.<p>The type of observation is deduced from the observation concept itself.<p>Observations may be linked at any level of nesting. In particular, tests and concept results observations are considered as 2 separate but linked observations, one for the test, the other for the result. This varies the Discovery observation model from the FHIR model that includes both test and result in the same observation.<p>For example, a blood pressure would be modelled as 3 observations as follows:<p>Observation 1Blood pressure<p>Observation 2Systolic blood pressure value= 120, part of observation 1<p>Observation 3Diastolic blood pressure value= 80, part of observation 2",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Observation (record type)",
        },
        properties: [
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#ProblemOrCondition",
        name: "Problem or condition  (record type)",
        summary: {
          name: "Problem or condition  (record type)",
          iri: "http://endhealth.info/im#ProblemOrCondition",
          description:
            'Problem is a patient and record management construct designed to help manage care. The main purposes of problem structures are to highlight significant issues and to group entries in the record to enable a narrative view categorised by a focus of care. In different care domains different terms are used such as "problem", "issue" or "need" but from a structural perspective they are the same.<p>A problem is always associated with at least one observation and therefore automatically shares its attribution.',
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Problem or condition  (record type)",
        },
        properties: [
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "anticipated duration",
              "@id": "http://endhealth.info/im#anticipatedDuration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "parent problem",
              "@id": "http://endhealth.info/im#parentProblem",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "significance",
              "@id": "http://endhealth.info/im#significance",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "description",
              "@id": "http://endhealth.info/im#description",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#Procedure",
        name: "Procedure  (record type)",
        summary: {
          name: "Procedure  (record type)",
          iri: "http://endhealth.info/im#Procedure",
          description:
            "Procedure provides more information beyond a simple observation about an operation or observation relating to the outcome of the procedure.<p>Within Discovery, unlike FHIR a complex procedure description (that includes body site, laterality, method and nature of device) is represented by a Snomed expression in the observation concept.",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            { name: "Class", "@id": "http://www.w3.org/2002/07/owl#Class" },
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Procedure  (record type)",
        },
        properties: [
          {
            property: {
              name: "complications",
              "@id": "http://endhealth.info/im#complications",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "devices used",
              "@id": "http://endhealth.info/im#devicesUsed",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "follow ups",
              "@id": "http://endhealth.info/im#followUps",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "linked problems",
              "@id": "http://endhealth.info/im#linkedProblems",
            },
            type: {
              name: "Problem or condition  (record type)",
              "@id": "http://endhealth.info/im#ProblemOrCondition",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "outcome",
              "@id": "http://endhealth.info/im#outcome",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "performed period",
              "@id": "http://endhealth.info/im#performedPeriod",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "end time",
              "@id": "http://endhealth.info/im#endTime",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Value set -  Procedures",
              "@id": "http://endhealth.info/im#VSET_Category_Procedures",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#ReferralRequestOrProcedureRequest",
        name: "Referral Request or procedure request  (record type)",
        summary: {
          name: "Referral Request or procedure request  (record type)",
          iri: "http://endhealth.info/im#ReferralRequestOrProcedureRequest",
          description:
            "A referral request or (procedure request) includes request for advice or invitation to participate in care and is not limited to conventional referrals. A referral request often precedes the encounter or care transfer that occurs subsequently. Furthermore a referral request may accompany a care transfer e.g.... a request for input from a community health professional during the discharge process. The referral type is considered as the core observation concept<p>Referral inherits attribution",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Referral Request or procedure request  (record type)",
        },
        properties: [
          {
            property: {
              name: "linked episode",
              "@id": "http://endhealth.info/im#linkedEpisode",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "priority",
              "@id": "http://endhealth.info/im#priority",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "procedure or Service type requested",
              "@id": "http://endhealth.info/im#procedureOrServiceTypeRequested",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "recipient location",
              "@id": "http://endhealth.info/im#recipientLocation",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "recipient practitioner",
              "@id": "http://endhealth.info/im#recipientPractitioner",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "recipient service or organisation",
              "@id": "http://endhealth.info/im#recipientServiceOrOrganisation",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "referral mode",
              "@id": "http://endhealth.info/im#referralMode",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "referred by type",
              "@id": "http://endhealth.info/im#referredByType",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "request Reason",
              "@id": "http://endhealth.info/im#requestReason",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "source organisation",
              "@id": "http://endhealth.info/im#sourceOrganisation",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "speciality requested",
              "@id": "http://endhealth.info/im#specialityRequested",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "referral UBRN",
              "@id": "http://endhealth.info/im#referralUbrn",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "codeable Concept",
              "@id": "http://endhealth.info/im#concept",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "effective `date",
              "@id": "http://endhealth.info/im#effectiveDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "end date",
              "@id": "http://endhealth.info/im#endDate",
            },
            type: { name: "Date time", "@id": "http://endhealth.info/im#DateTime" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: { name: "status", "@id": "http://endhealth.info/im#status" },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "practitioner",
              "@id": "http://endhealth.info/im#hasPractitioner",
            },
            type: { "@id": "http://endhealth.info/im#im:PractitionerInRole" },
            inheritedFrom: {
              name: "Patient related health event",
              "@id": "http://endhealth.info/im#PatientEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
      {
        iri: "http://endhealth.info/im#Appointment",
        name: "Appointment  (record type)",
        summary: {
          name: "Appointment  (record type)",
          iri: "http://endhealth.info/im#Appointment",
          description:
            "This is information about a particular appointment. Does not include the processes involved in slot booking itself",
          status: { name: "Active", "@id": "http://endhealth.info/im#Active" },
          scheme: { "@id": "http://endhealth.info/im#" },
          entityType: [
            { name: "Node shape", "@id": "http://www.w3.org/ns/shacl#NodeShape" },
          ],
          isDescendentOf: [],
          match: "Appointment  (record type)",
        },
        properties: [
          {
            property: {
              name: "appointment category",
              "@id": "http://endhealth.info/im#appointmentCategory",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "attendance history",
              "@id": "http://endhealth.info/im#attendanceHistory",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "attendance status",
              "@id": "http://endhealth.info/im#attendanceStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "booking history",
              "@id": "http://endhealth.info/im#bookingHistory",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "booking urgency",
              "@id": "http://endhealth.info/im#bookingUrgency",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "interaction type",
              "@id": "http://endhealth.info/im#interactionType",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "linked schedule",
              "@id": "http://endhealth.info/im#linkedSchedule",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "planned duration",
              "@id": "http://endhealth.info/im#plannedDuration",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "planned Reason",
              "@id": "http://endhealth.info/im#plannedReason",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "slot booking status",
              "@id": "http://endhealth.info/im#slotBookingStatus",
            },
            type: {
              name: "Ontological concept",
              "@id": "http://endhealth.info/im#894281000252100",
            },
            inheritedFrom: {},
          },
          {
            property: {
              name: "description",
              "@id": "http://endhealth.info/im#description",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#string" },
            inheritedFrom: {},
          },
          {
            property: {
              name: "start date and time",
              "@id": "http://endhealth.info/im#startDateTime",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#dateTime" },
            inheritedFrom: {
              name: "Workflow or scheduled event",
              "@id": "http://endhealth.info/im#WorkflowEvent",
            },
          },
          {
            property: {
              name: "end date and time",
              "@id": "http://endhealth.info/im#endDateTime",
            },
            type: { "@id": "http://www.w3.org/2001/XMLSchema#dateTime" },
            inheritedFrom: {
              name: "Workflow or scheduled event",
              "@id": "http://endhealth.info/im#WorkflowEvent",
            },
          },
          {
            property: {
              name: "patient",
              "@id": "http://endhealth.info/im#patient",
            },
            type: {
              name: "Patient (person)",
              "@id": "http://snomed.info/sct#116154003",
            },
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
          {
            property: {
              name: "has data controller",
              "@id": "http://endhealth.info/im#hasDataController",
            },
            type: {
              name: "Organisation  (record type)",
              "@id": "http://endhealth.info/im#Organisation",
            },
            minExclusive: "1",
            maxExclusive: "1",
            inheritedFrom: {
              name: "Health record entry (record type)",
              "@id": "http://endhealth.info/im#HealthRecordEntry",
            },
          },
        ],
      },
    ],
    queryBuilder: new QueryBuilder(),
    ontology: new Ontology(),
    isCardDragged: false,
  },
  mutations: {
    updateUserFiles(state, entities) {
      // state.openFiles = [...state.openFiles, file];

      // dont loaded if already loaded
      if (state.userFiles.length > 0) return;


      entities.forEach((entity: any) => {

        //any file belonging to the user
        const _userFile = {
          id: `urn:uuid:${v4()}`,
          iri: entity["@id"],
          name: entity["rdfs:label"],
          comment: entity["rdfs:comment"],
          folder: entity["im:isContainedIn"] ? entity["im:isContainedIn"] : "",
          type: entity["rdf:type"][0]["@id"],
        };

        //files after their content is fetched via service (i.e. when the user opens them)
        const _openFile = {
          ..._userFile,
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
      if (state.openFiles.length > 0 && state.activeFileIri == "") {
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
    updateOpenFiles(state, openFiles) {
      //if no active file exists, create one
      // console.log("openPQLFiles.some((file: any) => file.uuid == state.activePQLFile)", openPQLFiles.some((file: any) => file.uuid == state.activePQLFile));
      state.openFiles = openFiles;

    },
    updateActiveFileIri(state, activeFileIri) {
      state.activeFileIri = activeFileIri;
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
          entity.name = payload.data.name;
        }
      });

    },
    updateDatamodelIris(state, datamodelIris) {
      state.datamodelIris = datamodelIris;

    },
    updateEntity(state, payload) {
      //active query
      let _activeQueryIndex = -1;
      for (let i = 0; i < state.openQueries.length - 1; i++) {
        if (state.openQueries[i].id == state.activeQueryId) {
          _activeQueryIndex = i;
        }
      }

      if (_activeQueryIndex != -1) {
        _.set(state.openQueries[_activeQueryIndex], payload.propertyPath + ".name", payload.name)
        _.set(state.openQueries[_activeQueryIndex], payload.propertyPath + ".iri", payload.iri)
      }

      console.log("updated Entity with payload", payload);

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

    }
  },
  actions: {
    async loadUserData({ commit, dispatch }) {

      //example 
      const _filenames = ["userdata_profiles.json"];


      _filenames.forEach(async (filename: string) => {
        await DataService.getData(filename)
          .then(data => {
            commit("updateUserFiles", data)
            // console.log("opened file:", data);

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
    async fetchDatamodel({ commit }) {

      // hardcoded list of datamodel Iris you want to prefetch
      const datamodelIris = [
        // "http://endhealth.info/im#Activity",
        // "http://endhealth.info/im#Event",
        // "http://endhealth.info/im#Patient",
        // http://endhealth.info/im#HealthRecordEntry
        "http://endhealth.info/im#Appointment",
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

      ];

      datamodelIris.forEach(async (iri: string) => {
        commit("addDataModelItem", {
          iri: iri,
          name: "",
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
            // console.log(
            //   "Failed to get data model properties from server",
            //   err
            // );
          }
          );
        await EntityService.getEntitySummary(iri)
          .then((res) => {
            // console.log("datamodel summary fetched " + iri + " :", res.data);
            commit("updateDatamodelSummary", {
              iri: iri,
              data: res.data
            });
          })
          .catch((err) => {
            // console.log(
            //   "Failed to get data model properties from server",
            //   err
            // );
          }
          );


      });



    },
    async fetchDatamodelIris({ commit }) {
      //fetch all datamodel Iris and then metadata (properties) from IM API 
      const datamodelIris = [] as any[];
      await SearchService.oss_getDataModelAll()
        .then((res) => {
          res.data.hits.hits.forEach((entity: any) => {
            datamodelIris.push(entity._source.iri);
          });


        })
        .catch((err) => {
          console.log(
            "Failed to get data model properties from server",
            err
          );
        }
        );
      commit("updateDatamodelIris", datamodelIris);


    }
  },
  modules: {}
});
