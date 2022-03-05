<template>
  <!-- General -->
  <ConfirmDialog></ConfirmDialog>
  <!-- /General -->

  <!-- Content Wrapper -->
  <main class="main-container">
    <ProgressBar v-if="isLoading" />

    <!-- Page: Home -->
    <div
      v-if="activePageName == 'PageName'"
      class="page flex flex-col items-center justify-center"
    >
      <!-- Brand  -->
    </div>
    <!-- /Page: Home -->

    <!-- Page: Results -->
    <div id="page-main" v-if="activePageName == 'Main'" class="page">
      <div
        :class="
          'header relative flex items-center justify-center w-full b-bottom' +
            [activeTabName == 'Home' ? ' ' : ' ']
        "
      >
        <!-- Menu Toggler  -->
        <RoundButton
          class="menu-toggler absolute h-10 ml-4"
          :rounded="false"
          :showRing="true"
          backgroundColor="white"
          hoverBackgroundColor="white"
          borderColor="white"
          hoverTextColor="blue-600"
          focusTextColor="blue-600"
          focusBackgroundColor="white"
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
        <div
          v-if="activeTabName != 'Home'"
          :class="
            'app-branding absolute flex  non-selectable ' +
              [activeTabName == 'Home' ? ' invisible' : ' ']
          "
        >
          <img class="app-logo inline" src="app-icon.png" alt="" />
          <div class="relative app-title inline-flex flex-col">
            <!-- <div class="relative app-title-top font-medium text-gray-600">
              Resolution
            </div> -->
            <div class="relative app-title-bottom  font-medium text-black">
              Resolution
            </div>
          </div>
        </div>
        <!-- / Branding  -->

        <!-- Searchbox  -->
        <Searchbox
          v-if="activeTabName != 'Home'"
          :class="
            'searchbox-top absolute' +
              [activeTabName == 'Home' ? ' invisible' : '']
          "
          v-model="searchString"
          :autocompleteData="autocompleteData"
          @search="showSearchResults()"
        />

        <!-- Tab Buttons  -->
        <div
          :class="
            'header-nav relative h-full flex flex-col justify-center' +
              [activeTabName == 'Home' ? '' : '']
          "
        >
          <HorizontalNavbar v-model="activeTabName" :items="tabs" />
        </div>
        <!-- /Tab Buttons -->
        <div class="header-right">
          <UserWidget :modelValue="userMeta" />
        </div>
      </div>
      <!-- /Searchbox  -->

      <!-- Tabs -->
      <div class="page-content">
        <!-- Tab: Home -->
        <div
          v-if="activeTabName == 'Home'"
          class="tab-content flex pt-5 flex flex-col items-center justify-center"
        >
          <div
            class="non-selectable flex items-center justify-center mb-10 text-gray-700 text-5xl font-medium"
          >
            <!-- <img class="im-logo mr-5" src="/img/Logo-object-empty.27c03592.png" alt="IM logo" data-v-098ea5e8=""> -->
            <img class="search-logo mb-10" src="home-icon.png" alt="" />
          </div>
          <!-- /Brand  -->

          <!-- Searchbox  -->
          <div
            id="searchbox-main"
            class="mx-auto w-full max-w-3xl flex px-5-sm"
          >
            <Searchbox
              class="w-full mx-auto searchbox-main"
              v-model="searchString"
              :autocompleteData="autocompleteData"
              @search="showSearchResults()"
            />
          </div>
          <!-- /Searchbox  -->

          <!-- Suggestions -->
          <div class="flex justify-center w-full my-10">
            <div
              v-for="suggestion in suggestions"
              :key="suggestion.name"
              class="flex flex-col items-center rounded-md mx-3 px-6 py-2 border border-gray-300 hover:border-blue-600 max-w-200"
              @click="suggestion.onClick"
            >
              <HeroIcon
                class="inline mx-2 my-3 text-blue-700"
                strokewidth="2"
                width="24"
                height="24"
                :icon="suggestion.icon"
              />
              <div class="inline text-lg font-bold text-gray-900">
                {{ suggestion.name }}
              </div>
              <div class="inline text-lg font-bold text-gray-500">
                {{ suggestion.description }}
              </div>
            </div>
          </div>
          <!-- /Suggestions -->

          <!-- Examples  -->
          <div
            id="examples"
            class="non-selectable max-w-3xl my-7 text-gray-900 text-lg"
            @click="onTry()"
          >
            <a class="mr-3 font-bold">Try </a>
            <b>sbp</b> and <b>hr</b> for <b>diabetics</b> with <b>htn</b> and
            <b>stroke</b>
          </div>
          <!-- /Examples  -->
        </div>
        <!-- /Tab: Home -->

        <!-- Tab: Search -->
        <div v-if="activeTabName == 'Results'" class="tab-content  flex pt-5">
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
        <DataStudio v-if="activeTabName == 'Data'" class="tab-content " />
        <!-- /Tab: Data  -->

        <!-- Tab: Explore  -->

        <div v-if="activeTabName == 'Explore'" class="tab-content ">
          Explore
        </div>
        <!-- /Tab: Explore  -->

        <!-- Tab: Organisations  -->
        <OrganisationBrowser
          v-if="activeTabName == 'Sources'"
          class="tab-content"
        />
        <!-- /Tab: Organisations  -->

        <!-- Tab: Dictionary  -->
        <div v-if="activeTabName == 'Dictionary'" class="tab-content ">
          <iframe class="w-full h-full" src="https://dev.endhealth.co.uk/#/">
          </iframe>
        </div>
        <!-- /Tab: Dictionary  -->

        <!-- Tab: Resources  -->
        <div v-if="activeTabName == 'Resources'" class="tab-content ">
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
import { mapState } from "vuex";

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
import RoundButton from "@/components/dataset/RoundButton.vue";
import UserWidget from "@/components/dataset/UserWidget.vue";
import SearchResults from "@/components/search/SearchResults.vue";
import HorizontalNavbar from "@/components/dataset/HorizontalNavbar.vue";
import ProgressBar from "@/components/search/ProgressBar.vue";

