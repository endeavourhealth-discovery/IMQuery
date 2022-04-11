<template>
  <div class="tab-buttons font-medium h-full flex justify-center">
    <template v-for="item in items">
      <div
        v-if="item.visible"
        :key="item.name"
        :class="[
          'tab-button non-selectable inline-flex items-center justify-center transition duration-500 ease-in-out dark:hover:text-white ' +
            [
              modelValue == item.name
                ? ' dark:text-white  text-blue-600 border-b border-b-2 border-b-blue-500 dark:border-b-0 '
                : ' text-black dark:text-gray-400 border-b-transparent'
            ]
        ]"
        @click="onClick(item.name, item.hyperlink ? item.hyperlink : '')"
        v-wave="{
          color: 'currentColor',
          easing: 'ease-out',
          duration: 0.3,
          initialOpacity: 0.2,
          finalOpacity: 0.1,
          cancellationPeriod: 75
        }"
      >
        <!-- Icon -->
        <div v-if="showicon" class="inline-flex mr-2">
          <HeroIcon strokewidth="2" width="24" height="24" :icon="item.icon" />
        </div>

        <!-- / Icon -->

        <div class="inline-flex text-2xl">
          <div>{{ item.name }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";

export default defineComponent({
  name: "HorizontalNavbar",
  props: ["items", "modelValue", "showicon"],
  emits: ["update:modelValue"],
  components: {
    HeroIcon
  },
  methods: {
    onClick(itemName: string, hyperlink: string = ""): void {
      if (hyperlink && hyperlink != "") {
        window.open(hyperlink, "_blank");
      } else {
        this.$emit("update:modelValue", itemName);
      }
    }
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
