<template>
  <div class="flex w-full px-3">
    <div class="section-header flex">
      <!-- Toggler -->
      <!-- <SectionToggler :expanded="expanded" @click="expanded = !expanded" /> -->
      <!-- / Toggler -->

      <div class="section-title w-full flex h-7 ml-5 outline-none text-black">
        {{ name }}
      </div>
    </div>

    <!-- Content -->
    <div class="inline-flex">
<<<<<<< HEAD
      <div v-if="expanded" class="inline-flex">
=======
      <div v-show="expanded" class="inline-flex">
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
        <slot> </slot>
      </div>
    </div>
    <!-- /Content -->
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import SectionToggler from "@/components/dataset/SectionToggler.vue";

export default defineComponent({
  name: "Section",
  props: ["name"],
  components: {
    // SectionToggler,
  },
  data() {
    return {
      expanded: true,
    };
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
  font-size: 14px !important;
  font-weight: 400;
  width: 200px;
}

.section-header {
  padding-top: 6px;
}
</style>
