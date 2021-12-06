<template>
  <side-nav />
  <div class="layout-main">
    <div id="uprn-home">
      <TabView v-model:activeIndex="active" :lazy="true">
        <TabPanel header="Single address lookup">
          <div
            class="uprn-panel-content"
            id="address-lookup-container"
            :style="contentHeight"
          >
            <AddressLookup />
          </div>
        </TabPanel>
        <TabPanel header="Address file workflow">
          <div
            class="uprn-panel-content"
            id="file-workflow-container"
            :style="contentHeight"
          >
            <FileWorkflow />
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import AddressLookup from "@/views/uprn/AddressLookup.vue"; 
import FileWorkflow from "@/views/uprn/FileWorkflow.vue";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Uprn",
  components: {
    SideNav,
    AddressLookup,
    FileWorkflow
  },
  data() {
    return {
      contentHeight: "",
      active: 0
    };
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(): void {
      this.setContentHeight();
    },

    setContentHeight(): void {
      const container = document.getElementById("uprn-home") as HTMLElement;
      const nav = container?.getElementsByClassName(
        "p-tabview-nav"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      if (container && nav && currentFontSize) {
        const calcHeight =
          container.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          2 * currentFontSize -
          1;
        this.contentHeight =
          "height: " + calcHeight + "px; max-height: " + calcHeight + "px;";
      } else {
        this.contentHeight =
          "height: calc(100vh - 7rem);max-height: calc(100vh - 7rem);";
        LoggerService.error(
          "UPRN content sizing error",
          "Failed to get element(s) for UPRN content resizing"
        );
      }
    }
  }
});
</script>

<style scoped>
#uprn-home {
  height: 100%;
}

#address-lookup-container {
  position: relative;
}

@media screen and (max-width: 767px) {
  #file-workflow-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      "upload"
      "description"
      "examples"
      "refresh"
      "table";
  }
}

@media screen and (min-width: 768px) {
  #file-workflow-container {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      "upload description examples"
      "refresh refresh refresh"
      "table table table";
  }
}

#file-workflow-container {
  width: 100%;
  display: grid;
  gap: 1rem 1rem;
  align-items: start;
  overflow: auto;
  background-color: #ffffff;
}

.p-tabview-panels {
  height: 100%;
}
</style>
