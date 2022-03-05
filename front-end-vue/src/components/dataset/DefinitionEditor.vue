<template>
  <div class="definition-editor flex">
    <div
      class="definition-editor__definition inline-block overflow-y-auto px-5"
    >
      <div class="title text-center text-gray-400 h-10 font-semibold ">
        Search Criteria
      </div>

      <!-- Definition  -->
      <div
        :class="
          'transition duration-500 ease-in-out border border-b-1 border-gray-200 shadow-sm pb-20 rounded-md w-full' +
            [isHover ? ' hover border-gray-300 shadow-middle' : '']
        "
        v-for="(item, index) in withTempUUID(modelValue[definitionIri])"
        :key="item.temp_id"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
      >
        <div class="flex border-b border-b-gray-200">
          <div class="title text-black font-semibold mt-3 mb-2 mx-5 w-full">
            {{
              queryBuilder.activeProfile
                ? queryBuilder.activeProfile["rdfs:label"]
                : "Untitled Search Criteria"
            }}
          </div>
          <div></div>
        </div>
        <div class="pt-5 pl-8 pr-2 w-full">
          <ClauseItem
            :isTopLevel="true"
            class="grow"
            :propertyPath="`${definitionIri}[${index}]`"
            :clause="item"
            :operatorIris="['im:and', 'im:or', 'im:not']"
            :isParentHover="isHover"
          />
        </div>
      </div>
      <!-- D/efinition  -->
    </div>

    <!-- <dragNext /> -->
    <div
      v-if="queryBuilder.activeClause"
      class="definition-editor__curator w-full"
    >
      <div class="title text-center text-gray-400 w-full h-10 font-semibold">
        Profile
      </div>
      <!-- 
      <draggable
        :list="options"
        ghost-class="moving-card"
        :move="checkMove"
        @start="isDragging = true"
        @end="isDragging = false"
      >
      </draggable> -->
      <ClauseEditor :modelValue="queryBuilder.activeClause" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import{ v4 } from "uuid";
import SectionToggler from "@/components/dataset/SectionToggler.vue";
import ClauseItem from "@/components/dataset/ClauseItem.vue";
import ClauseEditor from "@/components/dataset/ClauseEditor.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
// import nestedExample from "@/components/dataset/draggable/nestedExample.vue";
// import draggable from "vuedraggable";
// import dragNext from "@/components/dataset/draggable/dragNext.vue";

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
    // nestedExample,
    // SectionToggler,
    ClauseItem,
    ClauseEditor,
    // dragNext,
    // draggable,
    // HeroIcon,
  },
  data() {
    return {
      isHover: false,
      collapsedItems: [] as any[],
      isDragging: false,
      options: [
        {
          id: "abc89209-fcc5-4770-9a4b-bb1655104258",
          name: "Add",
          icon: "plus",
          classes: "",
          order: 1,
          fixed: false,
        },
        {
          id: "afcd1608-3d79-4e10-90b6-1e9d354b9283",
          name: "Copy",
          icon: "document_duplicate",
          classes: "",
          order: 2,
          fixed: false,
        },
        {
          id: "23cdb751b04edc4a-79ad-41da-a44c-7e871902a8a9",
          name: "Cut",
          icon: "scissors",
          classes: "",
          order: 3,
          fixed: false,
        },
        {
          id: "23cdb75120e0ee94-b1d4-4c63-865f-e1c16f60d464",
          name: "Paste",
          icon: "clipboard_copy",
          classes: "",
          order: 4,
          fixed: false,
        },
        {
          id: "23cdb75120e0ee94-b1d4-4c63-865f-e1c16f60d464",
          name: "Move",
          icon: "arrow_right",
          classes: "",
          order: 5,
          fixed: false,
        },
        {
          id: "23cdb751-136c-433e-8614-f48f8459da11",
          name: "Edit",
          icon: "pencil",
          classes: "",
          order: 6,
          fixed: false,
        },
        {
          id: "bf34d743-35b2-4e3c-b50f-5989b0bd3174",
          name: "Delete",
          icon: "x",
          classes: "",
          order: 7,
          fixed: false,
        },
      ],
    };
  },
  methods: {
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },
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
  min-width: 600px;
}
</style>
