<template>
  <div :class="'query-editor flex' + [edit ? ' w-full border border-gray-300' : '']">
    <QueryDefinition :modelValue="modelValue" :edit="edit" @stopEditing="stopEditing"></QueryDefinition>
    <!-- <Criteria v-show="edit"></Criteria> -->
    <SearchInput  v-show="edit" class="ml-20" v-model="searchString"> </SearchInput>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// import { QueryDefinition } from "im-library";
import SearchInput from "@/components/query/SearchInput.vue";
import QueryDefinition from "@/components/query/QueryDefinition.vue";
import Criteria from "@/components/query/Criteria.vue";

export default defineComponent({
  name: "QueryEditor",
  components: {
    QueryDefinition,
    Criteria,
    SearchInput
  },
  data() {
    return {
      searchString: ""
    };
  },
  props: ["modelValue", "edit", "stopEditing"],
  emits: ["stopEditing"],
  methods: {
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    }
  },

});
</script>

<style scoped></style>
