<template>
  <div :class="'query-definition ' + [edit ? 'edit ' : '']">
    <!-- <div class="toggle-button">
      <span> Show Details</span>
      <InputSwitch class="ml10" v-model="showDetails" />
    </div> -->
    <!-- <ToggleButton v-model="showDetails" onLabel="Show Details" offLabel="Hide Details" onIcon="pi pi-check" offIcon="pi pi-times" class="toggle-button" /> -->
    <div>
      <Node
        template="MainEntity"
        :object="query"
        path="select.entityType"
        valueType="TTIriRef"
        :highlighted="true"
        operator="and"
        :edit="edit"
        :showDetails="showDetails"
        @updateActiveClause="updateActiveClause"
      >
        <!-- <Node :object="query" path="select.match" valueType="match" operator="and" :highlighted="true" :edit="edit"> </Node> -->
      </Node>
      <div v-if="edit && !query?.match?.length > 0">
        <SearchInput
          :maxResults="2"
          :allow="['preview', 'create', 'insert', '']"
          label="Property or Health Record Entry"
          v-model="searchString"
          @updateActiveClause="updateActiveClause"
        >
        </SearchInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Node from "./Node.vue";
import { mapState } from "vuex";
import SearchInput from "@/components/query/SearchInput.vue";

export default defineComponent({
  name: "QueryDefinition",
  props: ["modelValue", "edit"],
  emits: ["stopEditing", "updateActiveClause"],
  components: { Node, SearchInput },
  computed: {
    ...mapState(["activeClausePath"])
  },
  methods: {
    updateActiveClause(value: any) {
      this.$emit("updateActiveClause", value);
    }
  },
  watch: {
    modelValue(value: any) {
      this.query = value;
    }
  },
  data() {
    return {
      activePath: "",
      query: this.modelValue,
      showDetails: false,
      searchString: ""
    };
  }
});
</script>

<style scoped>
.query-definition::-webkit-scrollbar {
  width: 8px;
}
.query-definition::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
  border-radius: 20px;
}

.query-definition {
  position: relative;
  /* width: 800px; */
  min-width: 700px;
  max-width: 700px;
  width: 100%;
  height: 100%;
  max-height: 750px;
  transition: all 0.2s ease-in;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1.5rem;
  margin-bottom: 3rem;
  background-color: #ffffff;
  /* background-image: linear-gradient(to right, var(--tw-gradient-stops)); */
  /* transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform; */
  transition-duration: 700ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.75rem;
  border-width: 1px;
  border-color: #d1d5db;
}

.query-definition.edit {
  border-width: 0;
  box-shadow: none;
}

.toggle-button {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;

  position: absolute;
  top: 0;
  right: 0;
  margin-right: 1rem;
  margin-top: 1rem;
}

/* .query-definition:not(.edit):hover {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
} */
</style>
