<template>
  <div
    class="result cursor-pointer relative z-20 hover:scale-105  my-4 group rounded-md transition duration-300 ease-in-out appearance-none  px-4 py-3 bg-white border border-transparent border-gray-200 hover:border-gray-300 hover:shadow-md focus:border-gray-400 placeholder-gray-400 rounded-md focus:outline-none dark:  dark:bg-gradient-to-r dark:border-transparent dark:from-blue-700 dark:to-sky-600 "
    @click="handleView(result.iri)"
  >
    <div class="result-content relative">
      <div class="text-lg  flex row-col items-center">
        <div class="inline mr-2 text-black dark:text-gray-400 font-bold">
          {{ getTypeLabel(result.entityType) + ":" }}
        </div>
        <div class="inline text-black dark:text-gray-400">
          {{ toPrefixedIri(result.iri) }}
        </div>

        <!-- <div class="inline text-black dark:text-gray-400">
              https://im.endhealth.co.uk/query/#/
            </div> -->
        <!-- <div class="inline text-gray-500 dark:text-gray-300">
              {{ encodeURIComponent(result.iri) }}
            </div> -->
      </div>
      <div class="text-3xl text-blue-600 dark:text-white  font-semibold">
        {{ result.name }}
      </div>
      <!-- <div class="text-xl text-gray-900 dark:text-gray-200 mt-2 flex">
            <div>
              {{ result.scheme.name }}
            </div>
          </div> -->
      <div class="badges inline-flex space-x-3 mt-4 relative -left-1 -top-4">
        <template v-for="(item, index) in TTIriRefs(result)">
          <div
            v-if="index > 0 && (item.TTIriRefs?.name || item.TTIriRefs[0].name)"
            class="px-1 py-1  inline-flex  text-xl text-gray-900 dark:text-gray-200 #border rounded-full #border-2 #border-gray-200 dar:border-white #bg-gray-100 dark:hover:bg-blue-900"
          >
            <div class="mr-1">•</div>
            <div class="inline-flex">
              {{ item.TTIriRefs?.name ? item.TTIriRefs?.name : item.TTIriRefs[0].name }}
            </div>
            <div v-if="item?.TTIriRefs?.length && item?.TTIriRefs?.length > 1" class="inline-flex px-2 mx-2 border rounded-full font-bold">
              {{ item?.TTIriRefs?.length }}
            </div>
          </div>
        </template>
      </div>
    </div>

  

    <div class="result-actions rounded-md flex justify-end select-none space-x-5 mr-4">
      <div
        class="invisible group-hover:visible inline-flex items-center text-2xl hover:underline font-semibold text-blue-600 dark:text-white"
        @click="handleView(result.iri)"
      >
        <HeroIcon class="mx-2" strokewidth="2" width="20" height="24" icon="eye" /> View
      </div>
      <div
        class="invisible group-hover:visible inline-flex items-center text-2xl hover:underline font-semibold text-green-600 dark:text-white"
        @click="handleEdit(result.iri)"
      >
        <HeroIcon class="mx-2" strokewidth="2" width="20" height="24" icon="pencil" /> Edit
      </div>
      <div class="invisible group-hover:visible inline-flex items-center text-2xl hover:underline font-semibold text-purple-700 dark:text-white hidden">
        <HeroIcon class="mx-2" strokewidth="2" width="20" height="24" icon="download" /> Download
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";
import QueryUtils from "@/helpers/QueryUtils";
import { TransitionRoot } from "@headlessui/vue";
import { _ } from "lodash";

import Graph from "@/logic/Graph";

export default defineComponent({
  name: "SearchResult",
  components: { TransitionRoot, HeroIcon },
  emits: ["openItem"],
  props: ["result", "pathFilter"],
  data() {
    return {
      debounce: 0,
      pathData: []
    };
  },
  methods: {
    findPaths(iri: string): any {
      return Graph.findPaths(this.pathFilter, iri);
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
</style>
