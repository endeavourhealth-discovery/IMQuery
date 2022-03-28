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
      <div :class="'clause-item flex flex-col relative rounded'">
        <div class="clause-container clause inline-flex">
          <div class="connector-h rounded-sm inline-flex flex">
            <div v-if="showLineH(index, element.uuid)" :class="'line-h'"></div>
            <div v-if="showSpaceH(index, element.uuid)" class="space-h"></div>
            <!-- <div v-else class="line-v"> -->
            <!-- </div> -->
            <div class="connector-v relative inline-flex flex-col">
              <!-- circle  -->
              <div
                v-if="showCircle(index, element.uuid)"
                :class="'circle inline' + [!element.include || parent(element)['name'] == 'not' ? ' bg-red-600' : ' bg-green-700']"
                v-tooltip.left="!element.include || parent(element)['name'] == 'not' ? `${tooltip.exclude}` : `${tooltip.include}`"
              ></div>
              <!-- :line  -->
              <div v-if="index != children.length - 1" :class="'line-v inline '"></div>

              <!-- operator labels - displays "or" / "and" and converst "not" into "or" (only the label) -->
              <div
                v-if="parent(element) != null && index != siblingCount - 1"
                v-tooltip.left="parent(element)['name'] == 'not' ? `${tooltip.notor}` : operatorLabel(element) == 'and' ? `${tooltip.and}` : `${tooltip.or}`"
                :class="'clause-item__operatorlabel inline-block absolute rounded-sm text-lg font-semibold  '"
              >
                {{ operatorLabel(element) }}
              </div>
            </div>
          </div>

          <div class="clause-content w-full inline flex-col rounded-md">
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
                  'clause__matchLabel w-full pl-5 pr-2  py-1 relative -top-1 cursor-pointer font-medium text-left text-xl block transition duration-300 ease-in-out rounded-md border border-transparent  outline-none' +
                    [activeClausePath == element.uuid ? ' bg-red-700' : ' ']
                "
              >
                {{ matchLabel(element) }}
              </button>
            </div>

            <!-- Child   -->
            <nested-draggable
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
  props: ["activeClausePath", "profile", "definitionTree", "mainEntity", "children", "siblingCount", "theme", "themeClasses", "templates"],
  emits: ["viewClause"],
  components: {
    draggable
  },
  name: "nested-draggable",
  data() {
    return {
      activeClause: {
        uuid: "",
        path: ""
      },
      tooltip: {
        notor:
          '<div style="background-color: red; color: white; padding: 5px 20px; margin: -6px;  border-radius: 3px; font-size: 12x;"><b>NEITHER OF THESE CRITERIA MUST BE MET</b></div>',
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
      // console.log("this.activeClausePath", this.activeClausePath)
      // console.log("clause.currentPath", clause.currentPath)

      const _currentClausePath = clause.currentPath;
      this.$store.commit("updateActiveClausePath", _currentClausePath);

      this.activeClause.uuid = clause.uuid;
      this.activeClause.path = clause.currentPath;
      // console.log("theme", this.themeClasses);
      // console.log("profile", this.profile)
      // console.log("mainEntity", this.mainEntity)
      // console.log(this.test);
      // console.log(this.profile[0].data.id)
      // alert(clause.currentPath);

      //###todo
      // emit does not work inside here or parent component reliably? Element returns only the topmost element when emitted or nothing.
      // fix:
      // [ ] translate all clauses upon conversion so you already have the template data.
      // [ ] don't emit, commit: activeClause: [] in state. Pass it to Profile as prop via computed getter in order to allow ,

      // this.$emit('viewClause', "data1")
      // const _profileId = this.definitionTree[0].json.id["@id"];#

      // console.log("_currentPath", _currentPath)

      // const _templates = this.profile.toTemplates(this.profile[0].json.entityType, this.profile, _currentClausePath)

      //if using query builder
      // const _templates = this.queryBuilder.profiles.get(_profileId).toTemplates(_currentClausePath);

      // const joinArry = (arr: any[]): string => {
      //   let _textArr = [] as any[];
      //   arr.forEach((item: any) => _textArr.push(item.name));
      //   let str = _textArr.join(" or ");
      //   return str;
      // };

      // let _sentence = "";
      // _templates[0].data.forEach((item: any) => (_sentence = _sentence + (typeof item.text == "string" ? item.text : joinArry(item.text)) + " "));
      // _templates[0].children[0].data.forEach((item: any) => (_sentence = _sentence + (typeof item.text == "string" ? item.text : joinArry(item.text)) + " "));
      // // _templates[0].children[0].children[0].data.forEach((item: any) => (_sentence = _sentence + (typeof item.text == "string" ? item.text : joinArry(item.text)) + " "));

      // console.log(_sentence);
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
      // derives labels from Iri

      // console.log("clause json", clause.json)
      //
      let _entityType = clause.json.entityType ? clause.json.entityType["rdfs:label"] : "";
      let _property = clause.json.property ? clause.json.property["rdfs:label"] : "";

      // let _entityType = clause.json.entityType ? clause.json.entityType["@id"].split("#")[1] : "";
      // let _property = clause.json.property ? clause.json.property["@id"].split("#")[1] : "";

      // //adds spaces in between capital letters
      // _entityType = _entityType
      //   .match(/([A-Z]?[^A-Z]*)/g)
      //   .slice(0, -1)
      //   .join(" ");

      // _property = _property
      //   .match(/([A-Z]?[^A-Z]*)/g)
      //   .slice(0, -1)
      //   .join(" ");

      return _entityType || _property;
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
        // console.log("uuid", uuid);
        // console.log("json", this.definitionTree);
        return false;
      } else {
        return true;
      }
    }
    // toggleOperator(element: any): void {
    //   if (element.operator == "or") {
    //     element.operator = "and";
    //   } else {
    //     element.operator = "or";
    //   }
    // },
    // toggleInclude(element: any): void {
    //   element.include = !element.include;
    // }
  },
  computed: {
    isCardDragged: {
      get(): boolean {
        return this.$store.state.isCardDragged;
      },
      set(val: boolean): void {
        this.$store.commit("updateIsCardDragged", val);
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

.clause.light .circle {
  /* border: 2px solid transparent; */
}

.clause-container {
  min-height: 30px;
}

.line-v {
  min-width: 10px;
  margin-left: 5px;
  height: 100%;
  min-height: 5px;
  border-left: 2px solid #fff;
}

.clause.light .line-v {
  border-left: 2px solid #000;
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

.clause__matchLabel:hover {
  background: rgba(0, 0, 0, 0.4);
}

.clause.light .clause__matchLabel:hover {
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
