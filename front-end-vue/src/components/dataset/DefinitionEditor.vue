<template>
  <div  class="definition-editor flex">
    <div
      class="definition-editor__definition inline-block overflow-y-auto px-5"
    >
      <div class="title text-center text-gray-400 h-10 font-semibold ">
        Search Criteria
      </div>

      <!-- Definition  -->
      <div
        :class="
          'pl-4 pt-4 pb-2 hover:bg-gray-100 rounded-md w-full' +
            [isHover ? ' hover' : '']
        "
        v-for="(item, index) in withTempUUID(modelValue[definitionIri])"
        :key="item.temp_id"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
      >
        <div class="flex">
          <div class="title text-gray-500 h-10 font-semibold mb-5 ml-4">
            {{
              queryBuilder.activeProfile
                ? queryBuilder.activeProfile["rdfs:label"]
                : "Untitled Search Criteria"
            }}
          </div>
          <div></div>
        </div>
        <ClauseItem
          class="w-full grow"
          :propertyPath="`${definitionIri}[${index}]`"
          :clause="item"
          :operatorIris="['im:and', 'im:or', 'im:not']"
          :isHover="isHover"
        />
      </div>
      <!-- D/efinition  -->
    </div>
    <div
    v-if="queryBuilder.activeClause" 
      class="definition-editor__curator w-full"
    >
      <div class="title text-center text-gray-400 w-full h-10 font-semibold">
        Profile
      </div>
      <ClauseEditor :modelValue="queryBuilder.activeClause" />
    </div>
  </div> 
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";
import ClauseItem from "@/components/dataset/ClauseItem.vue";
import ClauseEditor from "@/components/dataset/ClauseEditor.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

// import Constraint from "@/components/dataset/Constraint.vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "DefinitionEditor",
  props: [
    "modelValue",
    "operatorIris",
    "definitionIri",
    "operator",
    "clause",
    "nestingCount",
  ],
  emits: ["update:modelValue"],
  components: {
    // SectionToggler,
    ClauseItem,
    ClauseEditor,
    // HeroIcon,
  },
  data() {
    return {
      isHover: false,
      collapsedItems: [] as any[],
    };
  },
  methods: {
    toggleTableSection(item: number): void {
      if (this.collapsedItems.includes(item)) {
        this.collapsedItems = this.collapsedItems.filter(function(value: any) {
          return value !== item;
        });
      } else {
        this.collapsedItems = [...this.collapsedItems, item];
      }
    },
    withTempUUID(items: any[]): any[] | any {
      if (items) {
        return items.map((item: any) => {
          return { temp_id: "urn:uuid:" + v4(), ...item };
        });
      }
    },
    isOperator(item: any): boolean {
      return this.operatorIris.some((operatorIri: any) => {
        return item[operatorIri];
      });
    },
    getOperator(item: any): any {
      console.log("item", item);
      const _keys = Object.keys(item);
      return _keys.filter((key: any) => {
        return this.operatorIris.includes(key);
      })[0];
    },
  },
  computed: {
    queryBuilder: {
      get(): any {
        return this.$store.state.queryBuilder;
      },
      set({ action, payload }: any): void {
        this.$store.commit("queryBuilder", {
          action: action,
          payload: payload,
        });
      },
    },
  },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

::-webkit-scrollbar {
  width: 0;
}

:-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
}

::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  /* outline: 1px solid slategrey; */
}

.definition-editor {
  height: 890px;
}

.definition-editor__definition {
  /* width: 100%; */
  /* max-width: 800px; */
  min-width: 700px;
}
</style>
