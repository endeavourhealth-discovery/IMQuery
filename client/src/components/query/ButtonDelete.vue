<template>
  <button></button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ButtonDelete.vue",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  methods: {
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    }
  }
});
</script>

<style scoped></style>
