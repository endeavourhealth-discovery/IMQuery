<template>
  <!-- General UI -->
  <ConfirmDialog></ConfirmDialog>
  <!-- /General UI -->

  <!-- Content Wrapper -->
  <div id="main-container">
    <!-- Header -->
    <header class="p-d-flex">
      <Stepper :activeIndex="activePage - 1" :items="stepperItems" />
      <!-- <div class="p-d-flex p-flex-column p-jc-center p-ai-center">
        <Button
          label="Save"
          icon="pi pi-save"
          class="p-button-primary p-button-outlined button-medium"
          @click="handleSave"
        />
      </div> -->
    </header>
    <!-- /Header -->

    <main>
      <!-- Step 1 -->
      <div id="step1" v-if="activePage == 1" class="page">
        <!-- Section: Name  -->
        <InputSection>
          <template v-slot:left>
            <InputDescription :description="inputMeta.name" />
          </template>
          <template v-slot:right>
            <InputTextbox
              class="w-dynamic"
              type="text"
              :placeholder="inputMeta.name.placeholder"
              minlength="10"
              maxlength="35"
            />
          </template>
        </InputSection>
        <!-- /Section: Name  -->

        <!-- Section: Description  -->
        <InputSection>
          <template v-slot:left>
            <InputDescription :description="inputMeta.description" />
          </template>
          <template v-slot:right>
            <InputTextbox
              class="w-dynamic"
              type="text"
              :placeholder="inputMeta.description.placeholder"
              minlength="25"
              maxlength="500"
            />
          </template>
        </InputSection>
        <!-- /Section: Description  -->
      </div>
      <!-- /Step 1-->

      <!-- Step 2 -->
      <div id="step2" v-if="activePage == 2" class="page">
        <!-- Section: Organisations  -->

        <!-- Full screen Search Dialog /  Create new List of Organisations  -->
        <FullscreenDialog
          v-if="showNewListDialog"
          id="newListDialog"
          @close="showNewListDialog = false"
          title="Create New List"
        >
          <OrganisationSearch
            :organisationdata="organisationData"
            :ccgdata="ccgData"
          />
        </FullscreenDialog>
           <!--  Full screen Search Dialog / Create new List of Organisations  -->


        <InputSection>
          <template v-slot:left>
            <InputDescription :description="inputMeta.organisations" />
          </template>
          <template v-slot:right>
            <div class="p-d-flex p-jc-end">
              <Button
                icon="pi pi-plus"
                class="button-medium"
                type="button"
                label="Add"
                @click="toggleAddOverlay"
              />
            </div>
            <OverlayPanel id="add-overlay" ref="add-overlay">
              <div class="p-d-flex p-flex-column">
                <Button
                  label="New List"
                  class="p-button-primary p-button-outlined button-medium p-mx-2 p-mb-2"
                  @click="handleNewList"
                />
                <Button
                  label="Existing List"
                  class="p-button-primary p-button-outlined button-medium p-mx-2"
                  @click="handleExistingList"
                />
              </div>
            </OverlayPanel>
          </template>
        </InputSection>

        <!-- Organisation Lists included in Dataset defintion  -->
        <OrganisationTable
          id="organisation-table"
          v-if="organisationDataLoaded && ccgDataLoaded"
          maxtableheight="600"
          class="p-mb-5"
          :lists="organisationLists"
          :collapsible="true"
          :organisationdata="organisationData"
          :ccgdata="ccgData"
        />
           <!-- Organisation Lists included in Dataset defintion  -->

        <!-- /Section: Organisations  -->
      </div>
      <!-- /Step 2-->

      <!-- Step 3 -->
      <div id="step3" v-if="activePage == 3" class="page">
        <!-- Section: Cohort Members  -->
        <InputSection>
          <template v-slot:left>
            <InputDescription :description="inputMeta.mainEntity" />
          </template>
          <template v-slot:right>
            <InputRadioButtons
              :items="radioButtonItems.mainEntity"
              :multiselect="false"
              v-model="selectedMainEntity"
            />
          </template>
        </InputSection>
        <!-- /Section: Cohort Members   -->
      </div>
      <!-- /Step 3-->

      <!-- Step 4 -->
      <div id="step4" v-if="activePage == 4" class="page">
        Step 4
      </div>
      <!-- /Step 4-->

      <!-- Footer  -->
      <footer
        :class="[
          'p-d-flex',
          'p-jc-between',
          activePage == 1 ? 'p-flex-row-reverse' : '',
        ]"
      >
        <Button
          v-if="activePage > 1"
          label="Back"
          icon="pi pi-chevron-left"
          class="p-button-primary p-button-outlined button-medium"
          @click="handleBack"
        />
        <Button
          v-if="activePage != totalPageCount"
          label="Next"
          icon="pi pi-chevron-right"
          class="p-button-primary button-medium"
          @click="handleNext"
        />
      </footer>

      <!-- Footer  -->
    </main>
  </div>
  <!-- /Content Wrapper -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

