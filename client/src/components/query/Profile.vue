<template>
  <div :class="'profile w-full px-5 py-5 flex  mb-12 rounded-xl overflow-hidden bg-gradient-to-r ' + themeClasses[theme].background">
    <!-- Left Side  -->
    <div class="body flex flex-col ">
      <!-- Header -->
      <div class="flex items-center mb-5">
        <!-- Icon -->
        <div :class="' flex justify-center items-center rounded-full w-12 h-12 ml-5  ' + themeClasses[theme].icon">
          <svg
            v-if="modelValue.mainEntity['rdfs:label'] == 'Person'"
            xmlns="http://www.w3.org/2000/svg"
            :class="'h-7 w-7'"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
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
          :activeProfile="activeProfile.uuid"
          :activeClausePath="activeProfile.activeClausePath"
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
    <div v-if="activeProfile.uuid == profile['@id']" class="pl-10 flex flex-col border-l border-l-gray-200">
      <!-- Header -->

      <div :class="'select-none flex space-x-5 font-semibold text-2xl mb-8 mt-1' + themeClasses[theme].text">
        <div
          v-for="tab in tabs"
          :key="tab.uuid"
          @click="activeTab = tab.name"
          :class="'inline rounded-md px-3 py-1' + [activeTab == tab.name ? ' text-white bg-blue-700 ' : ' text-gray-400']"
        >
          {{ tab.visible ? tab.name : "" }}
        </div>
      </div>
      <!-- Header -->
      <!-- Text Templates  -->
      <TextDefinition
        @onClick="click"
        v-if="templates.length > 0"
        v-show="activeTab == 'Criteria'"
        :children="templates[0]"
        :activeClausePath="activeProfile.activeClausePath"
        :theme="theme"
        :themeClasses="themeClasses"
        class="sticky textdefinition w-full h-full "
      />
      <!-- Text Templates  -->
      <!-- References  -->
      <div v-show="activeTab == 'References'" class="references flex-col pl-3">
        <div
          @click="click(reference.entityData)"
          v-for="reference in profile.entityReferences"
          :key="reference.uuid"
          class="reference inline text-xl text-gray-700  hover:text-blue-700 font-medium cursor-pointer hover:underline"
          v-tooltip.left="get(reference, 'entityData.rdfs:label') || `Unnamed Item ${reference.iri}` || `Unnamed Item`"
        >
          {{ get(reference, "entityData.rdfs:label") || `Unnamed Item ${reference.iri}` || `Unnamed Item` }}
        </div>
      </div>
      <!-- References  -->
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
  props: ["theme", "modelValue", "activeProfile"],
  components: {
    TextDefinition,
    DraggableClause
  },
  methods: {
    get(object: any, path: string): any {
      return _.get(object, path);
    },
    click(entity: any): void {
      const _iri = entity["@id"].replace(":", "#");
      const _contextKey = _iri.split("#")[0];
      const _iriKey = _iri.split("#")[1];
      const _contextUrl = this.context[_contextKey];
      const _encodedIri = encodeURIComponent(_contextUrl ? _contextUrl + _iriKey : entity["@id"]);

      const _url = `https://dev.endhealth.co.uk/viewer/#/concept/${_encodedIri}`;
      window.open(_url, "_blank");
    },
    viewClause(value: string) {
      // testing with $emit - $emit is not propopagated, vuex used instead./
      console.log("value", value);
      return;
    }
  },
  watch: {
    activeProfile() {
      if (this.profile && this.profile["@id"] == this.activeProfile.uuid) {
        this.templates = this.profile.toTemplates(this.activeProfile.activeClausePath);
        console.log("_templates", this.templates);
      }
    }
  },
  computed: {
    definitionTree: {
      get(): any {
        // instantiate Profile if not already done (e.g. QueryBuilder.profiles provides instantiated classes) but you can equally pass raw JSON as a prop
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
    }
  },
  data() {
    return {
      context: {
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        im: "http://endhealth.info/im#",
        imq: "http://endhealth.info/imq#",
        bc: "http://endhealth.info/bc#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        emis: "http://endhealth.info/emis#",
        sn: "http://snomed.info/sct#",
        ods: "http://endhealth.info/ods#",
        owl: "http://www.w3.org/2002/07/owl#",
        prov: "http://www.w3.org/ns/prov#",
        tpp: "http://endhealth.info/tpp#",
        xml: "http://www.w3.org/XML/1998/namespace#",
        sh: "http://www.w3.org/ns/shacl#",
        opcs4: "http://endhealth.info/opcs4#",
        vis: "http://endhealth.info/vision#",
        orole: "https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#",
        xsd: "http://www.w3.org/2001/XMLSchema#"
      },
      tabs: [
        {
          uuid: "255582e4-67d5-4307-934f-30a383b12944",
          name: "Criteria",
          visible: true
        },
        {
          uuid: "c47f6016-358d-480d-a018-d9c2da748002",
          name: "References",
          visible: false
        }
      ],
      activeTab: "Criteria",
      templates: [] as any[],
      profile: this.modelValue,
      themeClasses: {
        light: {
          phrases: { reference: "text-blue-700 font-bold hover:underline" },
          background: " bg-white hover:shadow-sm hover:bg-gray-50 border transition duration-700 ease-in-out border-gray-200",
          text: " text-gray-800",
          icon: " text-blue-700 bg-gray-100",
          bodyClasses: " text-black",
          bodyBackground: " ",
          connectorOutline: true
        },
        blue: {
          phrases: { reference: "text-blue-700 font-bold hover:underline" },
          background: " to-sky-500 from-blue-600",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        },
        purple: {
          phrases: { reference: "text-blue-700 font-bold hover:underline" },
          background: " to-purple-600 via-indigo-700 from-indigo-600",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black  bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        },
        green: {
          phrases: { reference: "text-blue-700 font-bold hover:underline" },
          background: " from-cyan-600 to-green-500",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black  bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        },
        orange: {
          phrases: { reference: "text-blue-700 font-bold hover:underline" },
          background: " to-amber-400 from-orange-500",
          text: " text-white",
          icon: " bg-opacity-40 bg-black text-white",
          bodyClasses: "",
          bodyBackground: " bg-black  bg-opacity-20 hover:bg-opacity-30",
          connectorOutline: false
        },
        pink: {
          phrases: { reference: "text-blue-700 font-bold hover:underline" },
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
.textdefinition,
.references {
  max-width: 600px;
}

.references {
  overflow-y: auto;
  min-width: 300px;
  max-height: 530px;
}

.reference {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of visible lines */
  -webkit-box-orient: vertical;
}

.profile .body::-webkit-scrollbar,
.references::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 20px;
}

.profile .body {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
