<template @mouseleave="isCardDragged = false">
  <!--  "ghost" class and drag/drop disabled  -->
  <draggable
    :list="children"
    item-key="name"
    :class="
      'clause w-full  before:select-none cursor-pointer dragArea rounded-md order-color-300 ' +
        theme +
        themeClasses[theme].bodyClasses +
        ' ' +
        [isCardDragged ? ' ' : '']
    "
    ghost-class=""
    :group="{ name: 'g1' }"
    tag="div"
    h="auto"
    ondragstart="return false;"
    ondrop="return false;"
    @drag="isCardDragged = true"
    @dragend="isCardDragged = false"
    @drop="isCardDragged = false"
  >
    <!-- Each item in list  -->
    <template #item="{ element, index }">
      <div :class="'group clause-item flex flex-col relative rounded'">
        <div class="clause-container clause inline-flex">
          <div :class="'connector-h rounded-sm inline-flex flex'">
            <!-- Horizontal Line or Space -->
            <div v-if="showLineH(index, element.uuid)" :class="'line-h'"></div>
            <div v-if="showSpaceH(index, element.uuid)" class="space-h"></div>

            <!-- Vertical Line, Space Or Label  -->
            <div class="connector-v relative inline-flex flex-col">
              <!-- circle  -->
              <div
                v-if="showCircle(index, element.uuid)"
                :class="
                  'circle inline' +
                    [
                      !element.include || parent(element)['name'] == 'not'
                        ? ' bg-red-600  ring-1 ring-transparent group-hover:ring-red-500 hover:ring-4 hover:ring-red-500'
                        : ' bg-green-700 ring-1 hover:ring-4 ring-transparent group-hover:ring-green-600 hover:ring-green-700'
                    ]
                "
                v-tooltip.left="!element.include || parent(element)['name'] == 'not' ? `${tooltip.exclude}` : `${tooltip.include}`"
              ></div>

              <!-- Vertical Line  -->
              <div v-if="index != children.length - 1" :class="'line-v inline ' + `operator-${operatorLabel(element)}`"></div>

              <!-- operator labels - displays "or" / "and" and converst "not" into "or" (only the label) -->
              <div
                v-if="parent(element) != null && index != siblingCount - 1"
                v-tooltip.left="parent(element)['name'] == 'not' ? `${tooltip.notor}` : operatorLabel(element) == 'and' ? `${tooltip.and}` : `${tooltip.or}`"
                :class="'clause-item__operatorlabel inline-block absolute rounded-sm text-lg text-gray-700 font-bold  '"
              >
                {{ operatorLabel(element) }}
              </div>
            </div>
          </div>

          <div :class="'clause-content w-full inline flex-col rounded-md'">
            <!-- Match Clause - Name  -->

            <div v-if="element.type == 'match'">
              <button
                v-wave="{
                  color: 'currentColor',
                  easing: 'ease-out',
                  duration: 0.7,
                  initialOpacity: 0.6,
                  finalOpacity: 0.1,
                  cancellationPeriod: 75
                }"
                @click="handleClick(element)"
                :class="
                  'clause__matchLabel ml-2 pl-3 pr-4  py-1  relative -top-1 cursor-pointer font-medium text-left md:text-2xl text-xl md:my-1 my-0 block transition duration-300 ease-in-out rounded-md border border-transparent  outline-none' +
                    [activeProfile == profile['@id'] && activeClausePath == element.currentPath ? ' active bg-blue-700 text-white' : ' text-black ']
                "
              >
                {{ matchLabel(element) }}
              </button>
            </div>

            <!-- Child   -->
            <nested-draggable
              :activeProfile="activeProfile"
              :activeClausePath="activeClausePath"
              :mainEntity="mainEntity"
              :themeClasses="themeClasses"
              :theme="theme"
              :profile="profile"
              :definitionTree="definitionTree"
              :isTopLevelNode="false"
              :isParentNegated="element.include == false"
              :class="
                'dragArea__children' +
                  [isCardDragged && !element.children.length ? ' min-h bg-blue-100' : ' '] +
                  [!isCardDragged && !element.children.length ? ' hidden' : ' ']
              "
              :siblingCount="element.children.length"
              :children="element.children"
              item-key="name"
              @drag="isCardDragged = true"
              @dragend="isCardDragged = false"
              @drop="isCardDragged = false"
            />
          </div>
        </div>
      </div>
    </template>
    <!-- /Each item in list  -->
  </draggable>
