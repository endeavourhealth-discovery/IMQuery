import { shallowMount } from "@vue/test-utils";
import SemanticProperties from "@/components/concept/SemanticProperties.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

describe("SemanticProperties.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockRoute: any;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn()
    };
    mockRoute = {
      name: "Concept"
    };

    wrapper = shallowMount(SemanticProperties, {
      global: {
        components: { DataTable, Column },
        mocks: { $route: mockRoute, $router: mockRouter }
      },
      props: { semanticProperties: [{"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}], contentHeight: 100 }
    });
  });

  it("can navigate", () => {
    wrapper.vm.navigate("http://snomed.info/sct#116676008");
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Concept", params: { "selectedIri": "http://snomed.info/sct#116676008" }});
  });

  it("can navigate ___ no iri", () => {
    wrapper.vm.navigate();
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
  });
});
