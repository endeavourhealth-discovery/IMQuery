<template>
  <div class="suggestions flex flex-col max-h-[750px]">
    <TransitionRoot
      appear
      :show="isShown"
      as="div"
      enter="transform transition duration-[500ms]"
      enter-from="opacity-0 -translate-y-5 scale-50"
      enter-to="opacity-100  translate-y-0 scale-100"
      leave="transform duration-[500ms] transition ease-in-out"
      leave-from="opacity-100 rotate-0 scale-100"
      leave-to="opacity-0 scale-50 "
    >

      <!-- <div class="text-gray-700 text-lg font-semibold">Suggestions</div> -->

      <template v-for="(result, resultIndex) in results" :key="result.iri">
        <Suggestion
          v-if="!maxResults || resultIndex < maxResults"
          :mainEntity="mainEntity"
          :result="result"
          class="result  cursor-pointer relative  hover:scale-105  hover:mb-10 group rounded-md transition duration-300 ease-in-out appearance-none  py-3 bg-white border border-transparent border-gray-200 hover:border-gray-300 hover:shadow-md focus:border-gray-400 placeholder-gray-400  focus:outline-none dark:  dark:bg-gradient-to-r dark:border-transparent dark:from-blue-700 dark:to-sky-600 "
          :pathFilter="pathFilter"
          :showDetails="showDetails"
          @updatePreview="updatePreview"
          @updateActiveClause="updateActiveClause"
        >
        </Suggestion>
      </template>
    </TransitionRoot>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";
import QueryUtils from "@/helpers/QueryUtils";
import { TransitionRoot } from "@headlessui/vue";
import { _ } from "lodash";
import IMDefinition from "@/components/query/IMDefinition.vue";

import Suggestion from "./Suggestion.vue";

import Graph from "@/logic/Graph";

export default defineComponent({
  name: "Suggestions",
  components: { TransitionRoot, HeroIcon, Suggestion, IMDefinition },
  emits: ["openItem", "updateActiveClause"],
  props: ["results", "searchstring", "isShown", "pathFilter", "showDetails", "maxResults", "showPreview", "mainEntity"],
  data() {
    return {
      debounce: 0,
      pathData: [],
      preview: null
    };
  },
  methods: {
    updatePreview(value: any): any {
      console.log("preview", value);
      this.preview = value.data;
    },
    updateActiveClause(value: any) {
      this.$emit("updateActiveClause", value);
    },
    findPaths(iri: string): any {
      Graph.findPaths(iri);
    },
    TTIriRefs(result: any): any {
      const TTIriRefJSONPaths = [
        { text: "Entity Type", jsonPath: "entityType" },
        { text: "Scheme", jsonPath: "scheme" },
        { text: "Status", jsonPath: "status" }
      ];
      const TTIriRefs = TTIriRefJSONPaths.map((path: any) => {
        const iriRefs = _.get(result, path.jsonPath);
        return {
          ...path,
          TTIriRefs: iriRefs
        };
      });
      return TTIriRefs;
    },
    handleView(iri: string) {
      //debouncing necessary to avoid loading items twice
      this.$store.commit("updateIsLoading", true);
      clearTimeout(this.debounce);
      this.debounce = window.setTimeout(() => {
        this.$store.commit("loadFile", iri);
      }, 500);
    },
    handleEdit(iri: string) {
      alert("Coming soon. Stay tuned!");
    },
    getTypeLabel(entityTypes: any): string | null {
      const entry = ["http://www.w3.org/ns/shacl#NodeShape", "http://www.w3.org/2000/01/rdf-schema#Class"];
      const property = ["http://www.w3.org/ns/shacl#NodeShape", "http://endhealth.info/im#dataModelProperty"];
      const query = ["http://endhealth.info/im#Query"];

      if (entityTypes.some((entity: any) => entry.includes(entity["@id"]))) {
        return "Health Record Entry";
      } else if (entityTypes.some((entity: any) => property.includes(entity["@id"]))) {
        return "Property";
      } else if (entityTypes.some((entity: any) => query.includes(entity["@id"]))) {
        return "Query";
      } else {
        return null;
      }
    },
    toPrefixedIri(url: any): string | null {
      const iri = QueryUtils.toIri(url);

      return iri;
    }
  }
});
</script>

<style scoped>
.result-actions {
  /* display: none; */
  height: 0px;
  transition: height 0.2s ease-out;
}
.result:hover .result-actions {
  /* display: flex; */
  height: 20px;
}

.suggestions::-webkit-scrollbar {
  width: 8px;
}
.suggestions::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
  border-radius: 20px;
}
</style>
