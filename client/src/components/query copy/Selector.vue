<template>
  <!-- Formatted TTIriRef name  -->
  <pre v-if="type == 'clause'" class="iriref selector" @click="handleClick">{{ label() }} </pre>
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
  /* word-break: break-all; */
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.selector__overlay {
  background-color: #fff;
}

.selector__input {
  background-color: transparent;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  min-width: 400px;
  height: 40px;
  width: 100%;
  padding-left: 10px;
}

.suggestions {
  display: flex;
  justify-items: between;
  flex-direction: column;
  margin-top: 10px;
}

.suggestions .suggestion {
  color: #000;
  font-weight: 600;
  font-size: 14px;
  padding: 5px 5px 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.suggestions .suggestion:hover {
  background-color: #e5e7eb;
}
.suggestions .suggestion-action {
  color: #fff;
  /* margin-bottom: 10px; */
  margin-right: 10px;
  font-weight: 600;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
}

.suggestion-action.rename {
  display: inline-flex;
  background-color: #fbbf24;
}

.suggestion-action.rename:hover {
  background-color: #d97706;
}
.suggestion-action.change {
  display: inline-flex;
  background-color: #64748b;
}

.suggestion-action.change:hover {
  background-color: #1f2937;
}

.suggestion-label {
  display: inline-flex;
}
</style>
