<template>
  <!-- Formatted TTIriRef name  -->
  <template v-if="type == 'clause'">
    Clause
    <!-- <pre class="selector" @click="handleClick">{{ label() }} </pre> -->
  </template>
  <template v-else>
    <div class="  flex items-center max-h-40px">
      <!-- <div class="text-gray-900 font-semibold text-2xl mb-4">Comparison</div> -->
      <Dropdown
        class="max-h-[40px] "
        v-model="comparison"
        :options="getOptions('value', 'value.comparison')"
        optionLabel="name"
        placeholder="Select an option"
      />
      <!-- <div class="text-gray-900 font-semibold text-2xl mb-4">Value</div> -->
      <input class=" outline-sky-600 ml-4 text-2xl text-black font-bold p-1" type="number" :min="min" :value="valueData" />
      <!-- <Slider class="" :min="min" :max="max" v-model="valueData" /> -->
    </div>
  </template>
  <!-- Formatted TTIriRef name  -->
</template>

<script lang="ts">
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { defineComponent } from "vue";
import _ from "lodash";

export default defineComponent({
  name: "Selector",
  props: ["type", "modelValue"],
  methods: {
    setValue(): void {
      const comparisons = this.getOptions("value", "value.comparison");
      console.log("comparison", comparisons);
      this.comparison = comparisons.find(c => c.value == _.get(this.modelValue, "value.comparison"));
      console.log("this.comparison", this.comparison);
      this.valueData = _.get(this.modelValue, "value.valueData");
    },
    onClick(event: any): void {},
    getOptions(type: string, path: string): any {
      return this.options[type].find(option => option.path == path).options;
    }
  },
  mounted() {
    this.setValue();
  },

  
  data() {
    return {
      // comparison: null,
      comparison: {
        name: "less than or equal to",
        value: "LESS_THAN_OR_EQUAL"
      },
      min: 1,
      max: 500,
      valueData: 50,
      options: {
        value: [
          {
            path: "value.comparison",
            type: "enum",
            options: [
              {
                name: "greater than or equal to",
                value: "GREATER_THAN_OR_EQUAL"
              },
              {
                name: "less than or equal to",
                value: "LESS_THAN_OR_EQUAL"
              },
              {
                name: "greater than",
                value: "GREATER_THAN"
              },
              {
                name: "less than",
                value: "LESS_THAN"
              }
            ]
          },
          {
            path: "value.valueData",
            type: "number",
            meta: {
              min: 1,
              max: 10000
            }
          }
        ]
      }
    };
  },
  computed: {
    isCardDragged: {
      get(): boolean {
        return this.$store.state.isCardDragged;
      },
      set(val: boolean): void {
        this.$store.commit("updateIsCardDragged", val);
      }
    }
  }
});
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
