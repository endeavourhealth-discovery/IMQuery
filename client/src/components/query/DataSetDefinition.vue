<template>
  <div
    :class="
      'profile w-full px-5 py-5 flex flex-col mb-12 rounded-xl overflow-hidden border-gray-200 hover:border-gray-300 hover:shadow-md trasition ease-in-out duration-500 bg-gradient-to-r light bg-white hover:shadow-md border transition duration-700 ease-in-out border-gray-200'
    "
  >
    <!-- Left Side  -->
    <div class="body flex flex-col ">
      <!-- Header -->
      <div class="header flex items-center mb-5">
        <!-- Icon -->
        <div :class="' flex justify-center items-center rounded-full w-12 h-12 ml-5  text-blue-700 bg-gray-100 '">
          <svg v-if="query.match?.entityType?.name == 'Person'" xmlns="http://www.w3.org/2000/svg" :class="'h-7 w-7'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <svg
            v-else-if="query.match?.entityType?.name == 'Appointment'"
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
            v-else-if="query.match?.entityType?.name == 'Organisation'"
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
        <div :class="'select-none font-semibold text-3xl ml-4 text-gray-800'">
          {{ mainEntity?.name ? mainEntity?.name : "Search" }}
        </div>
        <!-- /Title  -->
      </div>
      <!-- Header -->
    </div>
    <!-- Subtitle  -->
    <div class="text-definition">
      <Phrase template="IncludeEntity" :object="query" path="match.entityType" valueType="TTIriRef" :highlighted="true">
        <Phrase :object="query" path="match" valueType="match" operator="and" :highlighted="true"> </Phrase>
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

// import { Profile } from "@/models/query/Query";

import _ from "lodash";

export default defineComponent({
  name: "DataSetDefinition",
  props: ["modelValue"],
  components: { Phrase },
  mounted() {
    // console.log("pronoun", Helpers.pronoun(this.query.match?.entityType?.name));
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
        return this.query.match?.entityType;
      },
      set() {}
    }
  },
  data() {
    return {
      query: this.modelValue as DataSet
    };
  }
});
</script>
