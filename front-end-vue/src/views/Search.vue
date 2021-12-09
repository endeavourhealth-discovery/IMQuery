<template>
  <!-- General -->
  <ConfirmDialog></ConfirmDialog>
  <!-- /General -->

  <!-- Content Wrapper -->
  <main class="main-container">
    <ProgressBar v-if="isLoading" />

    <!-- Page: Home -->
    <div
      id="page-home"
      v-if="activePageName == 'Home'"
      class="page flex flex-col items-center justify-center"
    >
      <!-- Brand  -->

      <div
        id="brand"
        class="non-selectable flex items-center justify-center mb-10 text-gray-700 text-5xl font-medium"
      >
        <!-- <img class="im-logo mr-5" src="/img/Logo-object-empty.27c03592.png" alt="IM logo" data-v-098ea5e8=""> -->
        <img class="search-logo mb-10" src="search-icon.png" alt="" />
      </div>
      <!-- /Brand  -->

      <!-- Searchbox  -->
      <div id="searchbox-main" class="mx-auto w-full max-w-3xl flex px-5-sm">
        <Searchbox
          class="w-full"
          v-model="searchString"
          :autocompleteData="autocompleteData"
          @search="showSearchResults()"
        />
        <button
          class="transition duration-200 ease-in-out group ml-3 py-2 px-4 border border-transparent rounded-md text-white bg-blue-500 hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          @click="showSearchResults()"
        >
          <HeroIcon
            class=""
            strokewidth="2"
            width="24"
            height="24"
            icon="search"
          />
        </button>
      </div>
      <!-- /Searchbox  -->

      <!-- Examples  -->
      <div
        id="examples"
        class="non-selectable max-w-3xl my-7 text-gray-900 text-lg"
        @click="onTry('sbp and hr for diabetics with htn and stroke')"
      >
        <a class="mr-3 font-bold">Try </a>
        <b>sbp</b> and <b>hr</b> for <b>diabetics</b> with <b>htn</b> and
        <b>stroke</b>
      </div>
      <!-- /Examples  -->
    </div>
    <!-- /Page: Home -->

    <!-- Page: Results -->
    <div
      id="page-results"
      v-if="activePageName == 'SearchResults'"
      class="page"
    >
      <div class="header flex items-center w-full">
        <!-- Menu Toggler  -->
        <RoundButton
          class="h-10 ml-4"
          :rounded="false"
          :showRing="true"
          backgroundColor="white"
          hoverBackgroundColor="gray-50"
          borderColor="white"
          hoverBorderColor="gray-300"
          hoverTextColor="gray-700"
          focusTextColor="blue-600"
          textColor="gray-700"
          ringColor="blue-600"
        >
          <HeroIcon
            class="mx-2"
            strokewidth="2"
            width="24"
            height="24"
            icon="menu"
          />
        </RoundButton>
        <!-- / Menu Toggler  -->

        <!-- Branding  -->
        <div class="flex app-branding">
          <img class="app-logo inline" src="app-icon.png" alt="" />
          <div class="relative app-title inline-flex flex-col">
            <div
              class="relative app-title-top font-medium text-gray-600"
            >
              Resolution
            </div>
            <div
              class="relative app-title-bottom  font-medium text-black"
            >
              Data Studio
            </div>
          </div>
        </div>
        <!-- / Branding  -->

        <!-- Searchbox  -->
        <Searchbox
          class="searchbox-top mb-1 ml-3"
          v-model="searchString"
          :autocompleteData="autocompleteData"
          @search="showSearchResults()"
        />

        <RoundButton
          class="h-10 w-10 mx-3 px-2 text-xl font-regular mb-2"
          :rounded="false"
          :showRing="true"
          backgroundColor="blue-500"
          hoverBackgroundColor="blue-600"
          textColor="white"
          ringColor="blue-600"
          @click="showSearchResults()"
        >
          <HeroIcon
            class=""
            strokewidth="2"
            width="20"
            height="20"
            icon="search"
          />
        </RoundButton>

        <!-- Tab Buttons  -->
        <div id="tab-buttons" class="ml-5 mt-1">
          <HorizontalNavbar v-model="activeTabName" :items="tabs" />
        </div>
        <!-- /Tab Buttons -->
      </div>
      <!-- /Searchbox  -->

      <!-- Tabs -->
      <div class="page-content">
        <!-- Tab: Search -->
        <div v-show="activeTabName == 'Search'" class="tab-content  flex pt-5">
          <div class="results w-full max-w-4xl ">
            <!-- <div>Filter and sort</div> -->
            <template v-if="searchResults && searchResults.length > 0">
              <SearchResults
                class="w-full"
                :results="searchResults"
                :value="searchString"
              />
            </template>
            <template v-else>
              <div class="mt-10 ml-5 text-xl font-bold text-gray-600">
                No results were found for your search terms.
              </div>
            </template>
          </div>
        </div>
        <!-- /Tab: Search  -->

        <!-- Tab: Data  -->
        <DataStudio
          v-show="activeTabName == 'Data'"
          class="tab-content "
        />
        <!-- /Tab: Data  -->

        <!-- Tab: Explore  -->

        <div v-show="activeTabName == 'Explore'" class="tab-content ">
          Explore
        </div>
        <!-- /Tab: Explore  -->

        <!-- Tab: Organisations  -->
        <OrganisationBrowser
          v-show="activeTabName == 'Sources'"
          class="tab-content"
        />
        <!-- /Tab: Organisations  -->

        <!-- Tab: Dictionary  -->
        <div v-show="activeTabName == 'Dictionary'" class="tab-content ">
          <iframe class="w-full h-full" src="https://dev.endhealth.co.uk/#/">
          </iframe>
        </div>
        <!-- /Tab: Dictionary  -->

        <!-- Tab: Resources  -->
        <div v-show="activeTabName == 'Resources'" class="tab-content ">
          Resources
        </div>
        <!-- /Tab: Resources  -->
      </div>
      <!-- /Tabs -->
    </div>
    <!-- /Page: SearchResults-->
  </main>
  <!-- /Content Wrapper -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

