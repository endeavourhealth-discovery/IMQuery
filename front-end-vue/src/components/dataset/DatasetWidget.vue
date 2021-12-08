<template>
  <div class="non-selectable widget pt-1 pb-2 px-3 transition duration-700 easy-in-out bg-white">
    <div class="widget-header flex text-black">
      <HeroIcon
        class="widget-icon mt-1"
        icon="archive"
        strokewidth="2"
        width="14"
        height="14"
      />
      <div class="widget-title ml-3" v-tooltip.bottom="target.iri">
        {{ target.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
// import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "DatasetWidget",
  props: ["target"],
  components: {
    HeroIcon,
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

.widget {
  border: 1px solid transparent;
  box-sizing: border-box;
  border-radius: 7px;
}

.widget:hover {
    border: 1px solid #d1d5db;
    background: white;/* #f9fafb;*/
}

.drop-shadow {
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.13);
}

.widget-header {
  font-size: 14px !important;
  font-weight: 500;
}

.widget-icon {
  width: 20px;
  height: auto;
}
</style>
