<template>
  <!-- <div
    class="result cursor-pointer relative z-20 hover:z-30 hover:scale-105  my-4 group rounded-md transition duration-300 ease-in-out appearance-none  px-4 py-3 bg-white border border-transparent border-gray-200 hover:border-gray-300 hover:shadow-md focus:border-gray-400 placeholder-gray-400 rounded-md focus:outline-none dark:  dark:bg-gradient-to-r dark:border-transparent dark:from-blue-700 dark:to-sky-600 "
  > -->
  <!-- <div v-if="isEntity(result.entityType) || isProperty(result.entityType)"> -->
  <template v-if="isEntity(result) || isProperty(result)">
    <div
      v-if="pathData.length"
      class="result group cursor-pointer z-10 hover:z-30 bg-white #hover:bg-white relative  hover:scale-105   transition duration-300 ease-in-out appearance-none  px-4 py-3  border border-transparent border-gray-200 hover:border-gray-300 hover:shadow-md focus:border-gray-400 placeholder-gray-400 rounded-md focus:outline-none dark:  dark:bg-gradient-to-r dark:border-transparent #dark:from-blue-700 #dark:to-sky-600 "
      @mouseenter="onEnter()"
      @mouseleave="onLeave()"
    >
      <div class="result-content group relative ">
        <div class="invisible group-hover:visible text-lg  flex row-col items-center ">
          <div v-tooltip.bottom="result.iri" class="inline text-gray-500 dark:text-gray-300">
            <!-- {{ encodeURIComponent(result.iri) }} -->
            {{ result.iri }}
          </div>
        </div>
        <div class="text-3xl text-blue-600 dark:text-white  font-semibold">
          {{ result.name }}
          <div v-if="getTypeLabel(result)" class="inline mr-2 text-xl text-gray-700 dark:text-gray-400 font-semibold border border-gray-400 px-2 rounded-md">
            {{ getTypeLabel(result) }}
          </div>
        </div>
      </div>

      <!-- Paths  -->
      <div v-if="pathFilter" class="#result-actions #invisible #group-hover:visible    ">
        <div v-if="pathData.length" class="mt-2">
          <div
            v-for="path in pathData"
            :key="path"
            @mouseenter="onPreview(path)"
            @click="onCreate(path)"
            class="flex hover:bg-blue-100 pl-2 relative -left-2 rounded-md "
          >
            <div class="flex w-full  py-1">
              <div v-for="(pathItem, index) in path" :key="pathItem" class="group flex-wrap">
                <div :class="'flex  text-xl #hover:underline' + [index < path.length - 1 ? ' text-gray-600 font-semibold' : 'text-black font-bold']">
                  <div v-if="showDetails || index % 2 == 0">
                    {{ pathItem.split(":").length ? nameFromIri(pathItem) : "" }}
                  </div>
                  <div v-tooltip.bottom="getToolTip(path[index])">
                    <NodeIcon
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
              class="#bg-blue-600 group-hover:visible invisible text-blue-600 inline-flex  rounded-full relative  ml-2 h-9 pl-1 pr-4 pt-1  text-xl font-semibold"
            >
              <NodeIcon class="mx-2 mt-1" strokewidth="3" width="12" height="12" icon="plus" />
              Add
            </div>
          </div>
        </div>
        <div v-else class="mt-2 text-red-700 text-2xl">
          Not related to main data type
        </div>
      </div>
      <!-- Paths  -->

      <!-- Preview  -->
      <div v-if="preview.pathTo && isHover" class="mt-4 relative ">
        <div class="text-gray-500 text-xl mt-4 mb-2 font-semibold #absolute top-0 right-4">Preview</div>
        <IMDefinition :edit="false" class="clause-definition" type="clause" :modelValue="preview" :showDetails="true"> </IMDefinition>
      </div>
      <!-- Preview  -->
    </div>
  </template>
  <template v-else-if="isQuery(result) || isClause(result)">
    <div
      class="result cursor-pointer z-10 hover:z-30 bg-white #hover:bg-white relative  hover:scale-105  my-4 group transition duration-300 ease-in-out appearance-none  px-4 py-3  border border-transparent border-gray-200 hover:border-gray-300 hover:shadow-md focus:border-gray-400 placeholder-gray-400 rounded-md focus:outline-none dark:  dark:bg-gradient-to-r dark:border-transparent #dark:from-blue-700 #dark:to-sky-600 "
      @mouseenter="onEnter()"
      @mouseleave="onLeave()"
      @click="isClause(result) ? onAddClause() : null"
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
          <div v-if="getTypeLabel(result)" class="inline mr-2 text-xl text-gray-700 dark:text-gray-400 font-semibold border border-gray-400 px-2 rounded-md">
            {{ getTypeLabel(result) }}
          </div>
          <div
            v-if="isClause(result) && isHover"
            class="#bg-blue-600 group-hover:visible invisible text-blue-600  hover:bg-blue-200 inline-flex  rounded-full relative  ml-2 h-12 pl-1 pr-4 pt-1  text-2xl font-semibold"
          >
            <NodeIcon class="mx-2 mt-2" strokewidth="3" width="13" height="13" icon="plus" />
            Add
          </div>
          <div
            v-if="isQuery(result) && isHover"
            @click="viewEntity(result)"
            class="#bg-blue-600 group-hover:visible invisible text-blue-600  hover:underline inline-flex  rounded-full relative  ml-2 h-12 pl-1 pr-4 pt-1  text-2xl font-semibold"
          >
            <NodeIcon class="mx-2 mt-2" strokewidth="3" width="13" height="13" icon="external_link" />
            View Definition
          </div>
        </div>
      </div>

      <!-- Preview  -->
      <div v-if="isClause(result) && isHover" class="mt-4 relative ">
        <div class="text-gray-500 text-xl mt-4 mb-2 font-semibold #absolute top-0 right-4">Preview</div>
        <IMDefinition class="clause-definition" type="clause" :modelValue="result.matchClause" path="" :showDetails="true"> </IMDefinition>
      </div>
      <!-- Preview  -->

      <div v-else-if="isQuery(result)">
        <div class="flex #hover:bg-blue-100 pl-2 relative -left-2 rounded-md mt-5 ">
          <div
            class="#bg-blue-600 group-hover:visible invisible text-green-600  hover:bg-green-200 inline-flex  rounded-full relative  ml-2 h-12 pl-1 pr-4 pt-1  text-2xl font-semibold"
            @click="onCreate([], false)"
          >
            <NodeIcon class="mx-2 mt-2" strokewidth="3" width="13" height="13" icon="plus" />
            Include
          </div>
          <div
            class="#bg-blue-600 group-hover:visible invisible text-red-600  hover:bg-red-200 inline-flex  rounded-full relative  ml-2 h-12 pl-1 pr-4 pt-1  text-2xl font-semibold"
            @click="onCreate([], true)"
          >
            <NodeIcon class="mx-2 mt-2" strokewidth="3" width="13" height="13" icon="x" />
            Exclude
          </div>

          <div class="group-hover:visible invisible text-gray-700 font-bold text-xl ml-2 mt-2">
            {{ indefiniteArticle(mainEntity.name) }}
            {{ mainEntity.name }}
            {{ "if they were part of the results of this Query" }}
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import NodeIcon from "@/components/query/NodeIcon.vue";
import Datamodel from "@/logic/Datamodel";
import QueryUtils from "@/helpers/QueryUtils";
import { TransitionRoot } from "@headlessui/vue";
import { _ } from "lodash";
import { v4 } from "uuid";
import LoggerService from "@/services/LoggerService";

