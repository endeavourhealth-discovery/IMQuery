<template>
  <div class="keyword"><slot></slot></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SearchService from "@/services/SearchService";
import _ from "lodash";

export default defineComponent({
  name: "Keyword"
});
</script>

<style scoped></style>
