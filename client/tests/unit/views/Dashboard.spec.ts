import { flushPromises, shallowMount } from "@vue/test-utils";
import Dashboard from "@/views/Dashboard.vue";
import ReportTable from "@/components/dashboard/ReportTable.vue";
import ReportPieChart from "@/components/dashboard/ReportPieChart.vue";

describe("Dashboard.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(Dashboard, {
      global: {
        components: { ReportTable, ReportPieChart }
      }
    });
  });

  it("starts with correct data", () => {
    expect(wrapper.vm.cardsData).toStrictEqual([
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
    ]);
  })
});
