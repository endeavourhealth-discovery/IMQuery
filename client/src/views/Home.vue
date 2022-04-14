<template>
  <!-- General -->
  <ConfirmDialog></ConfirmDialog>
  <!-- /General -->

  <!-- Content Wrapper -->
  <main class="main-container bg-white dark:bg-gray-900">
    <!-- Page: Home -->
    <div v-if="activePageName == 'PageName'" class="page flex flex-col items-center justify-center"></div>
    <!-- /Page: Home -->

    <!-- Page: Results -->
    <div id="page-main" v-if="activePageName == 'Main'" class="page">
      <header :class="'header  mx-auto relative flex items-center justify-between w-full ' + [activeTabName == 'Home' ? ' ' : ' ']">
        <!-- Left Side  -->
        <div :class="'pl-7 inline-flex items-center non-selectable h-full ' + [activeTabName == 'Home' ? ' ' : ' ']">
          <!-- Menu Toggler  -->

          <button
            :class="
              `menu-toggler h-14 w-14 mr-6 non-selectable roundbutton focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out flex items-center justify-center rounded-md border text-black dark:text-white border-gray-200 dark:border-transparent bg-transparent  hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700  dark:hover:text-white focus:text-blue-600 dark:focus:text-white  focus:ring-blue-600 dark:focus:ring-white`
            "
          >
            <HeroIcon class="mx-2" strokewidth="2" width="24" height="24" icon="menu" />
          </button>
          <!-- / Menu Toggler  -->

          <img class="app-logo h-10 w-10" src="app-icon.png" alt="" />

          <!-- Tab Buttons  -->
          <nav :class="'ml-10 h-full flex-col justify-center inline-flex' + [activeTabName == 'Home' ? ' ' : ' ']">
            <HorizontalNavbar class="h-full" v-model="activeTabName" :items="tabs" />
          </nav>
          <!-- /Tab Buttons -->
        </div>
        <!-- / Left Side    -->

        <!-- Searchbox  -->
        <Searchbox
          :class="'searchbox-top ml-4 2xl:absolute 2xl:left-2/4 2xl:-translate-x-2/4 2xl:z-100 inline ' + [activeTabName == 'Home' ? ' ' : '']"
          v-model="searchString"
          :autocompleteData="autocompleteData"
          @search="search(searchString)"
        />

        <!-- /Searchbox  -->

        <div class="right flex mr-7 ml-4">
          <!-- <SplitButton
            v-if="isLoggedIn"
            class="p-button-rounded mr-10 h-14 mt-2 #p-button-outlined"
            label="New"
            icon="pi pi-plus"
            :model="newItems"
          ></SplitButton> -->
          <!-- Apps  -->
          <div class="select-none flex" @click="onToggleApps">
            <div :class="'flex ' + [isLoggedIn ? ' pt-2' : '']">
              <div class="app-title pt-1 ml-5 font-medium text-black dark:text-white text-3xl">
                Apps
              </div>
              <HeroIcon class="mt-2 mx-2 text-black dark:text-white" strokewidth="2" width="20" height="20" icon="chevron_down" />
            </div>
            <div class="relative">
              <!-- Apps -->
              <OverlayPanel ref="overlay-apps">
                <div class="flex justify-center w-full ">
                  <template v-for="app in apps" :key="app.name">
                    <a
                      v-if="app.visible"
                      class="cursor-pointer shadow-md flex flex-col items-center rounded-md mx-3 px-6 py-2 border border-gray-300 hover:bg-blue-50 hover:border-blue-500 max-w-200 dark:shadow-none dark:hover:bg-gray-700 dark:border-gray-500 dark:hover:border-white "
                      :href="app.hyperlink"
                      target="_blank"
                    >
                      <HeroIcon class="inline mx-2 my-3 text-blue-700 dark:text-white" strokewidth="2" width="24" height="24" :icon="app.icon" />
                      <div class="inline text-lg font-bold text-gray-900 dark:text-gray-200">
                        {{ app.name }}
                      </div>
                    </a>
                  </template>
                </div>
              </OverlayPanel>
            </div>
            <!-- /Apps -->
          </div>

          <button class="theme-toggler  pt-1 mx-5 text-gray-700 dark:text-white text-xl transition duration-500 ease-in-out" @click="toggleTheme()">
            <i class="fa-solid fa-sun h-9 w-auto dark:text-white  inline dark:hidden"></i>
            <i class="fa-solid fa-moon h-9 w-auto dark:text-white hidden dark:inline text-gray-800"></i>
          </button>

          <!-- User Widget -->
          <UserWidget class="" :modelValue="userMeta" />
        </div>
        <ProgressBar class="" v-if="isLoading" />
      </header>
      <!-- <ResponsiveNav/> -->
      <!-- Tabs -->
      <div class="page-content">
        <!-- Tab: Home -->
        <div v-if="activeTabName == 'Home'" class="tab-content flex flex-col items-center justify-center">
          <div class="non-selectable flex items-center justify-center mb-10 text-gray-700 text-5xl font-medium">
            <!-- <img class="im-logo mr-5" src="/img/Logo-object-empty.27c03592.png" alt="IM logo" data-v-098ea5e8=""> -->
            <img class="search-logo mb-10" src="home-icon.png" alt="" />
          </div>
          <!-- /Brand  -->

          <!-- Searchbox  -->
          <!-- <div id="searchbox-main" class="mx-auto w-full max-w-3xl flex px-5-sm">
            <Searchbox class="w-full mx-auto searchbox-main" v-model="searchString" :autocompleteData="autocompleteData" @search="search(searchString)" />
          </div> -->
          <!-- /Searchbox  -->

          <!-- Suggestions -->
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 items-center md:items-start justify-center w-full my-10">
            <template v-for="(suggestion, index) in suggestions" :key="suggestion.name">
              <template v-if="suggestion.visible && index == 0">
                <CardButton
                  @click="suggestion.command"
                  class="w-250px"
                  :name="suggestion.name"
                  :description="suggestion.description"
                  :icon="suggestion.icon"
                  :outlined="true"
                  nameColor="white"
                  descriptionColor="white"
                  iconColor="white"
                  backgroundColor="blue-500"
                />
              </template>
              <template v-else-if="suggestion.visible && index > 0">
                <CardButton
                  @click="suggestion.command"
                  class="w-250px"
                  :name="suggestion.name"
                  :description="suggestion.description"
                  :icon="suggestion.icon"
                  :outlined="true"
                  nameColor="black"
                  descriptionColor="gray-700"
                  iconColor="blue-700"
                  backgroundColor="white"
                />
              </template>
            </template>
          </div>
        </div>
        <!-- /Tab: Home -->

        <!-- Tab: Search -->
        <div v-if="activeTabName == 'Find'" class="tab-content relative flex justify-center">
          <div v-if="false" class="categories mt-20 ml-20 inline-flex lg:flex-col lg:space-y-10 space-x-10 lg:space-x-0 select-none mr-20">
            <template v-for="category in searchCategories" :key="category.name">
              <div
                v-if="category.visible"
                :class="
                  'transition duration-500 ease-in-out group flex items-center rounded-lg  px-5 py-3 border border-1 border-transparent ' +
                    [
                      activeSearchCategory == category.name
                        ? ' #bg-blue-50 #border-blue-500 dark:border-transparent dark:bg-transparent'
                        : ' text-gray-700 dark:text-gray-400 hover:bg-blue-50 dark:bg-transparent'
                    ]
                "
                @click="category.command()"
                v-wave="{
                  color: 'currentColor',
                  easing: 'ease-out',
                  duration: 0.5,
                  initialOpacity: 0.5,
                  finalOpacity: 0.1,
                  cancellationPeriod: 75
                }"
              >
                <div :class="'category-icon inline-flex h-16 w-16 rounded-xl  bg-gradient-to-r p-2 ' + category.css.background">
                  <div class="rounded-full bg-black bg-opacity-50 w-full h-full flex justify-center items-center">
                    <HeroIcon :class="' ' + category.css.icon" strokewidth="2.5" width="20" height="20" :icon="category.icon" />
                  </div>
                </div>
                <div
                  :class="
                    'inline-flex ml-8 text-3xl font-medium  dark:group-hover:text-white cursor-pointer transition ease-in-out duration-300' +
                      [activeSearchCategory == category.name ? ' text-blue-700 dark:text-white' : ' text-gray-700 dark:text-gray-400 ']
                  "
                >
                  {{ category.name }}
                </div>
              </div>
            </template>
          </div>

          <div class="results w-full max-w-4xl mt-5 #mx-auto #absolute #top-30 #lg:top-10 #left-2/4 #-translate-x-2/4 ">
            <!-- Results -->

            <template v-if="searchData?.length > 0">
              <div class="text-center text-black dark:text-white text-xl font-medium mb-5">
                {{ searchData.length }} {{ searchData.length == 1 ? "result" : "results" }} found
              </div>
              <SearchResults class="w-full" :results="searchData" :value="searchString" :isShown="isResultsShown" />
              <!-- </div> -->
            </template>

            <template v-else>
              <div class="mt-10 ml-5 text-2xl font-regular text-black dark:text-white text-center">
                {{
                  hasSearched
                    ? "This search did not return any results. Please use different search terms or try one of the following options: "
                    : "Find Query Definitions by entering your search terms into the Searchbar above or try one of the following options:"
                }}
                <br />
                <br />
                <div class="hover:underline cursor-pointer text-bold text-blue-600 dark:text-blue-400  font-bold" @click="handleTry()">
                  1. Search for sample queries e.g. "COVID-19"
                </div>
                <br />
                <div class="hover:underline cursor-pointer text-bold text-blue-600 dark:text-blue-400  font-bold" @click="handleQueryLibrary()">
                  2. Browse the Query Library on IM Directory app
                </div>
              </div>
            </template>
          </div>
          <!-- <div class="results-filters">
          </div> -->
        </div>
        <!-- /Tab: Search  -->

        <!-- Tab: Data  -->
        <DataStudio v-if="activeTabName == 'Data'" class="tab-content " />
        <!-- /Tab: Data  -->

        <!-- Tab: View  -->

        <div v-show="activeTabName == 'View'" class="tab-content ">
          <!-- Tabs  -->
          <div class="flex py-5 justify-center items-center w-full">
            <HorizontalNavPills class="nav" :items="openFiles" v-model="activeFileIri" :closable="true" />
          </div>

          <!-- <button @click="testQuery()"> test</button> -->

          <!-- Viewer  -->
          <div class="viewer w-full h-full bg-white dark:bg-gray-900 overflow-y-auto overflow-x-auto">
            <div class="kanban flex justify-center text-white">
              <template v-for="([iri, profile], index) in queryBuilder.profiles" :key="profile['@id']">
                <!-- <TransitionRoot
                  appear
                  :show="isVisible(iri)"
                  as="div"
                  enter="transform transition duration-[200ms]"
                  enter-from="opacity-0 rotate-[-10deg] scale-50"
                  enter-to="opacity-100 rotate-0 scale-100"
                  leave="transform duration-200 transition ease-in-out"
                  leave-from="opacity-100 rotate-0 scale-100"
                  leave-to="opacity-0 scale-95 "
                > -->
                <div v-show="isVisible(iri)" class="profile-column mx-5">
                  <!-- <div class="select-none text-black dark:text-white font-bold text-3xl h-10 h-max-10  overflow-hidden">{{ profile["rdfs:label"] }}</div>
                    <div class="select-none text-black dark:text-gray-400 font-semibold  text-xl h-16 h-max-16 overflow-hidden">
                      {{ profile["rdfs:comment"] }}
                    </div> -->

                  <!-- <Profile class="mt-5" :theme="light" :modelValue="profile" :activeProfile="activeProfile" /> -->
                  <Profile class="mt-5 " :theme="colours[index]" :modelValue="profile" :activeProfile="activeProfile" />
                </div>
                <!-- </TransitionRoot> -->
              </template>
            </div>
          </div>
        </div>
        <!-- /Tab: View  -->

        <!-- Tab: Explore  -->

        <div v-if="activeTabName == 'Create'" class="tab-content flex justify-center items-start "></div>
        <div v-if="activeTabName == 'Learn'" class="tab-content flex flex-col justify-start items-center ">
          <!-- <iframe class="iframe-learn" src="https://embednotion.com/embed/4dscvv7v"></iframe> -->
          <!-- <img class="dark:rounded-xl shadow-md dark:bg-white ring-1 focus:outline-none" src="animation1.gif" alt="" /> -->

          <div class="flex mt-20 flex-col text-3xl font-bold text-black dark:text-white">
            <div>
              Tutorials
            </div>

            <div class="mt-10 mb-10 flex space-x-20">
              <div
                :class="'inline-flex  text-2xl font-bold hover:underline cursor-pointer ' + [activeVideo == 1 ? ' text-black dark:text-white' : ' text-gray-500']"
                @click="activeVideo = 1"
              >
                1. Searching for and Opening Queries
              </div>
              <div
                :class="'inline-flex  text-2xl font-bold hover:underline cursor-pointer ' + [activeVideo == 2 ? ' text-black dark:text-white' : ' text-gray-500']"
                @click="activeVideo = 2"
              >
                2. Viewing and Interpreting Query Definitions
              </div>
            </div>
          </div>

          <iframe
            v-if="activeVideo == 1"
            width="780"
            height="480"
            src="https://www.youtube-nocookie.com/embed/2QJU_DeiEfQ"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <iframe
            v-if="activeVideo == 2"
            width="780"
            height="480"
            src="https://www.youtube.com/embed/aTeqPgkfOc0"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <!-- /Tab: Explore  -->

        <!-- Tab: Organisations  -->
        <OrganisationBrowser v-if="activeTabName == 'Sources'" class="tab-content" />
        <!-- /Tab: Organisations  -->

        <!-- Tab: Dictionary  -->
        <div v-if="activeTabName == 'Dictionary'" class="tab-content ">
          <iframe class="iframe-learn" src="https://embednotion.com/embed/4dscvv7v"></iframe>
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

