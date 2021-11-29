<template>
  <div class="p-d-flex p-flex-column p-jc-start" id="side-bar">
    <span class="p-input-icon-left" id="search-bar">
      <i class="pi pi-search" aria-hidden="true" />
      <InputText
        type="text"
        v-model="searchTerm"
        @input="debounceForSearch"
        @keyup.enter="search"
        placeholder="Search"
        class="p-inputtext-lg search-input"
        autoWidth="false"
      />
    </span>

    <TabView class="p-d-flex p-flex-column p-jc-start" id="side-menu" v-model:activeIndex="active">
      <TabPanel>
        <template #header>
          <i class="fas fa-sitemap icon-header" aria-hidden="true" />
          <span>Hierarchy</span>
        </template>
        <Hierarchy @showTree="active = 0" :active="active" />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fas fa-search icon-header" aria-hidden="true" />
          <span>Search results</span>
        </template>

        <div class="p-fluid p-d-flex p-flex-column p-jc-between results-filter-container">
          <SearchResults />
          <Filters :search="search" />
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fas fa-history icon-header" aria-hidden="true" />
          <span>History</span>
        </template>
        <History />
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Hierarchy from "@/components/sidebar/Hierarchy.vue";
import History from "@/components/sidebar/History.vue";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import Filters from "@/components/sidebar/Filters.vue";
import { SearchRequest } from "@/models/search/SearchRequest";
import { SortBy } from "@/models/search/SortBy";
import LoggerService from "@/services/LoggerService";
import axios from "axios";
import { mapState } from "vuex";

export default defineComponent({
  name: "SidebarControl",
  components: { Hierarchy, History, SearchResults, Filters },
  props: ["focusHierarchy"],
  computed: mapState(["filterOptions", "selectedFilters"]),
  emits: ["hierarchyFocused"],
  watch: {
    focusHierarchy(newValue) {
      if (newValue) {
        this.active = 0;
        this.$emit("hierarchyFocused");
      }
    }
  },
  data() {
    return {
      searchTerm: "",
      active: 0,
      debounce: 0,
      request: null as any,
      windowHeight: 0,
      windowWidth: 0
    };
  },
  mounted() {
    window.addEventListener("resize", this.onResize);

    this.setContainerHeights();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(): void {
      this.setContainerHeights();
    },

    async search(): Promise<void> {
      if (this.searchTerm.length > 2) {
        this.$store.commit("updateLoading", {
          key: "searchResults",
          value: true
        });
        this.active = 1;
        const searchRequest = new SearchRequest();
        searchRequest.termFilter = this.searchTerm;
        searchRequest.sortBy = SortBy.Usage;
        searchRequest.page = 1;
        searchRequest.size = 100;
        searchRequest.schemeFilter = this.selectedFilters.schemes.map((scheme: any) => scheme.iri);

        searchRequest.statusFilter = [];
        this.selectedFilters.status.forEach((status: any) => {
          searchRequest.statusFilter.push(status["@id"]);
        });

        searchRequest.typeFilter = [];
        this.selectedFilters.types.forEach((type: any) => {
          searchRequest.typeFilter.push(type["@id"]);
        });
        if (this.request) {
          await this.request.cancel();
        }
        const axiosSource = axios.CancelToken.source();
        this.request = { cancel: axiosSource.cancel, msg: "Loading..." };
        this.$store
          .dispatch("fetchSearchResults", {
            searchRequest: searchRequest,
            cancelToken: axiosSource.token
          })
          .then((res: string) => {
            if (res === "false") {
              this.$store.commit("updateLoading", {
                key: "searchResults",
                value: false
              });
              this.$toast.add(LoggerService.error("Search results server request failed"));
            } else {
              this.$store.commit("updateLoading", {
                key: "searchResults",
                value: false
              });
            }
          });
      } else {
        this.active = 0;
      }
    },

    debounceForSearch(): void {
      clearTimeout(this.debounce);
      this.debounce = window.setTimeout(() => {
        this.search();
      }, 600);
    },

    setContainerHeights(): void {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
      const html = document.documentElement;
      const currentFontSize = parseFloat(window.getComputedStyle(html, null).getPropertyValue("font-size"));
      const sidebar = document.getElementById("side-bar") as HTMLElement;
      if (sidebar) {
        sidebar.style.maxHeight = this.windowHeight - currentFontSize * 2 + "px";
      }
      const fixedSidebar = document.getElementById("side-bar") as HTMLElement;
      const searchBar = document.getElementById("search-bar") as HTMLElement;
      const sideMenu = document.getElementById("side-menu") as HTMLElement;
      if (searchBar && fixedSidebar && sideMenu) {
        sideMenu.style.maxHeight = fixedSidebar.getBoundingClientRect().height - searchBar.getBoundingClientRect().height + "px";
      }
    }
  }
});
</script>

<style scoped>
#side-bar {
  /* padding: 7px; */
  max-height: 100%;
  grid-area: sidebar;
  height: 100%;
  width: 30vw;
}

#side-menu {
  /* max-height: calc(100% - 41px); */
  flex-grow: 100;
}

#side-menu ::v-deep(.p-tabview-panels) {
  flex-grow: 6;
  overflow-y: auto;
}

#side-menu ::v-deep(.p-tabview-panel) {
  height: 100%;
  /* overflow-y: auto; */
}

.results-filter-container {
  height: 100%;
}

#search-bar {
  width: 100%;
}

.search-input {
  width: 100%;
}

.icon-header {
  margin: 0 4px 0 0;
}

.p-tabview-panel {
  overflow-x: hidden;
}
</style>
