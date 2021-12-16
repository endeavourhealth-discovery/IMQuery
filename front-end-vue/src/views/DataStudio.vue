<template>
  <!-- Content Wrapper -->
  <div class="wrapper flex w-full h-full bg-white">
    <!-- Sidenav  -->
    <div class="wrapper-sidenav w-full bg-white flex flex-col align-center"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
    >
      <div class="flex justify-center align-center border-right">
        <RoundButton
          class="w-10 h-10 my-5 "
          :rounded="true"
          :showRing="true"
          backgroundColor="blue-500"
          hoverBackgroundColor="blue-600"
          textColor="white"
          ringColor="blue-600"
          v-tooltip.right="'<b> Create </b>'"
          @click="activeView = 'Add'"
        >
          <HeroIcon strokewidth="3" width="22" height="22" icon="plus" />
        </RoundButton>
      </div>

      <!-- <VerticalButtonGroup :items="availableViews" v-model="activeView" /> -->
      <!--Content Nav -->
      <ContentNav
        class="inline w-full h-full"
        :expanded="expanded"
        :items="sideNavItems"
        v-model="sideNavActiveItem"
      />
      <!-- /Content Nav -->
    </div>

    <!-- Sidenav  -->

    <BackgroundCards class="bg-wrapper hidden" />

    <QueryEditor class="section-center w-full" :sideNavActiveItem="sideNavActiveItem" />

    <div class="section-right w-full">
      <HorizontalNav
        class="section-right-nav w-full border-bottom px-5 py-3"
        v-model:items="rightPanelItems"
        v-model="activeRightPanelItemId"
        :closable="false"
      />
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
// const { MeiliSearch } = require("meilisearch");
import HorizontalNav from "@/components/dataset/HorizontalNav.vue";
import QueryEditor from "@/components/dataset/QueryEditor.vue";
import BackgroundCards from "@/components/dataset/BackgroundCards.vue";
import VerticalButtonGroup from "@/components/dataset/VerticalButtonGroup.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import EntityService from "@/services/EntityService";
import ContentNav from "@/components/dataset/ContentNav.vue";

export default defineComponent({
  name: "DataStudio",
  components: {
    QueryEditor,
    BackgroundCards,
    // VerticalButtonGroup,
    RoundButton,
    HeroIcon,
    HorizontalNav,
    ContentNav
  },
  data() {
    return {
      expanded: false,
      showBackgroundCards: true,
      activeFileIndex: 0,
      activeView: "Edit",
      availableViews: [
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
          icon: "question_mark_cricle",
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
      sideNavActiveItem: "Sources",
      sideNavItems: {
        search: {
          id: "c1a1c191-11e1-4864-8305-286292486e15",
          name: "Search Library",
          icon: "search",
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
        mainDataType: {
          id: "f1e2cde5-2c4a-4411-862f-3ed2f9ed2c15",
          name: "Main Data Type",
          icon: "collection",
          visible: true,
          children: [],
        },
        filters: {
          id: "b3b0368b-8dfe-496b-8697-c3dfb6756b6b",
          name: "Steps",
          icon: "template",
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
        request: {
          id: "9a326f4e-67a7-4331-a4ad-ba075fba8e6d",
          name: "Save or Export",
          icon: "download",
          visible: true,
          children: [],
        },
        view: {
          id: "e1c3a8c1-96ad-475f-a5b2-18426e0c8ff6",
          name: "View Data",
          icon: "cube_transparent",
          visible: true,
          children: [],
        },
      },
      isLoading: false,
      activeRightPanelItemId: "13dba7f7-9d06-4f0a-9c60-cbb4d9518b47",
      rightPanelItems: [
        {
          id: "13dba7f7-9d06-4f0a-9c60-cbb4d9518b47",
          name: "Suggestions",
        },
        {
          id: "fbb192ca-d2ec-4d82-9228-94e23e5b753f",
          name: "All",
        },
        {
          id: "f31a59498-a835-4313-8124-22468a709a0c",
          name: "Favourites",
        },
      ],
    };
  },
  async mounted() {
    await this.$store.dispatch("fetchDatamodel");
    // console.log("datamodel fetched: ", this.$store.state.datamodel);
  },
  methods: {
    async getEntitySummary(iri: string): Promise<any> {
      await EntityService.getEntitySummary(iri)
        .then((res) => {
          // console.log("summary fetched " + iri + " :", res.data);
          this.$store.state.datamodel.map((entity: any) => {
            if ((entity.iri = iri)) {
              entity.summary = res.data;
            }
          });

          return res.data;
        })
        .catch((err) => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get data model properties from server",
              err
            )
          );
        });
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

.section-center {
  /* position: absolute; */
  /* margin-left: 10px; */
  /* margin-top: 15px; */
  /* margin-right: 15px; */
  /* bottom: 15px; */
  width: 100%;
  /* max-width: 1000px; */
  /* box-shadow: rgb(207 210 218) 0px 0px 6px; */ /* lighter shadow   */
  /* box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.3); */
  border-right: 1px solid #ecefed;
}

.border-right {
  border-right: 1px solid #ecefed;
  /* box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3); */
}

.wrapper-sidenav {
  top: 0;
  bottom: 0;
  width: 80px;
}


.wrapper-sidenav:hover {
  width: 325px;
}

.section-right {
  width: 400px;
}

.border-bottom {
  border-bottom: 1px solid #ecefed;
}

.section-right-nav {
  /* height: 80px; */
}
</style>
