<template @mouseleave="isCardDragged = false">
  <draggable
    :list="children"
    item-key="name"
    :class="
      'clauseselect-none cursor-pointer dragArea rounded-sm order-color-300 ' +
        [isCardDragged ? ' ' : '']
    "
    ghost-class="bg-blue-300"
    :group="{ name: 'g1' }"
    tag="div"
    h="auto"
    @drag="isCardDragged = true"
    @dragend="isCardDragged = false"
    @drop="isCardDragged = false"
    @mouseleave="isCardDragged = false"
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
            <div
              v-if="index == 0"
              :class="
                'line-h inline-block  text-green-700 font-semibold '
              "
            >
              ––
            </div>
            <div v-else class="line-h"></div>
            <!-- <div v-else class="line-v"> -->
            <!-- </div> -->
            <div class="inline-flex flex-col">
              <!-- circle  -->
              <div :class="'circle inline border  b-2 border-green-700'"></div>
              <!-- :line  -->
              <div
                v-if="index != children.length - 1"
                :class="'line-v inline border-l b-2 border-l-green-700'"
              ></div>
            </div>
          </div>

          <div class="clause-content inline flex-col relative">
            <!-- Named Clause - Name  -->
            <template v-if="element.type == 'match'">
              <template v-if="true">
                <button
                  class="clause-named__name ml-5 cursor-pointer font-medium text-left text-xl block transition duration-300 ease-in-out rounded-md border border-transparent relative z-0 focus:z-10 focus:ring-blue-600 focus:outline-none focus:ring-2"
                >
                  {{ element.name }}
                </button>
              </template>
              <template v-else-if="false">
                <textarea
                  :value="element.name"
                  class="clause-named__name ml-5 text-xl select-none cursor-pointer text-black font-medium text-left bg-white rounded-sm  pr-2 pt-1 py-2 relative"
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
              :isTopLevelNode="false"
              :isParentNegated="element.include == false"
              :class="
                'dragArea__children' +
                  [
                    isCardDragged && !element.children.length
                      ? ' min-h bg-blue-100'
                      : ' ',
                  ] +
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
import { faTasks } from "@fortawesome/free-solid-svg-icons";

export default defineComponent({
  props: ["children", "isParentNegated"],
  components: {
    draggable,
  },

  name: "nested-draggable",
  data() {
    return {
      childrenText: {
        1: {
          or: "",
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
    },
  },
  computed: {
    isCardDragged: {
      get(): boolean {
        return this.$store.state.isCardDragged;
      },
      set(val: boolean): void {
        this.$store.commit("updateIsCardDragged", val);
      },
    },
  },
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

/* .clause-connector {
  width: 60px;
} */

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

  margin: 3px 0px 5px 0px;
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

.line-v {
  /* visibility: hidden; */
  min-width: 10px;
  max-width: 10px;
  margin-left: 6px;
  /* padding-left: 20px; */
  height: 100%;
  min-height: 5px;
}


.line-h {
  /* visibility: hidden; */
  min-width: 10px;
  margin: 0 2px 0 0;
  /* height: 100%; */
  min-height: 40px;
}


</style>
