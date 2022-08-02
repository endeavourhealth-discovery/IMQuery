<template>
  <div class="property group relative cursor-pointer">
    <!-- <div @click="true" class="group-hover:inline rounded-full bg-blue-600 hover:bg-blue-800 absolute hidden -top-2 -left-10">
      <NodeIcon class="m-2  text-white  #hover:text-blue-800 mr-2" strokewidth="3" width="16" height="16" icon="plus" />
    </div> -->
    <NodeIcon
      :class="'ml10 min-w-[10px]' + [notExist || definition?.notExist ? ' text-red-700' : ' text-green-700']"
      strokewidth="3"
      width="14"
      height="14"
      icon="property_first"
    ></NodeIcon>

    <div v-if="definition?.entityInSet" class="horizontal" :updateTarget="['clause', 'view', `${propertyPath}[${propertyIndex}].entityInSet`]">
      <span class="property-name font-normal hover:underline"> {{ "is" }} </span>
      <span v-if="definition.notExist" class="property-name font-normal hover:underline"> {{ `${definition.notExist ? "not " : ""}` }} </span>
      <span class="ml-2 font-normal"> {{ "part of the results of the search" }} </span>
      <NodeIcon
        :class="'ml10 arrow-right' + [definition.notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div
        class="ml10 "
        :updateTarget="['property-entityInSet', 'view', `${propertyPath}[${propertyIndex}]`]"
        v-for="(set, setIndex) in definition?.entityInSet"
      >
        {{ set?.name }}{{ "," }}
      </div>
    </div>
    <selector v-else :updateTarget="['property-@id', 'view', `${propertyPath}[${propertyIndex}]`]">
      <div class="property-name font-normal hover:underline">
        {{ definition?.name }}
      </div>
    </selector>
    <div v-if="definition?.inSet" class="flex-col">
      <selector v-for="(set, setIndex) in definition?.inSet" :key="set['@id']" :updateTarget="['property-inSet', 'view', `${propertyPath}[${propertyIndex}]`]">
        <div class="ml10 flex ">
          <NodeIcon
            :class="'ml10 arrow-right' + [notExist ? ' text-red-700' : ' text-green-700']"
            strokewidth="3"
            width="14"
            height="14"
            icon="arrow_right_small"
          ></NodeIcon
          >{{ set?.name }}
        </div>
      </selector>
    </div>
    <!-- <div v-else-if="definition?.notInSet" :class="'horizontal'">
      <NodeIcon
        :class="'ml10 arrow-right min-w-[10px]' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <selector
        :key="set['@id']"
        :updateTarget="['property', 'view', `${propertyPath}[${propertyIndex}].notInSet[${setIndex}]`]"
        v-for="(set, setIndex) in definition?.notInSet"
      >
        <div class="ml10 ">{{ set?.name }}{{ "," }}</div>
      </selector>
    </div> -->
    <div v-else-if="definition?.value" :class="'flex-col'">
      <div class="horizontal">
        <NodeIcon
          :class="'ml10 arrow-right min-w-[10px]' + [notExist ? ' text-red-700' : ' text-green-700']"
          strokewidth="3"
          width="14"
          height="14"
          icon="arrow_right_small"
        ></NodeIcon>
        <div class="ml10 horizontal">
          <selector :updateTarget="['property-value', 'view', `${propertyPath}[${propertyIndex}]`]">
            {{ comparison(definition?.value?.comparison) }}
          </selector>
          <selector :updateTarget="['property-value', 'view', `${propertyPath}[${propertyIndex}]`]">{{ definition?.value?.valueData }}</selector>
          <selector :updateTarget="['property-value', 'view', `${propertyPath}[${propertyIndex}]`]">
            {{  definition?.function?.argument[0].valueData?.toLowerCase()}}
          </selector>
          <span class="relative -left-[5px]">{{ getText("s") }}</span>
        </div>
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
      <selector
        :updateTarget="['property-concept', 'view', `${propertyPath}[${propertyIndex}].isConcept[${conceptIndex}]`]"
        :key="concept['@id']"
        v-for="(concept, conceptIndex) in definition?.isConcept"
      >
        <div class="font-bold">{{ concept?.name }}</div>
      </selector>
    </div>
    <!-- <div @click="true" class="group-hover:inline absolute hidden -top-1 -right-10">
      <NodeIcon class="ml-4 mt-1 text-red-500 hover:text-red-800 mr-2" strokewidth="3" width="20" height="24" icon="x" />
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NodeIcon from "./NodeIcon.vue";
import Selector from "./Selector.vue";

import _ from "lodash";

export default defineComponent({
  name: "Property",
  props: ["modelValue", "notExist", "path", "propertyPath", "propertyIndex"],
  components: { NodeIcon, Selector },
  data() {
    return {
      // definition: this.modelValue?.property && this.modelValue?.property?.length > 0 ? this.modelValue.property[0] : this.modelValue
    };
  },
  watch: {
    path(oldValue, newValue) {
      this.definition = this.modelValue ? this.modelValue : _.get(this.data, newValue);
    }
  },
  methods: {
    getText(type: string): string {
      if (type == "s") {
        return _.get(this.definition, "function.argument[0].valueData") && _.get(this.definition, "value.valueData") > 1 ? "s" : "";
      }
      return "";
    },

    onClick(TTIriRef: any): void {
      // console.log("ref", this.$refs["overlay-inset"] as any);
      // this.viewEntity(TTIriRef);
    },
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
  },
  computed: {
    definition: {
      get(): any {
        console.log("this.activeQuery", this.activeQuery);
        const path = `${this.path}.${this.propertyPath}[${this.propertyIndex}]`;
        const def = _.get(this.activeQuery, path);
        return def;
      },
      set(val: any): void {}
    },
    activeQuery: {
      get(): any {
        return this.$store.state.queryBuilder.dataSet.get(this.$store.state.activeQueryId);
      },
      set(val: any): void {}
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
