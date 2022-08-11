<template>
  <div :class="'query-builder '">
    <!-- header   -->
    <!-- Main Tabs  -->
    <div class="w-full flex space-x-10 text-3xl mb-3 rounded-md font-bold">
      <template v-for="tab in tabs" :key="tab.name">
        <div
          v-if="tab.visible"
          @click="activeTab = tab.name"
          :class="'transition duration-500 ease-in-out cursor-pointer  pb-2 ' + [activeTab == tab.name ? ' text-black ' : ' text-gray-500']"
        >
          {{ tab.name }}
        </div>
      </template>
    </div>
    <!-- Main Tabs  -->
    <!-- Sub Tabs  -->
    <div v-if="activeTab == 'Add'" class="w-full flex space-x-10 text-xl mb-6 rounded-md font-bold border-b-2 border-b--gray-700">
      <template v-for="tab in searchTabs" :key="tab.name">
        <div
          v-if="tab.visible"
          @click="searchActiveTab = tab.name"
          :class="
            'transition duration-700 ease-in-out cursor-pointer border-b-2  pb-3 relative top-1 ' +
              [searchActiveTab == tab.name ? ' text-gray-900 border-b-blue-600 ' : ' text-gray-500 border-b-0']
          "
        >
          {{ tab.name }}
        </div>
      </template>
    </div>
    <div v-else-if="activeTab == 'Info'" class="w-full flex space-x-10 text-xl mb-6 rounded-md font-bold border-b-2 border-b--gray-700">
      <template v-for="tab in infoTabs" :key="tab.name">
        <div
          v-if="tab.visible"
          @click="infoActiveTab = tab.name"
          :class="
            'transition duration-700 ease-in-out cursor-pointer border-b-2  pb-3 relative top-1 ' +
              [infoActiveTab == tab.name ? ' text-gray-900 border-b-blue-600 ' : ' text-gray-500 border-b-0']
          "
        >
          {{ tab.name }}
        </div>
      </template>
    </div>
    <!-- Sub Tabs  -->

    <!-- header   -->

    <div v-if="activeTab == 'Add'" class="#bg-gray-50 px-2 rounded-lg h-full w-full">
      <Suggestions
        v-if="searchResult?.results?.length > 0"
        :results="getFilteredResults(searchResult)"
        :isShown="true"
        pathFilter="im:Person"
        :showPreview="true"
        :mainEntity="modelValue?.select?.entityType"
        @updateActiveClause="updateActiveClause"
      />
    </div>
    <div v-else-if="activeTab == 'Browse'" class="#bg-gray-50 px-2 rounded-lg h-full w-full">
      <!-- <SecondaryTree :conceptIri="'http://endhealth.info/im#Observation'" class="left-hierarchy" /> -->
    </div>
    <div v-else-if="activeTab == 'Info' && activePropertyInSetIri" class="#bg-gray-50 px-2 rounded-lg h-full w-full">
      <div v-if="infoActiveTab == 'Summary'">
        <Summary :iri="activePropertyInSetIri"></Summary>
      </div>
      <div v-else-if="infoActiveTab == 'Definition'">
        <SetDefinition :iri="activePropertyInSetIri"></SetDefinition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import SearchService from "@/services/SearchService";
import Suggestions from "@/components/search/Suggestions.vue";
import HeroIcon from "@/components/general/HeroIcon.vue";
import Summary from "@/components/query/Summary.vue";
import SetDefinition from "@/components/query/SetDefinition.vue";
// import SecondaryTree from "im-library";
import QueryService from "@/services/QueryService";
import _ from "lodash";

