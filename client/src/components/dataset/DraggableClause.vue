<template @mouseleave="isCardDragged = false">
  <draggable
    :list="children"
    item-key="name"
    :class="'clause before:select-none cursor-pointer dragArea rounded-md order-color-300 ' + [isCardDragged ? ' ' : '']"
    ghost-class="ghost"
    :group="{ name: 'g1' }"
    tag="div"
    h="auto"
    @drag="isCardDragged = true"
    @dragend="isCardDragged = false"
    @drop="isCardDragged = false"
  >
    <!-- Each item in list  -->
    <template #item="{ element, index }">
      <div
        class="clause-item flex flex-col relative rounded"
        v-wave="{
          color: 'currentColor',
          easing: 'ease-out',
          duration: 0.7,
          initialOpacity: 0.6,
          finalOpacity: 0.1,
          cancellationPeriod: 75
        }"
      >
        <!-- <div
          v-if="index == 0"
          class="inline-flex select-none cursor-pointer text-gray-700 font-medium pb-2 "
        ></div> -->
        <div class="clause-container clause inline-flex">
          <div class="connector-h dark:hover:bg-opacity-30 dark:hover:bg-black rounded-sm inline-flex flex">
            <div v-if="showLineH(index, element.uuid)" :class="'line-h'"></div>
            <div v-if="showSpaceH(index, element.uuid)" class="space-h"></div>
            <!-- <div v-else class="line-v"> -->
            <!-- </div> -->
            <div class="connector-v relative inline-flex flex-col">
              <!-- circle  -->
              <div
                v-if="showCircle(index, element.uuid)"
                :class="'circle inline border border-2 border-white' + [!element.include || parent(element)['name'] == 'not' ? ' bg-red-600' : ' bg-green-700']"
                v-tooltip.left="!element.include || parent(element)['name'] == 'not' ? `${tooltip.exclude}` : `${tooltip.include}`"
              ></div>
              <!-- :line  -->
              <div v-if="index != children.length - 1" :class="'line-v inline border-l border-l-2 border-l-white'"></div>

              <div
                v-if="parent(element) != null && parent(element)['name'] && index != siblingCount - 1"
                :class="
                  'clause-item__operatorlabel inline-block absolute rounded-sm hover:bg-white hover:text-black text-md font-semibold text-white ' +
                    [element && element.type == 'operator' && element.name && element.name == 'and' ? ` text-${colors.and}-700` : ` text-${colors.or}-700`]
                "
              >
                {{ parent(element)["name"] == "not" ? "or" : parent(element)["name"] }}
              </div>
            </div>
          </div>

          <div class="clause-content inline flex-col relative rounded-md">
            <!-- Named Clause - Name  -->
            <template v-if="element.type == 'match'">
              <template v-if="true">
                <button
                  class="clause-named__name ml-5 cursor-pointer font-medium text-left text-xl block transition duration-300 ease-in-out rounded-md border border-transparent relative z-0 focus:z-10  outline-none"
                >
                  {{ matchLabel(element) }}
                </button>
              </template>
              <template v-else-if="false">
                <!-- <textarea
                  :value="element.name"
                  class="clause-named__name ml-5 text-xl select-none cursor-pointer text-black font-medium text-left bg-white rounded-sm  pr-2 pt-1 py-2 relative"
                >
                </textarea> -->
              </template>
            </template>

            <!-- Operator-Clause: Header  -->
            <!-- <template v-else-if="element.type == 'operator'">
              <div
                :class="
                  'clause-operator__header flex absolute -translate-y-8 w-200 bg-white'
                "
              >
                <div
                  @click="toggleInclude(element)"
                  :class="
                    'inline border b-1 px-2 py-0.5 rounded-md text-white ' +
                      [
                        element.include && !isParentNegated
                          ? ' bg-green-600'
                          : ' bg-red-600',
                      ]
                  "
                >
                  {{
                    element.include && !isParentNegated ? "Include" : "Exclude"
                  }}
                </div>

                <div class="inline">
                  a person if they match
                </div>
                <div
                  v-if="operatorLabel(element) && operatorLabel(element) != ''"
                  @click="toggleOperator(element)"
                  :class="
                    'inline border b-1 px-2 py-0.5 rounded-md text-white ' +
                      [
                        element.operator == 'and'
                          ? ' bg-blue-600'
                          : ' bg-indigo-600',
                      ]
                  "
                >
                  {{ operatorLabel(element) }}
                </div>
              </div>
            </template> -->

            <nested-draggable
              :data="data"
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
import { ref, onMounted, defineComponent } from "vue";
import _ from "lodash";

