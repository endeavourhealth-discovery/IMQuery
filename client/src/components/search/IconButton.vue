<template>
  <!-- <button
    class="nons-selectable transition duration-400 ease-in-out w-14 group relative ml-3 py-2 px-4 border border-transparent rounded-md text-white bg-blue-500 hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
    @click="activePageName = 'Search'"
  >
    <span class="absolute left-0 inset-y-0 flex items-center pl-3">
      <HeroIcon
            strokewidth="2"
            width="24"
            height="24"
            :icon="this.icon"
          />
    </span>
  </button> -->

  <button
    class="block px-4 py-2 text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50  disabled:opacity-50 disabled:cursor-not-allowed"
    @click="activePageName = 'Search'"
  >
    <span class="absolute left-0 inset-y-0 flex items-center pl-3">
      <HeroIcon
            strokewidth="2"
            width="24"
            height="24"
            :icon="this.icon"
          />
    </span>
  </button>

</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "IconButton",
  components: {
      HeroIcon
  },
  props: ["icon"],
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}
</style>
