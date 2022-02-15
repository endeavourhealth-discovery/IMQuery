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
          :rounded="false"
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
      <div class="section-center flex w-full h-full p-3">
        <div class="inline-flex flex-col w-full h-full w-max-500p">
          <template v-if="openFiles.length">
            <div class="font-semibold text-lg text-black h-10 flex">
              <HorizontalNavbar v-model="activeItemView" :items="itemViews" />
            </div>
            <!-- <div class="line-separator"></div> -->
          </template>

          <template v-if="openFiles.length">
            <div class="item-view" v-show="activeItemView == 'All Items'">
              <div class="flex flex-col file-list">
                <div
                  v-for="item in getFilteredEntities()"
                  :key="item['@id']"
                  :class="
                    'file-list__item rounded-sm flex flex-col non-selectable p-2 px-3 mt-2 text-xl font-regular border hover:shadow-md hover:border-gray-300' +
                      [
                        selectedFile == item['@id']
                          ? ' border-blue-600 text-blue-600'
                          : '',
                      ]
                  "
                  @click="selectedFile = item['@id']"
                >
                  <div class="font-bold">{{ item["rdfs:label"] }}</div>
                  <div>{{ item["rdf:type"][0]["@id"].split(":")[1] }}</div>
                </div>
              </div>
              <div class="font-semibold text-lg text-black mt-2">
                Filter by type
              </div>
              <MultiSelect
                v-if="openFiles.length"
                class="w-full multi-large file-filter"
                v-model="selectedFilterTypes"
                :options="filterTypes"
                optionLabel="label"
                placeholder="Type(s)"
              />
            </div>
            <div
              class="item-view"
              v-show="activeItemView == 'Folder Hierarchy'"
            >
              <div
                v-if="queryBuilder.hierarchyTree(topLevelEntity)"
                class="left inline-flex flex-col w-full h-full"
              >
                <div
                  v-if="
                    queryBuilder.hierarchyTree(topLevelEntity).children.length
                  "
                  class="folder-viewer padding-text"
                >
                  <HierarchyTreeItem
                    :value="queryBuilder.hierarchyTree(topLevelEntity)"
                  />
                </div>
              </div>
            </div>
          </template>

          <template v-if="openFiles.length" class="">
            <!-- <div class="line-separator"></div> -->
            <div class="font-semibold text-lg text-black">
              Entities ({{
                openFiles.length && openFiles[0]["entities"].length
              }})
            </div>
          </template>
          <div v-else class="font-semibold text-lg text-black">
            Select a -id.json file
          </div>

          <input
            class="file-input font-regular text-lg text-black "
            ref="upload"
            type="file"
            name="file-upload"
            accept="application/JSON"
            content="Upload JSON file containing entities (-id)"
            @change="onUploadFiles()"
          />
          <button @click="testQuery()">Test Query</button>
        </div>
        <div class="inline-flex flex-col w-full h-full">
          <div class="h-10 w-full">
            <HorizontalNavbar
              class="w-full h-full text-center"
              :items="contentViews"
              v-model="activeContentView"
            />
          </div>

          <template v-if="activeContentView == 'Graph'">
            <Network
              class="w-full h-full bg-white"
              :nodeList="examples.gms.nodes"
              :linkList="examples.gms.links"
              :nodeSize="nodeSize"
              :linkWidth="linkWidth"
              :linkDistance="linkDistance"
              :svgTheme="svgTheme ? 'dark' : 'light'"
              :bodyStrength="bodyStrength"
              :nodeTextKey="nodeTextKey"
              :showLinkText="true"
            ></Network>
          </template>

          <template v-if="activeContentView == 'Text (rdfs:label)'">
            <!-- <button @click="test()">Click</button> -->
            <DefinitionEditor
              v-if="queryBuilder.activeProfile"
              class="p-3 w-full h-full"
              :modelValue="queryBuilder.activeProfile"
              :operatorIris="['im:and', 'im:or', 'im:not']"
              :definitionIri="'im:definition'"
            />
          </template>

          <template v-if="activeContentView == 'JSON'">
            <div class="w-full h-20 py-2">
              <InputTextbox
                v-model="jsonpath"
                class="w-max-500p mx-auto"
                type="text"
                placeholder="Paste JSONPath query here"
              />
            </div>
            <div class="flex">
              <v-ace-editor
                v-if="queryBuilder.activeProfile"
                class="inline json-viewer h-full w-full"
                v-model:value="queryBuilder.activeProfile.asString"
                lang="json"
                theme="tomorrow"
              />
              <v-ace-editor
                v-if="jsonpath && filteredJSONContent"
                class="inline json-viewer h-full w-full"
                v-model:value="filteredJSONContent"
                lang="json"
                theme="tomorrow"
              />
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
  <!-- /Content Wrapper -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import { functions_v1 as f } from "@/models/query/TemplateFunctions";

