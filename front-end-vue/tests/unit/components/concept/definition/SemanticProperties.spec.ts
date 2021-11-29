import { shallowMount } from "@vue/test-utils";
import SemanticProperties from "@/components/concept/definition/SemanticProperties.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import StyleClass from "primevue/styleclass";

describe("SemanticProperties.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockRoute: any;
  let mockStore: any;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn()
    };
    mockRoute = {
      name: "Concept"
    };
    mockStore = {
      state: {
        selectedEntityType: "Ontology"
      }
    }

    wrapper = shallowMount(SemanticProperties, {
      global: {
        components: { DataTable, Column, Button },
        mocks: { $route: mockRoute, $router: mockRouter, $store: mockStore },
        directives: { styleclass: StyleClass }
      },
      props: {
        label: "Semantic properties",
        data: [
          {
            property: { name: "Associated morphology (attribute)", "@id": "http://snomed.info/sct#116676008" },
            type: { name: "Lateral abnormal curvature (morphologic abnormality)", "@id": "http://snomed.info/sct#31739005" }
          }
        ],
        size: "100%"
      }
    });
  });

  it("can navigate", () => {
    wrapper.vm.navigate("http://snomed.info/sct#116676008");
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Concept", params: { selectedIri: "http://snomed.info/sct#116676008" } });
  });

  it("can navigate ___ no iri", () => {
    wrapper.vm.navigate();
    expect(mockRouter.push).toHaveBeenCalledTimes(0);
  });

  it("can setButtonExpanded ___ true", () => {
    expect(wrapper.vm.buttonExpanded).toBe(false);
    wrapper.vm.setButtonExpanded();
    expect(wrapper.vm.buttonExpanded).toBe(true);
  });

  it("can setButtonExpanded ___ false", () => {
    wrapper.vm.buttonExpanded = true;
    wrapper.vm.setButtonExpanded();
    expect(wrapper.vm.buttonExpanded).toBe(false);
  });
});
