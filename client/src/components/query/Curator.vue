<template>
  <template v-if="template == 'include'">
    <div class="ml-5 mb-2">
      <Curator valueType="enum" :modelValue="'include'" />
      <Span class="mx-2">{{ a }}</Span>
      <Curator valueType="iriref" :modelValue="clause?.valueObject?.entityType"></Curator>
      <Button label="" class="p-button-danger p-button-text" icon="pi pi-trash" />
    </div>
    <slot class="ml-10"></slot>
  </template>
  <template v-else-if="template == 'property'">
    <div class="ml-10 mb-2">
      <Curator valueType="enum" :modelValue="'with'" />
      <Span class="mx-2">a</Span>
      <Curator valueType="iriref" :modelValue="modelValue?.property"></Curator>
      <Span class="mx-2">that</Span>
      <Curator valueType="enum" :modelValue="'valueIn'" />
      <Button label="" class="p-button-danger p-button-text" icon="pi pi-trash" />
    </div>
    <slot></slot>
  </template>

  <template v-if="valueType == 'iriref'">
    {{ modelValue.name }}
    <!-- <Dropdown optionValue="value" v-model="value" :options="options" optionLabel="name" /> -->
  </template>
  <template v-if="valueType == 'set'"> </template>
  <template v-if="valueType == 'concept'"> </template>
  <template v-if="valueType == 'match'"> </template>
  <template v-if="valueType == 'string'">
    <Textarea class="w-full" v-model="value" :autoResize="true" rows="1" c />
    <!-- <InputText class="w-full max-w-6xl" v-model="value" -->
  </template>
  <template v-if="valueType == 'number'"></template>
  <template v-if="valueType == 'enum'">
    <Dropdown optionValue="value" v-model="value" :options="options" optionLabel="name" />
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";

export default defineComponent({
  name: "Curator",
  props: ["index", "template", "clause", "valueType", "path", "modelValue", "target"],
  methods: {
    // a(valueType: string, value: string): any {
    //   const testString = this.enums[valueType].filter((item: any) => item.value === value)[0].name;
    //   if (!testString || testString == "") return "a";
    //   return ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == testString.substring(0, 1).toLowerCase()) ? "an" : "a";
    // }
  },
  data() {
    return {
      value: this.modelValue,
      criteriaType: "Include",
      enums: {
        valueIn: [
          {
            value: "valueIn",
            name: "is in the value set"
          },
          {
            value: "valueNotIn",
            name: "is not the value set"
          }
        ],
        with: [
          {
            value: "with",
            name: "with"
          },
          {
            value: "without",
            name: "without"
          }
        ],
        include: [
          {
            value: "Include",
            name: "Include"
          },
          {
            value: "Exclude",
            name: "Exclude"
          }
        ],
        datamodel: [
          {
            value: "http://endhealth.info/im#Person",
            name: "Person"
          },
          {
            value: "http://endhealth.info/im#Observation",
            name: "Observation"
          },
          {
            value: "http://endhealth.info/im#Event",
            name: "Event"
          }
        ]
      }
    };
  },
  computed: {
    a: {
      get(): any {
        const value = this.clause?.valueObject?.entityType["@id"];
        if (this.template == "include") {
          const testString = this.enums.datamodel.filter((item: any) => item.value === value)[0].name;
          if (!testString || testString == "") return "a";
          return ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == testString.substring(0, 1).toLowerCase()) ? "an" : "a";
        }
      },
      set() {}
    },
    options: {
      get(): any {
         return _.get(this.enums, this.modelValue);
      },
      set(value: any): void {}
    }
  }
});
</script>

<style>
.criteria-item .p-dropdown-trigger {
  display: none !important;
}
.criteria-item .p-dropdown {
  border: none;
  border-radius: 0;

  border-bottom: 3px solid #ced4da !important;
}
.criteria-item .p-dropdown.p-focus {
  border-color: #2196f3 !important;
}
</style>
