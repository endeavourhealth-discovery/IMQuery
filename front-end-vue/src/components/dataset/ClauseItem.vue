<template>
  <!-- <FullscreenDialog

    @close="isEditorVisible = false"
    :title="queryBuilder.activeProfile['rdfs:label'] ? queryBuilder.activeProfile['rdfs:label'] : 'Unnamed Criteria'"
  >
    Full Screen
  </FullscreenDialog> -->

  <!-- Any object that is not preceded by an operator should be ignored -->
  <template v-if="hasOperator(clause)">
    <!-- Iterate over the children in the array of the oeprator -->
    <template v-for="(item, index) in currentClause" :key="item.temp_id">
      <div
        :class="
          'clause-item relative inline-block flex hover:bg-white' +
            [index == currentClause.length - 1 ? ' mb-4' : '']
        "
      >
        <!-- Right Click Options  -->
        <div
          v-if="isOptionVisible[index]"
          class="clause-item__options opacity-60 absolute"
        >
          <!-- <draggable
            :list="options"
            ghost-class="moving-card"
            :move="checkMove"
            @start="isDragging = true"
            @end="isDragging = false"
          > -->
          <div
            v-for="item in options"
            :key="item.id"
            :class="
              'select-none cursor-pointer bg-black flex items-center text-white font-semibold rounded-md py-1 px-2 my-1 hover:bg-gray-800'
            "
          >
            <HeroIcon
              class="inline text-white mr-2"
              :icon="item.icon"
              strokewidth="2"
              width="16"
              height="16"
            />
            {{ item.name }}
          </div>
          <!-- </draggable> -->
        </div>
        <!-- Right Click Options  -->

        <!-- Operator -->
        <div
          @mouseenter="isOperatorHovered[index] = true"
          @mouseleave="isOperatorHovered[index] = false"
          class="clause-item__operator relative"
        >
          <!-- First Item  -->
          <div
            v-if="index == 0"
            :class="
              'inline-block  text-indigo-700 font-semibold hover:text-blue-600  hover:underline' +
                [
                  isIncluded
                    ? ` text-${colors.include}-700`
                    : ` text-${colors.exclude}-700`,
                ]
            "
          >
            Include
          </div>

          <!--  Rest -->
          <div
            v-else-if="index > 0"
            :class="
              'inline-block font-semibold hover:text-blue-600 hover:underline' +
                [
                  operatorLabel() == 'And'
                    ? ` text-${colors.and}-700`
                    : ` text-${colors.or}-700`,
                ]
            "
          >
            {{ operatorLabel() }}
          </div>

          <!-- <HeroIcon
            v-if="isOperatorHovered[index]"
            class="clause-item__dots absolute text-blue-500 "
            icon="dots_horizontal"
            strokewidth="2"
            width="20"
            height="20"
          /> -->
        </div>
        <!-- / Operator -->

        <!-- circle + Line  -->
        <div class="inline-flex flex-col">
          <!-- circle  -->
          <div
            :class="
              'inline border border-transparent' +
                [
                  operatorLabel() == 'And'
                    ? ` circle b-2 border-${colors.and}-700`
                    : ` circle b-2 border-${colors.or}-700`,
                ]
            "
          ></div>
          <!-- / circle  -->

          <!-- Line -->
          <div
            v-if="index != currentClause.length - 1"
            :class="
              'inline border-r border-r-transparent' +
                [
                  operatorLabel() == 'And'
                    ? ` line b-2 border-r-${colors.and}-700`
                    : ` line border-dotted b-2 border-r-${colors.or}-700`,
                ]
            "
          ></div>
          <!-- / Line -->
        </div>
        <!-- /Ring + Line  -->

        <!-- Display Label  -->
        <div
          @mouseenter="isLabelHovered[index] = true"
          @mouseleave="isLabelHovered[index] = false"
          v-if="item['rdfs:label']"
          :class="
            'clause-item__label relative group inline-flex outline-none font-semibold bg-transparent border border-transparent b-2 rounded-md text-black pr-2' +
              [isActive(index) ? ' selected' : ''] +
              [isOptionVisible[index] ? ' options bg-blue-50' : ''] +
              [
                containsLongWords(item['rdfs:label'])
                  ? ' break-all'
                  : ' break-words',
              ]
          "
        >
          <div
            @click="setActive(index)"
            @click.right.prevent="showOptions(index)"
            :class="
              'clause-item__labeltext grow' +
                [isActive(index) ? ' #text-blue-700' : '']
            "
          >
            {{ item["rdfs:label"] }}
          </div>
          <div
            class="w-5 flex absolute h-9 w-9 right-0 group-hover:bg-white rounded-md top-2/4 -translate-y-2/4"
            @click="showOptions(index)"
            @click.right.prevent="showOptions(index)"
          >
            <HeroIcon
              v-if="isLabelHovered[index]"
              class="inline text-blue-500 mt-2 ml-2"
              icon="dots_horizontal"
              strokewidth="2"
              width="20"
              height="20"
            />
          </div>
        </div>
        <!-- /Display Label  -->

        <div
          v-show="item['rdfs:label'] && isActive(index)"
          class="clause-item_arrow flex flex-col items-center justify-center rounded-sm"
        ></div>

        <!-- If there's no label   -->
        <div
          v-if="!item['rdfs:label']"
          v-show="!collapsedItems.includes(item.temp_id)"
          class="inline-block flex flex-col w-full"
        >
          <ClauseItem
            class=""
            :propertyPath="getPathToClause(index)"
            :clause="item"
            :operatorIris="['im:and', 'im:or', 'im:not']"
          />
        </div>
      </div>

      <div
        v-if="isOptionVisible[index]"
        class="dialog-background non-selectable"
        @click="isOptionVisible[index] = false"
        @click.right.prevent="isOptionVisible[index] = false"
      ></div>
    </template>
  </template>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
