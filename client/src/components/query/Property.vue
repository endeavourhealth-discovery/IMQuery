<template>
  <div class="property">
    <NodeIcon
      :class="'ml10 min-w-[10px]' + [notExist ? ' text-red-700' : ' text-green-700']"
      strokewidth="3"
      width="14"
      height="14"
      icon="property_first"
    ></NodeIcon>
    <span class="property-name font-normal"> {{ modelValue?.name }} </span>
    <div v-if="modelValue?.inSet" class="horizontal">
      <NodeIcon
        :class="'ml10 arrow-right' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div class="ml10 inSet-item hover:underline" @click="viewEntity(set)" v-for="set in modelValue?.inSet">{{ set?.name }}{{ "," }}</div>
    </div>
    <div v-else-if="modelValue?.notInSet" :class="'horizontal'">
      <NodeIcon
        :class="'ml10 arrow-right min-w-[10px]' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div class="ml10 inSet-item hover:underline" @click="viewEntity(set)" v-for="set in modelValue?.notInSet">{{ set?.name }}{{ "," }}</div>
    </div>
    <div v-else-if="modelValue?.value" :class="'horizontal'">
      <NodeIcon
        :class="'ml10 arrow-right min-w-[10px]' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div class="ml10 ">
        {{ comparison(modelValue?.value?.comparison) + " " }} {{ modelValue?.value?.valueData + " " }}
        {{ modelValue?.function?.argument[0].valueData?.toLowerCase()






        }}{{modelValue?.function?.argument[0].valueData && modelValue?.value?.valueData > 1 ? "s" : "" }}
      </div>
    </div>
    <div v-else-if="modelValue?.isConcept" class="horizontal">
      <NodeIcon
        :class="'ml10 arrow-right' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div class="ml10 inSet-item hover:underline" @click="viewEntity(set)" v-for="concept in modelValue?.isConcept">{{ concept?.name }}{{ "," }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NodeIcon from "./NodeIcon.vue";

export default defineComponent({
  name: "Property",
  props: ["modelValue", "notExist"],
  components: { NodeIcon },
  methods: {
    comparison(comparison: string): string {
      switch (comparison) {
        case "GREATER_THAN_OR_EQUAL":
          return "greater than or equal to";
        case "LESS_THAN_OR_EQUAL":
          return "less than or equal to";
        case "GREATER_THAN":
          return "greater than";
        case "LESS_THAN":
          return "less than";
        default:
          return comparison;
      }
    },
    viewEntity(entity: any): void {
      const url = `https://dev.endhealth.co.uk/viewer/#/concept/${encodeURIComponent(entity['@id'])}`;
      window.open(url, "_blank").focus();
    }
  }
});
</script>

<style scoped>
.property {
  display: flex;
  /* padding: 4px 0; */
  /* padding-top: 20px; */
  font-size: 13px;
  /* flex-wrap: wrap; */
}

.property-name {
  margin-left: 16px;
}

.arrow-right {
  position: relative;
  top: 4px;
}
</style>
