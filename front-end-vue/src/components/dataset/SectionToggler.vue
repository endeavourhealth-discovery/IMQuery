<template>
  <RoundButton
    class="section-toggler non-selectable w-8 h-8 hover:bg-gray-100 p-1"
    :rounded="true"
    :showRing="true"
    backgroundColor="white"
    hoverBackgroundColor="white"
    ringColor="blue-600"
  >
    <HeroIcon
      :class="expanded ? ' text-gray-400' : 'text-blue-500'"
      :icon="expanded ? 'chevron_down' : 'chevron_right'"
      strokewidth="2"
      width="20"
      height="20"
    />
  </RoundButton>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "SectionToggler",
  props: ["expanded"],
  emits: ["toggle"],
  components: {
    RoundButton,
    HeroIcon,
  },
  // data() {
  //   return {
  //     expanded: true,
  //   };
  // },
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
