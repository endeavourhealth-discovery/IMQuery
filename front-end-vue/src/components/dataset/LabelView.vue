<template v-if="modelValue.length">
  <div class="label-view">
    <div
      v-for="(label, labelIndex) in modelValue"
      :key="label['imquery:uuid']"
      :data="label"
      class="label-view__item flex"
    >
      <template
        v-for="(item, itemIndex) in filterOperators(
          label['imquery:jsonPath']['imquery:asArray']
        )"
        :key="item['imquery:uuid']"
      >
        <!-- Shows Operators Only  -->
        <div v-if="labelIndex == 0"></div>
        <div
          v-else-if="
            itemIndex == label['imquery:jsonPath']['imquery:asArray'].length - 1
          "
        ></div>
        <div
          v-else-if="
            isOperatorVisible(
              labelIndex,
              modelValue.length,
              itemIndex,
              filterOperators(label['imquery:jsonPath']['imquery:asArray'])
                .length
            )
          "
          class="inline label-view__operator"
        >
          {{ item["rdfs:label"].split(":")[1] }}
        </div>
        <div v-else class="inline label-view__separator"></div>
      </template>

      <!-- Shows Labels -->
      <div
        class="label-view__label non-selectable font-regular text-blue-600 hover:underline"
      >
        {{ label["rdfs:label"] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LabelView",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  methods: {
    isOperatorVisible(
      labelIndex: number,
      labelCount: number,
      itemIndex: number,
      itemCount: number
    ): boolean {
      // if (itemIndex == itemCount - 1) {
      //   return true;
      // } else if (itemIndex == itemCount - 2) {
      //   return true;
      // } else {
      //   return false;
      // }

      return true;
    },
    updateModelValue(modelValue: string): void {
      this.$emit("update:modelValue", modelValue);
    },
    filterOperators(array: any): any {
      const _filterArray = ["im:and", "im:or", "im:not"];
      const _resultArray = [] as any[];
      array.forEach((item: any, index: number) => {
        if (_filterArray.includes(array[index]["rdfs:label"])) {
          if (
            index < array.length - 1 &&
            array[index + 1]["rdfs:label"] != "0"
          ) {
            _resultArray.push(array[index]);
          }
        }
      });
      // const _resultArray = array.filter((item: any, index: number) => {
      //   return _filterArray.includes(array[index]["rdfs:label"]);
      // });
      return _resultArray;
    },
  },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.label-view__label,
.label-view__operator {
  font-size: 14px;
}

.label-view__operator {
  margin-right: 10px;
  margin-left: 10px;
  width: 25px;
}
.label-view__separator {
  margin-left: 10px;
  width: 25px;
  /* margin-left: 20px; */
}
</style>
