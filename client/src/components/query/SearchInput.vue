<template>
  <div class="search-input">
    <div class="flex justify-between items-center mt-4 relative">
      <div class="searchbox flex flex-col">
        <span class="font-bold text-md text-gray-700 mb-2">Property or Health Record Entry</span>
        <input type="text" class="min-w-[400px] outline-none text-3xl text-blue-600 font-semibold border-b-2 border-b-blue-700 pb-2"  :value="modelValue" @input="onInput($event)" placeholder="Search (type here)" />
        <!-- <InputText type="text" class="p-inputtext-lg"  :modelValue="modelValue" @input="onInput($event)" placeholder="Search (type here)" /> -->
      </div>
      <div class="toggle-button">
        <span> Show Details</span>
        <InputSwitch class="ml10" v-model="showDetails" />
      </div>

      <!-- <div class="">
        <ToggleButton v-model="showDetails" onLabel="Show Details" offLabel="Hide Details" onIcon="pi pi-check" offIcon="pi pi-times" class="h-10 w-40 pt-2" />
      </div> -->
    </div>

    <div clas="results">
      <Suggestions
        v-if="searchData.length"
        :results="searchData"
        :value="searchString"
        :isShown="true"
        pathFilter="im:Person"
        :showDetails="showDetails"
        @updateActiveClause="updateActiveClause"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchService from "@/services/SearchService";
import Suggestions from "@/components/search/Suggestions.vue";
import HeroIcon from "@/components/general/HeroIcon.vue";

export default defineComponent({
  name: "SearchInput",
  props: ["modelValue"],
  emits: ["update:modelValue", "updateActiveClause"],
  components: {
    Suggestions,
    HeroIcon
  },
  methods: {
    updateActiveClause(value: any) {
      this.$emit("updateActiveClause", value);
    },
    onInput(event: any): void {
      this.search(event.target.value);
      this.$emit("update:modelValue", event.target.value);
    },
    async search(searchString: string): Promise<any> {
      await SearchService.searchAll(searchString)
        .then((res: any) => {
          console.log("fetched OSS search results", res);
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
      searchData: {},
      showDetails: false
    };
  }
});
</script>

<style scoped>
.search-input {
  width: 600px;
}

.toggle-button {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;

  position: absolute;
  top: 0;
  right: 0;
  margin-right: 1rem;
  margin-top: 1rem;
}
</style>
