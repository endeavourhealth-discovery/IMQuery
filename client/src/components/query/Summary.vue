<template>
  <div v-if="data" class="flex-col space-y-5">
    <div v-for="(value, key, index) in data" :key="key" class="flex ">
      <div class="text-gray-700 font-bold text-xl mr-3 w-[75px]">{{ getFriendlyLabel(key) }}</div>
      <div v-if="Array.isArray(value)" class="flex-col space-y-2">
        <div v-for="item in value" class="text-xl font-regular text-gray-black">
          {{ get(item, "rdfs:label[0]") || get(item, "@id") || item }}
        </div>
      </div>
      <div v-else class="text-xl font-regular text-gray-black">
        {{ get(item, "rdfs:label") || value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QueryService from "@/services/QueryService";
import QueryUtils from "@/helpers/QueryUtils";
import _ from "lodash";

export default defineComponent({
  name: "Summary",
  props: ["modelValue", "iri"],
  emits: ["update:modelValue"],
  data() {
    return {
      data: null
    };
  },
  async mounted() {
    await this.fetchSummary();
  },
  watch: {
    async iri() {
      await this.fetchSummary();
    }
  },
  methods: {
    get(object, path: string): any {
      const val = _.get(object, path);
      return val;
    },
    set(path: string, value: any): void {
      _.set(this.data, path, value);
    },
    async fetchSummary(): Promise<any> {
      await QueryService.queryIM("getSummary", { iri: this.iri })
        .then(res => {
          console.log("### getSummary", res);
          this.data = res;
        })
        .catch(err => {
          console.error("Failed to getSummary from the server", err);
        });
    },
    getFriendlyLabel(key: string): string {
      return QueryUtils.getFriendlyLabel(QueryUtils.toUrl(key));
    },
    getFriendyValue(key: string): string {
      return key;
    },
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    }
  }
});
</script>

<style scoped></style>
