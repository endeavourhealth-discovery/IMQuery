<template>
  <div class="dashboard-container">
    <report-table :key="cardsData[0].key" :iri="cardsData[0].iri" />
    <report-pie-chart :key="cardsData[1].key" :iri="cardsData[1].iri" />
    <report-pie-chart :key="cardsData[2].key" :iri="cardsData[2].iri" />
    <report-pie-chart :key="cardsData[3].key" :iri="cardsData[3].iri" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ReportTable from "@/components/dashboard/ReportTable.vue";
import ReportPieChart from "@/components/dashboard/ReportPieChart.vue";

export default defineComponent({
  name: "Dashboard",
  components: {
    "report-table": ReportTable,
    "report-pie-chart": ReportPieChart
  },
  data() {
    return {
      cardsData: [
        {
          key: "conceptCategory",
          iri: "http://endhealth.info/im#ontologyOverview"
        },
        {
          key: "conceptTypes",
          iri: "http://endhealth.info/im#ontologyConceptTypes"
        },
        {
          key: "conceptSchemes",
          iri: "http://endhealth.info/im#ontologyConceptSchemes"
        },
        {
          key: "conceptStatus",
          iri: "http://endhealth.info/im#ontologyConceptStatus"
        }
      ]
    };
  }
});
</script>

<style scoped>
.dashboard-container {
  grid-area: content;
  display: grid;
  column-gap: 7px;
  row-gap: 7px;
  width: 100%;
  height: calc(100vh - 2rem);
  overflow-y: auto;
  overflow-x: hidden;
}

@media screen and (min-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "overview types"
      "schemes status";
  }
}

@media screen and (max-width: 1023px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-areas:
      "overview"
      "types"
      "schemes"
      "status";
  }
}
</style>
