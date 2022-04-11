<template>
  <!-- Wrapper   -->

  <!-- "searchbox','w-full','transition','duration-500','ease-in-out','appearance-none','rounded-none','border','border-gray-300','rounded-md','focus:z-10" -->
  <div
    :class="
      'searchbox bg-gray-100 dark:bg-gray-800 relative w-full h-full transition duration-500 ease-in-out appearance-none border border-gray-200 hover:border-gray-300 dark:border-0 rounded-md focus:z-10' +
        [componentState == 'hover' ? ' hover' : ''] +
        [componentState == 'focus' ? ' focus' : '']
    "
  >
    <!-- Searchbox  -->
    <div class="flex items-center w-full h-full">
      <HeroIcon class="widget-icon text-black dark:text-white ml-3" icon="search" strokewidth="2" width="20" height="20" />
      <input
        type="text"
        class="relative bg-transparent transition duration-500 ease-in-out w-full h-full px-4 placeholder-gray-500 text-gray-900  dark:text-white font-medium rounded-md focus:outline-none"
        placeholder="Type to Search for Data, Apps and Resources"
        :value="modelValue"
        @input="onInput($event)"
        @keyup.enter="onEnter($event)"
        @focus="componentState = 'focus'"
        @blur="autocompleteHover ? (componentState = 'focus') : (componentState = 'default')"
        @mouseenter="componentState == 'focus' ? (componentState = 'focus') : (componentState = 'hover')"
        @mouseleave="componentState == 'focus' ? (componentState = 'focus') : (componentState = 'default')"
      />
      <div v-if="modelValue && modelValue != ''" @click="$emit('update:modelValue', '')">
        <HeroIcon class="text-gray-600 hover:text-red-500 mr-3" strokewidth="2" width="24" height="24" icon="x" />
      </div>
    </div>
    <!-- / Searchbox  -->

    <!-- Autocomplete  -->
    <div
      v-if="filteredHits() && modelValue != '' && componentState == 'focus'"
      class="autocomplete w-full rounded-t-none rounded-b-md bg-white dark:bg-gray-800 dark:border-0  border border-gray-300 hover:border-gray-300 non-selectable shadow-lg"
      @mouseenter="autocompleteHover = true"
      @mouseleave="autocompleteHover = false"
    >
      <div
        v-for="item in filteredHits()"
        :key="item.id"
        class="transition duration-500 ease-in-out appearance-none relative w-full px-4 py-3 text-gray-400 dark:text-gray-300 dark:hover:text-white  font-medium hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600 focus:z-10"
        v-html="item.searchString"
        @click.prevent="onAutocompleteClick(item.searchString)"
      ></div>
    </div>
    <!-- / Autocomplete -->
  </div>
  <!-- Wrapper   -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";

export default defineComponent({
  name: "Searchbox",
  props: ["modelValue", "autocompleteData"],
  emits: ["update:modelValue", "search"],
  components: {
    HeroIcon
  },
  data() {
    return {
      exampleAutocompleteHits: [
        {
          id: 0,
          searchString: "Heart rate for diabetics"
        },
        {
          id: 1,
          searchString: "Blood pressure for patients with stroke"
        },
        {
          id: 2,
          searchString: "Patients with asthma"
        }
      ],
      initialAutocompleteData: this.autocompleteData,
      autocompleteHits: [],
      autocompleteHover: false,
      componentState: "default" // Options #"default", #"hover", #"focus", #""
    };
  },
  methods: {
    filteredHits(): any {
      /* Todo: instead of overriding <em> globally use _matchedInfo property to highlight text  */
      if (this.autocompleteData && this.autocompleteData.hits.length > 0) {
        let _maxHits = this.autocompleteData.hits.length < 5 ? this.autocompleteData.hits.length : 5;
        return this.autocompleteData.hits.slice(0, _maxHits);
      }
    },
    onAutocompleteClick(searchString: string): void {
      this.componentState = "focus";
      this.$emit("update:modelValue", searchString);
      this.$emit("search");
      this.componentState = "default";
    },
    onInput(event: any): void {
      this.$emit("update:modelValue", event.target.value);
    },
    onEnter(event: any): void {
      event.target.blur();
      this.$emit("search");
      this.componentState = "default";
    }
  }
});
</script>

<style>
/* Perhaps not best to override em */

em {
  font-style: normal !important;
  color: rgba(17, 24, 39, var(--tw-text-opacity));
}
</style>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.searchbox {
  min-height: 40px;
  max-height: 40px;
}

.searchbox,
.autocomplete {
  font-size: 14px !important;
  z-index: 999;
}

.autocomplete {
  margin-left: -1px;
  width: calc(100% + 2px);
    position: absolute;
  /* background: #fff; */
  margin-top: -3px;
  cursor: default;
  border-bottom: 1px solid rgb(207, 210, 218);
  border-left: 1px solid rgb(207, 210, 218);
  border-right: 1px solid rgb(207, 210, 218);
}

.dark .autocomplete {

    margin-left: 0;
  width: calc(100% );

}

.hover,
.focus {
  /* background: #fff; */
  border-color: rgb(207, 210, 218);
  box-shadow: rgb(207, 210, 218) 0px 0px 6px;
}

.autocomplete {
  border-color: rgb(207, 210, 218);
  box-shadow: rgb(207, 210, 218) 0px 2px 6px;
}
</style>
