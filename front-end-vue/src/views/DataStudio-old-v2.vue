<template>
  <!-- Content Wrapper -->
  <div class="wrapper relative flex w-full h-full bg-gray-50">
    <BackgroundCards class="bg-wrapper hidden" />
    <ContentNav class="section-left" :items="contentNavItems" v-model="contentNavActiveItem" />
    <QueryEditor class="section-center" />
    <div class="section-right">

    </div>
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
// import HorizontalTabs from "@/components/search/HorizontalTabs.vue";
// import VerticalTabs from "@/components/search/VerticalTabs.vue";
// import ProgressBar from "@/components/search/ProgressBar.vue";

// import SearchService from "@/services/SearchService";
// import SearchClient from "@/services/SearchClient";
// import { MeiliSearch } from "meilisearch";
import QueryEditor from "@/components/dataset/QueryEditor.vue";
import BackgroundCards from "@/components/dataset/BackgroundCards.vue";
import  ContentNav from "@/components/dataset/ContentNav.vue";

export default defineComponent({
  name: "DataStudio",
  components: {
    QueryEditor,
    BackgroundCards,
    ContentNav,
  },
  data() {
    return {
      showBackgroundCards: true,
     
      activeFileIndex: 0,
      activeView: "text/piql",
      openDocuments: [
        {
          id: "e33e2650-e2b1-43cb-8cea-8f8725982cfe",
          index: 0,
          name: "CHD 005",
          icon: "translate",
          visible: true,
        },
        {
          id: "fdbfecff-01fc-45a8-ae85-c8af12a38699",
          index: 1,
          name: "DM 005",
          icon: "translate",
          visible: true,
        },
      ],
      contentNavActiveItem: "b3b0368b-8dfe-496b-8697-c3dfb6756b6b",
      contentNavItems: {
         mainDataType: {
          id: "f1e2cde5-2c4a-4411-862f-3ed2f9ed2c15",
          name: "Main Data Type",
          icon: "collection",
          visible: true,
          children: [],
        },
        definitions: {
          id: "81746109-05c2-427a-a0dd-74620f0ecd4e",
          name: "Templates",
          icon: "hashtag",
          visible: true,
          children: [],
        },
        filters: {
          id: "b3b0368b-8dfe-496b-8697-c3dfb6756b6b",
          name: "Filters",
          icon: "adjustments",
          visible: true,
          children: [],
        },
        output: {
          id: "b51ccc58-91da-4cf1-bcfb-a77256af7ccb",
          name: "Output",
          icon: "cube",
          visible: true,
          children: [],
        },
        sources: {
          id: "fde56326-f646-45cc-9fa2-97e294d192da",
          name: "Sources",
          icon: "office_building",
          visible: true,
          children: [],
        },
        request: {
          id: "9a326f4e-67a7-4331-a4ad-ba075fba8e6d",
          name: "Save or Export",
          icon: "download",
          visible: true,
          children: [],
        },
      },
      isLoading: false,
    };
  },
  methods: {},
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.wrapper {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

@media (min-width: 300px) {
  .section-center {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  /* #todo: not working for some reason  */
  .bg-wrapper {
    display: relative !important;
  }
}

@media (min-width: 850px) {
  .section-center {
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    height: 85%;
    width: 100%;
    max-width: 800px;
    /* box-shadow: rgb(207 210 218) 0px 0px 6px; */ /* lighter shadow   */
    box-shadow: 0px 4px 22px 0px rgba(0, 0, 0, 0.42);
  }
}

@media (min-width: 1200px) {
  .section-center {
    margin-left: 30px;
    margin-right: auto;
    margin-top: 10px;
    height: 84%;
  }
}

@media (min-width: 1600px) {
  .section-center {
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    height: 84%;
  }
}

.section-center {
  position: relative;
  z-index: 100;
}

.section-left {
  position: absolute;
  left: 10%;
  top: 10%;
  z-index: 90;
}

</style>
