<template>
  
</template>

<script lang="ts">
<<<<<<< HEAD
import { defineComponent } from "vue";

export default defineComponent({
  name: "",
=======
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "TailwindButton",
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
  props: ["modelValue"],
  emits: ["update:modelValue"],
   methods: {
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    },
  },
});
</script>

<style scoped>

<<<<<<< HEAD
=======
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
</style>
