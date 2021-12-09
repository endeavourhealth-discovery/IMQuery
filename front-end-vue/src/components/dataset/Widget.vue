<template>
  <div
    class="non-selectable widget transition duration-700 easy-in-out bg-white rounded-mdaaa hover:border-b"
  >
    <div
      :class="
        'widget-header flex text-black pt-2 pb-2 pl-2 pr-4 rounded-t-xl' +
          [expanded ? ' border-bottom' : '']
      "
      @click="expanded = !expanded"
    >
      <HeroIcon
        class="widget-icon ml-1 text-white bg-red-600"
        icon="link"
        strokewidth="2"
        width="20"
        height="20"
      />
      <div class="widget-modifier text-blue-600 ml-4 hover:underline">
        {{ criterion.modifier.name }}
      </div>
      <div class="widget-title ml-2 hover:underline font-medium">
        {{ criterion.datamodelEntity.name }}
      </div>
    </div>
    <div v-show="expanded" class="widget-content pb-3 pl-3 rounded-b-xl">
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
  props: ["criterion", "showTooltip"],
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
      // if (!this.showTooltip) {
      //   return "";
      // }

      switch (name) {
        case "Latest":
          return "If the latest health record entry matches the filters below it will be included in your dataset";
        case "All":
          return "If all health record entries match the filters below they will be included in your dataset";
        case "Any":
          return "If any health record entries match the filters below they will all be included in your dataset";
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
  box-sizing: border-box;
  border: 1px solid white;
}

/* .widget-header {
  border-bottom: 1px solid #dadcde;
} */

.widget:hover {
  border: 1px solid #d1d5db;
  -webkit-box-shadow: 0 0 0 1px #dadcde;
  box-shadow: 280ms cubic-bezier(0.4, 0, 0.2, 1);
  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 0 1px ##dadcde;
  background-color: white;
  -webkit-transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* .widget:hover .widget-header {
  border-bottom: 1px solid #d1d5db;
} */

.widget-icon {
  margin-top: 2px;
  width: 20px;
  height: auto;
}

.widget-title {
  font-size: 14px;
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
  border-bottom: 1px solid transparent;
}

.widget-icon {
  width: 26px;
  padding: 4px;
  height: auto;
  margin-top: 2px;
  border-radius: 50%;
}

/* .widget-title {
  width: clamp(300px, 100%, 500px);
} */
</style>
