<template>
  <div class="w-full px-4 py-5 md:grid md:grid-cols-3 md:gap-4 md:px-6">
    <div class="text-md font-medium text-gray-700">{{ name }}</div>
    <div class="mt-1 w-full text-sm sm:mt-0 sm:col-span-2"><slot></slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Row",
  props: ["name"]
});
</script>

<style scoped></style>
