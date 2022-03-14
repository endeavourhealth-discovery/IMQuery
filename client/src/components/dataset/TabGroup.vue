<template>
  <!-- <template v-slot:[dynamicSlotName] v-if="activeTabIndex == 2"> </template> -->

  <template v-for"tab in tabs" :key="tab.id"> 

  <slot name="tab" :item="tab" class="tab-content">
    {{tab.text}}
  </slot>
  </template>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "TabGroup",
  props: ["update:modelValue", "tabs"],
  emits: ["update:modelValue"],
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.tab-content {
  width: 100%;
  height: 100%;
}
</style>
