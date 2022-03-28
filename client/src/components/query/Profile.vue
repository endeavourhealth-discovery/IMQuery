<template>
  <div :class="'profile w-full px-5 py-5 flex  mb-12 rounded-xl overflow-hidden bg-gradient-to-r ' + themeClasses[theme].background">
    <!-- Left Side  -->
    <div class="flex flex-col">
      <!-- Header -->
      <div class="flex items-center mb-5">
        <!-- Icon -->
        <div :class="' flex justify-center items-center rounded-full w-12 h-12 ml-5  ' + themeClasses[theme].icon">
          <svg v-if="modelValue.mainEntity['rdfs:label'] == 'Person'" xmlns="http://www.w3.org/2000/svg" :class="'h-7 w-7'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <svg
            v-else-if="modelValue.mainEntity['rdfs:label'] == 'Appointment'"
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
            v-else-if="modelValue.mainEntity['rdfs:label'] == 'Organisation'"
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
        <!-- Icon -->

        <!-- Main Entity  -->
        <div :class="'select-none font-semibold text-3xl ml-4 ' + themeClasses[theme].text">
          {{ profile.mainEntity ? profile.mainEntity["rdfs:label"] : "Search Profile" }}
        </div>
        <!-- Main Entity  -->

        <div class="flex-grow"></div>
      </div>
      <!-- Header -->

      <!-- definitionTree  -->
      <button
        type="button"
        :class="
          'profile-clause w-full transition duration-500 ease-in-out py-2 px-2 text-sm font-medium  rounded-lg  outline-none ' +
            themeClasses[theme].bodyBackground
        "
      >
        <DraggableClause
        :activeClausePath="activeClausePath"
          :themeClasses="themeClasses"
          :theme="theme"
          v-if="definitionTree"
          :class="'draggable-clause pl-7 py-2 pr-1 '"
          @viewClause="viewClause"
          :siblingCount="definitionTree.length"
          :profile="profile"
          :definitionTree="definitionTree"
          :children="definitionTree"
        />
      </button>
      <!-- definitionTree  -->
    </div>
    <!-- Left Side  -->

    <!-- right side  -->
    <div v-if="this.activeClausePath " class="flex flex-col">
      <!-- Header -->
      <div :class="'select-none font-semibold text-3xl' + themeClasses[theme].text">
       Criteria  
      </div>
      <!-- Header -->
      <TextDefinition v-if="templates.length > 0" :children="templates[0]" :activeClausePath="activeClausePath" :theme="theme" :themeClasses="themeClasses" class="w-full h-full"/>
        


      <!-- Text Templates  -->
      
      <!-- Text Templates  -->
    </div>
    <!-- right side  -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DraggableClause from "./DraggableClause.vue";
import TextDefinition from "./TextDefinition.vue";

import { Profile } from "@/models/query/Query";

import _ from "lodash";

export default defineComponent({
  name: "Profile",
  props: ["theme", "modelValue", "activeClausePath"],
  components: {
    TextDefinition,
    DraggableClause,
    
  },
  methods: {
    loadData(data: any) {
      // if (typeOf )
      console.log("data", data);
      return data;
    },
    viewClause(value: string) {
      // alert(value);
      console.log("value", value);

      return;
      // console.log("value", value)
    }
  },
  watch: {
    activeClausePath() {
      this.templates  = this.profile ? this.profile.toTemplates(this.activeClausePath) : null;
      console.log("_templates", this.templates );
    }
  },
  computed: {
    definitionTree: {
      get(): any {
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
      templates: [] as any[],
      profile: this.modelValue, // optional _.cloneDeep(),
      // definitionTree: this.data ? this.loadData(this.data) : null,
      themeClasses: {
        light: {
          phrases: {reference: "text-blue-700 font-bold hover:underline"},
          background: " bg-white hover:shadow-sm hover:bg-gray-50 border transition duration-700 ease-in-out border-gray-200",
          text: " text-gray-800",
          icon: " text-blue-700 bg-gray-100",
          bodyClasses: " text-black",
          bodyBackground: " ",
          connectorOutline: true
        },
        blue: {
          phrases: {reference: "text-blue-700 font-bold hover:underline"},
          background: " to-sky-500 from-blue-600",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        },
        purple: {
          phrases: {reference: "text-blue-700 font-bold hover:underline"},
          background: " to-purple-600 via-indigo-700 from-indigo-600",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black  bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        },
        green: {
          phrases: {reference: "text-blue-700 font-bold hover:underline"},
          background: " from-cyan-600 to-green-500",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black  bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        },
        orange: {
          phrases: {reference: "text-blue-700 font-bold hover:underline"},
          background: " to-amber-400 from-orange-500",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black  bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        },
        pink: {
          phrases: {reference: "text-blue-700 font-bold hover:underline"},
          background: " from-pink-500 to-rose-500",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black  bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        }
      }
    };
  }
});
</script>
<style scoped>
.profile {
  /* max-width: 1000px; */
}
</style>