export default defineComponent({
  props: ["data", "children", "isParentNegated", "isTopLevelNode", "siblingCount"],
  components: {
    draggable
  },
  name: "nested-draggable",
  data() {
    return {
      tooltip: {
        include: '<span style="background-color: green; color: white; padding: 5px 20px; border-radius: 3px;"><b>INCLUDE </b></span>',
        exclude: '<span style="background-color: red; color: white; padding: 5px 20px; border-radius: 3px;"><b>EXCLUDE </b></span>'
      },
      lastParentPath: "",
      lastParent: {},
      colors: {
        and: "purple",
        or: "purple",
        include: "purple",
        exclude: "red"
      },
      childrenText: {
        1: {
          or: "",
          and: ""
        },
        2: {
          or: "either feature",
          and: "both features"
        },
        default: {
          or: "any feature",
          and: "all features"
        }
      }
    };
  },
  methods: {
    // operatorLabel(): any {
    //   // console.log("item", item);
    //   const _keys = Object.keys(this.clause);
    //   const _iri = _keys.filter((key: any) => {
    //     return this.operatorIris.includes(key);
    //   })[0];
    //   const _label = _iri.split(":")[1];
    //   return _label[0].toUpperCase() + _label.substring(1);
    // },
    parent(clause: any): any {
      if (this.lastParentPath == clause.lastParentPath) {
        return this.lastParent;
      } else {
        const _parentPath = clause.currentPath
          .split(".")
          .slice(0, -1)
          .join(".");

        this.lastParent = _.get(this.data, _parentPath);

        return this.lastParent;
      }

      // console.log("clause", clause.uuid);
      // console.log("parent path", _parentPath);

      // console.log(" UI _parent", _parent);

      // return JSON.stringify(_parent);
    },
    matchLabel(clause: any): string {
      // if (clause.name) {
      //   return clause.name;
      // } else {
      // console.log(clause)
      let _entityType = clause.data.entityType ? clause.data.entityType["@id"].split("#")[1] : "";
      let _property = clause.data.property ? clause.data.property["@id"].split("#")[1] : "";

      //adds spaces in between capital letters
      _entityType = _entityType
        .match(/([A-Z]?[^A-Z]*)/g)
        .slice(0, -1)
        .join(" ");

      // turns hasProfile in Profile
      if ((_property = "hasProfile")) {
        _property = "Profile";
      }
      // const _label = `${_entityType} ${_property}`
      return _entityType || _property;
      // }
    },
    showConnectorV(index: number, uuid: number): boolean {
      //first item at the top
      if (this.data && this.data[0] && this.data[0].uuid == uuid) {
        return false;
      }
      {
        return true;
      }
    },
    showSpaceH(index: number, uuid: string): boolean {
      if (this.data && this.data[0] && this.data[0].uuid == uuid) {
        //if you want the entire clause to be draggable set to true
        return false;
      } else if (_.get(this.data, `[0].children[${index}].uuid`) == uuid) {
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
      // console.log(this.data);
      if (this.data && this.data[0] && this.data[0].uuid == uuid) {
        //hide topmost item
        return false;
      } else if (index > 0) {
        return false;
      } else if (_.get(this.data, "[0].children[0].uuid") == uuid) {
        //hide first item in topmost item
        return false;
      } else {
        return true;
      }
    },
    showCircle(index: number, uuid: number): boolean {
      //first item at the top
      if (this.data && this.data[0] && this.data[0].uuid == uuid) {
        // console.log("uuid", uuid);
        // console.log("data", this.data);
        return false;
      } else {
        return true;
      }
    },
    // toggleOperator(element: any): void {
    //   if (element.operator == "or") {
    //     element.operator = "and";
    //   } else {
    //     element.operator = "or";
    //   }
    // },
    toggleInclude(element: any): void {
      element.include = !element.include;
    }

    // operatorLabel(element: any): string {
    //   if (this.children.length == 1) {
    //     return this.childrenText[1][element.operator];
    //   } else if (this.children.length == 2) {
    //     return this.childrenText[2][element.operator];
    //   } else {
    //     return this.childrenText.default[element.operator];
    //   }
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
    }
  }
});
</script>
<style scoped>
.dragArea {
  /* max-height: 800px; */
  /* overflow-y: visible; */
  /* display: absolute; */
  min-width: 200px;
}

.dragArea__nochildren {
}

.clause-operator__header {
  /* height: 30px; */
  padding-bottom: 20px;
}

.min-h {
  /* min-height: 25px; */
  /* height: 25px; */
  /* min-width: 200px; */
  /* width: 200px; */
}

/* .clause-connector {
  width: 60px;
} */

.ghost {
  background-color: #93c5fd;
  border-radius: 5px;
}

.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
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
  /* visibility: hidden; */

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
}

.clause-container {
  min-height: 30px;
}

.line-v {
  /* visibility: hidden; */
  min-width: 10px;
  /* max-width: 10px; */
  margin-left: 5px;
  /* padding-left: 20px; */
  /* margin-right: -3 */
  height: 100%;
  min-height: 5px;
}

.space-h {
  /* visibility: hidden; */
  min-width: 10px;
  margin-right: 3px;
  /* min-height: 25px; */

  /* margin: 0 5px 0 0; */
  /* height: 100%; */
}

.line-h {
  /* visibility: hidden; */
  min-width: 10px;
  margin: 8px 3px 0 0;
  border-top: 2px solid #fff;
  /* min-height: 25px; */

  /* height: 100%; */
  /* min-height: 40px; */
}

.connector-h {
  /* padding: 5px; */
}

.ghost .line-h,
.ghost .space-h,
.ghost .line-v {
  display: none;
}

.clause-item__operatorlabel {
  top: calc(50%);
  right: 15px;
  /* width: 30px; */
  /* text-align: right; */
  visibility: hidden;
}
/* 
.clause-item_arrow {
  margin-top: 4px;
  min-width: 20px;
  width: 20px;
} */
/* 
.definition-editor .hover .circle,
.definition-editor .hover .line-h,
.definition-editor .hover .linebutton {
  visibility: visible;
} */

.profile:hover .clause-item__operatorlabel {
  visibility: visible !important;
}
</style>
