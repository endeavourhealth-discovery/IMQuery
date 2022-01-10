<template>
  <!-- Editor  -->
  <div class="query-editor flex w-full h-full">
    <!-- Middle -->
    <div class="w-full flex">
      <div class="flex flex-col w-full h-full">
        <!-- Header  -->
        <div
          class="top-nav  inline-flex justify-center w-full px-5 pt-5 pb-10 text-2xl font-medium text-gray-500 bg-white rounded-t-2xl"
        >
          <!-- <div class="empty-space"></div> -->
          <HorizontalNavPills
            class="nav"
            v-model:items="openQueries"
            v-model="activeQueryId"
            :closable="true"
          />

          <div
            class="nav-buttons z-1 inline-flex rounded-md shadow-sm -space-x-px"
          >
            <button
              class="inline-flex items-center hover:shadow-lg pt-1 pl-2 pr-3 pb-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:border-transparent transition duration-500 ease-in-out hover:bg-blue-600 hover:text-white"
              @click="$emit('previous')"
            >
              <HeroIcon
                class="mr-1"
                strokewidth="2"
                width="20"
                height="20"
                icon="chevron_left"
              />
              Previous
            </button>
            <button
              class="inline-flex items-center  hover:shadow-lg pt-1 pl-3 pr-2 pb-1 rounded-r-md  text-sm font-medium duration-500 ease-in-out bg-blue-500 hover:bg-blue-600 text-white"
              @click="$emit('next')"
            >
              Next
              <HeroIcon
                class="ml-2"
                strokewidth="2"
                width="20"
                height="20"
                icon="chevron_right"
              />
            </button>
          </div>
        </div>
        <!-- / Header  -->

        <!-- Body  -->

        <div class="query-editor-body inline-flex h-full w-full">
          <!--  Content  -->
          <div class="bg-white inline query-editor-content rounded-b-2xl">
            <div
              v-show="sideNavActiveItem == 'Sources'"
              class="pt-8 pl-14 pr-10"
            >
              <div class="flex justify-between max-w-2xl mx-auto">
                <InputDescription :description="inputMeta.sources" />

                <!-- Button: New List  -->
                <RoundButton
                  class="h-10 p-2 px-3 text-xl font-regular shadow-sm "
                  :rounded="false"
                  :showRing="true"
                  backgroundColor="white"
                  hoverBackgroundColor="gray-50"
                  borderColor="gray-300"
                  hoverTextColor="gray-700"
                  focusTextColor="blue-600"
                  textColor="gray-700"
                  ringColor="blue-600"
                >
                  <HeroIcon
                    class="mr-3"
                    strokewidth="2"
                    width="16"
                    height="16"
                    icon="plus"
                  />
                  <span class="text-sm font-medium">
                    New List
                  </span>
                </RoundButton>
                <!-- /Button: New List  -->
              </div>
              <div class="flex flex-col items-center">
                <InputRadioButtons
                  class="w-full max-w-lg mt-7"
                  v-model="selectedOrganisations"
                  :items="radioButtonItems.sources"
                  :multiselect="false"
                    :checkbox="true"
                />
                <MultiSelect
                  v-if="selectedOrganisations.includes('other')"
                  class="w-full max-w-lg multi-large"
                  v-model="selectedOrganisationLists"
                  :options="organisationLists"
                  optionLabel="label"
                  :placeholder="inputMeta.selectedLists.placeholder"
                />
              </div>
            </div>
            <div
              v-show="sideNavActiveItem == 'Main Data Type'"
              class="pt-8 pl-14 pr-10 "
            >
              <div class="flex flex-col w-full max-w-2xl mx-auto">
                <InputDescription
                  class="w-full max-w-2xl"
                  :description="inputMeta.mainDataType"
                />
                <InputRadioButtons
                  
                  class="w-full max-w-lg mx-auto mt-7"
                  v-model="selectedMainDataType"
                  :items="radioButtonItems.mainDataType"
                  :multiselect="false"
                  :checkbox="true"
                />
              </div>
            </div>
            <StepCurator
              v-if="activeQuery.data.steps.length"
              class="w-full h-full"
              v-show="sideNavActiveItem == 'Steps'"
              :activeQuery="activeQuery"
              :openQueries="openQueries"
            >
              <InputDescription
                class="w-full max-w-2xl"
                :description="inputMeta.steps_data"
              />
            </StepCurator>

            <div v-show="sideNavActiveItem == 'Output'">
              Output
            </div>
            <div
              v-show="sideNavActiveItem == 'Save or Export'"
              class="pt-8 pl-14 pr-10"
            >
              <div class="flex justify-between items-center max-w-2xl mx-auto">
                <InputDescription :description="inputMeta.name" />
                <div class="w-full max-w-400px">
                  <input
                    class="title-input outline-none mb-5 text-gray-600 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter a name for your dataset."
                    :value="activeQuery.name"
                    @input="updateName($event.target.value)"
                  />
                </div>
              </div>
              <div class="flex justify-between max-w-2xl mx-auto">
                <InputDescription :description="inputMeta.description" />
                <div class="w-full max-w-400px h-full max-h-150px">
                  <textarea
                    class="title-input h-full outline-none mb-5 text-gray-600 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter a description for your dataset."
                    :value="activeQuery.description"
                    @input="updateDescription($event.target.value)"
                  />
                </div>
              </div>
            </div>
          </div>
          <!--  Content  -->
        </div>
        <!-- / Body  -->
      </div>
    </div>
    <!-- Middle -->

    <div class="section-right w-full hidden">
      <HorizontalNav
        class="section-right-nav w-full border-bottom px-5 py-3"
        v-model:items="rightPanelItems"
        v-model="activeRightPanelItemId"
        :closable="false"
      />
    </div>
  </div>
  <!-- Editor  -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

