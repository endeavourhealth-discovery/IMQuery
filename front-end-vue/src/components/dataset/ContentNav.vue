<template>
  <div class="non-selectable flex flex-col">
    <template v-for="(item, index) in items" :key="item.id">
      <template v-if="item.visible">
        <div v-if="index != 0" class="divider"></div>
        <div
          :class="
            'w-full section-item flex pl-2 overflow-none transition duration-500 ease-in-out text-gray-500' +
              [modelValue == item.name ? ' active text-blue-600' : '']
          "
          @click="$emit('update:modelValue', item.name)"
        >
          <div
            :class="
              'section-title w-full flex py-2 px-3' +
                [modelValue == item.name ? ' text-blue-600' : '']
            "
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

            <div
              v-if="expanded"
              :class="
                'inline ml-5 text-black' +
                  [modelValue == item.name ? ' text-blue-600' : '']
              "
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div v-if="item.seperator" class="separator"></div>
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
  props: ["items", "modelValue", "expanded"],
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

.section-item {
  font-size: 16px !important;
  font-weight: 400;
  border-right: 1px solid #ecefed;
  /* padding-right: 20px; */
}

.separator {
  padding-top: 10px;
  border-right: 1px solid #ecefed;
  border-bottom: 1px solid #ecefed;
}

.section-item:hover {
  background-color: #f6f8fa;
}

/* .section-item.active .section-title {
  color: #3b82f6;
} */

.section-item.active {
  border-right: 2px solid #3b82f6;
}

.divider {
  height: 15px;
  border-right: 1px solid #ecefed;
}

.divider-full {
  height: 100%;
  border-right: 1px solid #ecefed;
}
</style>
