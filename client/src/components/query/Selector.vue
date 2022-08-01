<template>
  <div :class="'selector  ' + getClasses()" @click="onToggle">
    <slot> </slot>
  </div>
  <OverlayPanel ref="overlay-selector">
    <!-- Formatted TTIriRef name  -->
    <template v-if="type == 'clause'">
      Clause
      <!-- <pre class="selector" @click="handleClick">{{ label() }} </pre> -->
    </template>
    <template v-else-if="type =='default'">
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
  </OverlayPanel>
</template>

<script lang="ts">
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { defineComponent } from "vue";
import _ from "lodash";

export default defineComponent({
  name: "Selector",
  props: ["type", "modelValue", "updateTarget"],
  methods: {
    getType(): string{
      const propertyPath = this.updateTarget[2]
      return;
      //###todo: check -> determine what the thing you are editing is e.g. is it a section?, property id?, etc -> this determines type
    },
    getClasses(): any {
      return "";
      // return this.$vnode.data.staticClass;
    },
    onToggle(event: any): void {
      this.commitTarget(...this.updateTarget);
      (this.$refs["overlay-selector"] as any).toggle(event); //show();
    },
    commitTarget(targetType: string, targetAction: string, propertyPath: string) {
      // console.log(this.path);
      // console.log(this.definition);

      const payload = {
        propertyPath: propertyPath,
        targetType: targetType,
        targetAction: targetAction
      };

      console.log("updateTarget", payload);

      this.$store.commit("updateTarget", payload);
    },
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
      type: "default",
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