import EntityService from "@/services/EntityService";
import ConfirmDialog from "primevue/confirmdialog";

import Searchbox from "@/components/search/Searchbox.vue";
import HeroIcon from "@/components/general/HeroIcon.vue";
import UserWidget from "@/components/user/UserWidget.vue";
import SearchResults from "@/components/search/SearchResults.vue";
import CardButton from "@/components/general/CardButton.vue";
import Profile from "@/components/query/Profile.vue";
import ProgressBar from "@/components/general/ProgressBar.vue";

import SearchService from "@/services/SearchService";
import SearchClient from "@/services/SearchClient";

import HorizontalNavbar from "@/components/general/HorizontalNavbar.vue";
import HorizontalNavPills from "@/components/general/HorizontalNavPills.vue";
import { TransitionRoot } from "@headlessui/vue";

// import Dataset from "@/components/dataset/Dataset.ts";

var _ = require("lodash");

import { MeiliSearch } from "meilisearch";

export default defineComponent({
  name: "Search",
  components: {
    ConfirmDialog,
    Searchbox,
    SearchResults,
    HeroIcon,
    ProgressBar,
    UserWidget,
    CardButton,
    HorizontalNavPills,
    HorizontalNavbar,
    Profile,
    TransitionRoot
  },
  $refs: {
    OverlayPanel: HTMLElement
  },
  data() {
    return {
      activeVideo: 1,
      isResultsShown: false,
      isShowing: true,
      colours: ["light", "light", "light", "light", "light", "light", "light", "light", "blue", "purple", "green", "orange", "pink"],
      // colours: ["light", "blue", "purple", "green", "orange", "pink", "blue", "purple", "green", "orange", "pink"],

      hasSearched: false,
      // definition: typeof Dataset,
      userMeta: {
        username: "",
        firstName: "",
        lastName: "",
        email: ""
      },
      searchString: "",
      activePageName: "Main",
      activeSearchCategory: "Search Results",
      searchCategories: [
        {
          name: "Search Results",
          icon: "search",
          css: {
            background: "to-sky-500 from-blue-600",
            icon: "text-teal-400"
          },
          command: () => {
            this.activeSearchCategory = "Search Results";
          },
          visible: false
        },
        {
          name: "Query Library",
          icon: "newspaper",
          css: {
            background: "from-cyan-600 to-green-500",
            icon: "text-yellow-300"
          },
          command: () => {
            this.activeSearchCategory = "Query Library";
          },
          visible: false
        }
      ],
      suggestions: [
        {
          name: "Start with an Example",
          description: 'View the Query "SMI Population"',
          icon: "cursor_click",
          command: () => {
            // this.activeTabName = "Find";
            this.$store.commit("updateIsLoading", true);
            this.$store.commit("loadFile", "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf");

            // clearTimeout(this.debounce);
            // this.debounce = window.setTimeout(() => {
            // }, 500);
          },
          visible: true
        },
        {
          name: "Query Library",
          description: "Browse through a list of query definitions",
          icon: "newspaper",
          command: () => {
            // this.activeTabName = "Find";
            this.handleQueryLibrary();
          },
          visible: false
        },
        {
          name: "Watch a 100 second Tutorial",
          description: "Learn how to Get Started",
          icon: "academic_cap",
          command: () => {
            //#todo
            this.activeTabName = "Learn";
          },
          visible: true
        }
      ],

      apps: [
        {
          name: "Directory",
          icon: "document_search",
          visible: true,
          hyperlink: "https://dev.endhealth.co.uk/"
        },
        {
          name: "Dictionary",
          icon: "book_open",
          visible: true,
          hyperlink: "https://dev.endhealth.co.uk/viewer"
        },
        {
          name: "Data Studio",
          icon: "newspaper",
          visible: false,
          hyperlink: ""
        }
      ],
      searchData: null,
      autocompleteData: null
    };
  },

  computed: {
    ...mapState(["currentUser", "isLoggedIn", "openFiles", "tabs"]),
    activeTabName: {
      get(): any {
        return this.$store.state.activeTabName;
      },
      set(value: any): void {
        this.$store.commit("updateActiveTabName", value);
      }
    },
    searchData: {
      get(): any {
        return this.$store.state.searchData;
      },
      set(value: any): void {
        this.$store.commit("updateSearchData", value);
      }
    },
    ontology: {
      get(): any {
        return this.$store.state.ontology;
      },
      set(value: any): void {
        return;
      }
    },
    activeProfile: {
      get(): any {
        return this.$store.state.activeProfile;
      },
      set(value: any): void {
        this.$store.commit("updateActiveProfile", value);
      }
    },
    queryBuilder: {
      get(): any {
        return this.$store.state.queryBuilder;
      },
      set({ action, payload }: any): void {
        this.$store.commit("queryBuilder", {
          action: action,
          payload: payload
        });
      }
    },
    isLoading: {
      get(): any {
        return this.$store.state.isLoading;
      },
      set(value: any): void {
        this.$store.commit("updateIsLoading", value);
      }
    },
    openFiles: {
      get(): any {
        return this.$store.state.openFiles;
      },
      set(value: any): void {
        this.$store.commit("updateOpenFiles", value);
        //sets an active file if A. there are openfiles left and B. there there is no longer an active file
      }
    },
    activeFileIri: {
      get(): string {
        return this.$store.state.activeFileIri;
      },
      set(value: any): void {
        alert("hi");
        this.$store.commit("updateActiveFileIri", value);
      }
    },
    currentTheme: {
      get(): string {
        return this.$store.state.theme;
      },
      set(value: any): void {
        this.$store.commit("updateTheme", value);
      }
    }
  },
  async mounted() {
    this.$store.dispatch("loadTheme");

    await this.$store.dispatch("authenticateCurrentUser");

    if (this.currentUser && this.isLoggedIn) {
      this.userMeta.username = this.currentUser.username;
      this.userMeta.firstName = this.currentUser.firstName;
      this.userMeta.lastName = this.currentUser.lastName;
      this.userMeta.email = this.currentUser.email;
    }

    //loading all of a user's files
    // this.$store.dispatch("loadUserData");

    const _fileIri = this.$route.params.fileIri;
    if (_fileIri) {
      // this.$store.dispatch("loadFile");
      console.log("fileIri", _fileIri);
      this.$store.commit("loadFile", _fileIri);
    }

    // console.log("URL Paramater FileIri", _fileIri);
  },
  methods: {
    // handleHotkey(): void {
    //   alert("search");
    // },
    // async handleOpenItem(iri: any) {
    //   console.log("##### Fetched ##### \n", await EntityService.getDefinitionBundle(iri));
    // },
    handleTry(): any {
      this.search("COVID-19");
    },
    handleQueryLibrary(): any {
      const _libraryURL = "https://im.endhealth.co.uk/#/folder/http:%2F%2Fendhealth.info%2Fceg%2Fqry%23Q_CEGQueries";
      window.open(_libraryURL, "_blank");
    },
    testQuery(): any {
      // console.log(
      //   "ontology",
      //   this.ontology
      // );
      // console.log(
      //   "all",
      //   this.ontology.entities
      // );
      // console.log("entities", this.ontology.byIri("im:MedicationOrder"));
      // console.log(
      //   "datamodels",
      //   this.ontology.entities.byType(entityTypes.datamodel)
      // );
    },
    toggleTheme(): void {
      if (this.currentTheme == "dark") {
        this.currentTheme = "light";
      } else {
        this.currentTheme = "dark";
      }
    },
    isVisible(iri: string): boolean {
      // console.log(profile["@id"])

      const _item = this.openFiles.filter((item: any, index: number) => item.iri == iri);
      // console.log(this.openFiles)

      return _item[0].isVisible;
    },
    test(): void {
      // console.log(this.activeFileIri);
      // console.log(this.queryBuilder.profiles.get(this.activeFileIri));
      for (const profile in this.queryBuilder.profiles) {
        console.log("prof", profile);
      }
    },
    onToggleApps(event: any): void {
      console.log(event);
      (this.$refs["overlay-apps"] as any).toggle(event);
    },
    async getAutocompleteSearch(): Promise<void> {
      await SearchClient.fetchAutocompleteSearch(this.searchString)
        .then((res: any) => {
          this.autocompleteData = res;
        })
        .catch((err: any) => {
          this.$toast.add(LoggerService.error("Could not load autocomplete results", err));
        });
    },
    async search(searchString: string): Promise<any> {
      this.isLoading = true;
      this.isResultsShown = false;

      //find queries regardless of status or scheme
      const _requestBody = {
        termFilter: searchString,
        statusFilter: [],
        typeFilter: ["http://endhealth.info/im#Query"],
        schemeFilter: [],
        sortBy: 0,
        page: 1,
        size: 20
      };

      await SearchService.advancedSearch(_requestBody)
        .then((res: any) => {
          console.log("fetched OSS search results", res);
          this.hasSearched = true;
          this.isResultsShown = true;
          this.searchData = res.data;
          this.activeTabName = "Find";
          return res;
        })
        .catch((err: any) => {
          console.log("Could not load search results", err);
          return null;
        });

      this.isLoading = false;
    }
  },
  watch: {
    // whenever question changes, this function will run
    searchString(newSearchString: any, oldearchString: any) {
      if (newSearchString && newSearchString.trim() != "") {
        this.getAutocompleteSearch();
      }
    }
  }
});
</script>

