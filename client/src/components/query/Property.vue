<template>
  <div class="property group relative cursor-pointer">
    <NodeIcon
      :class="'ml10 min-w-[10px]' + [notExist || definition?.notExist ? ' text-red-700' : ' text-green-700']"
      strokewidth="3"
      width="14"
      height="14"
      icon="property_first"
    ></NodeIcon>

    <div v-if="definition?.entityInSet" class="horizontal" :updateTarget="['clause', 'view', `${propertyPath}[${propertyIndex}].entityInSet`]">
      <span class="property-name font-normal hover:underline"> {{ "is" }} </span>
      <span v-if="definition.notExist" class="property-name font-normal hover:underline"> {{ `${definition.notExist ? "not " : ""}` }} </span>
      <span class="ml-2 font-normal"> {{ "part of the results of the search" }} </span>
      <NodeIcon
        :class="'ml10 arrow-right' + [definition.notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <div
        class="ml10 "
        :updateTarget="['property-entityInSet', 'view', `${propertyPath}[${propertyIndex}]`]"
        v-for="(set, setIndex) in definition?.entityInSet"
      >
        {{ set?.name }}{{ "," }}
      </div>
    </div>

    <selector v-else type="edit-property" :updateTarget="['property-@id', 'view', `${propertyPath}[${propertyIndex}]`]">
      <div class="property-name font-normal hover:underline">
        {{ definition?.name }}
      </div>
    </selector>

    <div v-if="definition?.inSet" class="flex-col">
      <div v-for="(set, setIndex) in definition?.inSet" :key="set['@id']" class="relative">
        <ButtonCRUD @click="onAddInSet(`${propertyPath}[${propertyIndex}].inSet[${setIndex}]`)" :type="'add'"> </ButtonCRUD>
        <ButtonCRUD @click="onDeleteInSet(`${propertyPath}[${propertyIndex}].inSet[${setIndex}]`)" :type="'delete'"> </ButtonCRUD>
        <selector
          :hideSelector="true"
          type="edit-property"
          :updateTarget="['property-inSet', set?.name == '' ? 'update' : 'view', `${propertyPath}[${propertyIndex}].inSet[${setIndex}]`]"
        >
          <div class="ml10 flex ">
            <NodeIcon
              :class="'ml10 arrow-right' + [notExist ? ' text-red-700' : ' text-green-700']"
              strokewidth="3"
              width="14"
              height="14"
              icon="arrow_right_small"
            ></NodeIcon>
            <template v-if="set?.name == ''">
              <div class="outline-none w-full min-w-[400px] overflow-hidden resize-none">
                <input
                  :value="searchString"
                  @input="onInput($event, `${propertyPath}[${propertyIndex}].inSet[${setIndex}]`)"
                  class="outline-none pb-4 placeholder-gray-500 text-red-700 focus:text-blue-700 font-bold text-2xl w-full max-h-[30px] border-b-2 border-b-transparent focus:border-b-blue-700"
                  :placeholder="'Type to search for Concept or Concept Set'"
                />
              </div>
              <!-- <SearchInput :maxResults="10" :allow="['preview', 'create', 'insert', '']" label="Concept or Concept Set" v-model="searchString" type="underline"> -->
              <!-- </SearchInput> -->
              <!-- <SearchInput
                class="w-full"
                :maxResults="2"
                :allow="['preview', 'create', 'insert', '']"
                label="Property or Health Record Entry"
                v-model="searchString"
                type="underline"
              >
              </SearchInput> -->
            </template>
            <template v-else>{{ set?.name }}</template>
          </div>
        </selector>
      </div>
    </div>

    <div v-else-if="definition?.value" :class="'flex-col'">
      <div class="horizontal">
        <NodeIcon
          :class="'ml10 arrow-right min-w-[10px]' + [notExist ? ' text-red-700' : ' text-green-700']"
          strokewidth="3"
          width="14"
          height="14"
          icon="arrow_right_small"
        ></NodeIcon>
        <div class="ml10 horizontal">
          <selector type="edit-property" :updateTarget="['property-value', 'view', `${propertyPath}[${propertyIndex}]`]">
            {{ comparison(definition?.value?.comparison) }}
          </selector>
          <selector type="edit-property" :updateTarget="['property-value', 'view', `${propertyPath}[${propertyIndex}]`]">{{
            definition?.value?.valueData
          }}</selector>
          <selector type="edit-property" :updateTarget="['property-value', 'view', `${propertyPath}[${propertyIndex}]`]">
            {{  definition?.function?.argument[0].valueData?.toLowerCase()}}
          </selector>
          <span class="relative -left-[5px]">{{ getText("s") }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="definition?.isConcept" class="horizontal">
      <NodeIcon
        :class="'ml10 arrow-right' + [notExist ? ' text-red-700' : ' text-green-700']"
        strokewidth="3"
        width="14"
        height="14"
        icon="arrow_right_small"
      ></NodeIcon>
      <selector
        :updateTarget="['property-concept', 'view', `${propertyPath}[${propertyIndex}].isConcept[${conceptIndex}]`]"
        :key="concept['@id']"
        v-for="(concept, conceptIndex) in definition?.isConcept"
      >
        <div class="font-bold">{{ concept?.name }}</div>
      </selector>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NodeIcon from "./NodeIcon.vue";
import Selector from "./Selector.vue";
import ButtonCRUD from "./ButtonCRUD.vue";
import SearchInput from "./SearchInput.vue";
import QueryService from "@/services/QueryService";

import _ from "lodash";

export default defineComponent({
  name: "Property",
  props: ["modelValue", "notExist", "path", "propertyPath", "propertyIndex"],
  components: { NodeIcon, Selector, ButtonCRUD },
  data() {
    return {
      searchString: "New",
      showSearchInput: false,
      searchData: {}
      // definition: this.modelValue?.property && this.modelValue?.property?.length > 0 ? this.modelValue.property[0] : this.modelValue
    };
  },
  watch: {
    path(oldValue, newValue) {
      this.definition = this.modelValue ? this.modelValue : _.get(this.data, newValue);
    }
  },
  methods: {
    onInput(event: any, path): void {
      console.log("search", path);
      const searchString = event.target.value;
      this.search(searchString, path);
      this.searchString = searchString;
    },
    async search(searchString: string, path?: string): Promise<any> {
      //###todo: instead of debounce only start searching after the user stops typing for >1s (or so) see https://stackoverflow.com/questions/4220126/run-javascript-function-when-user-finishes-typing-instead-of-on-key-up
      const search = _.debounce(() => {
        QueryService.searchConceptSet(searchString)
          // await SearchService.searchAll(searchString)
          .then((res: any) => {
            console.log("### res", res);
            this.searchData = res.data;
            this.$store.commit("setSearchData", { searchString: searchString, data: res.data, path: `${this.path}.${path}` });
            return res;
          })
          .catch((err: any) => {
            console.log("Could not load search results", err);
            return null;
          });
      });

      search();
    },
    onDeleteInSet(path: string) {
      this.$store.commit("updateActiveProperty", { action: "deleteInSet", propertyPath: path });
    },
    onAddInSet(path: string) {
      this.$store.commit("updateActiveProperty", { action: "newInSet", propertyPath: path });
    },
    getText(type: string): string {
      if (type == "s") {
        return _.get(this.definition, "function.argument[0].valueData") && _.get(this.definition, "value.valueData") > 1 ? "s" : "";
      }
      return "";
    },

    onClick(TTIriRef: any): void {
      // console.log("ref", this.$refs["overlay-inset"] as any);
      // this.viewEntity(TTIriRef);
    },
    setDefinition(definition: any) {
      this.definition = definition;
    },
    comparison(comparison: string): string {
      switch (comparison) {
        case "GREATER_THAN_OR_EQUAL":
          return "greater than or equal to";
        case "LESS_THAN_OR_EQUAL":
          return "less than or equal to";
        case "GREATER_THAN":
          return "greater than";
        case "LESS_THAN":
          return "less than";
        default:
          return comparison;
      }
    },
    viewEntity(entity: any): void {
      const url = `https://dev.endhealth.co.uk/viewer/#/concept/${encodeURIComponent(entity["@id"])}`;
      window.open(url, "_blank").focus();
    }
  },
  computed: {
    definition: {
      get(): any {
        let path;
        if (!this.path) {
          //i.e. properties being previewed in Suggestion.vue
          return this.modelValue?.property && this.modelValue?.property?.length > 0 ? this.modelValue.property[0] : this.modelValue;
        } else if (this.propertyPath) {
          //i.e. properties inside clauses
          path = `${this.path}.${this.propertyPath}[${this.propertyIndex}]`;
        } else {
          //i.e. other types of direct properties
          path = this.path;
        }
        // console.log("path", path);
        const def = _.get(this.queryDefinition, path);
        return def;
      },
      set(val: any): void {}
    },
    queryDefinition: {
      get(): any {
        return this.$store.state.queryBuilder.dataSet.get(this.$store.state.activeQueryId);
      },
      set(value: any): void {
        return;
      }
    }
  }
});
</script>

<style scoped>
.property {
  display: flex;
  font-size: 13px;
}

.property-name {
  margin-left: 16px;
}

.arrow-right {
  position: relative;
  top: 4px;
}
</style>