const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";

import LoggerService from "@/services/LoggerService";
import MultiSelect from "primevue/multiselect";
import SearchService from "@/services/SearchService";
import QueryEditor from "@/components/dataset/QueryEditor.vue";
import BackgroundCards from "@/components/dataset/BackgroundCards.vue";
import DefinitionEditor from "@/components/dataset/DefinitionEditor.vue";
import VerticalButtonGroup from "@/components/dataset/VerticalButtonGroup.vue";
import HorizontalNavbar from "@/components/dataset/HorizontalNavbar.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import EntityService from "@/services/EntityService";
import ContentNav from "@/components/dataset/ContentNav.vue";
import DatasetBrowser from "@/views/DatasetBrowser.vue";
import InputRadioButtons from "@/components/dataset/InputRadioButtons.vue";
import Network from "@/components/dataset/Network.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import QueryTools, { QueryBuilder } from "@/models/query/QueryTools";
import { entityTypes } from "@/models/query/OntologyTools";
import HierarchyTreeItem from "@/components/dataset/HierarchyTreeItem.vue";
import LabelView from "@/components/dataset/LabelView.vue";
import InputTextbox from "@/components/dataset/InputTextbox.vue";
const jp = require("jsonpath");
const prettier = require("prettier/standalone");
const prettierBabylon = require("prettier/parser-babylon");
import { VAceEditor } from "@/components/dataset/VAceEditor";

// import * as IMQ  from "@/models/query/QueryBuilder";
// import HeroIcon from "@/components/search/HeroIcon.vue";
// import VueJsonPretty from "vue-json-pretty";
// import "vue-json-pretty/lib/styles.css";
// import ProgressBar from "@/components/search/ProgressBar.vue";
// import OverlayPanel from "primevue/overlaypanel";
// import Dialog from "primevue/dialog";

