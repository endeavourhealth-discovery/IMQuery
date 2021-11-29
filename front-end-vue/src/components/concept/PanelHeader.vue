<template>
  <div id="entity-panel-header-text" :key="icon">
    <i :class="icon" :style="color" aria-hidden="true" />
    {{ header }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getColourFromType, getIconFromType } from "@/helpers/ConceptTypeMethods";

export default defineComponent({
  name: "PanelHeader",
  props: ["types", "header"],
  data() {
    return {
      icon: "",
      color: ""
    };
  },
  watch: {
    types(newValue) {
      if (newValue.length > 0) {
        this.color = "color: " + getColourFromType(newValue);
        this.icon = getIconFromType(newValue);
      }
    }
  }
});
</script>

<style scoped></style>
