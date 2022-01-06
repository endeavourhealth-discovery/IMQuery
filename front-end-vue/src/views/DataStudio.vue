<template>
  <!-- Content Wrapper -->
  <div class="wrapper relative flex w-full h-full bg-white">
    <!-- Sidenav  -->
    <div
      class="wrapper-sidenav w-full bg-white flex flex-col align-center"
      @mouseenter="expanded = true"
      @mouseleave="expanded = false"
    >
      <div class="flex pl-3 border-right">
        <RoundButton
          :class="'button-create ' + [expanded ? ' expanded' : '']"
          :rosssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssd="
            false
          "
          :showRing="true"
          backgroundColor="blue-500"
          hoverBackgroundColor="blue-700"
          textColor="white"
          ringColor="blue-600"
          @click="activeView = 'Add'"
        >
          <HeroIcon strokewidth="3" width="22" height="22" icon="plus" />
          <div v-if="expanded" class="ml-4 font-bold text-xl">
            Create
          </div>
        </RoundButton>
      </div>

      <!-- <VerticalButtonGroup :items="availableViews" v-model="activeView" /> -->
      <!--Content Nav -->
      <ContentNav
        class="inline w-full h-full"
        :expanded="expanded"
        :items="sideNavItems"
        v-model="sideNavActiveItem"
      />
      <!-- /Content Nav -->
    </div>

    <!-- Sidenav  -->

    <BackgroundCards class="bg-wrapper hidden" />

    <template
      v-if="
        sideNavActiveItem == 'Sources' ||
          sideNavActiveItem == 'Main Data Type' ||
          sideNavActiveItem == 'Steps' ||
          sideNavActiveItem == 'Output' ||
          sideNavActiveItem == 'Save or Export' ||
          sideNavActiveItem == 'View Data'
      "
    >
      <QueryEditor
        class="section-center w-full"
        :sideNavActiveItem="sideNavActiveItem"
        @previous="handlePrevious()"
        @next="handleNext()"
      />
    </template>
    <template v-else-if="sideNavActiveItem == 'Library'">
      <DatasetBrowser class="section-center w-full"
    /></template>
    <template v-else-if="sideNavActiveItem == 'Help'">Help</template>
    <template v-else-if="sideNavActiveItem == 'View Definition'">
      <div class="section-center flex w-full h-full">
        <div class="inline-flex flex-col w-full h-full">
          <div class="font-semibold text-lg text-black text-center">
            JSON Definition
          </div>
          <textarea
            v-model="json"
            class="outline-none h-full w-full padding-text"
          ></textarea>
        </div>
        <div class="inline-flex flex-col w-full h-full">
          <div class="font-semibold text-lg text-black text-center">
            Queries
          </div>
          <div v-if="json.length" class="query-viewer padding-text">
            <div
              v-for="query in JSON.parse(json)"
              :key="query.iri"
              class=" mt-5"
            >
              <div class="font-semibold text-lg text-gray-600">
                {{ query.name }}
              </div>
              <div>
                <ClauseItem
                  :operator="query.operator"
                  :clause="query.clause"
                  :nestingCount="1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <!-- /Content Wrapper -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

import LoggerService from "@/services/LoggerService";
// import OverlayPanel from "primevue/overlaypanel";
// import Dialog from "primevue/dialog";
// import Searchbox from "@/components/search/Searchbox.vue"; //replace with autosuggest box (same size but floating + richer suggestions. This is for the dialogue)
// import HeroIcon from "@/components/search/HeroIcon.vue";
// import HorizontalTabs from "@/components/search/HorizontalTabs.vue";
// import VerticalTabs from "@/components/search/VerticalTabs.vue";
// import ProgressBar from "@/components/search/ProgressBar.vue";

import SearchService from "@/services/SearchService";
// import SearchClient from "@/services/SearchClient";
// const { MeiliSearch } = require("meilisearch");
import QueryEditor from "@/components/dataset/QueryEditor.vue";
import BackgroundCards from "@/components/dataset/BackgroundCards.vue";
import ClauseItem from "@/components/dataset/ClauseItem.vue";
import VerticalButtonGroup from "@/components/dataset/VerticalButtonGroup.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import EntityService from "@/services/EntityService";
import ContentNav from "@/components/dataset/ContentNav.vue";
import DatasetBrowser from "@/views/DatasetBrowser.vue";
import { Query, Examples } from "@/models/query/QueryBuilder";

