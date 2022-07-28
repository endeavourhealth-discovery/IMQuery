<template>
  <div :class="'query-editor flex  justify-center relative w-full ' + [edit ? ' w-full #border #border-gray-300' : '']">
    <div :class="'w-full flex' + [edit ? ' ' : '']">
      <div class="#ml-[100px] min-w-[700px]">
        <!-- title  -->
        <!-- <div class="flex text-2xl font-semibold text-blue-700 #border-b relative z-0">
            <span class="text-3xl font-bold text-black ml-10">{{ activeViewerTab }}</span>
          </div> -->
        <div class="flex max-w-[700px]">
          <div v-if="activeViewerTab == 'Filter Criteria'" class="pt-4 mr-10 ">
            <button
              class="border border-gray-500 w-full max-w-[60px] px-4 py-2  rounded-full text-2xl font-bold hover:bg-gray-500 hover:text-white transition duration-500 ease-in-out"
              label="Back"
              @click.prevent="activeViewerTab = 'Query Definition'"
            >
              {{ "Back" }}
            </button>
          </div>
          <InputDescription class="" :description="activeViewerTab == 'Query Definition' ? inputMeta.definition : inputMeta.filterCriteria" />
          <!-- <slot name="buttons"></slot> -->
          <div class="toggle-button">
            <span> Edit Mode</span>
            <InputSwitch class="ml10" v-model="edit" />
          </div>
        </div>

        <!-- body  -->
        <div class="">
          <QueryDefinition
            v-if="activeViewerTab == 'Query Definition'"
            :modelValue="modelValue"
            :edit="edit"
            @stopEditing="stopEditing"
            @updateActiveClause="updateActiveClause"
          ></QueryDefinition>
        </div>
        <div v-if="activeViewerTab == 'Filter Criteria'" class="">
          <div class="text-gray-900 text-2xl font-semibold ml-6 break-words w-full max-w-[650px] mb-6">
            {{ clauseDefinition?.displayText }}
          </div>
          <IMDefinition
            class="clause-definition"
            type="clause"
            :data="modelValue"
            :path="activeClausePath"
            :showDetails="true"
            @updateActiveClause="updateActiveClause"
          >
          </IMDefinition>
        </div>
      </div>
    </div>
  

    <!-- <div v-if="edit" class="w-full">
      <HorizontalNavbar :underlined="true" :showIcon="true" class="border-y pt-2" v-if="edit" v-model="activeEditorTab" :items="editorTabs" />
      <div class="flex flex-col border-l pl-4 pt-4">
        <SearchInput v-if="activeEditorTab == 'Search'" v-show="edit" v-model="searchString" @update="updateActiveClause"> </SearchInput>
      </div>
      <div v-if="activeEditorTab == 'Editor'">
        Editor
      </div>
      <div v-if="activeEditorTab == 'Template'">
        Template
      </div>
    </div> -->
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

import InputDescription from "@/components/general/InputDescription.vue";

export default defineComponent({
  name: "QueryEditor",
  components: {
    QueryDefinition,
    Criteria,
    SearchInput,
    HorizontalNavbar,
    IMDefinition,
    InputDescription
  },
  data() {
    return {
      edit: this?.modelValue?.select?.match?.length > 0 ? false : true,
      searchString: "",
      activeViewerTab: "Query Definition",
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
      ],
      inputMeta: {
        definition: {
          title: `Define the features of the ${this?.modelValue?.select?.entityType.name} you are looking for                                                                                                                                                                                                                                                                                                                                                                                                                                        `,
          explanation: "Describe a criteria, property or health record ",
          placeholder: "Search for a criteria, property or health record"
        },
        filterCriteria: {
          title: "Criteria",
          explanation: "Define the criteria that your main data type must match in order to be filtered into your dataset",
          placeholder: ""
        }
      }
    };
  },
  props: ["modelValue", "stopEditing"],
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
        this.clauseDefinition = _.get(this.modelValue, payload.path);
        this.activeClausePath = payload.path;
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
