<template>
  <div
    class="tab-buttons overflow-y-hidden overflow-x-auto flex items-center justify-center group rounded-lg bg-gray-50 hover:bg-gray-100"
  >
    <template v-for="item in items" :key="item.id">
      <button
        @click="$emit('update:modelValue', item.id)"
        type="button"
        :class="[
          'tab-button px-2 py-1 non-selectable inline-flex items-center justify-center rounded-md transition duration-500 ease-in-out font-regular text-base text-gray-400 hover:text-gray-900',
          { ' text-gray-900 bg-white shadow-sm': modelValue == item.id },
        ]"
      >
        <!-- Icon -->
        <div class="inline-flex">
          <HeroIcon
          :class="[modelValue == item.id ? ' text-blue-500' : ' text-gray-500']"
             :icon="[modelValue == item.id ? 'eye' : 'database']"
            strokewidth="2"
            width="24"
            height="24"
          />
        </div>

        <div
          class="inline-flex text-base font-medium ml-2"
        
        >
          {{ item.name }}
        </div>
        <div v-if="closable" class="button-close inline-flex">
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
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "HorizontalNavbar",
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

.tab-buttons {
  padding: 3px 3px;

}


.button-close {
    margin-top: 2px;
    margin-left: 10px;
}

</style>
