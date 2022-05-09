<template>
  <div class="iriref selector" @click="handleToggle">{{ modelValue.name }}</div>
  <OverlayPanel ref="overlay-selector" class="notheme selector__overlay">
    <InputText class="selector__input" type="text" v-model="searchString" />
    <div class="suggestions">
      <template v-if="searchData?.length">
        <div class="suggestion" v-for="suggestion in searchData" :key="suggestion.iri">
          <span class="action">Select</span> <span> {{ suggestion.name }}</span>
        </div>
      </template>
      <div class="suggestion">
        <span class="action">Rename To</span> <span> {{ searchString }}</span>
      </div>
    </div>
  </OverlayPanel>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SearchService from "@/services/SearchService";
import _ from "lodash";

export default defineComponent({
  name: "Selector",
  props: ["path", "modelValue"],
  methods: {
    handleToggle(event: any): void {
      (this.$refs["overlay-selector"] as any).toggle(event);
    },
    async search(): Promise<any> {
      this.searchData = {};
      await SearchService.advancedSearchQuery(this.searchString)
        .then((res: any) => {
          console.log("fetched OSS search results", res);
          this.hasSearched = true;
          this.isResultsShown = true;
          this.searchData = res.data;
          return res;
        })
        .catch((err: any) => {
          console.log("Could not load search results", err);
          return null;
        });
    }
  },
  data() {
    return {
      hasSearched: false,
      searchString: this.modelValue.name,
      searchData: {}
    };
  },
  watch: {
    // searchString() {
    //   this.search();
    // }
    searchString: _.debounce(function() {
      this.search();
    }, 1000)
  }
});
</script>

<style scoped>
.selector__overlay {
  background-color: #fff;
}

.selector__input {
  background-color: transparent;
  color: #000;
  font-size: 12px;
  font-weight: 500;
  min-width: 400px;
}

.suggestions {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.suggestions .suggestion {
  margin-bottom: 10px;
  color: #000;
  font-weight: 600;
  font-size: 12px;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
}

.suggestions .suggestion:hover {
  /* background-color: #e5e7eb; */
}
.suggestions .action {
  margin-bottom: 10px;
  color: #000;
  font-weight: 600;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
  background-color: #eab308;
}

.suggestions .action:hover {
  background-color: #ca8a04;
}
</style>
