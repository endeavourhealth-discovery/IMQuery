<template>
  <div class="wrapper flex flex-col items-center non-selectable transition duration-5q00 ease-in-out">
    <template v-for="item in items" :key="item.id">
      <!-- divider  -->
      <!-- <div v-if="index == 0"  class="divider-full gray-300"  >
      </div> -->
      <!-- divider  -->
      <div
        v-if="item.visible"
        :key="item.id"
        :class="[
          'inline-flex flex items-center p-2 my-2 text-base text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600',
          { 'text-blue-600': modelValue == item.name },
        ]"
        @click="updateValue(item.name)"
        v-tooltip.right="'<b>' + item.title + '</b>'"
      >
        <!-- Icon -->
        <div class="inline">
          <HeroIcon
            strokewidth="2"
            width="24"
            height="24"
            :icon="item.icon"
            :active="modelValue == item.name"
          />
        </div>
        <!-- / Icon -->
      </div>
      <!-- divider  -->

      <!-- <div v-if="index != items.length - 1" class="divider gray-300"></div> -->
      <!-- divider  -->
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "VerticalButtonGroup",
  props: ["items", "modelValue"],
  emits: ["update:modelValue"],
  components: {
    HeroIcon,
  },
  methods: {
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
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

.wrapper {
  /* border-right: 1px solid #eef0f2; */
}

</style>
