<template>
  <div class="dashcard-container">
    <Card class="dashcard dash-table">
      <template #title> Ontology overview </template>
      <template #subtitle>
        A brief overview of the concepts stored in the Ontology
      </template>
      <template #content>
        <DataTable v-if="!$store.state.loading.get('reportTable_' + iri)" :value="tableData" class="p-datatable-sm" :scrollable="true" scrollHeight="350px">
          <template #header>
            Ontology data
          </template>
          <Column field="label" header="Label"></Column>
          <Column field="count" header="Total"></Column>
        </DataTable>
        <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading-container" v-if="$store.state.loading.get('reportTable_' + iri)">
          <ProgressSpinner />
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoggerService from "@/services/LoggerService";
import { IM } from "@/vocabulary/IM";
import { RDFS } from "@/vocabulary/RDFS";
import { OWL } from "@/vocabulary/OWL";
import EntityService from "@/services/EntityService";

export default defineComponent({
  name: "OntologyOverview",
  props: ["iri"],
  data() {
    return {
      tableData: [] as any
    };
  },
  mounted() {
    // table data
    this.$store.commit("updateLoading", {
      key: "reportTable_" + this.iri,
      value: true
    });
    EntityService.getPartialEntity(this.iri, [RDFS.LABEL, RDFS.COMMENT, IM.STATS_REPORT_ENTRY])
      .then(res => {
        this.tableData = [];

        for (const entry of res.data[IM.STATS_REPORT_ENTRY]) {
          this.tableData.push({
            label: entry[RDFS.LABEL],
            count: +entry[OWL.HAS_VALUE]
          });
        }

        this.$store.commit("updateLoading", {
          key: "reportTable_" + this.iri,
          value: false
        });
      })
      .catch(err => {
        this.$store.commit("updateLoading", {
          key: "reportTable_" + this.iri,
          value: false
        });
        this.$toast.add(LoggerService.error("Ontology Overview server request failed", err));
      });
  } // mounted end
});
</script>

<style scoped>
.dashcard-container {
  grid-area: overview;
  height: 100%;
  width: 100%;
}

@media screen and (min-width: 1440px) {
  .dashcard-container {
    max-width: calc(35vw - 57.5px - 21px);
  }
}

@media screen and (min-width: 1024px) and (max-width: 1439px) {
  .dashcard-container {
    max-width: calc(32vw - 21px);
  }
}

@media screen and (max-width: 1023px) {
  .dashcard-container {
    max-width: calc(62vw - 21px);
  }
}
.dashcard {
  height: 100%;
  width: 100%;
}
</style>