import ConfirmDialog from "primevue/confirmdialog";

import DatasetService from "@/services/DatasetService";
import LoggerService from "@/services/LoggerService";

import Stepper from "@/components/dataset/Stepper.vue";
import InputSection from "@/components/dataset/InputSection.vue";
import InputDescription from "@/components/dataset/InputDescription.vue";
import InputTextbox from "@/components/dataset/InputTextbox.vue";
import InputRadioButtons from "@/components/dataset/InputRadioButtons.vue";
import OrganisationTable from "@/components/dataset/OrganisationTable.vue";
import FullscreenDialog from "@/components/dataset/FullscreenDialog.vue";
import OrganisationSearch from "@/components/dataset/OrganisationSearch.vue";

export default defineComponent({
  name: "DatasetWizard",
  components: {
    ConfirmDialog,
    Stepper,
    InputSection,
    InputDescription,
    InputTextbox,
    InputRadioButtons,
    OrganisationTable,
    FullscreenDialog,
    OrganisationSearch,
  },
  $refs: {
    OverlayPanel: HTMLElement,
  },
  async mounted() {
    this.fetchOrganisationData();
    this.fetchCCGData();
  },
  data() {
    return {
      activePage: 1,
      totalPageCount: 4,
      showNewListDialog: false,
      organisationData: [] as any,
      ccgData: [] as any,
      organisationDataLoaded: false,
      ccgDataLoaded: false,
      selectedMainEntity: [] as any,
      stepperItems: [
        {
          label: "Details",
        },
        {
          label: "Data Sources",
        },
        {
          label: "Dataset",
        },
        {
          label: "Sharing",
        },
      ],
      radioButtonItems: {
        mainEntity: [
          {
            id: 0,
            name: "Patient / Service User",
            explanation: "<b>Definition</b><br>The records of a person who uses a health or care service at one distinct organisation. <br><br> <b>Example</b><br> A person may have been registered and/or previously received care at an organisation that has documented that interaction in their health record.",
          },
          {
            id: 1,
            name: "Person /  Individual",
            explanation: "<b>Definition</b><br>Every record of a person at every organisation where they have been a patient. <br><br> <b>Example</b><br> One person may be linked to multiple patient demographics in different health records.",
          },
          {
            id: 2,
            name: "Household",
            explanation: "<b>Definition</b><br>A collection of individuals (persons) who are the usual occupants of one single place of residence. <br><br><b>Example</b><br>A household may contain zero or more people (persons).",
          },
          {
            id: 3,
            name: "Organisation",
            explanation: "<b>Definition</b><br>The records of a legal entity, service or group  with a common purpose (such as providing care). <br><br> <b>Example</b><br> • A GP practice <br> • A Hospital ",
          },
          {
            id: 4,
            name: "Appointment",
            explanation: "<b>Definition</b><br>The records of a consultation that takes places on premises.",
          },
        ],
      },
      inputMeta: {
        name: {
          title: "Name",
          explanation:
            "<b>Purpose</b><br>Label your dataset with a short name that is memorable and helps you recognise it later. <br><br> <b>Example</b><br> • QOF BP002 2021 <br>• ABG Audit 2019",
          placeholder: "Enter a Name",
        },
        description: {
          title: "Description",
          explanation:
            "<b>Purpose</b><br>Add a detailed summary that describes your dataset. <br><br> <b>Example</b><br> 'Patients registered at primary care practices commissioned by Tower Hamlets CCG with a diagnosis of diabetes type 2' ",
          placeholder: "Enter a Description",
        },
        organisations: {
          title: "Organisations",
          explanation:
            "<b>Purpose</b><br>Create a list of organisations that host/publish their health records as sources of data for your dataset. <br><br> <b>Example</b><br> A dataset can extract data from multiple list of multiple organisations where health records are stored.",
          placeholder: "",
        },
        mainEntity: {
          title: "Main Entity",
          explanation:
            "<b>Definition</b><br>The main entity is the is the main component of the health record that is directly related to all the other data in your dataset. <br> Think of this like your 'main table' that is linked to all the other tables in your dataset. <br><br><b>Tip</b><br> If you are looking for all health records associated with an individual at every organisation that publishes their data, choose Person instead of Patient.",
          placeholder: "",
        },
      },
      organisationLists: [
        {
          id: "d058f99e1f074063b0887356baeeb225",
          title:
            "Primary Care Organisations commissioned by NHS HARTLEPOOL AND STOCKTON-ON-TEES CCG in the TS17* and TS18* Postcode",
          ccgs: ["00K"],
          postcodes: ["TS17*", "TS18*"],
          organisationTypes: [4],
        },
        {
          id: "94151c672ee64c91ba3e5125b62fc6ba",
          title:
            "Primary Care Organisations commissioned by NHS NORTH CUMBRIA CCG",
          ccgs: ["01H"],
          postcodes: [],
          organisationTypes: [4],
        },
      ],
    };
  },
  methods: {
    async fetchOrganisationData(): Promise<void> {
      await DatasetService.getOrganisations()
        .then((res) => {
          this.organisationData = JSON.parse(res).organisationData;
          this.organisationDataLoaded = true;
        })
        .catch((err) => {
          this.$toast.add(
            LoggerService.error("Failed to fetch table data", err)
          );
        });
    },
    async fetchCCGData(): Promise<void> {
      await DatasetService.getCCGs()
        .then((res) => {
          this.ccgData = JSON.parse(res).ccgData;
          this.ccgDataLoaded = true;
        })
        .catch((err) => {
          this.$toast.add(
            LoggerService.error("Failed to fetch table data", err)
          );
        });
    },
    handleNext(): void {
      this.activePage += 1;
    },
    handleBack(): void {
      this.activePage -= 1;
    },
    toggleAddOverlay(event: any): void {
      (this.$refs["add-overlay"] as any).toggle(event);
    },
    handleNewList(): void {
      (this.$refs["add-overlay"] as any).toggle(event);
      this.showNewListDialog = true;
    },
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

#main-container {
  margin: 0.5rem;
  padding: 2rem 2rem 1rem;
  height: calc(100vh - 1rem);
  width: 100%;
  overflow-y: auto;
  background-color: #f8f9fb;
  border: 1px solid #dde1e2;
}

#main-container::-webkit-scrollbar {
  width: 10px;
}

#main-container::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  /* outline: 1px solid slategrey; */
}

main {
  position: relative;
  max-width: 1160px;
  /* padding: 0 10px; */
  margin: 0 auto;
}

div.page {
  width: 100%;
  padding-top: 30px;
}

footer {
  margin-top: 20px;
}

.button-medium::v-deep * {
  font-size: 16px;
}

.w-dynamic {
  width: 100%;
  max-width: 500px;
}
</style>