import SearchService from "@/services/SearchService";
import SearchClient from "@/services/SearchClient";
import DataStudio from "./DataStudio.vue";

import OrganisationBrowser from "@/components/dataset/OrganisationBrowser.vue";

// import Dataset from "@/components/dataset/Dataset.ts";

var _ = require("lodash");

import { MeiliSearch } from "meilisearch";

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
    UserWidget,
  },
  data() {
    return {
      // definition: typeof Dataset,
      userMeta: {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
      },
      searchString: "",
      activePageName: "Main", 
      activeTabName: "Data", //Options #Home #SearchResults
      suggestions: [
        {
          name: "DataStudio",
          description: "Start a new Search for Data",
          icon: "search",
          visible: true,
        },
        {
          name: "Library",
          description: "Browse the Data Library",
          icon: "menu",
          visible: true,
        },
        {
          name: "Try",
          description: "sbp and hr for diabetics with htn and stroker",
          icon: "cursor_click",
          visible: true,
        },
      ],
      tabs: [
        {
          index: 0,
          name: "Home",
          icon: "home",
          visible: true,
        },
        {
          index: 1,
          name: "Results",
          icon: "search",
          visible: true,
        },
        {
          index: 2,
          name: "Data",
          icon: "newspaper",
          visible: true,
        },
        {
          index: 3,
          name: "Explore",
          icon: "globe",
          visible: false,
        },
        {
          index: 4,
          name: "Sources",
          icon: "office_building",
          visible: true,
        },
        {
          index: 5,
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
  computed: {
    ...mapState(["currentUser", "isLoggedIn"]),
    isLoading: {
      get(): any {
        return this.$store.state.isLoading;
      },
      set(value: any): void {
        this.$store.commit("updateIsLoading", value);
      },
    },
  },
  async mounted() {
    await this.$store.dispatch("authenticateCurrentUser");

    if (this.currentUser && this.isLoggedIn) {
      this.userMeta.username = this.currentUser.username;
      this.userMeta.firstName = this.currentUser.firstName;
      this.userMeta.lastName = this.currentUser.lastName;
      this.userMeta.email = this.currentUser.email;
    }

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
          this.activePageName = "Main";
          this.activeTabName = "Results";
        });
      }
    },
    onTry(searchString = "sbp and hr for diabetics with htn and stroke"): void {
      this.searchString = searchString;
      this.showSearchResults(searchString);
    },
    async oss_search(
      searchString: string,
      index: string,
      limit: number
    ): Promise<any> {
      this.isLoading = true;

      await SearchService.oss_search(searchString, index, limit)
        .then((res: any) => {
          this.isLoading = false;
          console.log("fetched opensearch results: ", res);
        })
        .catch((err: any) => {
          this.isLoading = false;
          console.log("Could not load opensearch results", err);
        });
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
  width: 250px;
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

.menu-toggler {
  top: 12px;
  left: 0px;
}

.app-branding {
  /* margin-left: 15px;
  margin-right: clamp(10px, 1%, 20px); */
  top: 16px;
  left: 75px;
}

.app-logo {
  margin-right: 3px;
  width: 31px;
  height: 26px;
}

.app-title-bottom {
  left: 10px;
  top: -4px;
  font-size: 22px;
}

.header {
  padding-left: 0px;
  height: 60px;
}

.header-right {
  position: absolute;
  right: 50px;
}

.b-bottom {
  border-bottom: solid 1px #ecefed; /*#dde1e2;*/
}

.results {
  margin-left: 140px;
}
.searchbox-main,
.searchbox-top {
  width: 100%;
  max-width: 400px;
  height: 40px;
}

.searchbox-top {
  position: absolute;
  left: 250px;
}
</style>