import ConfirmDialog from "primevue/confirmdialog";
import LoggerService from "@/services/LoggerService";
import Tooltip from "primevue/tooltip";

import Chips from "primevue/chips";
import MegaMenu from "primevue/megamenu";

import OverlayPanel from "primevue/overlaypanel";
import Dialog from "primevue/dialog";
import QueryTable from "@/components/dataset/QueryTable.vue";

import Searchbox from "@/components/search/Searchbox.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import SearchResults from "@/components/search/SearchResults.vue";
import HorizontalNavbar from "@/components/dataset/HorizontalNavbar.vue";
import ProgressBar from "@/components/search/ProgressBar.vue";

import SearchService from "@/services/SearchService";
import SearchClient from "@/services/SearchClient";
import DataStudio from "./DataStudio.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import OrganisationBrowser from "@/components/dataset/OrganisationBrowser.vue";
// import Dataset from "@/components/dataset/Dataset.ts";

var _ = require("lodash");

const { MeiliSearch } = require("meilisearch");

export default defineComponent({
  name: "Search",
  components: {
    ConfirmDialog,
    Searchbox,
    SearchResults,
    HorizontalNavbar,
    HeroIcon,
    ProgressBar,
    DataStudio,
    RoundButton,
    OrganisationBrowser,
  },
  data() {
    return {
      // definition: typeof Dataset,
      isLoading: false,
      searchString: "",
      activePageName: "SearchResults", //Options #Home #SearchResults
      activeTabName: "Data",
      tabs: [
        {
          index: 0,
          name: "Search",
          icon: "search",
          visible: true,
        },
        {
          index: 1,
          name: "Data",
          icon: "newspaper",
          visible: true,
        },
        {
          index: 2,
          name: "Explore",
          icon: "globe",
          visible: false,
        },
        {
          index: 3,
          name: "Sources",
          icon: "office_building",
          visible: true,
        },
        {
          index: 4,
          name: "Dictionary",
          icon: "bookOpen",
          visible: true,
        },
        {
          index: 6,
          name: "Resources",
          icon: "newspaper",
          visible: false,
        },
      ],
      modulesData: null,
      searchData: null,
      searchResults: [],
      autocompleteData: null,
      tableHeight: 600,
    };
  },
  async mounted() {
    //ensures sidebar is focused on search Icon
    this.$store.commit("updateSelectedEntityType", "Search");
    this.$store.commit("updateSideNavHierarchyFocus", {
      name: "Search",
      fullName: "Search",
      iri: "http://endhealth.info/im#Search",
    });
    // console.log(Dataset.definition)

    //loads moduless (contains tasks),
    // this.getInitialData();
  },
  methods: {
    async getAutocompleteSearch(): Promise<void> {
      await SearchClient.fetchAutocompleteSearch(this.searchString)
        .then((res: any) => {
          this.autocompleteData = res;
        })
        .catch((err: any) => {
          this.$toast.add(
            LoggerService.error("Could not load autocomplete results", err)
          );
        });
    },
    async getInitialData(): Promise<void> {
      await SearchClient.searchMeili("Modules", "")
        .then((res: any) => {
          this.modulesData = res;
        })
        .catch((err: any) => {
          this.$toast.add(
            LoggerService.error("Could not load initial data", err)
          );
        });
      // #todo:other fetches
    },
    async searchMeili(index: string, searchString: string): Promise<any> {
      await SearchClient.searchMeili(index, searchString)
        .then((res: any) => {
          console.log(`fetched Meilisearch results for index: ${index}`, res);

          Promise.resolve(res);
        })
        .catch((err: any) => {
          this.$toast.add(
            LoggerService.error("Could not load Meilisearch results data", err)
          );
        });
    },
    async searchMeiliFiltered(
      index: string,
      searchString: string
    ): Promise<any> {
      await SearchClient.searchMeiliFiltered(index, searchString)
        .then((res: any) => {
          console.log(
            `fetched Filtered Meilisearch results for index: "${index}", searchString: "${searchString}"`,
            res
          );
          Promise.resolve(res);
        })
        .catch((err: any) => {
          this.$toast.add(
            LoggerService.error("Could not load Meilisearch results data", err)
          );
        });
    },
    async search(searchString: string): Promise<any> {
      this.isLoading = true;

      await SearchClient.search(searchString)
        .then((res: any) => {
          this.searchResults = [];
          this.searchData = res;

          console.log("fetched AWS Lambda search results", res);
          return res;
        })
        .catch((err: any) => {
          // this.isLoading = false;
          this.searchResults = [];
          this.searchData = null;

          console.log("Could not load search results", err);
          return null;
        });
      this.isLoading = false;
    },
    async showSearchResults(searchString: any): Promise<void> {
      // await SearchClient.searchMeiliFiltered("IMSearch", ""); //'filter': `rdfsLabel =""`

      // alert(this.isLoading);
      let _searchString = searchString ? searchString : this.searchString;

      if (_searchString && _searchString.trim() != "") {
        await this.search(_searchString).then((res: any) => {
          if (this.searchData) {
            this.searchResults = (this.searchData as any).data.searchResults;
            // alert(this.searchResults.length);
          }
          this.activePageName = "SearchResults";
          this.activeTabName = "Search";
        });
      }
    },
    onTry(searchString: any): void {
      this.searchString = searchString;
      this.showSearchResults(searchString);
    },
  },
  watch: {
    // whenever question changes, this function will run
    searchString(newSearchString: any, oldearchString: any) {
      if (newSearchString && newSearchString.trim() != "") {
        this.getAutocompleteSearch();
      }
    },
  },
});
</script>

