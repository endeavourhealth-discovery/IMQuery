<template>
  <div :class="'query-builder'">
    <!-- header   -->
    <div class="w-full flex space-x-10 text-3xl  font-bold">
      <template v-for="tab in tabs" :key="tab.name">
        <div
          v-if="tab.visible"
          @click="activeTab = tab.name"
          :class="'transition duration-500 ease-in-out cursor-pointer' + [activeTab == tab.name ? ' text-black' : ' text-gray-500 ']"
        >
          {{ tab.name }}
        </div>
      </template>
    </div>
    <!-- header   -->
    <div v-if="activeTab == 'Search Results'">
      <Suggestions v-if="searchResult?.results?.length > 0" :results="searchResult?.results" :isShown="true" pathFilter="im:Person" :showPreview="true" />
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
  emits: ["update:modelValue"],
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
      activeTab: "Search Results",
      tabs: [
        {
          name: "Search Results",
          icon: "search",
          visible: true
        },
        {
          name: "Browse",
          icon: "pencil",
          visible: true
          // command: () => {
          //   if (this.activeClausePath.length > 0) {
          //     this.activeEditorTab = "Filter Criteria";
          //   } else {
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
