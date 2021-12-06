<template>
  <div class="wrapper flex non-selectable">
    <template v-for="(item, index) in items"  :key="item.id">
       <!-- divider  -->
      <!-- <div v-if="index == 0"  class="divider-full gray-300">
      </div> -->
      <!-- divider  -->
      <div
        v-if="item.visible"
       
        :index="item.index"
        :class="[
          'tab-button inline-flex justify-between items-center p-2 text-base non-selectable transition duration-500 ease-in-out text-gray-600 hover:text-blue-500 ',
          { active: modelValue == item.index },
        ]"
        @click="$emit('update:modelValue', item.index)"
      >
        <!-- Icon -->
        <div class="inline mr-2">
          <HeroIcon
            strokewidth="2"
            width="16"
            height="16"
            :icon="item.icon"
            :active="modelValue == item.index"
          />
        </div>
        <!-- / Icon -->

        <div class="inline text-base">
          <div>{{ item.name }}</div>
        </div>
        <div class="inline ml-2" @click="$emit('closing', item.id)">
          <HeroIcon
            class="text-gray-500 hover:text-red-500"
            strokewidth="2"
            width="16"
            height="16"
            icon="x"
          />
        </div>
      </div>
      <!-- divider  -->
      <div v-if="index == items.length -1" class="divider-full gray-300">
      </div>
      <div v-else class="divider gray-300">
      </div>
      <!-- divider  -->
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "HorizontalTabs",
  props: ["items", "modelValue"],
  emits: ["update:modelValue", "closing"],
  components: {
    HeroIcon,
  },
  data() {
    return {
      activeItemIndex: 0,
    };
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

.tab-button.active {
  background-color: #ffffff;
  color: #3b82f6;
  /* border-bottom: solid 2px #3b82f6; */
}

/* .wrapper {
    border-bottom: 1px solid #EEF0F2;
} */

.divider {
  margin-top: 6px;
  margin-bottom: 6px;
  border-right: 1px solid #EEF0F2;
}

.divider-full {
  border-right: 1px solid #EEF0F2;
}
</style>
