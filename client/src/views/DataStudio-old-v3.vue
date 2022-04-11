<template>
  <!-- Content Wrapper -->
  <div class="wrapper  flex w-full h-full bg-gray-50">
    <!-- Sidenav  -->
    <div class="wrapper-sidenav flex flex-col align-center px-5">
      <div class="editor-nav rounded-xl bg-white w-16 drop-shadow">
        <div class="flex justify-center align-center">
          <RoundButton
            class="w-10 h-10 my-5"
            :rounded="true"
            :showRing="true"
            backgroundColor="blue-500"
            hoverBackgroundColor="blue-600"
            textColor="white"
            ringColor="blue-600"
            v-tooltip.right="'<b> Add </b>'"
            @click="activeView = 'Add'"
          >
            <HeroIcon strokewidth="2" width="20" height="20" icon="plus" />
          </RoundButton>
        </div>

        <VerticalButtonGroup :items="sideNavItems" v-model="activeView" />
      </div>
    </div>

    <!-- Sidenav  -->

    <BackgroundCards class="bg-wrapper hidden" />

    <QueryEditor class="section-center" />

    <div class="section-right"></div>
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
import VerticalButtonGroup from "@/components/dataset/VerticalButtonGroup.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "DataStudio",
  components: {
    QueryEditor,
    BackgroundCards,
    VerticalButtonGroup,
    RoundButton,
    HeroIcon,
  },
  data() {
    return {
      showBackgroundCards: true,
      activeFileIndex: 0,
      activeView: "Edit",
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

      sideNavItems: [
        {
          id: "ba793059-b5b1-457a-84a9-32f3d2c4800b",
          index: 0,
          name: "Home",
          title: "Home",
          icon: "home",
          visible: true,
        },
        {
          id: "9ea69a5e-14ea-43bd-ad99-b5f67f10447c",
          index: 1,
          name: "Edit",
          title: "Open Editor",
          icon: "pencil",
          visible: true,
        },
        {
          id: "ffa2a3ac-b819-4378-89b8-cf7299cf559c",
          index: 2,
          name: "View",
          title: "View Data",
          icon: "cube_transparent",
          visible: true,
        },
        {
          id: "4fc82f08-18e4-49e4-91f9-061e87521b0c",
          index: 3,
          name: "Search",
          title: "Search This Document",
          icon: "search",
          visible: false,
        },
        {
          id: "90f245fb-cafe-43d0-8c72-bb1b685ebaf5",
          index: 4,
          name: "Suggestions",
          title: "See Suggestions",
          icon: "light_bulb",
          visible: false,
        },
        {
          id: "b6f0fbdc-3632-4eda-9801-83c6951169f6",
          index: 5,
          name: "Help",
          title: "Get Help",
          icon: "question_mark_circle",
          visible: true,
        },
        {
          id: "34f406e9-5784-4c1e-8f8e-52352a63aeba",
          index: 6,
          name: "Settings",
          title: "Change Settings",
          icon: "cog",
          visible: false,
        },
      ],

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

/* .wrapper {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
} */

.section-center {
  /* position: absolute; */
  margin-left: 10px;
  margin-top: 15px;
  margin-right: 15px;
  /* bottom: 15px; */
  width: 100%;
  max-width: 1000px;
  /* box-shadow: rgb(207 210 218) 0px 0px 6px; */ /* lighter shadow   */
  box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.3);
}

.drop-shadow {
  border: 1px solid #d0d7de;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
}

.wrapper-sidenav {
  margin-top: 20vh;
}
</style>
