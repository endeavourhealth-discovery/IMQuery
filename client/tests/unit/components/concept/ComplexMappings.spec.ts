import { flushPromises, shallowMount } from "@vue/test-utils";
import ComplexMappings from "@/components/concept/ComplexMappings.vue";
import ProgressSpinner from "primevue/progressspinner";
import OrganizationChart from "primevue/organizationchart";
import OverlayPanel from "primevue/overlaypanel";
import EntityService from "@/services/EntityService";

describe("ComplexMappings.vue", () => {
  let wrapper: any;
  let mockStore: any;

  beforeEach(async() => {
    jest.resetAllMocks();
    mockStore = {
      state: { loading: { get: jest.fn().mockReturnValue(false) }},
      commit: jest.fn()
    };

    EntityService.getPartialEntity = jest.fn().mockResolvedValue({ data: { "http://endhealth.info/im#hasMap": [{"http://endhealth.info/im#combinationOf":[{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#X109","name":"Unspecified amputation of foot"},"http://endhealth.info/im#mapAdvice":"ALWAYS X10.9 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]},{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#Z942","name":"Right sided operation"},"http://endhealth.info/im#mapAdvice":"ALWAYS Z94.2 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]}]}]}});

    wrapper = shallowMount(ComplexMappings, {
      global: {
        components: { ProgressSpinner, OrganizationChart, OverlayPanel },
        mocks: { $store: mockStore }
      },
      props: { conceptIri: "http://snomed.info/sct#723312009" }
    });
    await flushPromises();
    jest.clearAllMocks();
  });

  it("watches conceptIri", async() => {
    wrapper.vm.getMappings = jest.fn().mockResolvedValue(true);
    wrapper.vm.createChartStructure = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://snomed.info/sct#723312009");
    expect(wrapper.vm.getMappings).toHaveBeenCalledTimes(1);
    await flushPromises();
    expect(wrapper.vm.createChartStructure).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateLoading", {
      key: "mappings",
      value: true
    });
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", {
      key: "mappings",
      value: false
    });
  });

  it("can get mappings ___ success", async() => {
    wrapper.vm.getMappings();
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#723312009", ["http://endhealth.info/im#hasMap"]);
    expect(wrapper.vm.mappings).toStrictEqual([{"http://endhealth.info/im#combinationOf":[{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#X109","name":"Unspecified amputation of foot"},"http://endhealth.info/im#mapAdvice":"ALWAYS X10.9 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]},{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#Z942","name":"Right sided operation"},"http://endhealth.info/im#mapAdvice":"ALWAYS Z94.2 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]}]}]);
  });

  it("can get mappings ___ fail", async() => {
    EntityService.getPartialEntity = jest.fn().mockRejectedValue(false);
    wrapper.vm.getMappings();
    await flushPromises();
    expect(wrapper.vm.mappings).toStrictEqual([]);
    expect(wrapper.vm.data).toStrictEqual({});
  });


  it("can get mappings ___ fail no hasMap", async() => {
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({data: { comboOf: [1, 2] }});
    wrapper.vm.getMappings();
    await flushPromises();
    expect(wrapper.vm.mappings).toStrictEqual({});
    expect(wrapper.vm.data).toStrictEqual({});
  });

  it("can create chartTableNode", () => {
    expect(wrapper.vm.createChartTableNode([{ assuranceLevel: "TestAssurance", iri: "TestIri", name: "TestName", priority: 1 }], "0", 1)).toStrictEqual({ key: "0_1", type: "childList", data: { mapItems: [{ assuranceLevel: "TestAssurance", iri: "TestIri", name: "TestName", priority: 1 }] } });
  });

  it("can createChartMapNode ___ OneOf", () => {
    expect(wrapper.vm.createChartMapNode("http://endhealth.info/im#oneOf", "0_1", 2)).toStrictEqual({ key: "0_1_2", type: "oneOf", data: { label: "One of" }, children: [] });
  });

  it("can createChartMapNode ___ ComboOf", () => {
    expect(wrapper.vm.createChartMapNode("http://endhealth.info/im#combinationOf", "0_1", 2)).toStrictEqual({ key: "0_1_2", type: "comboOf", data: { label: "Combination of" }, children: [] });
  });

  it("can createChartMapNode ___ someOf", () => {
    expect(wrapper.vm.createChartMapNode("http://endhealth.info/im#someOf", "0_1", 2)).toStrictEqual({ key: "0_1_2", type: "someOf", data: { label: "Some of" }, children: [] });
  });

  it("can createChartMapNode ___ none", () => {
    expect(wrapper.vm.createChartMapNode("http://endhealth.info/im#none", "0_1", 2)).toStrictEqual(undefined);
  });

  it("can generateChildNodes", () => {
    expect(wrapper.vm.generateChildNodes([{"http://endhealth.info/im#combinationOf":[{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#X109","name":"Unspecified amputation of foot"},"http://endhealth.info/im#mapAdvice":"ALWAYS X10.9 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]},{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#Z942","name":"Right sided operation"},"http://endhealth.info/im#mapAdvice":"ALWAYS Z94.2 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]}]}])).toStrictEqual([{"children": [{"children": [{"data": {"mapItems": [{"assuranceLevel": "Nationally assured UK level", "iri": "http://endhealth.info/OPCS4#X109", "name": "Unspecified amputation of foot", "priority": 1}]}, "key": "undefined_0", "type": "childList"}], "data": {"label": "One of"}, "key": "undefined_0", "type": "oneOf"}, {"children": [{"data": {"mapItems": [{"assuranceLevel": "Nationally assured UK level", "iri": "http://endhealth.info/OPCS4#Z942", "name": "Right sided operation", "priority": 1}]}, "key": "undefined_1", "type": "childList"}], "data": {"label": "One of"}, "key": "undefined_1", "type": "oneOf"}], "data": {"label": "Combination of"}, "key": "undefined_0", "type": "comboOf"}]);
  });

  it("can generateChildNodes ___ mapNode fail", () => {
    wrapper.vm.createChartMapNode = jest.fn().mockReturnValue(undefined);
    expect(wrapper.vm.generateChildNodes([{"http://endhealth.info/im#combinationOf":[{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#X109","name":"Unspecified amputation of foot"},"http://endhealth.info/im#mapAdvice":"ALWAYS X10.9 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]},{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#Z942","name":"Right sided operation"},"http://endhealth.info/im#mapAdvice":"ALWAYS Z94.2 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]}]}])).toStrictEqual([undefined]);
  });

  it("can createChartStructure", () => {
    expect(wrapper.vm.createChartStructure([{"http://endhealth.info/im#combinationOf":[{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#X109","name":"Unspecified amputation of foot"},"http://endhealth.info/im#mapAdvice":"ALWAYS X10.9 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]},{"http://endhealth.info/im#oneOf":[{"http://endhealth.info/im#matchedTo":{"@id":"http://endhealth.info/OPCS4#Z942","name":"Right sided operation"},"http://endhealth.info/im#mapAdvice":"ALWAYS Z94.2 | ADDITIONAL CODE POSSIBLE","http://endhealth.info/im#mapPriority":1,"http://endhealth.info/im#assuranceLevel":{"@id":"http://endhealth.info/im#NationallyAssuredUK","name":"Nationally assured UK level"}}]}]}])).toStrictEqual({"key":"0","type":"hasMap","data":{"label":"Has map"},"children":[{"key":"0_0","type":"comboOf","data":{"label":"Combination of"},"children":[{"key":"0_0","type":"oneOf","data":{"label":"One of"},"children":[{"key":"0_0","type":"childList","data":{"mapItems":[{"name":"Unspecified amputation of foot","iri":"http://endhealth.info/OPCS4#X109","priority":1,"assuranceLevel":"Nationally assured UK level"}]}}]},{"key":"0_1","type":"oneOf","data":{"label":"One of"},"children":[{"key":"0_1","type":"childList","data":{"mapItems":[{"name":"Right sided operation","iri":"http://endhealth.info/OPCS4#Z942","priority":1,"assuranceLevel":"Nationally assured UK level"}]}}]}]},{"key":"01","type":"terms","data":{"label":"Term maps"}}]});
  });

  it("can create chart structure ___ empty mappingObject", () => {
    expect(wrapper.vm.createChartStructure([])).toStrictEqual([]);
  });

  it("can get bypriority ___ 1", () => {
    expect(wrapper.vm.byPriority({ priority: 9 }, { priority: 7 })).toBe(1);
  });

  it("can get bypriority ___ -1", () => {
    expect(wrapper.vm.byPriority({ priority: 7 }, { priority: 10 })).toBe(-1);
  });

  it("can get bypriority ___ 0", () => {
    expect(wrapper.vm.byPriority({ priority: 2 }, { priority: 2 })).toBe(0);
  });

  it("can emit toTerms", () => {
    wrapper.vm.toTerms();
    expect(wrapper.emitted().toTermsClicked).toBeTruthy();
  });
});
