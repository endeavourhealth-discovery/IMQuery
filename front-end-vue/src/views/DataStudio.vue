<template>
  <!-- Content Wrapper -->
  <div class="wrapper relative flex w-full h-full bg-white">
    <!-- Sidenav  -->
    <div
      class="wrapper-sidenav w-full bg-white flex flex-col align-center"
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

    <template
      v-if="
        sideNavActiveItem == 'Sources' ||
          sideNavActiveItem == 'Main Data Type' ||
          sideNavActiveItem == 'Steps' ||
          sideNavActiveItem == 'Output' ||
          sideNavActiveItem == 'Save or Export' || 
          sideNavActiveItem == 'View Data'
      "
    >
      <QueryEditor
        class="section-center w-full"
        :sideNavActiveItem="sideNavActiveItem"
        @previous="handlePrevious()"
        @next="handleNext()"
      />
    </template>
    <template v-else-if="sideNavActiveItem == 'Library'">
      <DatasetBrowser class="section-center w-full"
    /></template>
    <template v-else-if="sideNavActiveItem == 'Help'">Help</template>
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
import QueryEditor from "@/components/dataset/QueryEditor.vue";
import BackgroundCards from "@/components/dataset/BackgroundCards.vue";
import VerticalButtonGroup from "@/components/dataset/VerticalButtonGroup.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import EntityService from "@/services/EntityService";
import ContentNav from "@/components/dataset/ContentNav.vue";
import DatasetBrowser from "@/views/DatasetBrowser.vue";

export default defineComponent({
  name: "DataStudio",
  components: {
    QueryEditor,
    BackgroundCards,
    // VerticalButtonGroup,
    RoundButton,
    HeroIcon,
    // HorizontalNav,
    ContentNav,
    DatasetBrowser,
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
      sideNavActiveItem: "Steps",
      sideNavItems: [
        {
          id: "074b7d3e-2519-4bed-bdf4-84f90f46de46",
          name: "Library",
          icon: "search",
          visible: true,
          children: [],
        },

        {
          id: "dbb23c7f-7f8a-4457-ad60-9096e9de3eb7",
          name: "Get Help",
          icon: "question_mark_circle",
          visible: true,
          children: [],
          seperator: true,
        },
        {
          id: "65308e3e-a381-4c3b-b41a-08a674a35531",
          name: "Sources",
          icon: "office_building",
          visible: true,
          children: [],
        },
        {
          id: "ac43dd48-3bf8-4be9-87fb-045c1f245277",
          name: "Main Data Type",
          icon: "collection",
          visible: true,
          children: [],
        },
        {
          id: "1cece6bf-2bf5-448b-b3c3-3c578ce4412b",
          name: "Steps",
          icon: "template",
          visible: true,
          children: [],
        },
        {
          id: "af92a57b-9d1e-45db-a783-eaaf00970e23",
          name: "Output",
          icon: "cube",
          visible: true,
          children: [],
        },
        {
          id: "c813a2cb-2edd-4e42-a1d0-097e68a941e6",
          name: "Save or Export",
          icon: "download",
          visible: true,
          children: [],
        },
                {
          id: "b160ce1e-1bd3-4172-914a-ea127af6a756",
          name: "View Data",
          icon: "cube_transparent",
          visible: true,
          children: [],
        },
      ],
      isLoading: false,
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
    handlePrevious(): void {
      for (let i = 3; i < this.sideNavItems.length; i++) {
        if (this.sideNavItems[i].name == this.sideNavActiveItem) {
          this.sideNavActiveItem = this.sideNavItems[i - 1].name;
        }
      }
    },
    handleNext(): void {
      for (let i = 2; i < this.sideNavItems.length - 1; i++) {
        if (this.sideNavItems[i].name == this.sideNavActiveItem) {
          this.sideNavActiveItem = this.sideNavItems[i + 1].name;
        return;
        }
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

.section-center {
  /* position: absolute; */
  /* margin-left: 10px; */
  /* margin-top: 15px; */
  /* margin-right: 15px; */
  /* bottom: 15px; */
  margin-left: 60px;
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
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60px;
  z-index: 999;
}

.wrapper-sidenav:hover {
  width: 250px;
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