</template>

<script lang="ts">
import draggable from "vuedraggable";
// import { VueDraggableNext } from './draggable/@'
import Templates from "@/models/query/Templates";

import { ref, onMounted, defineComponent } from "vue";
import _ from "lodash";

export default defineComponent({
  props: ["activeProfile", "activeClausePath", "profile", "definitionTree", "mainEntity", "children", "siblingCount", "theme", "themeClasses", "templates"],
  emits: ["viewClause"],
  components: {
    draggable
  },
  name: "nested-draggable",
  data() {
    return {
      hoverIndex: null,
      activeClause: {
        uuid: "",
        path: ""
      },
      tooltip: {
        notor:
          '<div style="background-color: red; color: white; padding: 5px 20px; margin: -6px;  border-radius: 3px; font-size: 12x;"><b>EITHER OF THESE CRITERIA MUST BE MET</b></div>',
        or:
          '<div style="background-color: green; color: white; padding: 5px 20px; margin: -6px;  border-radius: 3px; font-size: 12px;"><b>EITHER OF THESE CRITERIA MUST BE MET</b></div>',
        and:
          '<div style="background-color: green; color: white; padding: 5px 20px; margin: -6px;  border-radius: 3px; font-size: 12px;"><b>BOTH OF THESE CRITERIA MUST BE MET</b></div>',
        include:
          '<div style="background-color: green; color: white; padding: 5px 20px; margin: -6px;  border-radius: 3px; font-size: 12px;"><b>INCLUSION CRITERIA</b></div>',
        exclude:
          '<div style="background-color: red; color: white; padding: 5px 20px; margin: -6px;  border-radius: 3px; font-size: 12px;"><b>EXCLUSION CRITERIA</b></div>'
      },
      lastParentPath: "",
      lastParent: {},
      colors: {
        and: "purple",
        or: "purple",
        include: "purple",
        exclude: "red"
      }
    };
  },
  methods: {
    handleClick(clause: any): any {
      const _currentClausePath = clause.currentPath;
      this.$store.commit("updateActiveProfile", { uuid: this.profile["@id"], activeClausePath: _currentClausePath });
    },
    operatorLabel(element: any): string {
      return this.parent(element)["name"] == "not" ? "or" : this.parent(element)["name"];
    },
    parent(clause: any): any {
      if (this.lastParentPath == clause.lastParentPath) {
        return this.lastParent;
      } else {
        const _parentPath = clause.currentPath
          .split(".")
          .slice(0, -1)
          .join(".");

        this.lastParent = _.get(this.definitionTree, _parentPath);

        return this.lastParent;
      }
    },
    matchLabel(clause: any): string {
      const toName = (iri: string) => {
        const _iri3 = iri.substring(0, 3);

        if (_iri3 == "urn") {
          return iri;
        } else if (_iri3 == "http") {
          const _iriArray = iri.split("/");
          return _iriArray[_iriArray.length - 1]
            .split("#")[1]
            .match(/([A-Z]?[^A-Z]*)/g)
            .slice(0, -1)
            .join(" ");
        } else if (iri.split(":").length == 2) {
          return iri
            .split(":")[1]
            .match(/([A-Z]?[^A-Z]*)/g)
            .slice(0, -1)
            .join(" ");
        }
      };

      let _entityType = clause.json.entityType ? clause.json.entityType["rdfs:label"] : "";
      let _property = clause.json.property ? clause.json.property["rdfs:label"] : "";

      // improved matchLabel
      // let _valueData = clause.json.valueCompare.valueData ? clause.json.valueCompare.valueData : null;
      // let _valueIn = clause.json.valueIn.valueData ? clause.json.valueIn.valueData : null;
      // let _valueNotIn = clause.json.valueNotIn ? clause.json.valueNotIn : null;

      // let _valueTest = clause.json.test ? clause.json.test.valueIn[0]
      // let _entityType = clause.json.entityType ? clause.json.entityType["@id"].split("#")[1] : "";
      // let _property = clause.json.property ? clause.json.property["@id"].split("#")[1] : "";

      return _entityType || _property || toName(clause.json.property["@id"] || toName(clause.json.entityType["@id"]));
    },
    showConnectorV(index: number, uuid: number): boolean {
      //first item at the top
      if (this.definitionTree && this.definitionTree[0] && this.definitionTree[0].uuid == uuid) {
        return false;
      }
      {
        return true;
      }
    },
    showSpaceH(index: number, uuid: string): boolean {
      if (this.definitionTree && this.definitionTree[0] && this.definitionTree[0].uuid == uuid) {
        //if you want the entire clause to be draggable set to true
        return false;
      } else if (_.get(this.definitionTree, `[0].children[${index}].uuid`) == uuid) {
        //hide first item in topmost item
        return false;
      } else if (index > 0) {
        return true;
      } else {
        return false;
      }
    },
    showLineH(index: number, uuid: number): boolean {
      //first item at the top
      // console.log(this.definitionTree);
      if (this.definitionTree && this.definitionTree[0] && this.definitionTree[0].uuid == uuid) {
        //hide topmost item
        return false;
      } else if (index > 0) {
        return false;
      } else if (_.get(this.definitionTree, "[0].children[0].uuid") == uuid) {
        //hide first item in topmost item
        return false;
      } else {
        return true;
      }
    },
    showCircle(index: number, uuid: number): boolean {
      //first item at the top
      if (this.definitionTree && this.definitionTree[0] && this.definitionTree[0].uuid == uuid) {
        return false;
      } else {
        return true;
      }
    }
  },
  computed: {
    isCardDragged: {
      get(): boolean | null {
        return null;
        // return this.$store.state.isCardDragged;
      },
      set(val: boolean): void {
        return;
        // this.$store.commit("updateIsCardDragged", val);
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
  }
});
</script>
<style scoped>
.dragArea {
  min-width: 200px;
}

.dragArea__nochildren {
}

.clause-operator__header {
  padding-bottom: 20px;
}

.ghost {
  background-color: #93c5fd;
  border-radius: 5px;
}

/* Scrollbar */
/* width */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ffffff;
  /* darker colour: #f1f1f1; */
}

/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(136, 136, 136, 0.233);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.clause-named__name {
}

.circle {
  margin: 3px 3px 5px 0px;
  min-width: 13px;
  min-height: 13px;
  width: 13px;
  height: 13px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 2px solid #fff;
}

.clause-container {
  min-height: 30px;
}

.line-v {
  min-width: 10px;
  margin-left: 5px;
  height: 100%;
  min-height: 5px;
  border-left: 3px solid #fff;
}
.line-v.operator-or {
  border-left: 3px dotted #fff;
}

.clause.light .line-v {
  border-left: 3px solid #475569;
}
.clause.light .line-v.operator-or {
  border-left: 3px dotted #475569;
}

.space-h {
  min-width: 10px;
  margin-right: 3px;
}

.line-h {
  min-width: 10px;
  margin: 8px 3px 0 0;
  border-top: 2px solid #fff;
}

.clause.light .line-h {
  border-top: 2px solid #000;
}

.clause__matchLabel {
  max-width: 200px;
}

.clause-content:hover .clause__matchLabel:not(.clause__matchLabel.active) {
  background: rgba(0, 0, 0, 0.4);
}

.clause.light .clause-content:hover .clause__matchLabel:not(.clause__matchLabel.active) {
  background: #e2e8f0;
}
.clause__matchLabel:hover:not(.clause__matchLabel.active) {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #000;
}

.clause.light .clause__matchLabel:hover:not(.clause__matchLabel.active) {
  background: #e2e8f0;
}

.ghost .line-h,
.ghost .space-h,
.ghost .line-v {
  display: none;
}

.clause-item__operatorlabel {
  top: calc(50%);
  right: 15px;
  visibility: hidden;
}

.profile:hover .clause-item__operatorlabel {
  visibility: visible !important;
}
</style>
