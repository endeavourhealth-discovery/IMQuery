<template>
  <div class="widget relative non-selectable " @mouseenter="isHover = true" @mouseleave="isHover = false">
    <button
      type="button"
      :class="
        'widget-button relative bg-white rounded-md text-left border border-transparent cursor-default outline-none sm:text-sm' +
          [isHover ? ' hover shadow-sm' : ''] +
          [componentState == 'focus' ? ' focus shadow-sm' : ''] +
          [componentState == 'typing' ? ' typing shadow-sm' : '']
      "
      @click="componentState == 'focus' ? (componentState = 'default') : (componentState = 'focus')"
      @blur="isHover ? null : (componentState = 'default')"
    >
      <div class="button-content flex items-center justify between">
        <span class="flex items-center">
          <HeroIcon
            :class="'widget-icon text-white ' + getIconMeta(modelValue.iri).class"
            :icon="getIconMeta(modelValue.iri).icon"
            strokewidth="2"
            width="20"
            height="20"
          />

          <div class="widget-title ml-4 block truncate text-black font-medium">
            <template v-if="type == 'query'">
              {{ modelValue.name }}
            </template>

            <template v-else-if="type == 'datamodel'">
              {{ trimName(modelValue.name) }}
            </template>
          </div>
        </span>
      </div>
    </button>

    <!-- Autocomplete  -->
    <div
      v-if="componentState == 'focus' || componentState == 'typing'"
      class="autocomplete absolute z-10 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div class="autocomplete-searchbox relative flex overflow-none py-2 ml-3">
        <HeroIcon class="widget-icon text-gray" icon="search" strokewidth="2" width="20" height="20" />
        <input
          type="text"
          class="search-input outline-none ml-4"
          placeholder="Type to search"
          @blur="isHover ? null : (componentState = 'default')"
          @focus="componentState = 'typing'"
          @input="onInput($event)"
          v-model="searchInputValue"
        />
      </div>
      <div v-if="componentState == 'focus' || componentState == 'typing' || isHover" class="autocomplete-label relative text-sm font-medium text-gray-600">
        {{ getPrompt }}
      </div>

      <ul class="autocomplete-results relative mt-1 w-full text-base  sm:text-sm" role="listbox">
        <!-- One Item   -->
        <li
          v-for="entity in filteredEntities"
          :key="entity.iri"
          class="relative text-gray-900 cursor-default select-none py-2 pl-3 pr-12 hover:bg-gray-100"
          role="option"
          @click="updateEntity(entity)"
        >
          <div class="flex items-center">
            <HeroIcon
              :class="'widget-icon text-white ' + getIconMeta(entity.iri).class"
              :icon="getIconMeta(entity.iri).icon"
              strokewidth="2"
              width="20"
              height="20"
            />

            <div class="widget-title ml-4 block truncate text-black font-medium rounded-t-md">
              <template v-if="type == 'query'">
                {{ entity.name }}
              </template>

              <template v-else-if="type == 'datamodel'">
                <!-- {{ entity.name.replace("(record type)", "") }} -->
                {{ entity.name }}
              </template>
            </div>
          </div>

          <!-- /Checkmark not currently necessary  -->
          <span v-if="false" class="autocomplete-check text-indigo-500 absolute inset-y-0 right-0 flex items-center pr-4">
            <!-- Heroicon name: solid/check -->
            <HeroIcon class="text-indigo-500" icon="check" strokewidth="3" width="20" height="20" />
          </span>
          <!-- Checkmark not currently necessary  -->
        </li>
        <!-- / One Item   -->
      </ul>
    </div>

    <!-- More items... -->

    <!--/  Autocomplete  -->
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
// import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/general/HeroIcon.vue";
import SearchService from "@/services/SearchService";

