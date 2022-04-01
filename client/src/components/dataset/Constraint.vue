<template>
  <div class="w-full non-selectable" v-if="node.children">
    <template v-if="node.itemType == 'item'">
      <div class="w-full flex pt-2 pr-5">
        <div
          class="inline text-black font-semibold hover:underline"
        >
          {{ node.children[0].datamodelProperty.property.name }}
        </div>
        <div class="inline ml-2 text-black hover:underline">
          {{ node.children[0].comparisons[0].comparisonOperator }}
        </div>
        <div v-if="node.children[0].comparisons[0].comparators.length" class="inline font-semibold ml-2 text-blue-600 hover:underline">
          {{ node.children[0].comparisons[0].comparators[0].value.name }}
        </div>
      </div>
    </template>

    <!-- child nodes  -->
    <Constraint v-for="node in node.children" :key="node.id" :node="node">
    </Constraint>
    <!-- /child nodes  -->
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
// import Constraint from "@/components/dataset/Constraint.vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "Constraint",
  props: ["node"],
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.row {
  font-size: 12px !important;
}

</style>
