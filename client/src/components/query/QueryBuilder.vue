<template>
  <div :class="'query-builder '">
    <!-- header   -->
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
    <div class="w-full flex space-x-10 text-xl mb-6 rounded-md font-bold border-b-2 border-b--gray-700">
      <template v-for="tab in searchTabs" :key="tab.name">
        <div
          v-if="tab.visible"
          @click="searchActiveTab = tab.name"
          :class="
            'transition duration-500 ease-in-out cursor-pointer border-b-2  pb-3 relative top-1 ' +
              [searchActiveTab == tab.name ? ' text-gray-900 border-b-blue-600 ' : ' text-gray-500 border-b-0']
          "
        >
          {{ tab.name }}
        </div>
      </template>
    </div>

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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import SearchService from "@/services/SearchService";
import Suggestions from "@/components/search/Suggestions.vue";
import HeroIcon from "@/components/general/HeroIcon.vue";

export default defineComponent({
  name: "QueryBuilder",
  props: ["mainEntity", "searchResults", "searchString", "target", "modelValue"],
  emits: ["openItem", "updateActiveClause"],

  components: {
    Suggestions,
    HeroIcon
  },
  computed: {
    searchResult: {
      get(): any {
        const currentQueryIri = this.modelValue["@id"];
        let currentFile = this.$store.state.openFiles.find(file => file.iri == currentQueryIri);
        const activeClausePath = currentFile?.activeClausePath;
        const lastResult = currentFile?.searchResults.find(result => result.activeClausePath == activeClausePath);
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
    }
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
    updateActiveClause(value: any) {
      this.$emit("updateActiveClause", value);
    },
    onInput(event: any): void {
      // this.search(event.target.value);
      // this.$emit("update:modelValue", event.target.value);
    }
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
          name: "Existing Criteria",
          searchResultKey: "existingClause",
          visible: true
        },
        {
          name: "Query based Criteria",
          searchResultKey: "existingQuery",
          visible: true
        },
        {
          name: "Health Record Entry",
          searchResultKey: "nodeShape",
          visible: true
        },
        {
          name: "Property",
          searchResultKey: "property",
          visible: true
        }
      ],
      activeTab: "Add",
      tabs: [
        {
          name: "Browse",
          visible: true
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
        }
      ]
    };
  }
});
</script>

<style scoped></style>
