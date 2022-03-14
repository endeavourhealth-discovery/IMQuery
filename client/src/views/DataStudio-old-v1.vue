<template>
  <!-- Content Wrapper -->
  <div class="flex w-full h-full bg-gray-50">
    <!-- Left Panel -->
    <!-- todo: replace w-16 with w-80 once you have more components for left panel  -->
    <div v-if="showLeftPanel" class="inline-flex top-36 bottom-0 left-0 w-16">
      <!-- VerticalTabs -->
      <VerticalTabs
        class="bg-white w-16"
        :items="viewTabs"
        v-model="activeLeftSidenavIndex"
      />
      <!-- /VerticalTabs -->
    </div>
    <!-- Left Panel -->

    <!-- main panel -->
    <div class="w-full h-full bg-white">
      <!-- HorizontalTabs -->
      <HorizontalTabs
        class="w-full bg-gray-50"
        v-model="activeFileIndex"
        :items="fileTabs"
        @closing="removeFile"
      />
      <!-- /HorizontalTabs -->

      <!-- Middle Panel Left -->
      <!-- <div class="h-full inline-flex w-6/12">
        ComponentView
      </div> -->
      <!-- Middle Panel Left  -->

      <!-- Middle Panel  Right   -->
      <div class="h-full w-full inline-flex">
        <!-- Fileview  -->
        <!-- <FileView :activeView="activeViewIndex == 0 ? 'text' : 'graph'" /> -->
        <Curator
          :view="activeView"
        />
        <!-- /Fileview  -->
      </div>
      <!-- Middle Panel  Right   -->
    </div>
    <!-- /main panel -->

    <!-- Right Panel -->
    <div
      v-if="showRightPanel"
      class="absolute top-36 bottom-0 right-0 w-80 bg-gray-500"
    >
      Right Panel
    </div>
    <!-- /Right Panel -->
  </div>
  <!-- /Content Wrapper -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

import LoggerService from "@/services/LoggerService";
// import OverlayPanel from "primevue/overlaypanel";
// import Dialog from "primevue/dialog";
// import Searchbox from "@/components/search/Searchbox.vue"; //replace with autosuggest box (same size but floating + richer suggestions. This is for the dialogue)
// import HeroIcon from "@/components/search/HeroIcon.vue";
import HorizontalTabs from "@/components/search/HorizontalTabs.vue";
import VerticalTabs from "@/components/search/VerticalTabs.vue";
// import ProgressBar from "@/components/search/ProgressBar.vue";

import SearchService from "@/services/SearchService";
import SearchClient from "@/services/SearchClient";
import { MeiliSearch } from "meilisearch";
import Curator from "@/components/dataset/Curator.vue";

export default defineComponent({
  name: "DataStudio",
  components: {
    HorizontalTabs,
    VerticalTabs,
    Curator,
  },
  data() {
    return {
      showLeftPanel: true,
      showRightPanel: false,
      activeLeftSidenavIndex: 0,
      activeFileIndex: 0,
      activeView: "text/piql",
      fileTabs: [
        {
          id: "e33e2650-e2b1-43cb-8cea-8f8725982cfe",
          index: 0,
          name: "Untitled New Query.hql",
          icon: "translate",
          visible: true,
        },
        {
          id: "fdbfecff-01fc-45a8-ae85-c8af12a38699",
          index: 1,
          name: "Example Query.hql",
          icon: "translate",
          visible: true,
        },
        // {
        //   id: "c54655cd-c769-4d96-accb-30297696b64b",
        //   index: 2,
        //   name: "Explore",
        //   icon: "globe",
        //   visible: true,
        // },
        // {
        //   id: "56453291-15e9-40f9-b3fb-e91e4dc37bdf",
        //   index: 3,
        //   name: "Organisations",
        //   icon: "home",
        //   visible: true,
        // },
        // {
        //   id: "863eaedb-448b-44ea-9661-08503b74b5e8",
        //   index: 4,
        //   name: "Dictionary",
        //   icon: "bookOpen",
        //   visible: true,
        // },
        // {
        //   id: "2ac21478-8919-475b-add7-bedee46d9042",
        //   index: 6,
        //   name: "Resources",
        //   icon: "newspaper",
        //   visible: true,
        // },
      ],
      viewTabs: [
        {
          id: "9ea69a5e-14ea-43bd-ad99-b5f67f10447c",
          index: 0,
          name: "Edit",
          icon: "pencil",
          visible: true,
        },
        {
          id: "ffa2a3ac-b819-4378-89b8-cf7299cf559c",
          index: 1,
          name: "Templates",
          icon: "template",
          visible: true,
        },
      ],
      isLoading: false,
    };
  },
  methods: {
    removeFile(tabId: string): void {
      this.fileTabs = this.fileTabs.filter((tab) => tab.id != tabId);
    },
    // activeView(): string | undefined {
    //   console.log("his.activeViewIndex", this.activeViewIndex);
    //   if (this.activeViewIndex == 0) {
    //     return "text";
    //   } else if (this.activeViewIndex == 1) {
    //     return "graph";
    //   }
    // },
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

.floating {
  position: fixed;
}

.floating.right {
}
</style>
