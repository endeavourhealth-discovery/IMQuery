<template @mouseleave="isCardDragged = false">
  <draggable
    :list="children"
    item-key="name"
<<<<<<< HEAD
    :class="'clause before:select-none cursor-pointer dragArea rounded-md order-color-300 ' + [isCardDragged ? ' ' : '']"
    ghost-class="ghost"
=======
    :class="
      'clause select-none cursor-pointer dragArea rounded-sm order-color-300 ' +
        [isCardDragged ? ' ' : '']
    "
    ghost-class="bg-blue-300"
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
    :group="{ name: 'g1' }"
    tag="div"
    h="auto"
    @drag="isCardDragged = true"
    @dragend="isCardDragged = false"
    @drop="isCardDragged = false"
<<<<<<< HEAD
=======
    @mouseleave="isCardDragged = false"
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
  >
    <!-- Each item in list  -->
    <template #item="{ element, index }">
      <div class="clause-item flex flex-col relative">
        <!-- <div
          v-if="index == 0"
          class="inline-flex select-none cursor-pointer text-gray-700 font-medium pb-2 "
        ></div> -->
        <div class="inline-flex">
          <div class="clause-connector inline-flex flex">
<<<<<<< HEAD
            <div v-if="index == 0" :class="'space-h inline-block text-white font-semibold '">
              ––
            </div>
            <div v-else class="space-h"></div>
            <!-- <div v-else class="line-v"> -->
            <!-- </div> -->
            <div class="inline-flex flex-col">
              <!-- circle  -->
              <div v-if="showCircle(index, element.uuid)" :class="'circle inline border  b-2 border-white'"></div>
              <!-- :line  -->
              <div v-if="index != children.length - 1" :class="'line-v inline border-l b-2 border-l-white'"></div>
            </div>
          </div>

          <div
            class="clause-content inline flex-col relative rounded-md"
            v-wave="{
              color: 'currentColor',
              easing: 'ease-out',
              duration: 0.3,
              initialOpacity: 0.2,
              finalOpacity: 0.1,
              cancellationPeriod: 75
            }"
          >
=======
            <div
              v-if="index == 0"
              :class="
                'inline-block  text-indigo-700 font-semibold hover:text-blue-600  hover:underline'
              "
            >
              ––
            </div>
            <div v-else class="line-v">

            </div>
            <div class="inline-flex flex-col">
              <!-- circle  -->
              <div :class="'circle inline border  b-2 border-blue-600'"></div>
              <!-- :line  -->
              <div
                v-if="index != children.length - 1"
                :class="'line-h inline border-r  b-2 border-r-blue-700'"
              ></div>
            </div>
          </div>

          <div class="clause-content inline flex-col relative">
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
            <!-- Named Clause - Name  -->
            <template v-if="element.type == 'match'">
              <template v-if="true">
                <button
<<<<<<< HEAD
                  class="clause-named__name ml-5 cursor-pointer font-medium text-left text-xl block transition duration-300 ease-in-out rounded-md border border-transparent relative z-0 focus:z-10  outline-none"
=======
                  class="cursor-pointer block transition duration-300 ease-in-out rounded-md border border-transparent relative z-0 focus:z-10 focus:ring-blue-600 focus:outline-none focus:ring-2"
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
                >
                  {{ element.name }}
                </button>
              </template>
              <template v-else-if="false">
                <textarea
                  :value="element.name"
<<<<<<< HEAD
                  class="clause-named__name ml-5 text-xl select-none cursor-pointer text-black font-medium text-left bg-white rounded-sm  pr-2 pt-1 py-2 relative"
=======
                  class="clause-named__name select-none cursor-pointer text-black font-bold bg-white rounded-sm  pr-2 pt-1 py-2 relative"
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
                >
                </textarea>
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
<<<<<<< HEAD
              :data="data"
              :isTopLevelNode="false"
              :isParentNegated="element.include == false"
              :class="
                'dragArea__children' +
                  [isCardDragged && !element.children.length ? ' min-h bg-blue-100' : ' '] +
=======
              :isParentNegated="element.include == false"
              :class="
                'dragArea__children' +
                  [
                    isCardDragged && !element.children.length
                      ? ' min-h bg-blue-100'
                      : ' ',
                  ] +
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
                  [!isCardDragged && !element.children.length ? ' hidden' : ' ']
              "
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
<<<<<<< HEAD

export default defineComponent({
  props: ["data", "children", "isParentNegated", "isTopLevelNode"],
  components: {
    draggable
  },
=======
import { faTasks } from "@fortawesome/free-solid-svg-icons";

export default defineComponent({
  props: ["children", "isParentNegated"],
  components: {
    draggable,
  },

>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
  name: "nested-draggable",
  data() {
    return {
      childrenText: {
        1: {
          or: "",
<<<<<<< HEAD
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
    showCircle(index: number, uuid: number): boolean {
      return true;
      if (this.data && this.data[0] && this.data[0].uuid == uuid) {
        console.log("uuid", uuid);
        console.log("data", this.data);
        return false;
      } else {
        return true;
      }
    },
=======
          and: "",
        },
        2: {
          or: "either feature",
          and: "both features",
        },
        default: {
          or: "any feature",
          and: "all features",
        },
      },
    };
  },
  methods: {
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
    toggleOperator(element: any): void {
      if (element.operator == "or") {
        element.operator = "and";
      } else {
        element.operator = "or";
      }
    },
    toggleInclude(element: any): void {
      element.include = !element.include;
    },
    operatorLabel(element: any): string {
      if (this.children.length == 1) {
        return this.childrenText[1][element.operator];
      } else if (this.children.length == 2) {
        return this.childrenText[2][element.operator];
      } else {
        return this.childrenText.default[element.operator];
      }
<<<<<<< HEAD
    }
=======
    },
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
  },
  computed: {
    isCardDragged: {
      get(): boolean {
        return this.$store.state.isCardDragged;
      },
      set(val: boolean): void {
        this.$store.commit("updateIsCardDragged", val);
<<<<<<< HEAD
      }
    }
  }
=======
      },
    },
  },
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
});
</script>
<style scoped>
.dragArea {
  /* max-height: 800px; */
  /* overflow-y: visible; */
  /* display: absolute; */
  min-width: 300px;
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

<<<<<<< HEAD
/* .clause-connector {
  width: 60px;
} */


.ghost {
  background-color: #93c5fd;
  border-radius: 5px;
}

=======
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
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

<<<<<<< HEAD
.clause-named__name {
}

.circle {
  /* visibility: hidden; */

  margin: 3px 0px 5px 0px;
=======
.circle {
  /* visibility: hidden; */

  margin: 5px 10px 5px 0px;
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
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

<<<<<<< HEAD
.line-v {
  /* visibility: hidden; */
  min-width: 10px;
  max-width: 10px;
  margin-left: 6px;
  /* padding-left: 20px; */
  height: 100%;
  min-height: 5px;
}

.space-h {
  /* visibility: hidden; */
  min-width: 10px;
  margin: 0 5px 0 0;
=======
.line-h {
  /* visibility: hidden; */
  width: 10px;
  height: 100%;
  /* min-height: 25px; */
}


.line-v {
  /* visibility: hidden; */
  min-width: 10px;
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
  /* height: 100%; */
  min-height: 40px;
}


<<<<<<< HEAD
.ghost .space-h,
.ghost .line-v {
visibility: hidden;
}

=======
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
</style>
