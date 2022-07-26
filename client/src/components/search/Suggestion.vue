<template>
  <div
    class="result cursor-pointer relative z-20 hover:z-30 hover:scale-105  my-4 group rounded-md transition duration-300 ease-in-out appearance-none  px-4 py-3 bg-white border border-transparent border-gray-200 hover:border-gray-300 hover:shadow-md focus:border-gray-400 placeholder-gray-400 rounded-md focus:outline-none dark:  dark:bg-gradient-to-r dark:border-transparent dark:from-blue-700 dark:to-sky-600 "
  >
    <div class="result-content relative">
      <div class="invisible group-hover:visible text-lg  flex row-col items-center">
        <div v-tooltip.bottom="result.iri" class="inline text-gray-500 dark:text-gray-300">
          <!-- {{ encodeURIComponent(result.iri) }} -->
          {{ result.iri }}
        </div>
      </div>
      <div class="text-3xl text-blue-600 dark:text-white  font-semibold">
        {{ result.name }}
        <div
          v-if="getTypeLabel(result.entityType)"
          class="inline mr-2 text-xl text-gray-700 dark:text-gray-400 font-semibold border border-gray-400 px-2 rounded-md"
        >
          {{ getTypeLabel(result.entityType) }}
        </div>
      </div>

      <div v-if="false && showDetails" class="badges inline-flex space-x-3 mt-4 relative -left-1 -top-4">
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

    <div v-if="pathFilter" class="#result-actions #invisible #group-hover:visible  ">
      <div v-if="pathData.length" class="mt-2">
        <div v-for="path in pathData" :key="path" class="flex hover:bg-blue-100 pl-2 relative -left-2 rounded-md ">
          <div class="flex w-full  py-1">
            <div v-for="(pathItem, index) in path" :key="pathItem" class="group flex-wrap">
              <div :class="'flex  text-xl hover:underline' + [index < path.length - 1 ? ' text-gray-600 font-semibold' : 'text-black font-bold']">
                <div v-if="showDetails || index % 2 == 0">
                  {{ pathItem.split(":").length ? nameFromIri(pathItem) : "" }}
                </div>
                <div v-tooltip.bottom="getToolTip(path[index])">
                  <HeroIcon
                    v-if="showDetails | (index < path.length - 1 && index % 2 == 1)"
                    class="text-blue-600 mx-2 mt-1"
                    strokewidth="3"
                    width="12"
                    height="12"
                    icon="arrow_right"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            @click="onAdd(path)"
            class="#bg-blue-600 group-hover:visible invisible text-blue-600 inline-flex  rounded-full relative  ml-2 h-9 pl-1 pr-4 pt-1  text-xl font-semibold"
          >
            <HeroIcon class="mx-2 mt-1" strokewidth="3" width="12" height="12" icon="plus" />
            Add
          </div>
        </div>
      </div>
      <div v-else class="mt-2 text-red-700 text-2xl">
        Not related to main data type
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";
import Datamodel from "@/logic/Datamodel";
import QueryUtils from "@/helpers/QueryUtils";
import { TransitionRoot } from "@headlessui/vue";
import { _ } from "lodash";

import Graph from "@/logic/Graph";

export default defineComponent({
  name: "SearchResult",
  components: { TransitionRoot, HeroIcon },
  emits: ["openItem"],
  props: ["result", "pathFilter", "showDetails", "updateActiveClause"],
  data() {
    return {
      debounce: 0,
      pathData: this.getPaths()
    };
  },
  // computed: {
  //   datamodelGraph: {
  //     get(): any {
  //       return this.$store.state.datamodelGraph.;
  //     },
  //     set({ action, payload }: any): void {
  //       this.$store.commit("datamodelGraph", {
  //         action: action,
  //         payload: payload
  //       });
  //     }
  //   }
  // },
  methods: {
    nameFromIri(iri: string): string {
      return iri
        .split(":")[1]
        .split(/(?=[A-Z])/)
        .join(" ");
    },
    onAdd(paths: string[]): void {
      // this.$emit("openItem", path);
      const newPaths = paths.map((item: string) => {
        return {
          "@id": item,
          name: this.nameFromIri(item)
        };
      });
      console.log("paths", newPaths);

      const properties = this.isEntity() ? [] : [this.result];

      const newClause = {
        "@id": "urn:uuid:07aed05b-62cc-4e62-87a2-5df95b604d87",
        pathTo: newPaths,
        entityType: this.isEntity() ? this.result : Datamodel.withProperty(this.result.iri),
        property: properties,
        displayText: "Untitled Filter Criteria"
      };
      console.log("newClause", newClause);

      this.$emit("updateActiveClause", { action: "new", data: newClause });
    },
    getToolTip(path: string): string {
      return `<span style="margin-top: 100px; font-size: 14px; font-weight: bold; ">${path}</span>`;
    },
    // isEntity(iri: string): boolean {
    //   const url = QueryUtils.toUrl(iri);
    //   console.log("url", url);
    //   return Datamodel.isEntity(url);
    // },
    getPaths(): any {
      const iris = this.datamodelIri();
      let paths = [];
      if (Array.isArray(iris)) {
        // console.log("iris", iris);
        iris.forEach(iri => {
          const p = this.findPaths(iri);
          if (p.length) paths = [...paths, ...p];
        });
      } else {
        paths = this.findPaths(iris);
      }
      // console.log("paths", paths);

      return paths;
    },
    datamodelIri(): string {
      console.log("this.result.iri", this.result.iri);
      console.log("this.toPrefixedIri(this.result.iri)", this.toPrefixedIri(this.result.iri));
      const iri = this.toPrefixedIri(this.result.iri);
      if (this.isEntity()) {
        return iri;
      } else {
        return Datamodel.withProperty(iri).map(item => item["@id"]);
      }
    },
    findPaths(iri: string): any {
      return this.$store.state.datamodelGraph.findPaths(this.pathFilter, iri);
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
    isEntity(): boolean {
      const entityTypes = this.result.entityType;
      const entry = ["http://www.w3.org/ns/shacl#NodeShape", "http://www.w3.org/2000/01/rdf-schema#Class"];
      if (entityTypes.some((entity: any) => entry.includes(entity["@id"]))) {
        return true;
      } else {
        return false;
      }
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

  transition: height 0.5s ease-out;
}
.result:hover .result-actions {
  /* display: flex; */
  /* height: 70px; */
}
.suggestions {
  max-height: 800px;
}
.suggestions::-webkit-scrollbar {
  width: 8px;
}
.suggestions::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
  border-radius: 20px;
}
</style>
