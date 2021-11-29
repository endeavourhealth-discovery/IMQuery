<template>
  <div class="content-container">
    <div class="summary-container">
      <template v-for="(config, index) in configs" :key="index">
        <component
          :is="config.type"
          :label="config.label"
          :data="concept[config.predicate]"
          :size="config.size"
          :id="config.type + index"
          :show="showItem(config, index)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SemanticProperties from "./definition/SemanticProperties.vue";
import DataModelProperties from "./definition/DataModelProperties.vue";
import ArrayObjectNamesToStringWithLabel from "@/components/generics/ArrayObjectNamesToStringWithLabel.vue";
import TextHTMLWithLabel from "@/components/generics/TextHTMLWithLabel.vue";
import TextWithLabel from "@/components/generics/TextWithLabel.vue";
import ObjectNameWithLabel from "@/components/generics/ObjectNameWithLabel.vue";
import ArrayObjectNameListboxWithLabel from "@/components/generics/ArrayObjectNameListboxWithLabel.vue";
import TermsTable from "@/components/concept/definition/TermsTable.vue";
import TextSectionHeader from "@/components/generics/TextSectionHeader.vue";
import SectionDivider from "@/components/generics/SectionDivider.vue";
import Axioms from "@/components/concept/definition/Axioms.vue";

export default defineComponent({
  name: "Definition",
  components: {
    SemanticProperties,
    DataModelProperties,
    ArrayObjectNamesToStringWithLabel,
    TextHTMLWithLabel,
    TextWithLabel,
    ObjectNameWithLabel,
    ArrayObjectNameListboxWithLabel,
    TermsTable,
    TextSectionHeader,
    SectionDivider,
    Axioms
  },
  props: ["concept", "configs"],
  methods: {
    showItem(config: any, index: number): boolean {
      let dataResults = [];
      if (config.type === "SectionDivider") {
        let i = index - 1;
        while (i > 0) {
          const data = this.concept[this.configs[i].predicate];
          if (this.configs[i].type === "SectionDivider") {
            break;
          }
          dataResults.push(this.hasData(data));
          i--;
        }
      } else if (config.type === "TextSectionHeader") {
        let i = index + 1;
        const data = this.concept[this.configs[i].predicate];
        while (i < this.configs.length) {
          if (this.configs[i].type === "SectionDivider") {
            break;
          }
          dataResults.push(this.hasData(data));
          i++;
        }
      } else {
        const data = this.concept[this.configs[index].predicate];
        dataResults.push(this.hasData(data));
      }
      const show = !dataResults.every(value => value === false);
      return show;
    },

    hasData(data: any): boolean {
      if (!data) {
        return false;
      } else if (Array.isArray(data)) {
        return data.length ? true : false;
      } else if (typeof data === "string") {
        return data ? true : false;
      } else if (Object.prototype.toString.call(data) === "[object Object]" && Object.prototype.hasOwnProperty.call(data, "count")) {
        return data.count ? true : false;
      } else if (Object.prototype.toString.call(data) === "[object Object]") {
        return Object.keys(data).length ? true : false;
      } else {
        console.log("Unexpected data type encountered for function hasData in definition");
        return false;
      }
    }
  }
});
</script>

<style scoped>
.content-container {
  height: 100%;
}

.summary-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  width: 100%;
  row-gap: 0.5rem;
}

.summary-container ::v-deep(.expand-button) {
  height: 1.5rem !important;
  width: 0.75rem !important;
  padding: 0.4375rem 0.7rem !important;
  margin-left: 0.5rem;
}
</style>
