<template>
  <div class="static"><slot></slot></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SearchService from "@/services/SearchService";
import _ from "lodash";

export default defineComponent({
  name: "Static"
});
</script>

<style scoped></style>