export default defineComponent({
  name: "DataStudio",
  components: {
    QueryEditor,
    BackgroundCards,
    // VerticalButtonGroup,
    RoundButton,
    HeroIcon,
    // HorizontalNav,
    ContentNav,
    DatasetBrowser,
    ClauseItem,
  },
  data() {
    return {
      json: `[{
   "iri": "urn:uuid6d517466-813b-46a8-b848-aaf5a4fbdcbf",
   "name": "SMI Population",
   "description": "Adults 18+ with SMI",
   "type": {
     "@id": "http://endhealth.info/im#Query"
   },
   "prefix": {
     "im": "http://endhealth.info/im#",
     "rdf": "http://www.w3.org/1999/0 2/22-rdf-syntax-ns#",
     "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
     "sn": "http://snomed.info/sct#"
   },
   "operator": "AND",
   "clause": [{
     "name": "Registered with GP for GMS services on the reference date",
     "where": [{
       "entity": [{
         "var": "?patient"
       }],
       "property": [{
         "@id": "http://endhealth.info/im#inDataset"
       }],
       "filter": [{
         "in": [{
           "@id": "Q_RegisteredGMS"
         }]
       }]
     }]
   }, {
     "name": "Regular patient type and Age years >18",
     "where": [{
       "entity": [{
         "var": "?patient"
       }, {
         "@id": "isSubjectOf"
       }, {
         "var": "?reg1",
         "@id": "PatientRegistration"
       }],
       "property": [{
         "@id": "http://endhealth.info/im#patientType"
       }],
       "valueVar": "?patientType3",
       "filter": [{
         "in": [{
           "@id": "urn:uuid:b34449f7-b2b8-4d7a-bdc4-835351479901"
         }]
       }]
     }, {
       "entity": [{
         "var": "?patient"
       }],
       "property": [{
         "@id": "http://endhealth.info/im#age"
       }],
       "valueVar": "?age6",
       "filter": [{
         "argument": ["?age6", "YEAR"],
         "comparison": "greaterThanOrEqual",
         "value": "18"
       }]
     }]
   }, {
     "name": "Serious mental illness (not resolved)",
     "clause": [{
       "select": [{
         "var": "?patient"
       }, {
         "var": "?effectiveDate12"
       }],
       "where": [{
         "entity": [{
           "var": "?patient"
         }, {
           "@id": "isSubjectOf"
         }, {
           "var": "?event8",
           "@id": "Event"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#concept"
         }],
         "valueVar": "?concept10",
         "filter": [{
           "in": [{
             "@id": "urn:uuid:837c474c-f6af-4a05-83ad-7c4ee7557e11"
           }, {
             "@id": "urn:uuid:8ab86afb-94e0-45fc-9875-3d16705cf41c"
           }]
         }]
       }, {
         "entity": [{
           "var": "?event8"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#effectiveDate"
         }],
         "valueVar": "?effectiveDate12"
       }],
       "groupSort": [{
         "sortBy": "LATEST",
         "count": 1,
         "field": "?effectiveDate12",
         "groupBy": "?patient"
       }]
     }],
     "where": [{
       "entity": [{
         "var": "?event8"
       }],
       "property": [{
         "@id": "http://endhealth.info/im#concept"
       }],
       "valueVar": "?concept10",
       "filter": [{
         "in": [{
           "@id": "urn:uuid:8ab86afb-94e0-45fc-9875-3d16705cf41c"
         }]
       }]
     }]
   }],
   "select": [{
     "var": "?patient"
   }]
 }, {
   "iri": "urn:uuid40a4a1f1-b768-4db8-a8a6-6df744935d97",
   "name": "Priority 1",
   "type": {
     "@id": "http://endhealth.info/im#Query"
   },
   "prefix": {
     "im": "http://endhealth.info/im#",
     "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
     "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
     "sn": "http://snomed.info/sct#"
   },
   "operator": "AND",
   "clause": [{
     "name": "is in cohort : SMI Population",
     "where": [{
       "entity": [{
         "var": "?patient"
       }],
       "property": [{
         "@id": "http://endhealth.info/im#inDataset"
       }],
       "filter": [{
         "in": [{
           "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
         }]
       }]
     }]
   }, {
     "operator": "OR",
     "clause": [{
       "operator": "AND",
       "clause": [{
         "name": "Hypertension (not resolved)",
         "operator": "AND",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate5"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event1",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept3",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
               }, {
                 "@id": "urn:uuid:aafda1f0-02fc-45bc-bd6f-b899efe9547d"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event1"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate5"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate5",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event1"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept3",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
             }]
           }]
         }]
       }, {
         "operator": "OR",
         "clause": [{
           "name": "Latest systolic blood pressure in the last 18 months : If Office based and >140",
           "clause": [{
             "select": [{
               "var": "?patient"
             }, {
               "var": "?effectiveDate14"
             }],
             "where": [{
               "entity": [{
                 "var": "?patient"
               }, {
                 "@id": "isSubjectOf"
               }, {
                 "var": "?event8",
                 "@id": "Event"
               }],
               "property": [{
                 "@id": "http://endhealth.info/im#concept"
               }],
               "valueVar": "?concept10",
               "filter": [{
                 "in": [{
                   "@id": "urn:uuid:43ed3aa3-0e0f-4cfc-bf24-82f64c9c4582"
                 }]
               }]
             }, {
               "entity": [{
                 "var": "?patient"
               }, {
                 "@id": "isSubjectOf"
               }, {
                 "var": "?event12",
                 "@id": "Event"
               }],
               "property": [{
                 "@id": "http://endhealth.info/im#effectiveDate"
               }],
               "valueVar": "?effectiveDate14",
               "filter": [{
                 "function": {
                   "@id": "http://endhealth.info/im#TimeDifference"
                 },
                 "argument": ["MONTH", "?effectiveDate14", "$referenceDate"],
                 "comparison": "greaterThanOrEqual",
                 "value": "-18"
               }]
             }],
             "groupSort": [{
               "sortBy": "LATEST",
               "count": 1,
               "field": "?effectiveDate14",
               "groupBy": "?patient"
             }]
           }],
           "where": [{
             "entity": [{
               "var": "?event12"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept10",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:4330157f-ddbd-4159-9cc7-e0375b0b4c99"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event12"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#numericValue"
             }],
             "filter": [{
               "comparison": "greaterThanOrEqual",
               "value": "140"
             }]
           }]
         }, {
           "name": "Latest diastolic blood pressure in the last 18 months : if Office based and >90",
           "clause": [{
             "select": [{
               "var": "?patient"
             }, {
               "var": "?effectiveDate26"
             }],
             "where": [{
               "entity": [{
                 "var": "?patient"
               }, {
                 "@id": "isSubjectOf"
               }, {
                 "var": "?event20",
                 "@id": "Event"
               }],
               "property": [{
                 "@id": "http://endhealth.info/im#concept"
               }],
               "valueVar": "?concept22",
               "filter": [{
                 "in": [{
                   "@id": "urn:uuid:241c7550-e131-478c-8538-0ee6385bdf9c"
                 }]
               }]
             }, {
               "entity": [{
                 "var": "?patient"
               }, {
                 "@id": "isSubjectOf"
               }, {
                 "var": "?event24",
                 "@id": "Event"
               }],
               "property": [{
                 "@id": "http://endhealth.info/im#effectiveDate"
               }],
               "valueVar": "?effectiveDate26",
               "filter": [{
                 "function": {
                   "@id": "http://endhealth.info/im#TimeDifference"
                 },
                 "argument": ["MONTH", "?effectiveDate26", "$referenceDate"],
                 "comparison": "greaterThanOrEqual",
                 "value": "-18"
               }]
             }],
             "groupSort": [{
               "sortBy": "LATEST",
               "count": 1,
               "field": "?effectiveDate26",
               "groupBy": "?patient"
             }]
           }],
           "where": [{
             "entity": [{
               "var": "?event24"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept22",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:ed8147d9-24e1-4196-b2b8-3f7425ae14a5"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event24"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#numericValue"
             }],
             "filter": [{
               "comparison": "greaterThanOrEqual",
               "value": "90"
             }]
           }]
         }, {
           "name": "Latest systolic blood pressure in the last 18 monthsm : if home based >135",
           "clause": [{
             "select": [{
               "var": "?patient"
             }, {
               "var": "?effectiveDate38"
             }],
             "where": [{
               "entity": [{
                 "var": "?patient"
               }, {
                 "@id": "isSubjectOf"
               }, {
                 "var": "?event32",
                 "@id": "Event"
               }],
               "property": [{
                 "@id": "http://endhealth.info/im#concept"
               }],
               "valueVar": "?concept34",
               "filter": [{
                 "in": [{
                   "@id": "urn:uuid:36eb4f63-d28e-4e90-9ede-cbee1d58551b"
                 }]
               }]
             }, {
               "entity": [{
                 "var": "?patient"
               }, {
                 "@id": "isSubjectOf"
               }, {
                 "var": "?event36",
                 "@id": "Event"
               }],
               "property": [{
                 "@id": "http://endhealth.info/im#effectiveDate"
               }],
               "valueVar": "?effectiveDate38",
               "filter": [{
                 "function": {
                   "@id": "http://endhealth.info/im#TimeDifference"
                 },
                 "argument": ["MONTH", "?effectiveDate38", "$referenceDate"],
                 "comparison": "greaterThanOrEqual",
                 "value": "-18"
               }]
             }],
             "groupSort": [{
               "sortBy": "LATEST",
               "count": 1,
               "field": "?effectiveDate38",
               "groupBy": "?patient"
             }]
           }],
           "where": [{
             "entity": [{
               "var": "?event36"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept34",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:c945de2c-9b76-4404-b8f7-103266b1b137"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event36"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#numericValue"
             }],
             "filter": [{
               "comparison": "greaterThanOrEqual",
               "value": "135"
             }]
           }]
         }, {
           "name": "Latest diastolic blood pressure in the last 18 months a: if home based and >85",
           "clause": [{
             "select": [{
               "var": "?patient"
             }, {
               "var": "?effectiveDate50"
             }],
             "where": [{
               "entity": [{
                 "var": "?patient"
               }, {
                 "@id": "isSubjectOf"
               }, {
                 "var": "?event44",
                 "@id": "Event"
               }],
               "property": [{
                 "@id": "http://endhealth.info/im#concept"
               }],
               "valueVar": "?concept46",
               "filter": [{
                 "in": [{
                   "@id": "urn:uuid:83661482-667f-4b8d-8735-aaa82790e86c"
                 }]
               }]
             }, {
               "entity": [{
                 "var": "?patient"
               }, {
                 "@id": "isSubjectOf"
               }, {
                 "var": "?event48",
                 "@id": "Event"
               }],
               "property": [{
                 "@id": "http://endhealth.info/im#effectiveDate"
               }],
               "valueVar": "?effectiveDate50",
               "filter": [{
                 "function": {
                   "@id": "http://endhealth.info/im#TimeDifference"
                 },
                 "argument": ["MONTH", "?effectiveDate50", "$referenceDate"],
                 "comparison": "greaterThanOrEqual",
                 "value": "-18"
               }]
             }],
             "groupSort": [{
               "sortBy": "LATEST",
               "count": 1,
               "field": "?effectiveDate50",
               "groupBy": "?patient"
             }]
           }],
           "where": [{
             "entity": [{
               "var": "?event48"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept46",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:9bbc735b-2403-43f2-8fe1-494da702c333"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event48"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#numericValue"
             }],
             "filter": [{
               "comparison": "greaterThanOrEqual",
               "value": "85"
             }]
           }]
         }, {
           "name": "No blood pressure in the last 18 months",
           "notExist": true,
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event56",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept58",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:a5b51359-b31b-4893-8d1b-98b4f5c1c817"
               }]
             }]
           }, {
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event60",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate62",
             "filter": [{
               "function": {
                 "@id": "http://endhealth.info/im#TimeDifference"
               },
               "argument": ["MONTH", "?effectiveDate62", "$referenceDate"],
               "comparison": "greaterThanOrEqual",
               "value": "-18"
             }]
           }]
         }]
       }]
     }, {
       "operator": "AND",
       "clause": [{
         "name": "Diabetes (not resolved)",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate68"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event64",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept66",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:4ecec7ee-f42f-4418-acc3-ba4f16264c95"
               }, {
                 "@id": "urn:uuid:bd8458fb-abb7-469b-91e5-ce888b5b0f3d"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event64"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate68"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate68",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event64"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept66",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:4ecec7ee-f42f-4418-acc3-ba4f16264c95"
             }]
           }]
         }]
       }, {
         "name": "Latest HBA1C in the last 18 months : if >59",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate75"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event71",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept73",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:a903cde4-68af-433b-9fa0-0ce292d906b3"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event71"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate75"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate75",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event71"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#numericValue"
           }],
           "filter": [{
             "comparison": "greaterThanOrEqual",
             "value": "59"
           }]
         }]
       }]
     }, {
       "operator": "AND",
       "clause": [{
         "name": "Latest QRisk2 or Qrisk 3, : if >10",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate82"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event78",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept80",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:c7ca8edd-dd0f-4b2c-b17b-3abcc9951641"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event78"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate82"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate82",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event78"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#numericValue"
           }],
           "filter": [{
             "comparison": "greaterThanOrEqual",
             "value": "10"
           }]
         }]
       }, {
         "name": "Not on statins in the last 6 months",
         "notExist": true,
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med85",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#medication"
           }],
           "valueVar": "?medication87",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:5d985d56-1a49-44a9-ac83-961e34a8838d"
             }]
           }]
         }, {
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med89",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate91",
           "filter": [{
             "function": {
               "@id": "http://endhealth.info/im#TimeDifference"
             },
             "argument": ["MONTH", "?effectiveDate91", "$referenceDate"],
             "comparison": "greaterThanOrEqual",
             "value": "-6"
           }]
         }]
       }]
     }, {
       "operator": "AND",
       "clause": [{
         "name": "? What are these clinical concepts",
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?event93",
             "@id": "Event"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept95",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:22575230-a13e-431d-983c-3fee668bf452"
             }, {
               "@id": "urn:uuid:8aa2198a-efca-4d1a-9bcf-1fd6117ef87d"
             }, {
               "@id": "urn:uuid:1ee3788a-0e92-4a69-890a-0b5daff494b4"
             }, {
               "@id": "urn:uuid:8a030be6-be7a-49eb-b187-6575dfdd32c0"
             }]
           }]
         }]
       }, {
         "notExist": true,
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med97",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#medication"
           }],
           "valueVar": "?medication99",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:705b717b-880c-402b-aed8-f76cdb561fa2"
             }]
           }]
         }, {
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med101",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate103",
           "filter": [{
             "function": {
               "@id": "http://endhealth.info/im#TimeDifference"
             },
             "argument": ["MONTH", "?effectiveDate103", "$referenceDate"],
             "comparison": "greaterThanOrEqual",
             "value": "-6"
           }]
         }]
       }]
     }, {
       "operator": "AND",
       "clause": [{
         "name": "Cardiovascular disease (not resolved)",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate109"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event105",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept107",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:b8e618ac-9a75-40d7-a3f9-698c94c6591c"
               }, {
                 "@id": "urn:uuid:8717d642-5703-444d-8985-de8e5d1a3a06"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event105"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate109"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate109",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event105"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept107",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:8717d642-5703-444d-8985-de8e5d1a3a06"
             }]
           }]
         }]
       }, {
         "name": "Latest CHA2DS2-VASc and if >2",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate116"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event112",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept114",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:797a3f50-a95d-41a5-a4a5-21c5ccd87fa8"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event112"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate116"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate116",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event112"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#numericValue"
           }],
           "filter": [{
             "comparison": "greaterThanOrEqual",
             "value": "2"
           }]
         }]
       }, {
         "name": "Not on Warfarin,Edoxaban,Dabigatranm Apixaban,Rivaroxaban,Phenindione,Acenocoumarol, in the last 6 months",
         "notExist": true,
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med119",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#medication"
           }],
           "valueVar": "?medication121",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:44254378-a46d-4d21-9da9-710098583301"
             }]
           }]
         }, {
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med123",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate125",
           "filter": [{
             "function": {
               "@id": "http://endhealth.info/im#TimeDifference"
             },
             "argument": ["MONTH", "?effectiveDate125", "$referenceDate"],
             "comparison": "greaterThanOrEqual",
             "value": "-6"
           }]
         }]
       }]
     }, {
       "operator": "AND",
       "clause": [{
         "name": "Latest BMI : if >30",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate131"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event127",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept129",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:aefeba01-d292-406d-8d02-15790430d61f"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event127"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate131"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate131",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event127"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#numericValue"
           }],
           "filter": [{
             "comparison": "greaterThanOrEqual",
             "value": "30"
           }]
         }]
       }, {
         "name": "On Olanzapine, Clozapine in the last 6 months",
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med134",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#medication"
           }],
           "valueVar": "?medication136",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:d15c85e6-00c7-4ef0-aecd-169b82acfb96"
             }]
           }]
         }, {
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med138",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate140",
           "filter": [{
             "function": {
               "@id": "http://endhealth.info/im#TimeDifference"
             },
             "argument": ["MONTH", "?effectiveDate140", "$referenceDate"],
             "comparison": "greaterThanOrEqual",
             "value": "-6"
           }]
         }]
       }]
     }, {
       "operator": "AND",
       "clause": [{
         "name": "Latest BMI : if >27.5",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate146"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event142",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept144",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:f36f7b3e-1689-4d59-865d-4f4f6954f74c"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event142"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate146"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate146",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event142"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#numericValue"
           }],
           "filter": [{
             "comparison": "greaterThanOrEqual",
             "value": "27.5"
           }]
         }]
       }, {
         "name": "On Olanzapine, Clozapine in the last 6 months",
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med149",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#medication"
           }],
           "valueVar": "?medication151",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:ea022cb8-a544-4789-a4c6-68a84d4337e6"
             }]
           }]
         }, {
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med153",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate155",
           "filter": [{
             "function": {
               "@id": "http://endhealth.info/im#TimeDifference"
             },
             "argument": ["MONTH", "?effectiveDate155", "$referenceDate"],
             "comparison": "greaterThanOrEqual",
             "value": "-6"
           }]
         }]
       }, {
         "name": "Asian or chinese",
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?event157",
             "@id": "Event"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept159",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:726d11dd-c26f-4c8e-89a1-aa1102fba5ca"
             }]
           }]
         }]
       }]
     }, {
       "operator": "AND",
       "clause": [{
         "name": "Type 1 Diabetes",
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?event161",
             "@id": "Event"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept163",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:5a0192fd-27ea-4b30-8f8d-db17ab89284a"
             }]
           }]
         }]
       }, {
         "name": "Age years >18",
         "where": [{
           "entity": [{
             "var": "?patient"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#age"
           }],
           "valueVar": "?age166",
           "filter": [{
             "argument": ["?age166", "YEAR"],
             "comparison": "greaterThanOrEqual",
             "value": "18"
           }]
         }]
       }, {
         "name": "On Atorvastin, Rosuvastin, Pravastin,Fluvastin,Simvastin in the last 6 months",
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med168",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#medication"
           }],
           "valueVar": "?medication170",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:bc8ff12e-54d7-4f34-bc1c-6f5fc9465ee0"
             }]
           }]
         }, {
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med172",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate174",
           "filter": [{
             "function": {
               "@id": "http://endhealth.info/im#TimeDifference"
             },
             "argument": ["MONTH", "?effectiveDate174", "$referenceDate"],
             "comparison": "greaterThanOrEqual",
             "value": "-6"
           }]
         }]
       }]
     }, {
       "operator": "AND",
       "clause": [{
         "name": "Latest various Diabetes illnesses and if a subset of these",
         "clause": [{
           "select": [{
             "var": "?patient"
           }, {
             "var": "?effectiveDate180"
           }],
           "where": [{
             "entity": [{
               "var": "?patient"
             }, {
               "@id": "isSubjectOf"
             }, {
               "var": "?event176",
               "@id": "Event"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#concept"
             }],
             "valueVar": "?concept178",
             "filter": [{
               "in": [{
                 "@id": "urn:uuid:b31d668d-47d2-4859-82f6-1fc3d927389a"
               }]
             }]
           }, {
             "entity": [{
               "var": "?event176"
             }],
             "property": [{
               "@id": "http://endhealth.info/im#effectiveDate"
             }],
             "valueVar": "?effectiveDate180"
           }],
           "groupSort": [{
             "sortBy": "LATEST",
             "count": 1,
             "field": "?effectiveDate180",
             "groupBy": "?patient"
           }]
         }],
         "where": [{
           "entity": [{
             "var": "?event176"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept178",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:339cb893-1c82-449d-93ab-e24d4ab4fd97"
             }]
           }]
         }]
       }, {
         "name": "Age years >40",
         "where": [{
           "entity": [{
             "var": "?patient"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#age"
           }],
           "valueVar": "?age184",
           "filter": [{
             "argument": ["?age184", "YEAR"],
             "comparison": "greaterThanOrEqual",
             "value": "40"
           }]
         }]
       }, {
         "name": "On Atorvastin, Rosuvastin, Pravastin,Fluvastin,Simvastin in the last 6 months",
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med186",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#medication"
           }],
           "valueVar": "?medication188",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:858923e7-d77e-419a-8a1e-f1b9e2646cb1"
             }]
           }]
         }, {
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?med190",
             "@id": "MedicationOrder"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate192",
           "filter": [{
             "function": {
               "@id": "http://endhealth.info/im#TimeDifference"
             },
             "argument": ["MONTH", "?effectiveDate192", "$referenceDate"],
             "comparison": "greaterThanOrEqual",
             "value": "-6"
           }]
         }]
       }]
     }]
   }],
   "select": [{
     "var": "?patient"
   }]
 }, {
   "iri": "urn:uuidfe469cf2-84f3-4b03-a2f5-96223ae78dfd",
   "name": "Priority 2",
   "type": {
     "@id": "http://endhealth.info/im#Query"
   },
   "prefix": {
     "im": "http://endhealth.info/im#",
     "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
     "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
     "sn": "http://snomed.info/sct#"
   },
   "operator": "AND",
   "clause": [{
     "name": "is in cohort : SMI Population",
     "where": [{
       "entity": [{
         "var": "?patient"
       }],
       "property": [{
         "@id": "http://endhealth.info/im#inDataset"
       }],
       "filter": [{
         "in": [{
           "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
         }]
       }]
     }]
   }, {
     "clause": [{
       "name": "is in cohort : Priority 1",
       "notExist": true,
       "where": [{
         "entity": [{
           "var": "?patient"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#inDataset"
         }],
         "filter": [{
           "in": [{
             "@id": "urn:uuid:40a4a1f1-b768-4db8-a8a6-6df744935d97"
           }]
         }]
       }]
     }]
   }],
   "select": [{
     "var": "?patient"
   }]
 }, {
   "iri": "urn:uuid6d4abdbb-d278-4675-a98d-c340967daee6",
   "name": "Priority 3a",
   "type": {
     "@id": "http://endhealth.info/im#Query"
   },
   "prefix": {
     "im": "http://endhealth.info/im#",
     "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
     "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
     "sn": "http://snomed.info/sct#"
   },
   "operator": "AND",
   "clause": [{
     "name": "is in cohort : SMI Population",
     "where": [{
       "entity": [{
         "var": "?patient"
       }],
       "property": [{
         "@id": "http://endhealth.info/im#inDataset"
       }],
       "filter": [{
         "in": [{
           "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
         }]
       }]
     }]
   }, {
     "operator": "OR",
     "clause": [{
       "name": "Hypertension (not resolved)",
       "clause": [{
         "select": [{
           "var": "?patient"
         }, {
           "var": "?effectiveDate5"
         }],
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?event1",
             "@id": "Event"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept3",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
             }, {
               "@id": "urn:uuid:aafda1f0-02fc-45bc-bd6f-b899efe9547d"
             }]
           }]
         }, {
           "entity": [{
             "var": "?event1"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate5"
         }],
         "groupSort": [{
           "sortBy": "LATEST",
           "count": 1,
           "field": "?effectiveDate5",
           "groupBy": "?patient"
         }]
       }],
       "where": [{
         "entity": [{
           "var": "?event1"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#concept"
         }],
         "valueVar": "?concept3",
         "filter": [{
           "in": [{
             "@id": "urn:uuid:be880ad6-5dab-48c2-8e94-d5c5219afb4f"
           }]
         }]
       }]
     }, {
       "name": "Diabetes (not resolved)",
       "clause": [{
         "select": [{
           "var": "?patient"
         }, {
           "var": "?effectiveDate12"
         }],
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?event8",
             "@id": "Event"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept10",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:4ecec7ee-f42f-4418-acc3-ba4f16264c95"
             }, {
               "@id": "urn:uuid:bd8458fb-abb7-469b-91e5-ce888b5b0f3d"
             }]
           }]
         }, {
           "entity": [{
             "var": "?event8"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate12"
         }],
         "groupSort": [{
           "sortBy": "LATEST",
           "count": 1,
           "field": "?effectiveDate12",
           "groupBy": "?patient"
         }]
       }],
       "where": [{
         "entity": [{
           "var": "?event8"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#concept"
         }],
         "valueVar": "?concept10",
         "filter": [{
           "in": [{
             "@id": "urn:uuid:4ecec7ee-f42f-4418-acc3-ba4f16264c95"
           }]
         }]
       }]
     }, {
       "where": [{
         "entity": [{
           "var": "?patient"
         }, {
           "@id": "isSubjectOf"
         }, {
           "var": "?event15",
           "@id": "Event"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#concept"
         }],
         "valueVar": "?concept17",
         "filter": [{
           "in": [{
             "@id": "urn:uuid:22575230-a13e-431d-983c-3fee668bf452"
           }, {
             "@id": "urn:uuid:8aa2198a-efca-4d1a-9bcf-1fd6117ef87d"
           }, {
             "@id": "urn:uuid:1ee3788a-0e92-4a69-890a-0b5daff494b4"
           }, {
             "@id": "urn:uuid:8a030be6-be7a-49eb-b187-6575dfdd32c0"
           }]
         }]
       }]
     }, {
       "where": [{
         "entity": [{
           "var": "?patient"
         }, {
           "@id": "isSubjectOf"
         }, {
           "var": "?event19",
           "@id": "Event"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#concept"
         }],
         "valueVar": "?concept21",
         "filter": [{
           "in": [{
             "@id": "urn:uuid:15bd20c8-c92f-496c-8560-896299a632e5"
           }, {
             "@id": "urn:uuid:c97f55a2-fe6e-4da2-8865-a95b7cc80f4f"
           }]
         }]
       }]
     }, {
       "name": "- Latest BMI >35",
       "clause": [{
         "select": [{
           "var": "?patient"
         }, {
           "var": "?effectiveDate27"
         }],
         "where": [{
           "entity": [{
             "var": "?patient"
           }, {
             "@id": "isSubjectOf"
           }, {
             "var": "?event23",
             "@id": "Event"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#concept"
           }],
           "valueVar": "?concept25",
           "filter": [{
             "in": [{
               "@id": "urn:uuid:849eaf4e-55ef-40b7-be7b-1d95f56abee2"
             }]
           }]
         }, {
           "entity": [{
             "var": "?event23"
           }],
           "property": [{
             "@id": "http://endhealth.info/im#effectiveDate"
           }],
           "valueVar": "?effectiveDate27"
         }],
         "groupSort": [{
           "sortBy": "LATEST",
           "count": 1,
           "field": "?effectiveDate27",
           "groupBy": "?patient"
         }]
       }],
       "where": [{
         "entity": [{
           "var": "?event23"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#numericValue"
         }],
         "filter": [{
           "comparison": "greaterThanOrEqual",
           "value": "35"
         }]
       }]
     }]
   }, {
     "operator": "NOTOR",
     "clause": [{
       "name": "is in cohort : Priority 1",
       "notExist": true,
       "where": [{
         "entity": [{
           "var": "?patient"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#inDataset"
         }],
         "filter": [{
           "in": [{
             "@id": "urn:uuid:40a4a1f1-b768-4db8-a8a6-6df744935d97"
           }]
         }]
       }]
     }, {
       "name": "is in cohort : Priority 2",
       "notExist": true,
       "where": [{
         "entity": [{
           "var": "?patient"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#inDataset"
         }],
         "filter": [{
           "in": [{
             "@id": "urn:uuid:fe469cf2-84f3-4b03-a2f5-96223ae78dfd"
           }]
         }]
       }]
     }]
   }],
   "select": [{
     "var": "?patient"
   }]
 }, {
   "iri": "urn:uuid3f04bc73-fb03-4d50-bae4-49a866ad5033",
   "name": "Priority 3b",
   "type": {
     "@id": "http://endhealth.info/im#Query"
   },
   "prefix": {
     "im": "http://endhealth.info/im#",
     "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
     "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
     "sn": "http://snomed.info/sct#"
   },
   "operator": "AND",
   "clause": [{
     "name": "is in cohort : SMI Population",
     "where": [{
       "entity": [{
         "var": "?patient"
       }],
       "property": [{
         "@id": "http://endhealth.info/im#inDataset"
       }],
       "filter": [{
         "in": [{
           "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
         }]
       }]
     }]
   }, {
     "operator": "NOTOR",
     "clause": [{
       "name": "is in cohort : Priority 1",
       "notExist": true,
       "where": [{
         "entity": [{
           "var": "?patient"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#inDataset"
         }],
         "filter": [{
           "in": [{
             "@id": "urn:uuid:40a4a1f1-b768-4db8-a8a6-6df744935d97"
           }]
         }]
       }]
     }, {
       "name": "is in cohort : Priority 2",
       "notExist": true,
       "where": [{
         "entity": [{
           "var": "?patient"
         }],
         "property": [{
           "@id": "http://endhealth.info/im#inDataset"
         }],
         "filter": [{
           "in": [{
             "@id": "urn:uuid:fe469cf2-84f3-4b03-a2f5-96223ae78dfd"
           }]
         }]
       }]
     }]
   }],
   "select": [{
     "var": "?patient"
   }]
 }]`,
      expanded: false,
      showBackgroundCards: true,
      activeFileIndex: 0,
      activeView: "Edit",
      availableViews: [
        {
          id: "ba793059-b5b1-457a-84a9-32f3d2c4800b",
          index: 0,
          name: "Home",
          title: "Home",
          icon: "home",
          visible: true,
        },
        {
          id: "9ea69a5e-14ea-43bd-ad99-b5f67f10447c",
          index: 1,
          name: "Edit",
          title: "Open Editor",
          icon: "pencil",
          visible: true,
        },
        {
          id: "ffa2a3ac-b819-4378-89b8-cf7299cf559c",
          index: 2,
          name: "View",
          title: "View Data",
          icon: "cube_transparent",
          visible: true,
        },
        {
          id: "4fc82f08-18e4-49e4-91f9-061e87521b0c",
          index: 3,
          name: "Search",
          title: "Search This Document",
          icon: "search",
          visible: false,
        },
        {
          id: "90f245fb-cafe-43d0-8c72-bb1b685ebaf5",
          index: 4,
          name: "Suggestions",
          title: "See Suggestions",
          icon: "light_bulb",
          visible: false,
        },
        {
          id: "b6f0fbdc-3632-4eda-9801-83c6951169f6",
          index: 5,
          name: "Help",
          title: "Get Help",
          icon: "question_mark_circle",
          visible: true,
        },
        {
          id: "34f406e9-5784-4c1e-8f8e-52352a63aeba",
          index: 6,
          name: "Settings",
          title: "Change Settings",
          icon: "cog",
          visible: false,
        },
      ],
      sideNavActiveItem: "View Definition",
      sideNavItems: [
        {
          id: "074b7d3e-2519-4bed-bdf4-84f90f46de46",
          name: "Library",
          icon: "search",
          visible: true,
          children: [],
        },
        {
          id: "d8108f1f-61e8-4d88-a0a1-59aa122b5725",
          name: "View Definition",
          icon: "menu_alt_1",
          visible: true,
          children: [],
          seperator: false,
        },
        {
          id: "dbb23c7f-7f8a-4457-ad60-9096e9de3eb7",
          name: "Get Help",
          icon: "question_mark_circle",
          visible: true,
          children: [],
          seperator: true,
        },
        {
          id: "65308e3e-a381-4c3b-b41a-08a674a35531",
          name: "Sources",
          icon: "office_building",
          visible: true,
          children: [],
        },
        {
          id: "ac43dd48-3bf8-4be9-87fb-045c1f245277",
          name: "Main Data Type",
          icon: "collection",
          visible: true,
          children: [],
        },
        {
          id: "1cece6bf-2bf5-448b-b3c3-3c578ce4412b",
          name: "Steps",
          icon: "template",
          visible: true,
          children: [],
        },
        {
          id: "af92a57b-9d1e-45db-a783-eaaf00970e23",
          name: "Output",
          icon: "cube",
          visible: true,
          children: [],
        },
        {
          id: "c813a2cb-2edd-4e42-a1d0-097e68a941e6",
          name: "Save or Export",
          icon: "download",
          visible: true,
          children: [],
        },
        {
          id: "b160ce1e-1bd3-4172-914a-ea127af6a756",
          name: "View Data",
          icon: "cube_transparent",
          visible: true,
          children: [],
        },
      ],
      isLoading: false,
    };
  },
  watch: {
    json(newValue) {
      console.log(JSON.parse(newValue));
    },
  },
  async mounted() {
    // const dataset = new Query(Examples.QOF_CHD005 as Query);
    // console.log(dataset.name);
    // await this.$store.dispatch("fetchDatamodel");
    await this.$store.dispatch("fetchDatamodelIris");
    // console.log("datamodel fetched: ", this.$store.state.datamodel);
    let qry = `CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o} LIMIT 10`


    await this.graphSearch(qry);
  },
  methods: {
    // onJSONInput(input: string): void {
    // },
    async getEntitySummary(iri: string): Promise<any> {
      await EntityService.getEntitySummary(iri)
        .then((res) => {
          // console.log("summary fetched " + iri + " :", res.data);
          this.$store.state.datamodel.map((entity: any) => {
            if ((entity.iri = iri)) {
              entity.summary = res.data;
            }
          });

          return res.data;
        })
        .catch((err) => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get data model properties from server",
              err
            )
          );
        });
    },
    async graphSearch(sparqlQueryString: string): Promise<any> {
      await SearchService.graphdb_search(sparqlQueryString)
        .then((res) => {
          console.log("graphsearch complete: ", res);
        })
        .catch((err) => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get data model properties from server",
              err
            )
          );
        });
    },

    handlePrevious(): void {
      for (let i = 4; i < this.sideNavItems.length; i++) {
        if (this.sideNavItems[i].name == this.sideNavActiveItem) {
          this.sideNavActiveItem = this.sideNavItems[i - 1].name;
        }
      }
    },
    handleNext(): void {
      for (let i = 3; i < this.sideNavItems.length - 1; i++) {
        if (this.sideNavItems[i].name == this.sideNavActiveItem) {
          this.sideNavActiveItem = this.sideNavItems[i + 1].name;
          return;
        }
      }
    },
  },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.section-center {
  /* position: absolute; */
  /* margin-left: 10px; */
  /* margin-top: 15px; */
  /* margin-right: 15px; */
  /* bottom: 15px; */
  margin-left: 60px;
  width: 100%;
  /* max-width: 1000px; */
  /* box-shadow: rgb(207 210 218) 0px 0px 6px; */ /* lighter shadow   */
  /* box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.3); */
  border-right: 1px solid #ecefed;
}

.border-right {
  border-right: 1px solid #ecefed;
  /* box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3); */
}

.wrapper-sidenav {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60px;
  z-index: 999;
}

.wrapper-sidenav:hover {
  width: 250px;
}

.section-right {
  width: 400px;
}

.border-bottom {
  border-bottom: 1px solid #ecefed;
}

.section-right-nav {
  /* height: 80px; */
}

.button-create {
  height: 40px;
  width: 40px;
  margin: 20px 0 20px 0;
  border-radius: 50%;
  justify-content: start !important;
  padding-left: 8px;
}

.button-create.expanded {
  width: 125px;
  border-radius: 20px;
}

.query-viewer {
  /* padding-bottom: 150px; */
  overflow-y: auto;
  font-size: 14px !important;
}

::-webkit-scrollbar {
  width: 10px;
}

:-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
}

::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  /* outline: 1px solid slategrey; */
}
.padding-text {
  padding: 20px 10px 150px 10px;
}
</style>
