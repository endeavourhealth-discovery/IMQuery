<template>
  <div class="main p-pt-3">
    <!-- Section: ODS Code  -->

    <InputSection>
      <template v-slot:left>
        <InputDescription :description="inputMeta.odsCode" />
      </template>
      <template v-slot:right>
        <InputTextbox
          class="w-dynamic"
          type="text"
          :placeholder="inputMeta.odsCode.placeholder"
          maxlength="10"
        />
      </template>
    </InputSection>

    <!-- / Section: ODS Code  -->

    <!-- Section: Organisation Type  -->

    <InputSection>
      <template v-slot:left>
        <InputDescription :description="inputMeta.organisationType" />
      </template>
      <template v-slot:right>
        <MultiSelect
          class="w-dynamic multi-large"
          v-model="selectedOrganisationTypes"
          :options="organisationTypes"
          optionLabel="label"
          :placeholder="inputMeta.organisationType.placeholder"
          
        />
      </template>
    </InputSection>

    <!-- / Section: Organisation Type  -->
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

import InputSection from "@/components/dataset/InputSection.vue";
import InputDescription from "@/components/dataset/InputDescription.vue";
import InputTextbox from "@/components/dataset/InputTextbox.vue";
import InputRadioButtons from "@/components/dataset/InputRadioButtons.vue";
import OrganisationTable from "@/components/dataset/OrganisationTable.vue";
import MultiSelect from "primevue/multiselect";

export default defineComponent({
  name: "OrganisationSearch",
  props: ["organisationdata", "ccgdata"],
  components: {
    InputSection,
    InputDescription,
    InputTextbox,
    // InputRadioButtons,
    // OrganisationTable,
    MultiSelect,
  },
  data() {
    return {
      activePage: 1,
      totalPageCount: 2,
      showNewListDialog: false,
      selectedOrganisationTypes: [] as any,
      inputMeta: {
        odsCode: {
          title: "ODS Code",
          explanation:
            "<b>Purpose</b><br> Filter organisations by ODS Code. Use * as wildcard. <br><br> <b>Example</b><br> 'A8*' matches any ODS code starting with 'A8' ",
          placeholder: "Code, use * as wildcard",
        },
        organisationType: {
          title: "Organisation Type",
          explanation:
            "<b>Purpose</b><br> Filter organisations by Type. <br><br> <b>Example</b><br>  •  General Practices <br> • Hospital Services",
          placeholder: "Select Organisation Types",
        },
      },
      organisationTypes: [
        { value: 0, label: "Other" },
        { value: 1, label: "WIC Practice" },
        { value: 2, label: "OOH Practice" },
        { value: 3, label: "WIC + OOH Practice" },
        { value: 4, label: "GP Practice" },
        { value: 8, label: "Public Health Service" },
        { value: 9, label: "Hospital Service" },
        { value: 10, label: "Community Health Service" },
        { value: 11, label: "Optometry Service" },
        { value: 12, label: "Urgent & Emergency Care" },
        { value: 13, label: "Hospice" },
        { value: 14, label: "Care Home / Nursing Home" },
        { value: 15, label: "Border Force" },
        { value: 16, label: "Young Offender Institution" },
        { value: 17, label: "Secure Training Centre" },
        { value: 18, label: "Secure Children's Home" },
        { value: 19, label: "Immigration Removal Centre" },
        { value: 20, label: "Court" },
        { value: 21, label: "Police Custody" },
        { value: 22, label: "Sexual Assault Referral Centre" },
        { value: 24, label: "Other – Justice Estate" },
        { value: 25, label: "Prison" },
      ],
    };
  },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

div.main {
  position: relative;
  max-width: 1160px;
  /* padding: 0 10px; */
  margin: 0 auto;
}

.w-dynamic {
  width: 100%;
  max-width: 500px;
}

/* does bind properly  */
.p-multiselect-label-container {
    font-size: 1.25rem !important;
}

</style>

<style>
.multi-large .p-multiselect-label {
padding: 0.625rem 0.625rem !important;
}

.multi-large .p-multiselect-label-container {
    font-size: 1.25rem !important;
    
}
</style>
