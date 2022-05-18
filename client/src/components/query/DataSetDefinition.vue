<template>
  <div
    :class="
      'definition w-full pt-5 flex flex-col mb-12 rounded-xl overflow-hidden dark:border-transparent hover:shadow-md trasition ease-in-out duration-500 bg-gradient-to-r bg-white border border-gray-300 transition duration-700 ease-in-out hover:border-gray-300 ' +
        [edit ? 'edit #bg-blue-700 #border-blue-500 #border-1 ' : ' border-gray-200 ']
    "
  >
    <!-- Left Side  -->
    <div :class="'flex flex-col border-b transition duration-500 ease-in-out ' + [edit ? '#border-b-blue-500 ' : 'border-b-gray-300']">
      <!-- Header -->
      <div :class="'header flex items-center justify-between mb-5 pr-5 '">
        <div>
          <!-- Icon -->
          <div
            :class="
              ' inline-flex justify-center items-center rounded-full w-12 h-12 ml-5    ' + [false ? 'bg-transparent text-white' : ' bg-gray-100 text-black']
            "
          >
            <svg
              v-if="query.select?.entityType?.name == 'Person'"
              xmlns="http://www.w3.org/2000/svg"
              :class="'h-7 w-7'"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <svg
              v-else-if="query.select?.entityType?.name == 'Appointment'"
              xmlns="http://www.w3.org/2000/svg"
              :class="'h-7 w-7'"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="query.select?.entityType?.name == 'Organisation'"
              xmlns="http://www.w3.org/2000/svg"
              :class="'h-7 w-7'"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                clip-rule="evenodd"
              />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" :class="'h-7 w-7'" viewBox="0 0 20 20" fill="transparent" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <!-- /Icon -->
          <!-- Title  -->
          <div :class="'inline-flex select-none font-semibold text-3xl ml-4 text-gray-800' + [false ? ' text-white' : '']">
            {{ mainEntity?.name ? mainEntity?.name : "Search" }}
          </div>
          <!-- /Title  -->
        </div>

        <ToggleButton v-model="edit" onLabel="Stop Editing" offLabel="Edit" onIcon="pi pi-times" offIcon="pi pi-pencil" />
      </div>
      <!-- Header -->
    </div>
    <!-- Subtitle  -->
    <div class="bg-white px-5 py-5">
      <Phrase template="IncludeEntity" :object="query" path="select.entityType" valueType="TTIriRef" :highlighted="true" :edit="edit">
        <Phrase :object="query" path="select.filter" valueType="filter" operator="and" :highlighted="true" :edit="edit"> </Phrase>
      </Phrase>
    </div>
    <!-- /Subtitle  -->

    <!-- Left Side  -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DataSet } from "../../models/sets/DataSet";
import { Helpers } from "../../models/text/Helpers";
import Phrase from "./Phrase.vue";

// import DraggableClause from "./DraggableClause.vue";
// import TextDefinition from "./TextmodelValue.vue";

import ToggleButton from "";

// import { Profile } from "@/models/query/Query";

import _ from "lodash";

export default defineComponent({
  name: "DataSetDefinition",
  props: ["modelValue"],
  components: { Phrase },
  mounted() {
    // console.log("pronoun", Helpers.pronoun(this.query.select?.entityType?.name));
  },

  methods: {
    get(object: any, path: string): any {
      return _.get(object, path);
    }
  },
  watch: {
    modelValue(value: any) {
      this.query = value as DataSet;
    }
  },
  computed: {
    mainEntity: {
      get() {
        return this.query.select?.entityType;
      },
      set() {}
    }
  },
  data() {
    return {
      edit: false,
      query: this.modelValue,
    };
  }
});
</script>

<style scoped>
.definition::-webkit-scrollbar{
  width: 8px;
}
.definition::-webkit-scrollbar-thumb {
  background-color: #94a3b8; 
  border-radius: 20px;
}

.definition,
.references {
  max-width: 600px;

  overflow-y: auto;
  min-width: 300px;
  max-height: 530px;
}

/* .reference {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; 
  -webkit-box-orient: vertical;
} */

.body {
  padding: 10px;
}

.definition .body ::-webkit-scrollbar,
.definition .profile-clause::-webkit-scrollbar,
.definition .references::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 20px;
}

.definition .body {
  max-height: 600px;
}
</style>
