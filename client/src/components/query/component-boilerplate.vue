<template>
  
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "",
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

</style>
