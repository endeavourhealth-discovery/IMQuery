<template>
  <button v-if="type == 'add'" class="group-hover:inline hidden  rounded-full bg-blue-600 hover:bg-blue-800 absolute -translate-y-2 left-1 z-40">
    <NodeIcon class="m-2  text-white  #hover:text-blue-800 mr-2" strokewidth="3" width="16" height="16" icon="plus" />
  </button>
  <button v-else-if="type == 'view'" class="group-hover:inline hidden  rounded-full bg-gray-600 hover:bg-gray-800 absolute -translate-y-2 right-[60px] z-40">
    <NodeIcon class="m-2  text-white  #hover:text-blue-800 mr-2" strokewidth="3" width="16" height="16" icon="eye" />
  </button>
  <button
    v-else-if="type == 'edit'"
    class="group-hover:inline hidden  rounded-full bg-yellow-600 hover:bg-yellow-800 absolute -translate-y-2 right-[30px] z-40"
  >
    <NodeIcon class="m-2  text-white  #hover:text-blue-800 mr-2" strokewidth="3" width="16" height="16" icon="pencil" />
  </button>
  <button v-else-if="type == 'delete'" class="group-hover:inline hidden  rounded-full bg-red-600 hover:bg-red-800 absolute -translate-y-2 -left-[25px] z-40">
    <NodeIcon class="m-2  text-white  #hover:text-blue-800 mr-2" strokewidth="3" width="16" height="16" icon="trash" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NodeIcon from "./NodeIcon.vue";

export default defineComponent({
  name: "ButtonCRUD",
  props: ["modelValue", "type"],
  components: { NodeIcon },
  emits: ["update:modelValue"],
  methods: {
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    }
  }
});
</script>

<style scoped></style>
