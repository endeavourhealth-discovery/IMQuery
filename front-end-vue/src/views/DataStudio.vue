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
      <div class="section-center flex w-full h-full p-3">
        <div class="inline-flex flex-col w-full h-full">
          <div v-if="openFiles.length" class="font-semibold text-lg text-black">
            Entities ({{ openFiles.length && openFiles[0]["entities"].length }})
          </div>
          <div v-else class="font-semibold text-lg text-black">
            Select a -id.json file
          </div>
          <input
            class="font-regular text-lg text-black "
            ref="upload"
            type="file"
            name="file-upload"
            accept="application/JSON"
            @change="onUploadFiles()"
          />

          <div class="font-semibold text-lg text-black mt-2 h-10 flex">
            <HorizontalNavbar v-model="activeFileView" :items="fileViews" />
          </div>
          <template v-if="openFiles.length">
            <div v-show="activeFileView == 'All Items'">
              <div class="flex flex-col file-list mt-2 ">
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
            <div v-show="activeFileView == 'Folder Hierarchy'">
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
        </div>
        <div class="inline-flex flex-col w-full h-full">
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
        </div>
      </div>
    </template>
  </div>
  <!-- /Content Wrapper -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";

import LoggerService from "@/services/LoggerService";
// import OverlayPanel from "primevue/overlaypanel";
// import Dialog from "primevue/dialog";
// import Searchbox from "@/components/search/Searchbox.vue"; //replace with autosuggest box (same size but floating + richer suggestions. This is for the dialogue)
// import HeroIcon from "@/components/search/HeroIcon.vue";
// import HorizontalTabs from "@/components/search/HorizontalTabs.vue";
// import VerticalTabs from "@/components/search/VerticalTabs.vue";
// import ProgressBar from "@/components/search/ProgressBar.vue";
import MultiSelect from "primevue/multiselect";
import SearchService from "@/services/SearchService";
// import SearchClient from "@/services/SearchClient";
// const { MeiliSearch } = require("meilisearch");
import QueryEditor from "@/components/dataset/QueryEditor.vue";
import BackgroundCards from "@/components/dataset/BackgroundCards.vue";
import ClauseItem from "@/components/dataset/ClauseItem.vue";
import VerticalButtonGroup from "@/components/dataset/VerticalButtonGroup.vue";
import HorizontalNavbar from "@/components/dataset/HorizontalNavbar.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import EntityService from "@/services/EntityService";
import ContentNav from "@/components/dataset/ContentNav.vue";
import DatasetBrowser from "@/views/DatasetBrowser.vue";
import QueryBuilder from "@/models/query/QueryBuilder";
import InputRadioButtons from "@/components/dataset/InputRadioButtons.vue";
import Network from "@/components/dataset/Network.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
// import * as IMQ  from "@/models/query/QueryBuilder";
import HierarchyTreeItem from "@/components/dataset/HierarchyTreeItem.vue";
// import ceg_smi from '@/models/query/examples/QMUL_CEG_query_library/COVID 2nd Vaccine-ld';

export default defineComponent({
  name: "DataStudio",
  components: {
    QueryEditor,
    BackgroundCards,
    // VerticalButtonGroup,
    RoundButton,
    HeroIcon,
    HorizontalNavbar,
    ContentNav,
    DatasetBrowser,
    MultiSelect,
    // SectionToggler,
    Network,
    HierarchyTreeItem
    // DataTable,
    // Column,
    // ColumnGroup,
    // ClauseItem,
    // InputRadioButtons,
  },
  data() {
    return {
      activeFileView: "All Items",
      fileViews: [
        {
          name: "All Items",
          icon: "menu",
          visible: true,
        },
        {
          name: "Folder Hierarchy",
          icon: "folder_open",
          visible: true,
        },
      ],
      nodeSize: 8,
      linkWidth: 3,
      linkDistance: 145,
      bodyStrength: -400,
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
              id: "9dcff16d-b723-4fcf-8f1d-d4dd2c9c7b9e",
              name: "where",
              group: 4,
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
  watch: {
    json(newValue) {
      console.log(JSON.parse(newValue));
    },
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
  },
  created() {
    //todo: bind updates to specific methods e.g. onLoad should trigger a new state
    // this.queryBuilder.onLoad
  },
  async mounted() {
    // await this.$store.dispatch("fetchDatamodel");
    // const _folder  = new Folder();
    // folder.load("http://endhealth.info/ceg/qry#Q_CEGQueries");
    //  (QueryBuilder.getExamples());

    await this.$store.dispatch("fetchDatamodelIris");
  },
  methods: {
    // onJSONInput(input: string): void {
    // },
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
    async onUploadFiles(event: InputEvent): Promise<void> {
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
  width: 500px;
  height: 680px;
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
</style>
