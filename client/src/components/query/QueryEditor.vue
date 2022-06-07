<template>
  <div :class="'query-editor flex justify-between' + [edit ? ' w-full border border-gray-300' : '']">
    <Criteria v-show="edit"></Criteria>
    <QueryDefinition :modelValue="modelValue" :edit="edit" @stopEditing="stopEditing"></QueryDefinition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { QueryDefinition } from "im-library";
// import QueryDefinition from "@/components/query/QueryDefinition.vue";
import Criteria from "@/components/query/Criteria.vue";

export default defineComponent({
  name: "QueryEditor",
  components: {
    QueryDefinition,
    Criteria
  },
  props: ["modelValue", "edit"],
  emits: ["stopEditing"],
  methods: {
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    }
  },

});
</script>

<style scoped></style>
