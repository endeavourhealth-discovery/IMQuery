<template>
  <div class="property">
    <NodeIcon
      :class="'ml10 min-w-[10px]' + [notExist || definition?.notExist ? ' text-red-700' : ' text-green-700']"
      strokewidth="3"
      width="14"
      height="14"
      icon="property_first"
    ></NodeIcon>
    <div v-if="definition?.entityInSet" class="horizontal">
      <span class="property-name font-normal"> {{ "is" }} </span>
      <span v-if="definition.notExist" class="property-name font-normal"> {{ `${definition.notExist ? "not " : ""}` }} </span>
      <span class="ml-2 font-normal"> {{ "part of the results of the search" }} </span>
      <NodeIcon
        :class="'ml10 arrow-right' + [definition.notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div
        class="ml10 inSet-item hover:underline text-black font-bold cursor-pointer"
        @click="viewEntity(set)"
        v-for="set in definition?.entityInSet || definition?.entityNotInSet"
      >
        {{ set?.name }}{{ "," }}
      </div>
    </div>
    <span v-else class="property-name font-normal"> {{ definition?.name }} </span>
    <div v-if="definition?.inSet" class="horizontal">
      <NodeIcon
        :class="'ml10 arrow-right' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div class="ml10 inSet-item hover:underline text-black font-bold cursor-pointer" @click="viewEntity(set)" v-for="set in definition?.inSet">
        {{ set?.name }}{{ "," }}
      </div>
    </div>
    <div v-else-if="definition?.notInSet" :class="'horizontal'">
      <NodeIcon
        :class="'ml10 arrow-right min-w-[10px]' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div class="ml10 inSet-item hover:underline text-black font-bold cursor-pointer" @click="viewEntity(set)" v-for="set in definition?.notInSet">
        {{ set?.name }}{{ "," }}
      </div>
    </div>
    <div v-else-if="definition?.value" :class="'horizontal'">
      <NodeIcon
        :class="'ml10 arrow-right min-w-[10px]' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div class="ml10 ">
        {{ comparison(definition?.value?.comparison) + " " }} {{ definition?.value?.valueData + " " }}
        {{ definition?.function?.argument[0].valueData?.toLowerCase()


        }}{{definition?.function?.argument[0].valueData && definition?.value?.valueData > 1 ? "s" : "" }}
      </div>
    </div>
    <div v-else-if="definition?.isConcept" class="horizontal">
      <NodeIcon
        :class="'ml10 arrow-right' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div class="ml10 inSet-item hover:underline text-black font-bold cursor-pointer" @click="viewEntity(set)" v-for="concept in definition?.isConcept">
        {{ concept?.name }}{{ "," }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NodeIcon from "./NodeIcon.vue";

import _ from "lodash";

export default defineComponent({
  name: "Property",
  props: ["modelValue", "notExist"],
  components: { NodeIcon },
  data() {
    return {
      definition: this.modelValue?.property && this.modelValue?.property?.length > 0 ? this.modelValue.property[0] : this.modelValue
    };
  },
  watch: {
    modelValue() {
      this.definition = this.modelValue?.property && this.modelValue?.property?.length > 0 ? this.modelValue.property[0] : this.modelValue;
    }
  },
  methods: {
    setDefinition(definition: any) {
      this.definition = definition;
    },
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
      const url = `https://dev.endhealth.co.uk/viewer/#/concept/${encodeURIComponent(entity["@id"])}`;
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
