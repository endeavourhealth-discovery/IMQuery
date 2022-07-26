<template>
  <div :class="'query-editor flex relative ' + [edit ? ' w-full #border #border-gray-300' : '']">
    <div :class="' ' + [edit ? ' border-r' : '']">
      <div class="min-w-[700px]">
        <div v-if="edit" class="flex justify-center border-y pt-2">
          <div class="flex justify-between text-2xl font-semibold text-blue-700 pl-10 border-b relative z-0">
            <span class="mx-auto border-b-2 border-b-blue-700 px-3 pb-2">{{ activeViewerTab }}</span>
          </div>
        </div>
        <div class="border-r">
          <QueryDefinition
            v-if="activeViewerTab == 'Query'"
            :modelValue="modelValue"
            :edit="edit"
            @stopEditing="stopEditing"
            @updateActiveClause="updateActiveClause"
          ></QueryDefinition>
        </div>
      </div>
      <div v-if="activeViewerTab == 'Filter Criteria'" class="pt-4">
        <div class="pl-8 -mr-20 mb-4 flex items-center">
          <button
            class="border border-gray-500 w-full max-w-[60px] px-4 py-2  rounded-full text-2xl font-bold hover:bg-gray-500 hover:text-white transition duration-500 ease-in-out"
            label="Back"
            icon="pi pi-arrow-circle-left"
            iconPos="left"
            @click.prevent="activeViewerTab = 'Query'"
          >
            {{ "Back" }}
          </button>
          <div class="text-gray-900 text-2xl font-semibold ml-6 break-words max-w-[550px]">
            {{ clauseDefinition?.displayText }}
          </div>
        </div>
        <IMDefinition class="clause-definition" type="clause" :data="modelValue" :path="activeClausePath" :showDetails="true" @updateActiveClause="updateActiveClause"> </IMDefinition>
      </div>
    </div>
    <!-- <Criteria v-show="edit"></Criteria> -->

    <div v-if="edit" class="w-full">
      <HorizontalNavbar :showIcon="true" class="border-y pt-2" v-if="edit" v-model="activeEditorTab" :items="editorTabs" />
      <div class="flex flex-col border-l pl-4 pt-4">
        <SearchInput v-if="activeEditorTab == 'Search'" v-show="edit" v-model="searchString" @update="updateActiveClause"> </SearchInput>
      </div>
      <div v-if="activeEditorTab == 'Editor'">
        Editor
      </div>
      <div v-if="activeEditorTab == 'Template'">
        Template
      </div>
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

export default defineComponent({
  name: "QueryEditor",
  components: {
    QueryDefinition,
    Criteria,
    SearchInput,
    HorizontalNavbar,
    IMDefinition
  },
  data() {
    return {
      searchString: "",
      activeViewerTab: "Query",
      activeEditorTab: "Search",
      activeClausePath: "",
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
      ]
    };
  },
  props: ["modelValue", "edit", "stopEditing"],
  emits: ["stopEditing"],
  methods: {
    updateActiveClause(payload: any): void {
      console.log("payload", payload);
      // this.tabs[1].visible = true;

      if (payload.action == "create") {
        this.$store.commit("createClause", payload);
        this.activeClausePath = payload.path + `.[${payload.index}]`;
        this.clauseDefinition = _.get(this.modelValue, payload.path + `.[${payload.index}]`);
      } else if (payload.action == "update") {
        alert("hi");

        this.$store.commit("updateActiveClausePath", payload);
      } else {
        this.activeClausePath = payload.path;
        this.clauseDefinition = _.get(this.modelValue, payload.path);
        this.activeViewerTab = "Filter Criteria";
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

/* .clause-definition.edit {
  border-width: 0;
  box-shadow: none;
} */
</style>
