<template>
  <div class="tab-buttons font-medium">
    <template v-for="item in items">
      <div
        v-if="item.visible"
        :key="item.name"
        :class="[
          'tab-button non-selectable inline-flex flex-row items-center justify-center transition duration-500 ease-in-out text-gray-600 hover:text-blue-500 ',
          { active: modelValue == item.name },
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
  /* margin-top: 10px; */
  padding-bottom: 2px;
  text-align: center;

}

.tab-button {
  font-size: 14px;
  padding: 0 10px 5px 10px;
  margin: 0 20px 0 0;
  /* border-bottom: solid 3px transparent; */
}

.tab-button.active {
  color: #3b82f6;
  /* border-bottom: solid 2px #3b82f6; */
}
</style>
