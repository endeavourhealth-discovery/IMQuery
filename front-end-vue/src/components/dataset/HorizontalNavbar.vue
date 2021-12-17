<template>
  <div class="tab-buttons font-medium h-full flex  justify-end">
    <template v-for="item in items">
      <div
        v-if="item.visible"
        :key="item.name"
        :class="[
          'tab-button non-selectable inline-flex items-center mt-2 border border-transparent justify-center transition duration-500 ease-in-out text-gray-600 hover:text-blue-500 '
         + [modelValue == item.name ? ' active text-blue-500' : ''],
        ]"
        @click="$emit('update:modelValue', item.name)"
      >
        <!-- Icon -->
        <div class="inline-flex mr-2">
          <HeroIcon
            strokewidth="2"
            width="24"
            height="24"
            :icon="item.icon"
            :active="modelValue == item.name "
          />
        </div>

        <!-- / Icon -->

        <div class="inline-flex">
          <div>{{ item.name }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "HorizontalNavbar",
  props: ["items", "modelValue"],
  emits: ["update:modelValue"],
  components: {
    HeroIcon,
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

.tab-buttons {
  width: 100%;
  text-align: center;

}

.tab-button {
  font-size: 14px;
  padding: 0 10px 5px 10px;
  /* margin-right: 1%; */
  /* border-bottom: solid 3px transparent; */
}

.tab-button.active {
  border-bottom: 2px solid #3b82f6;  /* blue-700 #1d4ed8*/
}
</style>
