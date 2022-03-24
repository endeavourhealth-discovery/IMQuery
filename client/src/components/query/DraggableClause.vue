<template @mouseleave="isCardDragged = false">
  <!--  "ghost" class and drag/drop disabled  -->
  <draggable
    :list="children"
    item-key="name"
    :class="'clause before:select-none cursor-pointer dragArea rounded-md order-color-300 ' + [isCardDragged ? ' ' : '']"
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
      <div class="clause-item flex flex-col relative rounded">
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
                :class="'circle inline border border-2 border-white' + [!element.include || parent(element)['name'] == 'not' ? ' bg-red-600' : ' bg-green-700']"
                v-tooltip.left="!element.include || parent(element)['name'] == 'not' ? `${tooltip.exclude}` : `${tooltip.include}`"
              ></div>
              <!-- :line  -->
              <div v-if="index != children.length - 1" :class="'line-v inline border-l border-l-2 border-l-white'"></div>

              <!-- operator labels - displays "or" / "and" and converst "not" into "or" (only the label) -->
              <div
                v-if="parent(element) != null && index != siblingCount - 1"
                v-tooltip.left="parent(element)['name'] == 'not' ? `${tooltip.notor}` : operatorLabel(element) == 'and' ? `${tooltip.and}` : `${tooltip.or}`"
                :class="
                  'clause-item__operatorlabel inline-block absolute rounded-sm text-lg font-semibold text-white ' +
                    [element && element.type == 'operator' && element.name && element.name == 'and' ? ` text-${colors.and}-700` : ` text-${colors.or}-700`]
                "
              >
                {{ operatorLabel(element) }}
              </div>
            </div>
          </div>

          <button class="clause-content w-full inline flex-col relative rounded-md  ">
            <!-- Named Clause - Name  -->
            <template v-if="element.type == 'match'">
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
                class="clause-named__name w-full ml-5 px-2 cursor-pointer font-medium text-left text-xl block transition duration-300 ease-in-out rounded-md border border-transparent relative z-0 focus:z-10  outline-none hover:bg-black hover:bg-opacity-50"
              >
                {{ matchLabel(element) }}
              </button>
            </template>

            <!-- Child   -->
            <nested-draggable
              :profile="profile"
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
          </button>
        </div>
      </div>
    </template>
    <!-- /Each item in list  -->
  </draggable>
</template>

<script lang="ts">
import draggable from "vuedraggable";
// import { VueDraggableNext } from './draggable/@'
import { ref, onMounted, defineComponent } from "vue";
import _ from "lodash";

export default defineComponent({
  props: ["profile", "test", "children", "siblingCount"],
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
          '<div style="background-color: red; color: white; padding: 5px 20px; margin: -5px;  border-radius: 3px; font-size: 12x;"><b>A PERSON MUST MEET NEITHER OF THESE CRITERIA</b></div>',
        or:
          '<div style="background-color: green; color: white; padding: 5px 20px; margin: -5px;  border-radius: 3px; font-size: 12px;"><b>A PERSON MUST MEET EITHER OF THESE CRITERIA</b></div>',
        and:
          '<div style="background-color: green; color: white; padding: 5px 20px; margin: -5px;  border-radius: 3px; font-size: 12px;"><b>A PERSON MUST MEET BOTH OF THESE CRITERIA</b></div>',
        include:
          '<div style="background-color: green; color: white; padding: 5px 20px; margin: -5px;  border-radius: 3px; font-size: 12px;"><b>INCLUDE A PERSON WITH THIS FEATURE</b></div>',
        exclude:
          '<div style="background-color: red; color: white; padding: 5px 20px; margin: -5px;  border-radius: 3px; font-size: 12px;"><b>EXCLUDE A PERSON WITH THIS FEATURE </b></div>'
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
      // console.log(this.profile)
      // console.log(this.test);
      // console.log(this.profile[0].data.id)
      const _profileId = this.profile[0].json.id["@id"];
      const _currentClausePath = clause.currentPath;
      this.activeClause.uuid = this.profile[0].uuid;
      this.activeClause.path = clause.currentPath;
      // console.log("_currentPath", _currentPath)

      const _templates = this.queryBuilder.profiles.get(_profileId).toTemplates(_currentClausePath);
      console.log("Template objects", _templates);

      const joinArry = (arr: any[]): string => {
        let _textArr = [] as any[];
        arr.forEach((item: any) => _textArr.push(item.name));
        let str = _textArr.join(" or ");
        return str;
      };

      let _sentence = "";
      _templates[0].data.forEach((item: any) => (_sentence = _sentence + (typeof item.text == "string" ? item.text : joinArry(item.text)) + " "));
      _templates[0].children[0].data.forEach((item: any) => (_sentence = _sentence + (typeof item.text == "string" ? item.text : joinArry(item.text)) + " "));

      console.log(_sentence);

      //
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

        this.lastParent = _.get(this.profile, _parentPath);

        return this.lastParent;
      }
    },
    matchLabel(clause: any): string {
      // derives labels from Iri
      let _entityType = clause.json.entityType ? clause.json.entityType["@id"].split("#")[1] : "";
      let _property = clause.json.property ? clause.json.property["@id"].split("#")[1] : "";

      //adds spaces in between capital letters
      _entityType = _entityType
        .match(/([A-Z]?[^A-Z]*)/g)
        .slice(0, -1)
        .join(" ");

      _property = _property
        .match(/([A-Z]?[^A-Z]*)/g)
        .slice(0, -1)
        .join(" ");

      return _entityType || _property;
    },
    showConnectorV(index: number, uuid: number): boolean {
      //first item at the top
      if (this.profile && this.profile[0] && this.profile[0].uuid == uuid) {
        return false;
      }
      {
        return true;
      }
    },
    showSpaceH(index: number, uuid: string): boolean {
      if (this.profile && this.profile[0] && this.profile[0].uuid == uuid) {
        //if you want the entire clause to be draggable set to true
        return false;
      } else if (_.get(this.profile, `[0].children[${index}].uuid`) == uuid) {
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
      // console.log(this.profile);
      if (this.profile && this.profile[0] && this.profile[0].uuid == uuid) {
        //hide topmost item
        return false;
      } else if (index > 0) {
        return false;
      } else if (_.get(this.profile, "[0].children[0].uuid") == uuid) {
        //hide first item in topmost item
        return false;
      } else {
        return true;
      }
    },
    showCircle(index: number, uuid: number): boolean {
      //first item at the top
      if (this.profile && this.profile[0] && this.profile[0].uuid == uuid) {
        // console.log("uuid", uuid);
        // console.log("json", this.profile);
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
}

.clause-container {
  min-height: 30px;
}

.line-v {
  min-width: 10px;
  margin-left: 5px;
  height: 100%;
  min-height: 5px;
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
