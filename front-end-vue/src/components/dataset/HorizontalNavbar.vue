<template>
  <div class="tab-buttons font-medium h-full flex justify-center">
    <template v-for="item in items">
      <div
        v-if="item.visible"
        :key="item.name"
        :class="[
          'tab-button non-selectable inline-flex items-center border-b border-b-2 mt-2 justify-center transition duration-500 ease-in-out hover:text-blue-500 ' +
            [modelValue == item.name ? ' text-blue-600 border-b-blue-500' : ' text-gray-700 border-b-transparent']
        ]"
        @click="$emit('update:modelValue', item.name)"
      >
        <!-- Icon -->
        <div v-if="showicon" class="inline-flex mr-2">
          <HeroIcon strokewidth="2" width="24" height="24" :icon="item.icon" />
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
  props: ["items", "modelValue", "showicon"],
  emits: ["update:modelValue"],
  components: {
    HeroIcon
  }
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
</style>