export default defineComponent({
  name: "QueryBuilder",
  props: ["mainEntity", "searchResults", "searchString", "target", "modelValue"],
  emits: ["openItem", "updateActiveClause"],

  components: {
    Suggestions,
    HeroIcon,
    Summary,
    SetDefinition
    // SecondaryTree
  },
  computed: {
    activeClausePath: {
      get(): any {
        return this.$store.state.activeClausePath;
      },
      set(val: any): void {}
    },
    activePropertyPath: {
      get(): any {
        return this.$store.state.activePropertyPath;
      },
      set(val: any): void {}
    },
    targetType: {
      get(): any {
        return this.$store.state.targetType;
      },
      set(val: any): void {}
    },
    target: {
      get(): boolean {
        return this.targetType.includes("-") ? this.targetType.split("-")[1] : "none";
      },
      set(val: boolean): void {}
    },
    activeQuery: {
      get(): any {
        return this.$store.state.queryBuilder.dataSet.get(this.$store.state.activeQueryId);
      },
      set(val: any): void {}
    },
    activeClause: {
      get(): any {
        const clause = _.get(this.activeQuery, this.activeClausePath);
        // console.log("clause selected", clause);
        return clause;
      },
      set(val: any): void {}
    },
    activeProperty: {
      get(): any {
        const prop = _.get(this.activeQuery, this.activeClausePath + "." + this.activePropertyPath);
        // console.log("property selected", prop);
        return prop;
      },
      set(val: any): void {}
    },
    activePropertyInSetIri: {
      get(): any {
        if (this.targetType == "property-inSet") {
          return _.get(this.activeProperty, "@id");
        }
      },
      set(value: any): void {
        return;
      }
    },
    searchResult: {
      get(): any {
        const currentQueryIri = this.modelValue["@id"];
        let currentFile = this.$store.state.openFiles.find(file => file.iri == currentQueryIri);

        let activeClausePath = "";
        if (currentFile?.targetType == "property-inSet") {
          activeClausePath = `${currentFile.activeClausePath}.${currentFile?.activePropertyPath}`;
        } else {
          activeClausePath = currentFile?.activeClausePath;
        }

        // console.log("activeClausePath", activeClausePath);

        const lastResult = currentFile?.searchResults.find(result => result.activeClausePath == activeClausePath);
        // console.log("lastResult", lastResult);

        return lastResult;
        //removes previous results for active path
        // let currentFile = this.$store.state.openFiles.find(file => file.iri == activeQueryId).searchResults;
        // newResults = newResults.filter(result => result.activeClausePath != activeClausePath);
        //   const activeQueryCategory =
        //   return this.$store.state.ontology;
        // },
      },
      set(value: any): void {
        return;
      }
    },
    isView: {
      get(): boolean {
        return this.$store.state.targetAction == "View";
      },
      set(value: boolean): void {
        return;
      }
    }
  },
  mounted() {
    this.emitter.on("update-searchActiveTab", (payload: any) => {
      this.searchActiveTab = payload.data;
    });
    this.emitter.on("show-infoTab", (payload: any) => {
      this.tabs[2].visible = true;
      this.activeTab = this.tabs[2].name;
    });
    this.emitter.on("hide-infoTab", (payload: any) => {
      this.tabs[2].visible = false;
      this.activeTab = this.tabs[1].name;
    });
  },
  methods: {
    updateActiveClause(value: any) {
      this.$emit("updateActiveClause", value);
    },
    getFilteredResults(searchResult: any): any {
      // console.log("searchResult", searchResult);
      const resultKey = this.searchTabs.find(tab => tab.name == this.searchActiveTab).searchResultKey;
      // console.log("resultKey", resultKey);
      return searchResult[resultKey];
    },
    onInput(event: any): void {
      // this.search(event.target.value);
      // this.$emit("update:modelValue", event.target.value);
    }
    // showAdd(): boolean {
    //   return this.searchResult?.results?.length > 0 ? true : false;
    // }
  },
  data() {
    return {
      focus: false,
      searchData: {},
      showDetails: false,
      searchActiveTab: "All",
      searchTabs: [
        {
          name: "All",
          searchResultKey: "results",
          visible: true
        },
        {
          name: "Criteria",
          searchResultKey: "existingClause",
          visible: true
        },
        {
          name: "Queries",
          searchResultKey: "existingQuery",
          visible: true
        },
        {
          name: "Health Record Types",
          searchResultKey: "nodeShape",
          visible: true
        },
        {
          name: "Properties",
          searchResultKey: "property",
          visible: true
        },
        {
          name: "Concept Set",
          searchResultKey: "conceptSet",
          visible: true
        }
      ],
      infoActiveTab: "Summary",
      infoTabs: [
        {
          name: "Summary",
          visible: true
        },
        {
          name: "Definition",
          visible: true
        }
      ],
      activeTab: "Add",
      tabs: [
        {
          name: "Browse",
          visible: false
        },
        {
          name: "Add",
          visible: true
          // command: () => {
          //   if (this.searchResult?.results?.length > 0) {
          //     this.tabs[0].visible = true;
          //   } else {
          //     this.tabs[0].visible = false;

          //     alert("Select a Filter Criteria in the Query to edit!");
          //   }
          // }
        },
        {
          name: "Info",
          visible: false
        }
      ]
    };
  }
});
</script>

<style scoped></style>