<style scoped>
.iframe-learn {
  width: 100%;
  height: 100%;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: none;
}

.search-logo {
  width: 350px;
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
  /* background-color: #ffffff; Grey f8f9fb */
  overflow-y: auto;
  /* border: 1px solid #dde1e2; */
}
.profile-column {
  margin-bottom: 150px;
  /* max-width: 300px; */
}
.main-container::-webkit-scrollbar {
  width: 10px;
}

.main-container::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
}

.main-container::-webkit-scrollbar-thumb {
  background-color: #f3f3f3;
  /* outline: 1px solid slategrey; */
}

.viewer::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.viewer::-webkit-scrollbar-track {
  background: transparent;
  /* darker colour: #f1f1f1; */
}

/* Handle */
.viewer::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #f3f3f3;
}

/* Handle on hover */
.viewer::-webkit-scrollbar-thumb:hover {
  background: #9b9b9b;
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

.app-logo {
  margin-right: 3px;
  min-width: 31px;
  min-height: 26px;
  display: inline;
}

.menu-toggler {
  display: none;
}
header nav {
  display: inline-flex;
}

@media screen and (max-width: 1000px) {
  .menu-toggler {
    display: inline-flex;
  }

  .app-logo,
  header nav {
    display: none;
  }
}

.app-title-bottom {
  left: 10px;
  top: -4px;
  font-size: 22px;
}

header {
  max-width: 1300px;
}

header,
header .left,
nav,
nav .tab-buttons {
  min-height: 60px;
}

.b-bottom {
  border-bottom: solid 1px #ecefed; /*#dde1e2;*/
}

.searchbox-main,
.searchbox-top {
  /* position: inline; */
  /* left: 250px; */
  /* left: 50%; */
  /* transform: translate() */
  width: 100%;
  max-width: 350px;
  height: 40px;
}

.results-filters {
  min-width: 250px;
}

.category-icon {
  min-width: 40px;
  min-height: 40px;
}
</style>
