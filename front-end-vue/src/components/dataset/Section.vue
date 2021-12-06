<template>
  <div class="flex w-full px-3">
    <!-- Toggler -->
     <SectionToggler @click="expanded = !expanded" />
    <!-- / Toggler -->

    <!-- Content -->
    <div class="inline-flex flex-col">
      <div class="content w-full flex h-7 ml-5 outline-nonetext-black">
        {{name}}
      </div>
      <div v-show="expanded" class="inline-flex">
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
    SectionToggler,
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

.content {
  font-size: 14px !important;
  font-weight: 500;
}
</style>
