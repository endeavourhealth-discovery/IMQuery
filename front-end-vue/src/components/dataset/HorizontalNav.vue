<template>

  <div class="tab-buttons overflow-y-hidden overflow-x-auto w-full flex">
    <template v-for="item in items" :key="item.id">
      <div
        :class="[
          'tab-button non-selectable inline-flex items-center justify-center rounded-md py-1 px-2 mr-2 font-regular transition duration-500 ease-in-out text-gray-400 font-regular text-base hover:text-black ',
          { 'active text-black': modelValue == item.id },
        ]"
      >
        <!-- Icon -->
        <div class="inline-flex">
          <HeroIcon
            v-if="item.icon"
            strokewidth="2"
            width="24"
            height="24"
            :icon="item.icon"
          />
        </div>

        <div
          class="inline-flex text-base font-medium"
          @click="$emit('update:modelValue', item.id)"
        >
          {{ item.name }}
        </div>
        <div v-if="closable" class="button-close inline-flex ml-2">
          <HeroIcon
            class="text-gray-400 hover:text-red-500"
            strokewidth="2"
            width="16"
            height="16"
            icon="x"
            @click="
              $emit(
                'update:items',
                items.filter((query: any) => query.id != item.id)
              )
            "
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "HorizontalNav.",
  props: ["items", "modelValue", "closable"],
  emits: ["update:modelValue", "update:items"],
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

/* .tab-button {
  border: solid 1px transparent;
} */

.tab-button.active {
  /* border: solid 1px #d0d7de; */
  /* background-color: #F9FAFB; */
  color: #000000;
}
</style>
