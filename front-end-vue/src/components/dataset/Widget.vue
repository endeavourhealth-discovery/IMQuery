<template>
  <div
    class="non-selectable widget transition duration-700 easy-in-out bg-white rounded-xl"
  >
    <div
      :class="
        'widget-header flex text-black pt-2 pb-3 pl-3 pr-4 rounded-t-xl' +
          [expanded ? ' border-bottom' : '']
      "
      @click="expanded = !expanded"
    >
      <HeroIcon
        class="widget-icon ml-1"
        :icon="[
          criterion.datamodelEntity.iri == 'im:EpisodeOfCare'
            ? 'clipboard_copy'
            : '',
        ] + [
          criterion.datamodelEntity.iri == 'im:ProblemOrCondition'
            ? 'flag'
            : '',
        ]"
        strokewidth="2"
        width="16"
        height="16"
      />
      <div
        class="widget-modifier text-blue-600 ml-3"
        v-tooltip.bottom="parseTooltipText(criterion.modifier.name)"
      >
        {{ criterion.modifier.name }}
      </div>
      <div
        class="widget-title ml-3"
        v-tooltip.bottom="criterion.datamodelEntity.iri"
      >
        {{ criterion.datamodelEntity.name }}
      </div>
    </div>
    <div v-show="expanded" class="widget-content pb-3 pl-5 pt-1 rounded-b-xl">
      <template v-for="node in criterion.constraints" :key="node.id">
        <Constraint :node="node" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import Constraint from "@/components/dataset/Constraint.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "Widget",
  props: ["criterion"],
  components: {
    HeroIcon,
    Constraint,
  },
  data() {
    return {
      expanded: true,
    };
  },
  methods: {
    parseTooltipText(name: string): string {
      switch (name) {
        case "Latest":
          return "If the latest health record entry matches the filters below it will be included in your dataset";
        case "All":
          return "If all heatlh record entries match the filters below they will be included in your dataset";
        case "Any":
          return "If any heatlh record entries match the filters below they will all be included in your dataset";
        default:
          return "";
      }
 
    },
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
  border: 1px solid white;
  box-sizing: border-box;
}

.widget:hover {
  border: 1px solid #d1d5db;
  box-sizing: border-box;
}
.widget:hover .border-bottom  {
    border-bottom: 1px solid #d1d5db;
}


.widget-icon {
  margin-top: 2px;
  width: 20px;
  height: auto;
}

.widget-content {
  background: white /*#f9fafb*/;
}

.drop-shadow {
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.13);
}

.widget-header {
  font-size: 14px !important;
  font-weight: 500;
}

/* .widget-title {
  width: clamp(300px, 100%, 500px);
} */

</style>
