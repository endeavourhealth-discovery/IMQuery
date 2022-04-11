<template>
  <div class="flex m-10">
    <draggable class="dragArea list-group w-full" :list="list" @change="log">
      <template
        class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
        v-for="element in list"
        :key="element.name"
      >
        {{ element.name }}
      </template>
    </draggable>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { VueDraggableNext } from "vuedraggable";
export default defineComponent({
  name: "dragNext",
  components: {
    draggable: VueDraggableNext,
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 },
      ],
      dragging: false,
    };
  },
  methods: {
    log(event) {
      console.log(event);
    },
  },
});
</script>