const { v4 } = require("uuid");

import SectionToggler from "@/components/dataset/SectionToggler.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import FullscreenDialog from "@/components/dataset/FullscreenDialog.vue";
import draggable from "vuedraggable";

export default defineComponent({
  name: "ClauseItem",
  props: [
    "propertyPath",
    "modelValue",
    "operatorIris",
    "definitionIri",
    "clause",
    "operator",
    "nestingCount",
    "isParentHover",
  ],
  emits: ["update:modelValue"],
  components: {
    // SectionToggler,
    HeroIcon,
    // draggable,
    // FullscreenDialog,
  },
  data() {
    return {
      maxLabelWordLength: 35,
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
      colors: {
        and: "purple",
        or: "purple",
        include: "purple",
        exclude: "red",
      },
      collapsedItems: [] as any[],
      componentState: "default", // Options #"default", #"hover", #"focus", #"",
      isOperatorHovered: {}, ///returns bolean
      isLabelHovered: {}, ///returns bolean
      isOptionVisible: {}, //returns bolean
      isEditorVisible: false,
      activeClause: "",
      isLoading: false,
    };
  },
  methods: {
    //  add: function() {
    //   this.list.push({ name: "Juan " + id, id: id++ });
    // },
    // replace: function() {
    //   this.list = [{ name: "Edgard", id: id++ }];
    // },
    containsLongWords(testString: string): boolean {
      return testString
        .split(" ")
        .some((i) => i.length > this.maxLabelWordLength);
    },
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },
    updateLabel(value: string): void {
      this.queryBuilder.activeClause["rdfs:label"] = value;
    },
    isIncluded(): boolean {
      return true;
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
      // console.log("items", items);
      if (items) {
        return items.map((item: any) => {
          return { temp_id: "urn:uuid:" + v4(), ...item };
        });
      }
    },
    hasOperator(item: any): boolean {
      // console.log("item", item);
      return this.operatorIris.some((operatorIri: any) => {
        return item[operatorIri];
      });
    },
    operatorIri(): any {
      // console.log("item", item);
      const _keys = Object.keys(this.clause);
      return _keys.filter((key: any) => {
        return this.operatorIris.includes(key);
      })[0];
    },
    operatorLabel(): any {
      // console.log("item", item);
      const _keys = Object.keys(this.clause);
      const _iri = _keys.filter((key: any) => {
        return this.operatorIris.includes(key);
      })[0];
      const _label = _iri.split(":")[1];
      return _label[0].toUpperCase() + _label.substring(1);
    },
    test(val: any): void {
      alert(val);
    },
    getPathToClause(index: number): any {
      const _path = `${this.propertyPath}.${this.operatorIri(
        this.clause
      )}[${index}]`;
      console.log(_path);
      console.log("activeClause", this.queryBuilder.activeClause);
      return _path;
    },
    isActive(index: number): boolean {
      return this.queryBuilder.activePath == this.getPathToClause(index);
    },
    setActive(index: number): void {
      this.queryBuilder.activePath = this.getPathToClause(index);
    },
    showOptions(index: number): void {
      // Object.keys(this.isEditorVisible).forEach(
      //   (i: any) => (this.isEditorVisible[i] = false)
      // );
      // this.isEditorVisible[index] = true;

      Object.keys(this.isOptionVisible).forEach(
        (i: any) => (this.isOptionVisible[i] = false)
      );

      this.isOptionVisible[index] = true;
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
    currentClause: {
      get(): any {
        return this.withTempUUID(this.clause[this.operatorIri(this.clause)]);
      },
      set(value: any): void {
        return;
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

.dialog-background {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 80; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.7); /* Black w/ opacity */
}

.clause-item,
.clause-item__operator,
.clause-item__label {
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.clause-item {
  /* max-width: 400px; */
}

.clause-item__labeltext {
  padding: 6px 8px 6px 8px;
}

.clause-item__label {
  width: 100%;
  /* max-width: 300px; */
  /* width: 100%; */
  max-width: 300px;
  min-height: 20px;
  /* max-width: 300px; */
  /* min-width: 150px; */
  position: relative;

  top: -7px;
  margin: 3px;
  z-index: 9; /* Sit on top */
}

.definition-editor .hover .clause-item__label {
  background-color: #fff;
  border-color: #d1d5db;
}
.definition-editor .hover .clause-item__label:hover {
  border: 1px solid #0d89ec;
  background-color: #fff;
  color: #0d89ec;
}

.definition-editor .clause-item__label.selected {
  /* background-color: black; */
  /* z-index: 149; Sit on top */
}
.definition-editor .clause-item__label.options {
  color: #0d89ec;
  border: 1px solid #0d89ec;
  /* background-color: #edf7ff; */
  /* border: 1px solid #0d89ec; */
  /* background-color: black; */
  z-index: 149; /* Sit on top */
}

.clause-item__operator {
  /* min-width: 55px; */
  min-width: 60px;
  margin-left: 13px;
}
/* 
.clause-item_arrow {
  margin-top: 4px;
  min-width: 20px;
  width: 20px;
} */

.definition-editor .hover .circle,
.definition-editor .hover .line,
.definition-editor .hover .linebutton {
  visibility: visible;
}

.circle {
  visibility: hidden;

  margin: 5px 10px 5px 0px;
  min-width: 13px;
  min-height: 13px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.line {
  visibility: hidden;
  width: 7px;
  height: 100%;
  min-height: 10px;
}

.linebutton {
  visibility: hidden;
  width: 7px;
  height: 100%;
  min-height: 0px;
}

.clause-item__options {
  left: 10px;
  top: -8px;
  font-size: 16px;
  /* margin-right: 20px; */
  z-index: 150; /* Sit on top */
  /* width: 100px; */
}
</style>
