<template>
  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect
        id="status"
        v-model="$store.state.filters.selectedStatus"
        @change="checkForSearch"
        :options="statusOptions"
        display="chip"
      />
      <label for="status">Select status:</label>
    </span>
  </div>

  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect
        id="scheme"
        v-model="$store.state.filters.selectedSchemes"
        @change="checkForSearch"
        :options="schemeOptions"
        optionLabel="name"
        display="chip"
      />
      <label for="scheme">Select scheme:</label>
    </span>
  </div>

  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect
        id="conceptType"
        v-model="$store.state.filters.selectedTypes"
        @change="checkForSearch"
        :options="typeOptions"
        display="chip"
      />
      <label for="scheme">Select concept type:</label>
    </span>
  </div>
</template>

<script lang="ts">
import { IM } from "@/vocabulary/IM";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Filters",
  components: {},
  props: ["search", "searchTerm"],
  data() {
    return {
      statusOptions: ["Active", "Draft", "Inactive"] as string[],
      schemeOptions: [
        {
          iri: IM.CODE_SCHEME_BARTS,
          name: "Barts Cerner code"
        },
        {
          iri: IM.CODE_SCHEME_CTV3,
          name: "CTV3 Code"
        },
        {
          iri: IM.DISCOVERY_CODE,
          name: "Discovery code"
        },
        {
          iri: IM.CODE_SCHEME_EMIS,
          name: "EMIS local code"
        },
        {
          iri: "http://endhealth.info/im#581000252100",
          name: "Homerton Cerner code"
        },
        {
          iri: IM.CODE_SCHEME_ICD10,
          name: "ICD10 code"
        },
        {
          iri: IM.CODE_SCHEME_OPCS4,
          name: "OPCS4 code"
        },
        {
          iri: IM.CODE_SCHEME_READ,
          name: "Read 2 code"
        },
        {
          iri: IM.CODE_SCHEME_SNOMED,
          name: "Snomed-CT code"
        },
        {
          iri: "http://endhealth.info/im#631000252102",
          name: "TPP local codes"
        },
        {
          iri: IM.CODE_SCHEME_TERMS,
          name: "Term based code"
        }
      ] as { iri: string; name: string }[],
      typeOptions: [
        "Class",
        "ObjectProperty",
        "DataProperty",
        "DataType",
        "Annotation",
        "Individual",
        "Record",
        "ValueSet",
        "Folder",
        "Term",
        "Legacy",
        "CategoryGroup"
      ] as string[]
    };
  },
  methods: {
    checkForSearch() {
      if (this.searchTerm.length > 2) {
        this.search();
      }
    }
  }
});
</script>

<style scoped>
label {
  font-size: 1rem !important;
}

.p-field {
  margin-top: 1rem;
}
</style>