export default defineComponent({
  name: "Selector",
  props: ["modelValue", "type", "stepIri", "propertyPath"],
  emits: ["update:modelValue"],
  components: {
    HeroIcon
  },
  data() {
    return {
      componentState: "default", // Options #"default", #"hover", #"focus", #""
      isHover: false,
      isLoading: false,
      searchResults: [] as any[],
      searchResults1: [] as any[],
      searchInputValue: ""
    };
  },
  mounted() {
    this.oss_search_im(this.modelValue.name, 5, "http://www.w3.org/ns/shacl#NodeShape");
  },
  computed: {
    filteredEntities(): any {
      let _maxHits = 5;
      if (this.type == "query") {
        // get all steps in current queries
        let _steps = this.$store.state.openQueries.filter((query: any) => query.id == this.$store.state.activeQueryId)[0].data.steps;

        // get all currently open queries
        let _queries = this.$store.state.openQueries.slice(
          0,
          this.$store.state.openQueries.length < _maxHits ? this.$store.state.openQueries.length - 1 : _maxHits
        );

        // get all data souries
        let _sources = [{ iri: "im:DDS", name: "Discovery Data Service" }];

        let _dataEntities = [..._steps, ..._queries, ..._sources];

        //returns everything except for:
        // 1. currently Iri of currently selected item (modelValue)
        // 2. current step (to avoid an infinite loop)
        let _filterArray = [this.stepIri, this.modelValue.iri];

        // 3. a step referencing itself in .copy attribute of step.
        _steps.forEach((step: any) => {
          step.copy.forEach((copy: any) => {
            if (copy.iri == this.stepIri) {
              _filterArray.push(step.iri);
            }
          });
        });

        // console.log("_filterArray: ", _filterArray);

        let _filteredDataEntities = _dataEntities.filter((entity: any) => !_filterArray.includes(entity.iri));

        // console.log("_filteredDataEntities: ", _filteredDataEntities);

        return _filteredDataEntities;
      } else if (this.type == "datamodel") {
        if (this.searchResults) {
          // let _hits = this.searchResults;
          // let _formattedHits = _hits.hits.hits.map((entity: any) => {
          //   return {
          //     iri: entity._source.iri,
          //     name: entity._source.name,
          //     scheme: entity._source.scheme,
          //     status: entity._source.status,
          //     entityType: entity._source.nentityTypeame,
          //     code: entity._source.code,
          //   };
          // });
          return this.searchResults;

          // return this.$store.state.prefetched_datamodel.slice(0, _maxHits);
        } else {
          return this.$store.state.prefetched_datamodel.slice(0, _maxHits);
        }
      } else {
        return this.$store.state.prefetched_datamodel.slice(0, _maxHits);
      }
    },
    getPrompt(): string {
      if (this.searchResults.length) {
        switch (this.type) {
          case "query":
            return "Select a source, query or step:";
          case "datamodel":
            return "Select a health record type:";
          default:
            return "Select an item";
        }
      } else {
        return "No results were found";
      }
    }
  },
  methods: {
    trimName(name: string): string {
      if (name.includes("(record type)")) {
        return name.replace("(record type)", "");
      } else if (name.includes("(record of)")) {
        return name.replace("(record of)", "");
      } else {
        return name;
      }
    },

    getIconMeta(iri: string): any {
      if (iri == "im:DDS") {
        return { icon: "cloud", class: " text-green-600" };
      } else if (iri.split(":")[0] == "dds") {
        if (iri.split(":")[1].substring(0, 4) == "Step") {
          return { icon: "template", class: " text-indigo-600" }; //if it is a step
        } else {
          return { icon: "database", class: " text-yellow-600" }; //if it is a query
        }
      } else if (this.$store.state.datamodelIris && this.$store.state.datamodelIris.includes(iri)) {
        return { icon: "document_text", class: " text-red-600" }; //if datamodel entity
      } else {
        return { icon: "document", class: " text-gray-500" }; //if unknown entity
      }
    },
    updateEntity(entity: any): void {
      this.$store.commit("updateEntity", {
        ...entity,
        propertyPath: this.propertyPath
      });
      this.componentState = "default";
    },
    async oss_search(searchString: string, index: string, limit: number): Promise<any> {
      this.isLoading = true;

      await SearchService.oss_search(searchString, index, limit)
        .then((res: any) => {
          this.isLoading = false;
          console.log("fetched opensearch results: ", res);
          return res;
        })
        .catch((err: any) => {
          this.isLoading = false;
          console.log("Could not load opensearch results", err);
          return err;
        });
    },
    async oss_search_im(searchString: string, limit: number, entityType?: string): Promise<any> {
      this.isLoading = true;

      await SearchService.oss_search_im(searchString, limit, entityType)
        .then((res: any) => {
          this.isLoading = false;
          let _formattedHits = res.data.hits.hits.map((entity: any) => {
            return {
              id: entity._source.id,
              iri: entity._source.iri,
              name: entity._source.name,
              code: entity._source.code,
              scheme: entity._source.scheme,
              entityType: entity._source.entityType,
              status: entity._source.status
            };
          });
          // console.log("this.searchResults : ", _formattedHits);
          this.searchResults = _formattedHits;
          return res;
        })
        .catch((err: any) => {
          this.isLoading = false;
          console.log("Could not load opensearch results", err);
          return err;
        });
    },
    async onInput(event: any): Promise<any> {
      if (this.type == "query") {
        return null;
      } else if (this.type == "datamodel") {
        const searchString = event.target.value;
        await SearchService.advancedSearchQuery(searchString)
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
      }
    }
  }
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.button-content {
  padding: 3px 10px 3px 5px;
}

.widget-buton {
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 0 0 5px 5px;
}

.widget-button.focus,
.widget-button.hover,
.widget-button.typing {
  /* min-width: 175px; */
  border: 1px solid rgb(207, 210, 218);
  border-radius: 5px;
  /* border-left: 1px solid rgb(207, 210, 218);
  border-right: 1px solid rgb(207, 210, 218);
  border-bottom: 1px solid rgb(207, 210, 218); */
  /* border-radius: 0 0 5px 5px; */
}

.widget-label {
  position: absolute;
  background: #fff;
  margin-top: -24px;
  width: calc(100%);
  z-index: 9;
  cursor: default;
  border-radius: 5px 5px 0 0;
  border-top: 1px solid rgb(207, 210, 218);
  border-left: 1px solid rgb(207, 210, 218);
  border-right: 1px solid rgb(207, 210, 218);
  padding-left: 10px;
}

.widget:hover {
  /* border: 1px solid #d1d5db; */
  background: white; /* #f9fafb;*/
}

.widget-title {
  font-size: 14px !important;
  font-weight: 500;
}

.widget-icon {
  width: 26px;
  padding: 4px;
  height: auto;
  margin-top: 2px;
  border-radius: 50%;
}

.autocomplete {
  border-color: rgb(207, 210, 218);
  box-shadow: rgb(207, 210, 218) 0px 2px 6px;
}

.autocomplete-label {
  margin-top: 10px;
  margin-left: 14px;
}
.autocomplete-searchbox {
  margin-top: 3px;
}
</style>