export default defineComponent({
  name: "DataStudio",
  components: {
    QueryEditor,
    BackgroundCards,
    RoundButton,
    HeroIcon,
    HorizontalNavbar,
    ContentNav,
    DatasetBrowser,
    MultiSelect,
    Network,
    HierarchyTreeItem,
    VAceEditor,
    // LabelView,
    InputTextbox,
    DefinitionEditor,
    // VueJsonPretty
  },
  data() {
    return {
      CoreOntology: {} as any,
      filteredJSONContent: "",
      jsonpath: "",
      labelPaths: [] as any[],
      activeItemView: "Folder Hierarchy",
      itemViews: [
        {
          name: "Folder Hierarchy",
          icon: "folder_open",
          visible: true,
        },
        {
          name: "All Items",
          icon: "menu",
          visible: true,
        },
      ],
      activeContentView: "JSON",
      contentViews: [
        {
          name: "Graph",
          icon: "share",
          visible: true,
        },
        {
          name: "Text (rdfs:label)",
          icon: "translate",
          visible: true,
        },
        {
          name: "JSON",
          icon: "document",
          visible: true,
        },
      ],
      nodeSize: 8,
      linkWidth: 3,
      linkDistance: 165,
      bodyStrength: -1000,
      svgTheme: false, // false = light, true = dark
      nodeTextKey: "name",
      examples: {
        gms_separtenodes: {
          nodes: [
            {
              id: "5f7d54a0-fb79-498a-97fc-22bc8135cde4",
              name: "Patient",
              group: 1,
            },
            {
              id: "55aa377a-9f2c-4d05-b45b-7fa1063f8cc7",
              name: "GP Registration",
              group: 2,
            },
            {
              id: "57b14e08-1625-4168-ba06-2e1dc4b697f4",
              name: "Regular GMS patient",
              group: 3,
            },
            {
              id: "d09a3b13-a69e-4cb0-8bb9-e525a2470361",
              name: "is on or before 31/03/2020",
              group: 3,
            },
            {
              id: "ce5c00bb-3de4-4cd7-8c6a-8cf98c703fed",
              name: "is after 31/03/2020",
              group: 3,
            },
            {
              id: "a572d325-321a-418d-948a-8c87baaf7fd8",
              name: "does not exist",
              group: 3,
            },
            {
              id: "9dcff16d-b723-4fcf-8f1d-d4dd2c9c7b9e",
              name: "and",
              group: 4,
            },
            {
              id: "453e074a-1543-4956-bf0e-305df888993c",
              name: "or",
              group: 4,
            },
          ],
          links: [
            {
              source: "5f7d54a0-fb79-498a-97fc-22bc8135cde4",
              target: "55aa377a-9f2c-4d05-b45b-7fa1063f8cc7",
              value: "is subject of",
            },
            {
              source: "55aa377a-9f2c-4d05-b45b-7fa1063f8cc7",
              target: "9dcff16d-b723-4fcf-8f1d-d4dd2c9c7b9e",
              value: "",
            },
            {
              source: "9dcff16d-b723-4fcf-8f1d-d4dd2c9c7b9e",
              target: "57b14e08-1625-4168-ba06-2e1dc4b697f4",
              value: "patient type",
            },
            {
              source: "9dcff16d-b723-4fcf-8f1d-d4dd2c9c7b9e",
              target: "d09a3b13-a69e-4cb0-8bb9-e525a2470361",
              value: "effective date",
            },
            {
              source: "9dcff16d-b723-4fcf-8f1d-d4dd2c9c7b9e",
              target: "453e074a-1543-4956-bf0e-305df888993c",
              value: "",
            },
            {
              source: "453e074a-1543-4956-bf0e-305df888993c",
              target: "ce5c00bb-3de4-4cd7-8c6a-8cf98c703fed",
              value: "end date",
            },
            {
              source: "453e074a-1543-4956-bf0e-305df888993c",
              target: "a572d325-321a-418d-948a-8c87baaf7fd8",
              value: "end date",
            },
          ],
        },
        gms: {
          nodes: [
            {
              id: "5f7d54a0-fb79-498a-97fc-22bc8135cde4",
              name: "Patient",
              group: 1,
            },
            {
              id: "55aa377a-9f2c-4d05-b45b-7fa1063f8cc7",
              name: "GP Registration",
              group: 2,
            },
            {
              id: "57b14e08-1625-4168-ba06-2e1dc4b697f4",
              name: "Regular GMS patient",
              group: 3,
            },
            {
              id: "d09a3b13-a69e-4cb0-8bb9-e525a2470361",
              name: "before 31/03/2020",
              group: 3,
            },
            {
              id: "ce5c00bb-3de4-4cd7-8c6a-8cf98c703fed",
              name: "after 31/03/2020",
              group: 3,
            },
            {
              id: "a572d325-321a-418d-948a-8c87baaf7fd8",
              name: "non existent",
              group: 3,
            },
            {
              id: "453e074a-1543-4956-bf0e-305df888993c",
              name: " either",
              group: 4,
            },
          ],
          links: [
            {
              source: "5f7d54a0-fb79-498a-97fc-22bc8135cde4",
              target: "55aa377a-9f2c-4d05-b45b-7fa1063f8cc7",
              value: "had a",
            },
            {
              source: "55aa377a-9f2c-4d05-b45b-7fa1063f8cc7",
              target: "57b14e08-1625-4168-ba06-2e1dc4b697f4",
              value: "and its patient type is",
            },
            {
              source: "55aa377a-9f2c-4d05-b45b-7fa1063f8cc7",
              target: "d09a3b13-a69e-4cb0-8bb9-e525a2470361",
              value: " and its effective date is",
            },
            {
              source: "55aa377a-9f2c-4d05-b45b-7fa1063f8cc7",
              target: "453e074a-1543-4956-bf0e-305df888993c",
              value: "and its end date is",
            },
            {
              source: "453e074a-1543-4956-bf0e-305df888993c",
              target: "ce5c00bb-3de4-4cd7-8c6a-8cf98c703fed",
              value: "",
            },
            {
              source: "453e074a-1543-4956-bf0e-305df888993c",
              target: "a572d325-321a-418d-948a-8c87baaf7fd8",
              value: "or",
            },
          ],
        },
      },
      topLevelEntity: {
        "@id": "http://endhealth.info/ceg/qry#Q_CEGQueries",
        "rdf:type": [
          {
            "@id": "im:Folder",
          },
        ],
        "rdfs:label": "QMUL CEG query library",
        "im:isContainedIn": [
          {
            "@id": "im:QT_QueryTemplates",
          },
        ],
      },
      expandedItems: [] as any[],
      selectedFilterTypes: [] as any[],
      filterTypes: [] as any[],
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
      openFiles: [] as any[],
      selectedFile: "",
      selectedFileItems: [] as any[],
      fileItems: [] as any[],
    };
  },

  computed: {
    isLoading: {
      get(): any {
        return this.$store.state.isLoading;
      },
      set(value: any): void {
        this.$store.commit("updateIsLoading", value);
      },
    },
    queryBuilder: {
      get(): any {
        return this.$store.state.queryBuilder;
      },
      set({ action, payload }: any): void {
        this.$store.commit("queryBuilder", {
          action: action,
          payload: payload,
        });
      },
    },
    ontology: {
      get(): any {
        return this.$store.state.ontology;
      },
      set(value: any): void {
        return;
      },
    },
  },

  async mounted() {
    // await this.getAppData();
    await this.$store.dispatch("fetchDatamodelIris");
  },
  methods: {
    testQuery(): any {
  
      // console.log(
      //   "ontology",
      //   this.ontology
      // );
      // console.log(
      //   "all",
      //   this.ontology.entities
      // );
      // console.log(
      //   "entities",
      //   this.ontology.entities.byIri("im:MedicationOrder")
      // );
      // console.log(
      //   "datamodels",
      //   this.ontology.entities.byType(entityTypes.datamodel)
      // );
    },
    getFilteredEntities(): any {
      if (this.selectedFilterTypes.length) {
        return this.openFiles[0]["entities"].filter((entity: any) =>
          this.selectedFilterTypes.some(
            (selectedFilterType: any) =>
              selectedFilterType.value == entity["rdf:type"][0]["@id"]
          )
        );
      } else {
        return this.openFiles[0]["entities"];
      }
    },
    async onUploadFiles(): Promise<void> {
      const _inputElement = this.$refs.upload as HTMLInputElement;
      const _files = [...(_inputElement.files ? _inputElement.files : [])];

      this.openFiles = [];
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const json = JSON.parse(e.target.result);
        this.openFiles = [...this.openFiles, json];

        this.queryBuilder.loadJSON(e.target.result);

        this.filterTypes = this.queryBuilder.entityTypes.map((item: any) => {
          const _label =
            item.substring(0, 1) == ":"
              ? item.substring(1)
              : item.split(":")[1];

          return {
            value: item,
            label: _label,
          };
        });
      };
      fileReader.readAsText(_files[0]);
    },
    getQueries(): any {
      return this.openFiles[0]["entities"].filter(
        (entity: any) => entity["rdf:type"][0]["@id"] == "im:Query"
      );
    },
    async getAppData(): Promise<any> {
      // uses up to 5mb of localstorage of the browser
      // x-amz-version-id is Amazon S3 bucket version (feature must be enabled)
      // const isCacheSupported = "caches" in window;
      // if (isCacheSupported) {
      // const url = `${process.env.VUE_APP_ONTOLOGY_URL}/CoreOntology.json`;
      // const cacheName = "imquery-appdata";
      // create store
      // caches.open(cacheName).then((cache) => {
      //   cache.add(url).then(() => {
      //     console.log("Data cached");
      //   });
      // });
      // check response
      // caches.open(cacheName).then((cache) => {
      //   cache.match(url).then((settings: any) => {
      //     console.log(settings);
      //     fetch(settings.body)
      //       // Retrieve its body as ReadableStream
      //       .then((response) => response.body);
      //   });
      // });
      // retrieve items
      // caches.open(cacheName).then((cache) => {
      //   cache.keys().then((arrayOfRequest) => {
      //     console.log(arrayOfRequest); // [Request,  Request]
      //   });
      // });
      // } else {
      //   console.log(
      //     "Content caching is not supported in this browser. App data is fetched from CDN everytime the page is refreshed."
      //   );
      // }
      // console.log("local",, "lol"));
      // var start = Date.now();
      // await SearchService.fetchAppData()
      //   .then((res) => {
      //     // console.log("res", res);
      //     // var end = Date.now();
      //     // console.log(`Fetch time: ${end - start} ms`);
      //     return res.data;
      //   })
      //   .catch((err) => {
      //     this.$toast.add(
      //       LoggerService.error("Failed to get app data from server", err)
      //     );
      //   });
    },
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
    // async graphSearch(sparqlQueryString: string): Promise<any> {
    // await SearchService.graphdb_search(sparqlQueryString)
    //   .then((res) => {
    //     console.log("graphsearch complete: ", res);
    //   })
    //   .catch((err) => {
    //     this.$toast.add(
    //       LoggerService.error(
    //         "Failed to get data model properties from server",
    //         err
    //       )
    //     );
    //   });
    // },

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
    itemsithUUID(items: any): any {
      return items.map((item: any) => {
        return { id: "temp_" + v4(), ...items };
      });
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

.section-center .left {
  /* position: absolute; */
  /* margin-left: 10px; */
  /* margin-top: 15px; */
  /* margin-right: 15px; */
  /* bottom: 15px; */
  width: 500px;
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

.folder-viewer,
.file-list {
  /* padding-bottom: 150px; */
  overflow-y: auto;
  font-size: 12px !important;
  width: 100%;
  height: 680px;
}

.item-view {
  width: 500px;
}

.w-max-500p {
  width: 500px;
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

.file-filter {
  width: 500px;
}
.line-separator {
  height: 1px;
  border-bottom: 1px solid #d3d3d3;
}

.file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.file-input::before {
  content: "Upload JSON";
  display: inline-block;
  background: linear-gradient(top, #f9f9f9, #e3e3e3);
  border: 1px solid #d3d3d3;
  border-radius: 3px;
  padding: 5px 8px;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  cursor: pointer;
  text-shadow: 1px 1px #fff;
  font-weight: 700;
  font-size: 10pt;
}
.file-input:hover::before {
  border-color: black;
}
.file-input:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}

.json-viewer {
  height: calc(100vh - 9rem);
  width: 100%;
  overflow-y: auto;
  /* background-color: #ffffff; */
  /* border: 1px solid #dee2e6; */
}
</style>
