<template>
  <div class="static"><slot></slot></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Static"
});
</script>
