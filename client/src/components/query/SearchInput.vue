<template>
  <div class="">
    <div class="searchbox flex flex-col">
      <span class="font-bold text-md text-gray-700">Property or Health Record Entry</span>
      <InputText type="text" class="p-inputtext-lg" :modelValue="modelValue" @input="onInput($event)" placeholder="Search (type here)"/>
    </div>
    <div clas="results">
      <Suggestions v-if="searchData.length" class="w-full" :results="searchData" :value="searchString" :isShown="true" pathFilter="im:Person" :showDetails="false"/>
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
  emits: ["update:modelValue"],
  components: {
    Suggestions,
    HeroIcon
  },
  methods: {

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
    };
  }
});
</script>

<style scoped></style>
