<template>
  <div :class="'search-input w-full'">
    <div class=" w-full flex justify-between relative">
      <!-- Searchboxes  -->
      <template v-if="type == 'textarea'">
        <textarea
          ref="textarea"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput($event)"
          :value="modelValue"
          placeholder="Type to create or find criteria"
          class="node-card-textarea outline-none ml-4 w-full overflow-hidden resize-none text-gray-900 font-semibold"
        ></textarea>
      </template>
      <template v-else-if="type == 'underline'">
        <div class="outline-none w-full min-w-[400px] overflow-hidden resize-none">
          <input
            :value="modelValue"
            @input="onInput($event)"
            @focus="onFocus"
            @blur="onBlur"
            class="outline-none pb-4 placeholder-gray-500 text-blue-700 font-bold text-2xl w-full max-h-[30px] border-b-2 border-b-transparent focus:border-b-blue-700"
            :placeholder="label"
          />
        </div>
      </template>
      <template v-else>
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
      </template>
      <!-- Searchboxes  -->

      <div v-if="allowShowDetails" class="toggle-button">
        <span> Show Details</span>
        <InputSwitch class="ml10" v-model="showDetails" />
      </div>
    </div>
    <!-- <OverlayPanel class="panel-suggestions" ref="overlay-suggestions">
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
    </OverlayPanel> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchService from "@/services/SearchService";
import Suggestions from "@/components/search/Suggestions.vue";
import HeroIcon from "@/components/general/HeroIcon.vue";
import QueryService from "../../services/QueryService";
import _ from "lodash";

export default defineComponent({
  name: "SearchInput",
  props: ["modelValue", "allowShowDetails", "label", "maxResults", "allow", "type", "path"],
  emits: ["update:modelValue", "updateActiveClause", "close"],
  components: {
    Suggestions,
    HeroIcon
  },
  mounted() {
    this.focusTextArea();

  },
  methods: {
    focusTextArea() {
      this.$nextTick(() => {
        (this.$refs["textarea"] as any).focus();
        // setTimeout(() => {
        //   theElement.focus();
        // }, 500);
      });
    },
    updateActiveClause(value: any) {
      this.$emit("updateActiveClause", value);
    },
    onInput(event: any): void {
      this.search(event.target.value);
      this.$emit("update:modelValue", event.target.value);
    },
    async search(searchString: string): Promise<any> {
      //###todo: instead of debounce only start searching after the user stops typing for >1s (or so) see https://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up
      const search = _.debounce(() => {
        QueryService.searchAll(searchString)
          // await SearchService.searchAll(searchString)
          .then((res: any) => {
            console.log("fetched OSS search results", res);
            this.searchData = res;
            this.$store.commit("setSearchData", { searchString: searchString, data: res, path: this.path });
            return res;
          })
          .catch((err: any) => {
            console.log("Could not load search results", err);
            return null;
          });
      }, 500);

      search();
    },
    onFocus(event: any): void {
      this.focus = true;
      // (this.$refs["overlay-suggestions"] as any).toggle(event); //show();
    },
    onBlur(event: any): void {
      this.focus = false;
      // (this.$refs["overlay-suggestions"] as any).toggle(event); //hide();
      this.$emit("blur");
    }
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
.node-card-textarea {
  /* min-width: 300px; */
}
.search-input {
  /* width: 600px; */
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

<style>
.panel-suggestions {
  background-color: gray;
}
</style>
