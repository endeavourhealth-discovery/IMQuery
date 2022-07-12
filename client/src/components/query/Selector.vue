<template>
  <!-- Formatted TTIriRef name  -->
  <pre v-if="type == 'clause'" class="selector" @click="handleClick">{{ label() }} </pre>
  <!-- Formatted TTIriRef name  -->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Selector",
  props: ["path", "modelValue", "edit", "type"],

  methods: {
    label(): any {
      let label: string = this.modelValue.name;
      if (label && label != "") label = label.replaceAll("--", "\n    •");
      return label;
    },
    handleClick(event: any): void {
      if (this.edit) {
        // (this.$refs["overlay-selector"] as any).toggle(event);
      } else {
        // #todo: open query in IM Viewer or New IM Query windowF
      }

      console.log("modelValue", this.modelValue);
      console.log("path", this.path);
    }
  },
  data() {
    return {
      maxSuggestions: 6,
      hasSearched: false,
      searchString: ""
    };
  }
});
</script>

<style scoped>
.selector {
  font-family: inherit;
  white-space: -o-pre-wrap;
  white-space: pre-wrap;
  word-wrap: break-word;
  display: inline-flex;
  font-weight: 600;
  color: #2563eb;
}

</style>
