<template>
  <div class="quick-filters-container">
    <div class="quick-filter-container">
      <label>Include legacy:</label>
      <InputSwitch v-model="includeLegacy" />
    </div>
  </div>
  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect id="status" v-model="selectedStatus" @change="checkForSearch" :options="statusOptions" optionLabel="name" display="chip" />
      <label for="status">Select status:</label>
    </span>
  </div>

  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect id="scheme" v-model="selectedSchemes" @change="checkForSearch" :options="schemeOptions" optionLabel="name" display="chip" />
      <label for="scheme">Select scheme:</label>
    </span>
  </div>

  <div class="p-field">
    <span class="p-float-label">
      <MultiSelect id="conceptType" v-model="selectedTypes" @change="checkForSearch" :options="typeOptions" optionLabel="name" display="chip" />
      <label for="scheme">Select concept type:</label>
    </span>
  </div>
</template>

<script lang="ts">
import ConfigService from "@/services/ConfigService";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "Filters",
  components: {},
  props: ["search"],
  computed: mapState(["filterOptions", "selectedFilters", "quickFiltersStatus"]),
  watch: {
    includeLegacy(newValue) {
      this.setLegacy(newValue);
    },
    selectedStatus() {
      this.updateStoreSelectedFilters();
    },
    selectedSchemes() {
      this.updateStoreSelectedFilters();
    },
    selectedTypes() {
      this.updateStoreSelectedFilters();
    }
  },
  async mounted() {
    await this.getFilterOptions();
    this.setFilters();
    this.setDefaults();
  },
  data() {
    return {
      statusOptions: [] as any[],
      schemeOptions: [] as any[],
      typeOptions: [] as any[],
      selectedStatus: [] as any[],
      selectedSchemes: [] as any[],
      selectedTypes: [] as any[],
      configs: {} as any,
      includeLegacy: false
    };
  },
  methods: {
    checkForSearch() {
      this.updateStoreSelectedFilters();
      this.search();
    },

    setFilters() {
      this.$store.commit("updateFilterOptions", {
        status: this.statusOptions,
        scheme: this.schemeOptions,
        type: this.typeOptions
      });
    },

    setDefaults() {
      if (!this.selectedFilters.status.length && !this.selectedFilters.schemes.length && !this.selectedFilters.types.length) {
        this.selectedStatus = this.statusOptions.filter(item => this.configs.statusOptions.includes(item.name));
        this.selectedSchemes = this.schemeOptions.filter(item => this.configs.schemeOptions.includes(item.name));
        this.selectedTypes = this.typeOptions.filter(item => this.configs.typeOptions.includes(item.name));
        this.updateStoreSelectedFilters();
      } else {
        this.selectedStatus = this.selectedFilters.status;
        this.selectedSchemes = this.selectedFilters.schemes;
        this.selectedTypes = this.selectedFilters.types;
      }

      if (this.quickFiltersStatus.includeLegacy) {
        this.includeLegacy = this.quickFiltersStatus.includeLegacy;
      }
    },

    updateStoreSelectedFilters() {
      this.$store.commit("updateSelectedFilters", {
        status: this.selectedStatus,
        schemes: this.selectedSchemes,
        types: this.selectedTypes
      });
    },

    async getFilterOptions() {
      await ConfigService.getFilterDefaults()
        .then(res => {
          this.configs = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get filter configs from server", err));
        });

      await EntityService.getNamespaces()
        .then(res => {
          this.schemeOptions = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get scheme filter options from server", err));
        });

      await EntityService.getEntityChildren("http://endhealth.info/im#Status")
        .then(res => {
          this.statusOptions = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get status filter options from server", err));
        });

      await EntityService.getEntityChildren("http://endhealth.info/im#ModellingEntityType")
        .then(res => {
          this.typeOptions = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get type filter options from server", err));
        });
    },

    setLegacy(include: boolean) {
      const emisScheme = this.selectedSchemes.findIndex(scheme => scheme.iri === "http://endhealth.info/emis#");
      if (include) {
        if (emisScheme === -1) {
          this.selectedSchemes.push(this.schemeOptions.find(scheme => scheme.iri === "http://endhealth.info/emis#"));
        }
      } else {
        if (emisScheme > -1) {
          this.selectedSchemes.splice(emisScheme, 1);
        }
      }
      this.$store.commit("updateQuickFiltersStatus", {
        key: "includeLegacy",
        value: include
      });
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

.quick-filters-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1rem;
}

.quick-filter-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
