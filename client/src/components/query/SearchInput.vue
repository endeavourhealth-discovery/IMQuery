<template>
  <div :class="'search-input'">
    <div class="w-full flex justify-between items-center mt-4 relative">
      <div :class="'w-full border-b-2 border-b-blue-700 pb-2 px-2 rounded-md searchbox flex flex-col' + [focus ? ' bg-gray-100 ' : '']">
        <span class="font-bold text-md text-gray-700 mb-2">{{ label }}</span>
        <input
          type="text"
          class="bg-transparent min-w-[250px] w-full outline-none text-3xl text-blue-600 font-semibold "
          :value="modelValue"
          @input="onInput($event)"
          @focus="onFocus"
          @blur="onBlur"
          placeholder="Search (type here)"
        />
        <!-- <InputText type="text" class="p-inputtext-lg"  :modelValue="modelValue" @input="onInput($event)" placeholder="Search (type here)" /> -->
      </div>
      <div v-if="allowShowDetails" class="toggle-button">
        <span> Show Details</span>
        <InputSwitch class="ml10" v-model="showDetails" />
      </div>

      <!-- <div class="">
        <ToggleButton v-model="showDetails" onLabel="Show Details" offLabel="Hide Details" onIcon="pi pi-check" offIcon="pi pi-times" class="h-10 w-40 pt-2" />
      </div> -->
    </div>
    <OverlayPanel class="panel-suggestions" ref="overlay-suggestions">
      <div class="">
        <Suggestions
          v-if="searchData.length"
          :maxResults="maxResults"
          :results="searchData"
          :value="searchString"
          :isShown="true"
          pathFilter="im:Person"
          :showDetails="showDetails"
          @updateActiveClause="updateActiveClause"
          :showPreview="allow.includes('preview')"
        />
      </div>
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchService from "@/services/SearchService";
import Suggestions from "@/components/search/Suggestions.vue";
import HeroIcon from "@/components/general/HeroIcon.vue";

export default defineComponent({
  name: "SearchInput",
  props: ["modelValue", "allowShowDetails", "label", "maxResults", "allow"],
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
    },
    onFocus(event: any): void {
      this.focus = true;
      (this.$refs["overlay-suggestions"] as any).toggle(event); //show();
    },
    onBlur(event: any): void {
      this.focus = false;
      (this.$refs["overlay-suggestions"] as any).toggle(event); //hide();
    }
    //  onKeyDown(event: any): void {
    //createClause with name
    // if (event.key === "Enter") {
    //   this.updateActiveClause(this.searchString);
    // }
  },
  data() {
    return {
      focus: false,
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

<style >
.panel-suggestions {
  background-color: gray;
  
}

</style>
