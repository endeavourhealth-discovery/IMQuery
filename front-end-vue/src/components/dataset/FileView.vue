<template>

 <div class="w-full h-full bg-white p-4" >

 
 <!-- Graph  -->
  <Network
    v-if="activeView == 'graph'"
    class="w-full h-full bg-white"
    :nodeList="nodes"
    :linkList="links"
    :nodeSize="nodeSize"
    :linkWidth="linkWidth"
    :linkDistance="linkDistance"
    :svgTheme="svgTheme ? 'dark' : 'light'"
    :bodyStrength="bodyStrength"
  ></Network>
  <!-- /Graph  -->
  <!-- Text Curator  -->
  <Curator  v-if="activeView == 'text' || activeView == 'curator'" :view="activeView" />
  <!-- /Text Curator  -->
 </div>

 
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import Network from "@/components/dataset/Network.vue";
import Curator from "@/components/dataset/Curator.vue";
// import PillNavbar from "@/components/dataset/PillNavbar.vue";

export default defineComponent({
  name: "FileView",
  components: {
    Network,
    Curator,
    // PillNavbar,
  },
  props: ["activeView"],
  data() {
    return {
      views: [
        {
          name: "graph",
          visible: true,
          index: 0,
        },
        {
          name: "text",
          visible: true,
          index: 1,
        },
      ],
      showLeftPanel: false,
      showRightPanel: false,
      autocompleteData: null,
      showSettingCard: false,
      nodeSize: 20,
      linkWidth: 4,
      linkDistance: 100,
      bodyStrength: -400,
      svgTheme: false, // false = light, true = dark
      nodes: [
        { id: "Dataset", group: 1 },
        { id: "Filters", group: 2 },
        { id: "Output", group: 3 },
        { id: "ANY Registration Status", group: 4 },
        { id: "Registered", group: 4 },
        { id: "AT Anytime1", group: 4 },
        { id: "AT Anytime2", group: 4 },
        { id: "GP Practices in London", group: 4 },
        { id: "LATEST Registration Status", group: 5 },
        { id: "Deregistered", group: 5 },
        { id: "Dead", group: 5 },
        { id: "BEFORE 01/01/2019", group: 5 },
        { id: "OR", group: 5 },
      ],
      links: [
        { source: "Dataset", target: "Filters", value: "has" },
        { source: "Dataset", target: "Output", value: "has" },
        {
          source: "Filters",
          target: "ANY Registration Status",
          value: "INCLUDE IF",
        },
        {
          source: "ANY Registration Status",
          target: "Registered",
          value: "is",
        },
        {
          source: "ANY Registration Status",
          target: "AT Anytime1",
          value: "starting",
        },
        {
          source: "ANY Registration Status",
          target: "AT Anytime2",
          value: "ending",
        },
        {
          source: "ANY Registration Status",
          target: "GP Practices in London",
          value: "at",
        },
        {
          source: "Filters",
          target: "LATEST Registration Status",
          value: "EXCLUDE IF",
        },
        {
          source: "LATEST Registration Status",
          target: "OR",
          value: "is",
        },
        {
          source: "OR",
          target: "Deregistered",
          value: "",
        },
        {
          source: "OR",
          target: "Dead",
          value: "",
        },
        {
          source: "LATEST Registration Status",
          target: "BEFORE 01/01/2019",
          value: "ending",
        },
      ],
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

.float {
  position: fixed;
  z-index: 10;
  overflow: auto;
  margin-left: auto;
  top: 150px;
  right: 15px;
  height: 400px;
  width: 400px;
  overflow-y: hidden;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
