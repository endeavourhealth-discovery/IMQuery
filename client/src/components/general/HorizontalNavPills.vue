<template>
  <div
    class="tab-buttons #drop-zone transition duration-700 ease-in-out overflow-y-hidden overflow-x-auto flex items-center justify-center space-x-0 xl:space-x-3 group rounded-lg bg-white dark:bg-gray-900 "
  >
    <template v-for="item in items" :key="item.iri">
      <button
        draggable="true"
        @click="onClick(item?.iri)"
        type="button"
        :class="
          'tab-button transition duration-500 ease-in-out px-2 py-2 non-selectable inline-flex items-center justify-center font-regular text-base  hover:text-gray-900  dark:hover:text-white' +
            [
              item?.isVisible
                ? 'active border dark:text-white dark:border-yellow-500 border-2 border-gray-300   bg-white dark:bg-gray-900  shadow-sm'
                : 'border border-2 border-transparent dark:border-gray-600 dark:text-gray-400 '
            ]
        "
      >
        <!-- Icon -->
        <!-- <div class="inline-flex">
          <HeroIcon
            :class="[
              modelValue == item.id ? ' text-yellow-500' : ' text-gray-500',
            ]"
            icon="database"
            strokewidth="2"
            width="24"
            height="24"
          />
        </div> -->

        <!-- Name  -->
        <div class="inline-flex font-medium text-2xl ml-2 mr-2">
          {{ item?.name }}
        </div>
        <!-- x button  -->
        <div v-if="closable" class="button-close inline-flex hidden">
          <HeroIcon class="text-gray-400 hover:text-red-500" strokewidth="2" width="16" height="16" icon="x" @click="closeItem(item?.iri)" />
        </div>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";

export default defineComponent({
  name: "HorizontalNavbar",
  props: ["items", "modelValue", "closable"],
  emits: ["update:modelValue", "update:items"],
  components: {
    HeroIcon
  },
  methods: {
    onClick(itemIri: string) {
      // this.$emit("update:modelValue", itemIri);
      this.$store.commit("toggleVisibleOpenFile", itemIri);

      // this.$emit("update:modelValue", itemIri);
    },
    closeItem(itemIri: string) {
      //removes item from state
      // this.$store.commit("closeOpenFile", itemIri);

      // this.$emit(
      //   "update:items",
      //   this.items.filter((item: any) => item.iri != itemIri)
      // );
    }
  },
  // watch: {
  //   modelValue(value: any) {}
  // }
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.drop-zone {
  background-color: #eee;
  margin-bottom: 10px;
  padding: 10px;
}

.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}

.tab-button {
  /* height: 30px; */
  border-radius: 30px;
}

.tab-buttons {
  padding: 10px 3px;
}

.tab-button.active {
  /* color: black; */
  /* border: 3px solid #eab308; */
}

.button-close {
  margin-top: 2px;
  margin-left: 10px;
}

.tab-buttons .tab-button:not(:last-child) {
  margin-right: 5px;
}
</style>