// UI
import VerticalButtonGroup from "@/components/dataset/VerticalButtonGroup.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import HorizontalNavPills from "@/components/dataset/HorizontalNavPills.vue";
import InputDescription from "@/components/dataset/InputDescription.vue";
import InputRadioButtons from "@/components/dataset/InputRadioButtons.vue";
// import InputTextbox from "@/components/dataset/InputTextbox.vue";
import HorizontalNav from "@/components/dataset/HorizontalNav.vue";

// import RoundButton from "@/components/dataset/RoundButton.vue";
// import MultiSelect from "primevue/multiselect";

import StepCurator from "@/components/dataset/StepCurator.vue";

export default defineComponent({
  name: "QueryEditor",
  components: {
    // VerticalButtonGroup,
    RoundButton,
    HeroIcon,
    HorizontalNavPills,
    StepCurator,
    InputDescription,
    // InputTextbox,
    InputRadioButtons,
    HorizontalNav,
    // MultiSelect,
  },
  props: ["sideNavActiveItem", "sideNavItems"],
  emits: ["update:activeQuery", "next", "previous"],
  data() {
    return {
      activeView: "Edit", // #Add #Edit #Convert #Search #Suggestions #Help
      selectedOrganisations: ["all"],
      selectedMainDataType: ["8beb8591-8b7b-4055-82c2-9da166df674f"],
      selectedOrganisationLists: [] as any,
      organisationLists: [
        {
          value: "b4a9a163-9ab8-4306-a7c0-8b17205983bc",
          label: "All GP practices commissioned by NEL CCG",
        },
      ],

      radioButtonItems: {
        mainDataType: [
          {
            id: "8beb8591-8b7b-4055-82c2-9da166df674f",
            iri: "im:Patient",
            name: "Patient",
            explanation:
              "<b>Tip</b><br>This option will select health records related to patients. <br><br> <b>Example</b><br> A patient is a person who has previously received care at an organisation that has documented that interaction in their electronic health record.",
          },
          {
            id: "952f4842-ffb6-4775-ae5f-58b7bb239896",
            iri: "im:Property",
            name: "Property",
            explanation:
              "<b>Tip</b><br>This option will select health records for a group of people who usually live at a single place of residence (a property). <br><br><b>Example</b><br>A family of 4 people may be living in a household i.e. parents and two kids.",
          },
          {
            id: "c0674833-dfeb-46e5-b465-cb0bd676c486",
            iri: "im:Organisation",
            name: "Organisation",
            explanation:
              "<b>Tip</b><br>This option will select health records generated by a legal entity, service or group  with a common purpose (such as providing care). <br><br> <b>Example</b><br> • GP Practice <br> • Hospital <br>  • Out of Hours Clinic  <br> • Community Mental Health Service ",
          },
          {
            id: "716bfd97-a461-4134-beb0-ad0b64a97da3",
            iri: "im:Appointment",
            name: "Appointment",
            explanation:
              "<b>Tip</b><br>This option will select health records associated with appointments that have taken places across and within organisations. <br><br> <b>Example</b><br> • A&E attendances <br> • GP visits <br> • Outpatient Clinic Appointments",
          },
        ],
        sources: [
          {
            id: "all",
            iri: "im:VSET_OrgAllAllowable",
            name: "All Allowable Organisations",
            explanation:
              "<b>Tip</b><br>This option selects data for all organisation you are authorised to view data for.<br><br> <b>Example</b><br> Members of staff at an organisation can view: <br> • Sensitive data for their organisation only, and <br> • Anonymised data for any other organisation.",
          },
          {
            id: "gp",
            iri: "im:VSET_OrgAllAllowableGPs",
            name: "All GP practices",
            explanation:
              "<b>Tip</b><br>This option selects data for all GP practices you are authorised to view data for.<br><br> <b>Example</b><br> A clinician working at a primary care network may wish to see anonymous data for other GP practices in their network.",
          },
          {
            id: "hospital",
            iri: "im:VSET_OrgAllAllowableHospitals",
            name: "All Hospitals",
            explanation:
              "<b>Tip</b><br>This option selects data for all Hospitals you are authorised to view data for.<br><br> <b>Example</b><br> A CIO at a hospital may wish to see data for all of the hospitals they manage.",
          },
          {
            id: "other",
            iri: "im:VSET_OrgList1",
            name: "Other - Select Below",
            explanation:
              "<b>Tip</b><br>This option selects data for all organisation in one of the custom lists of organisations you can select below or create yourself. <br><br> <b>Example</b><br> 'All organisations commissioned by the North East London CCG except for GP practices in Tower Hamlets'",
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
        // organisations: {
        //   title: "Organisations",
        //   explanation:
        //     "<b>Purpose</b><br>Create a list of organisations that host/publish their health records as sources of data for your dataset. <br><br> <b>Example</b><br> A dataset can extract data from multiple list of multiple organisations where health records are stored.",
        //   placeholder: "",
        // },
        sources: {
          title: "Sources",
          explanation:
            "<b>Tip</b><br>Select a lists of organisations that publish the health records you want data from. <br><br> <b>Example</b><br> A list describes a group of organisations that share similar characteristics such as a Postcode, Commissioner, Organisation Type and more. ",
          placeholder: "",
        },
        mainDataType: {
          title: "Main Data Type",
          explanation:
            "<b>Tip</b><br>Select the main health record that is directly related to all the data in your dataset. <br><br><b>Example</b><br> Think of this like your 'main table' of data that is linked to all the other tables in your dataset.",
          placeholder: "",
        },
        steps_data: {
          title: "Steps",
          explanation:
            '<b>Tip</b><br>Copy existing data from a dataservice or dataset by selecting sources. Then transform the data by applying inclusion and exclusion criteria in a series of steps.  <br><br> To see an example in action, copy a template from the library. <br><br><b>Example 1</b><br> The following research question is a product of three steps <br> 1. "Patients registered at GP practices <br> 2. with a diagnosis of Coronary Heart Disease <br> 3. taking any anti-coagulant or anti-platelet medication"',
          placeholder: "",
        },
        selectedLists: {
          title: "Select Lists",
          explanation: "",
          placeholder: "Select Lists from the Dropdown",
        },
      },
      activeRightPanelItemId: "13dba7f7-9d06-4f0a-9c60-cbb4d9518b47",
      rightPanelItems: [
        {
          id: "13dba7f7-9d06-4f0a-9c60-cbb4d9518b47",
          name: "Suggestions",
        },
        {
          id: "fbb192ca-d2ec-4d82-9228-94e23e5b753f",
          name: "All",
        },
        {
          id: "f31a59498-a835-4313-8124-22468a709a0c",
          name: "Favourites",
        },
      ],
    };
  },
  computed: {
    openQueries: {
      get(): any {
        return this.$store.state.openQueries;
      },
      set(value: any): void {
        this.$store.commit("updateOpenQueries", value);
        //sets an active file if A. there are openfiles left and B. there there is no longer an active file
        this.activeQueryId =
          this.openQueries.length > 0 ? this.openQueries[0].id : "";
      },
    },
    activeQuery: {
      get(): any {
        return this.openQueries.filter(
          (query: any) => query.id == this.$store.state.activeQueryId
        )[0];
      },
      set(value: any): void {
        console.log("active query updated: ", value);
        this.$store.commit("updateActiveQuery", value);
      },
    },
    activeQueryId: {
      get(): string {
        return this.$store.state.activeQueryId;
      },
      set(value: any): void {
        this.$store.commit("updateActiveQueryId", value);
      },
    },
  },
  methods: {
    updateName(name: string): void {
      console.log("valuechanged: ", name);
      let newActiveQuery = this.activeQuery;
      newActiveQuery.name = name;
      this.$emit("update:activeQuery", newActiveQuery);
    },
    updateDescription(description: string): void {
      let newActiveQuery = this.activeQuery;
      newActiveQuery.description = description;
      this.$emit("update:activeQuery", newActiveQuery);
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

.query-editor {
  /* border: 1px solid #d0d7de; */
  height: 100%;
  width: 100%;
}

.side-nav {
  max-width: 230px !important;
}

.top-nav {
  z-index: 2;
  /* border-bottom: 1px solid #ecefed; */
}

.query-editor-content {
  flex-grow: 1;
}

.section-toggler {
  margin-top: 5px;
}

.title-input {
  font-size: 16px !important;
  font-weight: 500;
}

.max-w-400px {
  max-width: 400px;
}

.max-h-150px {
  height: 150px;
}

.nav-buttons {
  position: absolute;
  right: 30px;
  height: 40px;
}
.empty-space {
  width: 70px;
}

.top-nav .nav {
  height: 40px;
}

.section-right {
  width: 400px;
  border-left: 1px solid #ecefed;
}
</style>
