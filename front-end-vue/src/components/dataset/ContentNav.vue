<template>

  <div class="non-selectable flex flex-col h-full w-full">
    <template v-for="(item, index) in items" :key="item.id">
      <template v-if="item.visible">
        <div v-if="index != 0" class="divider"></div>
        <div
          :class="
            'w-full section-title flex py-2 pl-7 overflow-none transition duration-500 ease-in-out text-gray-600 hover:text-blue-600 hover:bg-gray-200 ' +
              [modelValue == item.name ? 'active text-blue-600' : '']
          "
          @click="$emit('update:modelValue', item.name)"
        >
          <div class="inline">
            <HeroIcon
              v-if="item.icon"
              strokewidth="2"
              width="24"
              height="24"
              :icon="item.icon"
              :active="modelValue == item.name"
            />
          </div>

          <div class="inline ml-5">
            {{ item.name }}
          </div>
        </div>
      </template>
    </template>
    <div class="divider-full"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "ContentNav",
  props: ["items", "modelValue"],
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

.section-title {
  font-size: 16px !important;
  font-weight: 500;
  border-right: 2px solid #dfe2e6;
  padding-right: 40px;
}

.section-title.active {
  border-right: 2px solid #3b82f6;
}

.divider {
  height: 15px;
  border-right: 2px solid #dfe2e6;
}

.divider-full {
  height: 100%;
  border-right: 2px solid #dfe2e6;
}


</style>
