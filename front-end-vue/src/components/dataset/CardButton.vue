<template>
  <button
    :class="
      `select-none cursor-pointer flex flex-col py-4 rounded-lg mx-3 bg-${backgroundColor} hover:bg-${darken(
        backgroundColor
      )} border  border-gray-200 hover:border-gray-300 max-w-200 hover:shadow-md trasition ease-in-out duration-500`
    "
  >
    <div class="flex w-full">
      <HeroIcon :class="`ml-4 inline my-3 text-${iconColor} w-10 h-10`" strokewidth="2" width="24" height="24" :icon="icon" />
      <div class="inline flex flex-col justify-center">
        <span :class="`ml-4 mr-6 text-xl font-bold text-${nameColor}`">
          {{ name }}
        </span>
      </div>
    </div>

    <div :class="`px-4 text-lg text-left font-bold text-${descriptionColor} `">
      {{ description }}
    </div>
  </button>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "CardButton",
  components: {
    HeroIcon
  },
  props: ["icon", "name", "description", "outlined", "shadowed", "iconColor", "nameColor", "descriptionColor", "backgroundColor"],
  methods: {
    //only works if Tailwind is not treeshaking excess utility classes (e.g. CDN import instead of Node.js module)
    darken(color: string): string {
      if (color == "transparent" || color == "transparent") {
        return "gray-50";
      } else {
        let _color = color.substring(0, color.length - 3);
        let _weighing = parseInt(color.substring(color.length - 3, color.length));
        if (_weighing == -50) {
          _color = _color + "-";
          _weighing = 100;
        } else {
          _weighing += 100;
        }
        console.log("_weighing", _weighing);
        console.log("color", _color);
        return _color + _weighing.toString();
      }
    },
    onClick(action: any): void {
      switch (action) {
        case action.module == "datastudio":
          break;

        case action.module == "library":
          break;

        default:
          break;
      }
    }
  }
});
</script>

<style scoped></style>
