<template v-if="modelValue.length">
  <div class="label-view">
    <div
      v-for="(label, labelIndex) in modelValue"
      :key="label['imquery:uuid']"
      :data="label"
      class="label-view__item flex"
    >
      <template
        v-for="(item, itemIndex) in filteredPath(
          label['imquery:jsonPath']['imquery:asArray']
        )"
        :key="item['imquery:uuid']"
      >
        <!-- Shows Operators Only  -->
        <!-- <div v-if="labelIndex == 0"></div> -->
        <!-- <div
          v-else-if="
            itemIndex == label['imquery:jsonPath']['imquery:asArray'].length - 1
          "
        ></div> -->
        <div
          v-if="
            isOperatorVisible(
              labelIndex,
              modelValue.length,
              itemIndex,
              filteredPath(label['imquery:jsonPath']['imquery:asArray']).length
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
  props: ["modelValue", "pathIris"],
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
    filteredPath(array: any): any {
      const _resultArray = [] as any[];

      //only allows iris in the path if they are pathIri prop e.g. im:and, im:or, im:not
      const addToResults = (index: any) =>
        this.pathIris.includes(array[index]["item"]) &&
        _resultArray.push(array[index]);

      if (array.length && array[array.length - 2]["item"] != 0) {
        addToResults(array.length - 3);
      } else {
        // addToResults(array.slice(0, array.legnth - 3));
        array.slice(0, array.length - 3).forEach((item: any, index: number) => {
          addToResults(index);
        });
      }

      //alternatively  do a for loop for all X/Y coordinates and decice which AND/OR/NOTs are hidden based on patterns
      // e.g. in a vertical row, every duplicate node should have their first node REMOVED
      // ee/g/

      // addToResults(array.length - 3);

      // array.forEach((item: any, index: number) => {
      //   if (
      //     index < array.length - 2 &&
      //     array[array.length - 2]["rdfs:label"] == 0
      //   ) {
      //     addToResults(array.length - 3);
      //   } else {
      //     // addToResults(array.length - 2);
      //   }
      // });

      // array.forEach((item: any, index: number) => {
      //   if (
      //     index < array.length - 2 &&
      //     array[index + 1]["rdfs:label"] == 0 &&
      //     array[index + 2]["rdfs:label"] == "rdfs:label"
      //   ) {
      //     console.log("t");
      //   } else {
      //     addToResults(index);
      //   }
      // });

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
  margin-left: 10px;
  font-size: 14px;
}

.label-view__operator {
  margin-left: 10px;
  width: 25px;
}
.label-view__separator {
  margin-left: 10px;
  width: 25px;
  /* margin-left: 20px; */
}
</style>
