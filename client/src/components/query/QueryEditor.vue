<template>
  <div :class="'query-editor w-full flex  justify-center relative ' + [edit ? ' w-full #border #border-gray-300' : '']">
    <div :class="'w-full min-w-[700px]  flex' + [edit ? ' ' : '']">
      <div class="w-full  ">
        <!-- title  -->
        <!-- <div class="flex text-2xl font-semibold text-blue-700 #border-b relative z-0">
            <span class="text-3xl font-bold text-black ml-10">{{ activeViewerTab }}</span>
          </div> -->
        <div class="flex w-full justify-between">
          <div class=" mr-10 flex">
            <button
              v-if="activeViewerTab == 'Filter Criteria'"
              class=" border border-blue-700 w-full max-w-[60px] max-h-[40px]  px-4 py-2 mt-4  rounded-full text-2xl font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition duration-500 ease-in-out"
              label="Back"
              @click.prevent="activeViewerTab = 'Query Definition'"
            >
              {{ "Back" }}
            </button>
            <InputDescription
              class="ml-10 min-w-[300px]"
              :description="activeViewerTab == 'Query Definition' ? inputMeta.definition : inputMeta.filterCriteria"
            />
          </div>
          <div v-if="activeViewerTab == 'Query Definition'" class="inline-flex max-h-[70px] mt-3 pb-10  space-x-10">
            <button
              @click="previousQueryCategory()"
              icon="pi pi-chevron-left"
              iconPos="left"
              class="border border-blue-500 min-w-[100px] px-4 py-2  rounded-full text-2xl font-bold hover:bg-blue-600 text-blue-600 hover:text-white   transition duration-500 ease-in-out"
            >
              Previous
            </button>
            <button
              @click="nextQueryCategory()"
              icon="pi pi-chevron-right"
              class="border border-blue-600 w-full min-w-[100px] px-4 py-2  rounded-full text-2xl font-bold  hover:bg-blue-600 text-blue-600 hover:text-white     transition duration-500 ease-in-out"
            >
              Next
            </button>
          </div>
          <!-- <slot name="buttons"></slot> -->
          <!-- <div class="toggle-button">
            <span> Edit Mode</span>
            <InputSwitch class=" ml10" v-model="edit" />
          </div> -->
        </div>

        <!-- body  -->
        <QueryDefinition
          v-show="activeViewerTab == 'Query Definition'"
          :modelValue="modelValue"
          :edit="edit"
          @stopEditing="stopEditing"
          @updateActiveClause="updateActiveClause"
        ></QueryDefinition>
        <div v-show="activeViewerTab == 'Filter Criteria'">
          <!-- <div class="text-gray-900 text-2xl font-semibold ml-6 break-words w-full  mt-4 mb-4">
            {{ clauseDefinition?.displayText }}
          </div> -->
          <IMDefinition
            class="clause-definition"
            type="clause"
            :data="modelValue"
            :path="activeClausePath"
            :showDetails="true"
            @updateActiveClause="updateActiveClause"
            :edit="true"
          >
          </IMDefinition>
        </div>
      </div>
    </div>

    <div class="w-full ml-[90px]">
      <QueryBuilder :modelValue="modelValue" @updateActiveClause="updateActiveClause"></QueryBuilder>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HorizontalNavbar from "@/components/general/HorizontalNavbar.vue";

// import { QueryDefinition } from "im-library";
import SearchInput from "@/components/query/SearchInput.vue";
import QueryDefinition from "@/components/query/QueryDefinition.vue";
import IMDefinition from "@/components/query/IMDefinition.vue";
import Criteria from "@/components/query/Criteria.vue";
import _ from "lodash";
import { nextTick } from "vue";

import InputDescription from "@/components/general/InputDescription.vue";
import QueryBuilder from "@/components/query/QueryBuilder.vue";