import IMDefinition from "../query/IMDefinition.vue";

import Graph from "@/logic/Graph";

export default defineComponent({
  name: "Sugggestion",
  components: { TransitionRoot, NodeIcon, IMDefinition },
  emits: ["openItem", "updatePreview"],
  props: ["result", "pathFilter", "showDetails", "updateActiveClause", "mainEntity"],
  data() {
    return {
      isHover: false,
      preview: {},
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
    indefiniteArticle(text: any) {
      if (!text || text == "") return "a";
      return ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == text.substring(0, 1).toLowerCase()) ? "an" : "a";
    },
    isQuery(entity: any): boolean {
      return QueryUtils.isQuery(entity);
    },
    isClause(entity: any): boolean {
      return QueryUtils.isClause(entity);
    },
    isEntity(entity: any): boolean {
      return QueryUtils.isEntity(entity);
    },
    isProperty(entity: any): boolean {
      return QueryUtils.isProperty(entity);
    },

    nameFromIri(iri: string): string {
      return iri != ""
        ? iri
            .split(":")[1]
            .split(/(?=[A-Z])/)
            .join(" ")
        : "";
    },
    onAddClause(): void {
      this.emitter.emit("reset-searchinput", true);

      const data = this.result?.matchClause;
      data.displayText = this.result?.name;
      this.$emit("updateActiveClause", { action: "new", path: null, data: data });
      this.$toast.add(LoggerService.success("Added Criteria to your definition. Now you can edit it or go back."));

      // this.$store.commit("updateActiveClause", { action: "new", path: null, data: this.result?.matchClause });
      // const clause = this.result.matchClause;
      // clause["@id"] = `urn:uuid:${v4()}`;
      // this.$emit("updateActiveClause", { action: "new", path: "", data: clause });
    },
    onCreate(paths?: string[], notExist?: boolean): void {
      this.emitter.emit("reset-searchinput", true);

      // console.log("paths", paths);
      // console.log("result", this.result);
      // this.$store.commit("updateActiveClause", { action: "new", path: this.path, data: this.createClause(paths) });

      if (this.isQuery(this.result)) {
        this.$emit("updateActiveClause", { action: "new", path: this.path, dataType: "entityInSet", data: this.createEntityInSet(notExist) });
      } else if (this.isEntity(this.result)) {
        this.$emit("updateActiveClause", { action: "new", path: this.path, dataType: "clause", data: this.createClause(paths) });
      } else if (this.isProperty(this.result)) {
        // direct properties (path == 1) vs datamodel properties
        if (paths?.length == 1) {
          this.$emit("updateActiveClause", { action: "new", path: this.path, dataType: "directProperty", data: this.createProperty(this.result) });
        } else {
          this.$emit("updateActiveClause", { action: "new", path: this.path, dataType: "clause", data: this.createClause(paths) });
        }
      }
      this.$toast.add(LoggerService.success("Added Criteria to your definition. Now you can edit it or go back."));
    },
    createEntityInSet(notExist?: boolean) {
      const result = {
        "@id": this.result?.iri,
        name: this.result?.name
      };

      return notExist == true
        ? {
            notExist: true,
            entityInSet: [result]
          }
        : {
            entityInSet: [result]
          };
    },
    createProperty(result: any): any {
      return {
        "@id": result.iri,
        name: result.name
      };
    },
    createClause(path: any): any {
      if (!path || path?.length == 0) {
        return {};
      }

      // this.$emit("openItem", path);
      let newPaths = path.map((item: string) => {
        return {
          "@id": item,
          name: this.nameFromIri(item)
        };
      });

      newPaths = newPaths.splice(1, path.length - 1);

      // console.log("paths", path);

      const prop = {
        "@id": this.result.iri,
        name: this.result.name
      };

      const properties = this.isEntity(this.result) ? [] : [];

      const entity = newPaths.splice(newPaths.length - 1, 1)[0];
      // console.log("entity", entity);

      const result = {
        "@id": this.result?.iri,
        name: this.result?.name
      };

      const newClause = {
        "@id": `urn:uuid:${v4()}`,
        entityType: this.isEntity(this.result) ? result : entity,
        pathTo: newPaths,
        property: this.isEntity(this.result) ? [] : _.cloneDeep([prop])
      };

      console.log("newClause", newClause);
      return _.cloneDeep(newClause);
    },
    getToolTip(path: string): string {
      return `<span style="margin-top: 100px; font-size: 14px; font-weight: bold; ">${path}</span>`;
    },
    onPreview(path: any): void {
      this.isHover = true;
      const newClause = this.createClause(path);
      console.log("newClause", newClause);
      this.preview = newClause;
      // if (this.isEntity(this.result)) {
      //   console.log("preview clause", this.createClause(path));
      //   this.preview = this.createClause(path);
      // } else if (this.isProperty(this.result)) {
      //   console.log("preview property", this.createProperty(this.result));
      //   this.preview = this.createProperty(this.result);
      // }
    },
    onEnter(): void {
      this.isHover = true;
    },
    onLeave(): void {
      this.isHover = false;
    },

    getPaths(): any {
      let iris = this.datamodelIri();
      // console.log("iris", iris);

      if (iris && Array.isArray(iris) && iris?.length > 0) {
        iris = iris.map((iri: any) => {
          return QueryUtils.toIri(iri);
        });
      }
      // console.log("iris map", iris);

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
      console.log("paths", paths);
      // console.log("paths", paths);
      this.$emit("updatePreview", { data: this.createClause(paths[0]) });
      return paths;
    },
    datamodelIri(): string {
      // console.log("this.result.iri", this.result.iri);
      // console.log("this.toPrefixedIri(this.result.iri)", this.toPrefixedIri(this.result.iri));
      const iri = this.toPrefixedIri(this.result.iri);
      if (this.isEntity(this.result)) {
        return iri;
      } else {
        // const entity = Datamodel.withProperty(iri).map(item => item["@id"]);
        const entity = this.$store.state.datamodelGraph.withProperty(iri).map(item => item["@id"]);
        // console.log("entity", entity);
        return entity;
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
    viewEntity(entity: any): void {
      const url = `https://dev.endhealth.co.uk/viewer/#/concept/${encodeURIComponent(entity?.iri)}`;
      window.open(url, "_blank").focus();
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

    getTypeLabel(entity: any): string | null {
      // const entry = ["http://www.w3.org/ns/shacl#NodeShape", "http://www.w3.org/2000/01/rdf-schema#Class"];
      // const property = ["http://www.w3.org/ns/shacl#NodeShape", "http://endhealth.info/im#dataModelProperty"];
      // const query = ["http://endhealth.info/im#Query"];
      // console.log("entity", entity);

      if (QueryUtils.isEntity(entity)) {
        return "Health Record Entry";
      } else if (QueryUtils.isClause(entity)) {
        return "Criteria";
      } else if (QueryUtils.isProperty(entity)) {
        return "Property";
      } else if (QueryUtils.isQuery(entity)) {
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
