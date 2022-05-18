<template>
  <div class="iriref selector" @click="handleClick">{{ modelValue.name }}</div>
  <OverlayPanel ref="overlay-selector" class="notheme selector__overlay">
    <div class="action-buttons #hidden flex space-x-2 mb-5 ">
      <template v-for="option in editOptions" :key="option.id">
        <Button v-if="option.visible" label="Submit" :icon="'pi pi-' + option.icon" iconPos="left" :class="'action-button p-button-text ' + option.classes">
          <HeroIcon :icon="option.icon" strokewidth="3" class=" h-8 w-8 mr-3 "></HeroIcon>
          <span class="font-bold text-2xl"> {{ option.name }}</span>
        </Button>
      </template>
    </div>
    <InputText placeholder="Type to Replace or Rename" class="selector__input " type="text" v-model="searchString" />
    <div class="suggestions">
      <template v-if="searchData?.length" v-for="(suggestion, suggestionIndex) in searchData" :key="suggestion.iri">
        <div v-if="suggestionIndex < maxSuggestions" class="suggestion flex items-center justify-between">
          <div class="inline-flex">{{ suggestion.name }}</div>
          <div class="action change inline-flex">CHANGE</div>
        </div>
      </template>
      <div v-if="modelValue.name != searchString && searchString != ''" class="suggestion flex items-center justify-between">
        <div class="inline-flex">{{ searchString }}</div>
        <div class="action rename inline-flex ">RENAME</div>
      </div>
    </div>
  </OverlayPanel>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoggerService from "@/services/LoggerService";
import SearchService from "@/services/SearchService";

import _ from "lodash";
import HeroIcon from "../general/HeroIcon.vue";

export default defineComponent({
  name: "Selector",
  props: ["path", "modelValue", "edit"],
  components: { HeroIcon },
  methods: {
    handleClick(event: any): void {
      console.log("modelValue", this.modelValue);

      if (this.edit) {
        (this.$refs["overlay-selector"] as any).toggle(event);
      } else {
        this.$toast.add(LoggerService.error("Please enable edit mode in the top-right corner."));
      }
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
      editOptions: [
        {
          id: "abc89209-fcc5-4770-9a4b-bb1655104258",
          name: "Add",
          icon: "plus",
          classes: "",
          visible: true
        },
        {
          id: "afcd1608-3d79-4e10-90b6-1e9d354b9283",
          name: "Copy",
          icon: "document_duplicate",
          classes: "p-button-secondary",
          visible: true
        },
        {
          id: "23cdb75120e0ee94-b1d4-4c63-865f-e1c16f60d464",
          name: "Paste",
          icon: "clipboard_copy",
          classes: "p-button-secondary",
          visible: true
        },
        {
          id: "23cdb751b04edc4a-79ad-41da-a44c-7e871902a8a9",
          name: "Cut",
          icon: "scissors",
          classes: "p-button-warning",
          visible: true
        },
        {
          id: "23cdb75120e0ee94-b1d4-4c63-865f-e1c16f60d464",
          name: "Move",
          icon: "arrow_right",
          classes: "p-button-warning",
          visible: true
        },
        {
          id: "bf34d743-35b2-4e3c-b50f-5989b0bd3174",
          name: "Delete",
          icon: "x",
          classes: "p-button-danger",
          visible: true
        }
      ],
      maxSuggestions: 6,
      hasSearched: false,
      searchString: "",
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

.action-button {
  /* color: #fff !important; */
}

.selector__input {
  background-color: transparent;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  min-width: 400px;
  height: 40px;
  width: 100%;
  padding-left: 10px;
}

.suggestions {
  display: flex;
  justify-items: between;
  flex-direction: column;
  margin-top: 10px;
}

.suggestions .suggestion {
  /* margin-bottom: 10px; */
  color: #000;
  font-weight: 600;
  font-size: 14px;
  padding: 5px 5px 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.suggestions .suggestion:hover {
  background-color: #e5e7eb;
}
.suggestions .action {
  color: #fff;
  /* margin-bottom: 10px; */
  margin-right: 10px;
  font-weight: 600;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
}

.action.rename {
  background-color: #fbbf24;
}

.action.rename:hover {
  background-color: #d97706;
}
.action.change {
  background-color: #64748b;
}

.action.change:hover {
  background-color: #1f2937;
}
</style>