export default defineComponent({
  name: "QueryEditor",
  components: {
    QueryDefinition,
    Criteria,
    SearchInput,
    HorizontalNavbar,
    IMDefinition,
    InputDescription,
    QueryBuilder
  },
  data() {
    return {
      edit: this?.modelValue?.select?.match?.length > 0 ? false : true,
      searchString: "",
      activeViewerTab: "Query Definition",
      activeEditorTab: "Search",
      activeClausePath: null,
      clauseDefinition: {},
      editorTabs: [
        {
          name: "Search",
          icon: "search",
          visible: true
        },
        {
          name: "Editor",
          icon: "pencil",
          visible: true
          // command: () => {
          //   if (this.activeClausePath.length > 0) {
          //     this.activeEditorTab = "Filter Criteria";
          //   } else {
          //     alert("Select a Filter Criteria in the Query to edit!");
          //   }
          // }
        },
        {
          name: "Template",
          icon: "template",

          visible: true
        }
      ],
      otherTabs: [
        {
          name: "Editor",
          icon: "search",
          // visible: this.activeClausePath.length > 0 ? true : false,
          visible: true,
          command: () => {
            if (this.activeClausePath.length > 0) {
              this.activeEditorTab = "Editor";
            } else {
              alert("Select a Search Criteria in the Viewer to edit!");
            }
          }
        },
        {
          name: "Template Builder",
          icon: "search",
          visible: true
        }
      ],
      inputMeta: {
        definition: {
          title: "Add or Create inclusion and exclusion criteria",
          explanation: "Add existing createria or create one using existing queries, health records or properties",
          placeholder: ""
        },
        filterCriteria: {
          title: "Edit Criteria Definition",
          explanation: "Define the criteria that your main data type must match in order to be filtered into your dataset",
          placeholder: ""
        }
      }
    };
  },
  props: ["modelValue", "stopEditing"],
  emits: ["stopEditing"],
  methods: {
    nextQueryCategory(): void {
      this.$store.commit("nextQueryCategory");
    },
    previousQueryCategory(): void {
      this.$store.commit("previousQueryCategory");
    },
    updateActiveClause(payload: any): void {
      console.log("#Query Editor updat ActiveClause payload:", payload);
      if (payload.action == "addTo") {
        this.$store.commit("updateActiveClause", payload);
        this.activeClausePath = this.$store.state.activeClausePath; //match[0]"; //###todo: replace with path from sugestion
        this.activeViewerTab = "Filter Criteria";
      } else if (payload.action == "new") {
        this.$store.commit("updateActiveClause", payload);
        this.activeClausePath = this.$store.state.activeClausePath; //match[0]"; //###todo: replace with path from sugestion
        // this.activeClausePath = "select.match[0]"; //###todo: replace with path from sugestion
        this.activeViewerTab = "Filter Criteria";

        // nextTick(() => {
        //   this.activeViewerTab = "Filter Criteria";
        // });
      } else if (payload.action == "delete") {
        this.$store.commit("updateActiveClausePath", payload);
      } else if (payload.action == "create") {
        this.$store.commit("createClause", payload);
        this.activeClausePath = payload.path + `.[${payload.index}]`;
        this.clauseDefinition = _.get(this.modelValue, payload.path + `.[${payload.index}]`);

        // this.$store.commit("updateActiveClausePath", this.activeClausePath);
      } else if (payload.action == "update") {
        this.$store.commit("updateActiveClausePath", payload);
      } else {
        this.clauseDefinition = _.get(this.modelValue, payload.path);
        this.activeClausePath = payload.path;
        this.activeViewerTab = "Filter Criteria";
        // console.log("payload", payload);
        this.$store.commit("updateActiveClausePath", payload);

        // this.$store.commit("updateActiveClausePath", this.activeClausePath);
      }
    },
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    }
  }
});
</script>

<style scoped>
.clause-definition {
  position: relative;
  /* width: 800px; */
  min-width: 700px;
  max-width: 700px;
  width: 100%;
  height: 100%;
  max-height: 750px;
}

.toggle-button {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;

  position: absolute;
  top: 0;
  right: 0;
  margin-right: 1rem;
  margin-top: 1rem;
}

/* .clause-definition.edit {
  border-width: 0;
  box-shadow: none;
} */
</style>
