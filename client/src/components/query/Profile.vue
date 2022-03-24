<template>
  <div :class="'profile  w-full px-6 py-6 flex flex-col  mb-12 rounded-xl overflow-hidden bg-gradient-to-r ' + themeClasses[theme].background">
    <div class="flex items-center mb-5">
      <!-- Left  -->

      <!-- Icon -->
      <div class=" bg-black flex justify-center items-center rounded-full bg-opacity-40 w-12 h-12 ml-5 text-white">
        <svg v-if="modelValue.mainEntity.name == 'Person'" xmlns="http://www.w3.org/2000/svg" :class="'h-7 w-7'" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
        <svg
          v-else-if="modelValue.mainEntity.name == 'Appointment'"
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
          v-else-if="modelValue.mainEntity.name == 'Organisation'"
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

        <svg v-else xmlns="http://www.w3.org/2000/svg" :class="'h-7 w-7'" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <!-- Icon -->

      <!-- Main Entity  -->
      <div :class="'select-none text-white font-semibold text-3xl ml-4'">
        {{ profile.mainEntity ? profile.mainEntity.name : "Search Profile" }}
      </div>
      <!-- Main Entity  -->
      <!-- Left  -->

      <div class="flex-grow"></div>

      <!-- Right  -->
      <!-- <div class="">
        Definition
      </div> -->
      <!-- Right  -->
    </div>
    <!-- Definition  -->

    <button
      type="button"
      :class="
        'profile-clause w-full transition duration-500 ease-in-out py-2 px-3 text-sm font-medium text-white bg-black rounded-lg bg-opacity-20 hover:bg-opacity-30 outline-none'
      "
    >
      <DraggableClause
        v-if="definitionTree"
        :class="'draggable-clause mx-5'"
        @viewClause="viewClause"
        :siblingCount="definitionTree.length"
        :profile="definitionTree"
        :children="definitionTree"
      />
    </button>

    <!-- Definition  -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DraggableClause from "./DraggableClause.vue";
import { Profile } from "@/models/query/Query";

import _ from "lodash";

export default defineComponent({
  name: "Profile",
  props: ["iri", "modelValue", "theme"],
  components: {
    DraggableClause
  },
  methods: {
    loadData(data: any) {
      // if (typeOf )
      console.log("data", data);
      return data;
    },
    viewClause() {
      alert("hi");
      return;
      // console.log("value", value)
    }
  },
  computed: {
    definitionTree: {
      get(): any {
        console.log("profile", this.profile);

        // instantiate Profile if not already done (e.g. QueryBuilder.profiles provides instantiated classes
        // Profile class = UI Object Model required for displaying clauses and text templates
        if (Object.keys(this.profile).includes("_definitionTree")) {
          return this.profile.definitionTree;
        } else {
          this.profile = new Profile(this.profile);
          return this.profile.definitionTree;
        }
      },
      set({ action, payload }: any): void {
        return;
      }
    },
    queryBuilder: {
      get(): any {
        return this.$store.state.queryBuilder;
      },
      set({ action, payload }: any): void {
        this.$store.commit("queryBuilder", {
          action: action,
          payload: payload
        });
      }
    }
  },
  data() {
    return {
      profile: this.modelValue, // optional _.cloneDeep(),
      // definitionTree: this.data ? this.loadData(this.data) : null,
      themeClasses: {
        light: { background: "bg-gray-100" },
        blue: { background: "to-sky-500 from-blue-600" },
        purple: { background: "to-purple-600 via-indigo-700 from-indigo-600" },
        green: { background: "from-cyan-600 to-green-500" },
        orange: { background: "to-amber-400 from-orange-500" },
        pink: { background: "from-pink-500 to-rose-500" }
      }
    };
  }
});
</script>
<style scoped>
.profile {
  max-width: 400px;
}
</style>
