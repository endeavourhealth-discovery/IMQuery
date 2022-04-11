<!-- <template>
  <draggable class="dragArea" tag="ul" :list="tasks" :group="{ name: 'g1' }">
    
      <li v-for="el in tasks" :key="el.name">
        <p>{{ el.name }}</p>
        <nested-draggable :tasks="el.tasks" />
      </li>
  </draggable>
</template> -->
<template @mouseleave="isCardDragged = false">
  <draggable
    :list="tasks"
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
    <template #item="{ element, index }">
      <div ref="listGroup" class="">
        <div
          v-if="index == 0"
          class="select-none cursor-pointer text-gray-700 font-medium px-2"
        >
          Include a person if they match all descriptions
        </div>
        <div
          class="select-none cursor-pointer text-black font-bold bg-white rounded-sm mx-5 my-1 px-2 py-1"
        >
          {{ element.name }}
        </div>
        <nested-draggable
          :class="
            'ml-5 dragArea__children' +
              [
                isCardDragged && !element.tasks.length
                  ? ' min-h bg-blue-100'
                  : '',
              ] +
              [!isCardDragged && !element.tasks.length ? ' hidden' : ' ']
          "
          :tasks="element.tasks"
          item-key="name"
          @drag="isCardDragged = true"
          @dragend="isCardDragged = false"
          @drop="isCardDragged = false"
        />

        <!-- <nested-draggable
          v-else
          :class="
            'mt-10 ml-10 bg-gray-300 dragArea__nochildren' +
              [isCardDragged ? ' min-h' : ' hidden']
          "
        /> -->

        <!-- <nested-draggable
          v-if="element.tasks.length"
          class="ml-5"
          :tasks="element.tasks"
          item-key="name"
        />
        <nested-draggable
          v-else-if="onDrag"
          class="ml-5"
          :tasks="element.tasks"
          item-key="name"
        /> -->
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  props: ["tasks", "isParentDragged"],
  components: {
    draggable,
  },

  name: "nested-draggable",
  data() {
    return {
      // isDrag: false,
    };
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
  outline: 1px solid;
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
</style>
