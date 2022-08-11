<template>
  <div v-if="data" class="transition duration-500 ease-in-out flex-col space-y-5">
    <div v-for="(value, key, index) in data" :key="key" class="flex-col">
      <div class="inline-flex px-3 py-2 rounded-md hover:bg-gray-300 cursor-pointer" @click="expanded = !expanded">
        <NodeIcon class="text-blue-700  mr-4" strokewidth="4" width="14" height="14" :icon="[expanded ? 'chevron_up' : 'chevron_down']"></NodeIcon>
        <div class="text-gray-700 font-bold text-xl mr-3 ">
          {{ getFriendlyLabel(key) }}
        </div>
      </div>
      <div
        v-if="expanded"
        v-for="(member, memberIndex) in data[key]"
        :key="member"
        class="flex px-3 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
        v-tooltip.bottom="member['@id']"
        @click="onClick(member['@id'])"
      >
        <div class="text-blue-700 font-bold text-2xl ml-2 mr-4" width="14" height="14" icon="">{{ "-" }}</div>
        <div class="text-black  text-xl mr-3">
          {{ member?.name }}
        </div>
      </div>
    </div>
  </div>
  <div v-else>No Definition Found</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QueryService from "@/services/QueryService";
import QueryUtils from "@/helpers/QueryUtils";
import NodeIcon from "./NodeIcon.vue";

export default defineComponent({
  name: "SetDefinition",
  props: ["modelValue", "iri"],
  emits: ["update:modelValue"],
  components: { NodeIcon },
  data() {
    return {
      data: null,
      expanded: true
    };
  },
  async mounted() {
    await this.fetchMembers();
  },
  watch: {
    async iri() {
      await this.fetchMembers();
    }
  },
  methods: {
    onClick(iri: string): void {
      const _encodedIri = encodeURIComponent(iri);
      const _url = `https://dev.endhealth.co.uk/viewer/#/concept/${_encodedIri}`;
      window.open(_url, "_blank");
    },
    getFriendlyLabel(key: string): string {
      return QueryUtils.getFriendlyLabel(key);
    },
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    },
    async fetchMembers(): Promise<any> {
      await QueryService.queryIM("getMembers", { iri: this.iri })
        .then(res => {
          console.log("### getMembers", res);
          this.data = res;
        })
        .catch(err => {
          console.error("Failed to getMembers from the server", err);
        });
    }
  }
});
</script>

<style scoped></style>