<style scoped>
.search-logo {
  width: 100px;
  height: auto;
}

.icon {
  padding: 15px;
}

.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.main-container {
  /* margin: 0.5rem; */
  padding: 0;
  /* height: calc(100vh - 1rem); */
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff; /* Grey f8f9fb*/
  overflow-y: auto;
  /* border: 1px solid #dde1e2; */
}

.main-container::-webkit-scrollbar {
  width: 10px;
}

.main-container::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
}

.main-container::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  /* outline: 1px solid slategrey; */
}

.tab-content {
  height: 100%;
  width: 100%;
}
.page-content {
  height: 100%;
  width: 100%;
  /* top: 0;
  right: 0;
  bottom: 0;
  left: 0; */
}

.page {
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
}

.filter-container {
  max-width: 300px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #4b5563d1; /*darker: #4B5563*/
}

.overlay-title {
  font-size: 18px;
  font-weight: bold;
  color: #4b5563d1; /*darker: #4B5563*/
}

.max-w-55rem {
  max-width: 55rem;
}

.app-branding {
  margin-left: 15px;
  margin-right: clamp(10px, 1%, 20px);
}

.app-logo {
  padding-top: 3px;
  width: 40px;
  height: 40px;
}

.app-title {
  margin-left: 5px;
}

.app-title-top {
  top: 2px;
  font-size: 10px;
}

.app-title-bottom {
  top: -5px;
    font-size: 18px;
}

.header {
  padding-left: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: solid 1px #ECEFED /*#dde1e2;*/
}

.results {
  margin-left: 140px;
}

.searchbox-top {
  width: 100%;
  max-width: 400px;
  height: 40px;
}
</style>
