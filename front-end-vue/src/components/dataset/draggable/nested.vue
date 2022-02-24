<template @mouseleave="isCardDragged = false">
  <draggable
    :list="children"
    item-key="name"
    :class="
      'select-none cursor-pointer dragArea rounded-sm order-color-300 ' +
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
      <div class="flex flex-col relative">
        <div
          v-if="index == 0"
          class="inline-flex select-none cursor-pointer text-gray-700 font-medium pb-2 "
        >
          <div>
            <div
              @click="toggleInclude(element)"
              :class="
                'inline border b-1 px-2 py-0.5 rounded-md text-white ' +
                  [element.include ? ' bg-green-600' : ' bg-red-600']
              "
            >
              {{ element.include ? " Include" : " Exclude" }}
            </div>
            <!-- <div
              :class="
                'inline border b-1 pl-2 pr-1 py-0.5 rounded-md text-white ' +
                  [element.include ? ' bg-green-600' : ' bg-red-600']
              "
            >
              Include
            </div> -->
            <div class="inline">
              a person if they match
            </div>
            <div
              v-if="operatorLabel(element) && operatorLabel(element) != ''"
              @click="toggleOperator(element)"
              :class="
                'inline border b-1 px-2 py-0.5 rounded-md text-white ' +
                  [
                    element.operator == 'all'
                      ? ' bg-blue-600'
                      : ' bg-indigo-600',
                  ]
              "
            >
              {{ operatorLabel(element) }}
            </div>
          </div>
        </div>
        <div class="inline-flex">
          <div class="inline-flex flex-col">
            <!-- circle  -->
            <div :class="' inline border circle b-2 border-blue-600'"></div>
            <!-- :line  -->
            <div
              v-if="index != children.length - 1"
              :class="'inline  border-r line-h b-2 border-r-blue-700'"
            ></div>
            <!-- <div
              v-if="element.children.length"
              :class="'inline border circle b-2 border-blue-600'"
            ></div> -->
          </div>
          <div class="inline flex-col">
            <div
              class="select-none cursor-pointer text-black font-bold bg-white rounded-sm my-1 pr-2 py-1 relative -translate-y-2"
            >
              {{ element.name }}
            </div>
            <nested-draggable
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
          any: "",
          all: "",
        },
        2: {
          any: "either feature",
          all: "both features",
        },
        default: {
          any: "any feature",
          all: "all features",
        },
      },
    };
  },
  methods: {
    toggleOperator(element: any): void {
      if (element.operator == "any") {
        element.operator = "all";
      } else {
        element.operator = "any";
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
  min-width: 200px;
}

.dragArea__nochildren {
}

.min-h {
  min-height: 25px;
  height: 25px;
  /* min-width: 200px; */
  /* width: 200px; */
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

.circle {
  /* visibility: hidden; */

  margin: 5px 10px 5px 0px;
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

.line-h {
  /* visibility: hidden; */
  width: 7px;
  height: 100%;
  /* min-height: 25px; */
}
</style>
