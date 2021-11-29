import { flushPromises, shallowMount } from "@vue/test-utils";
import Concept from "@/views/Concept.vue";
import Tooltip from "primevue/tooltip";
import ContextMenu from "primevue/contextmenu";
import VueClipboard from "vue3-clipboard";
import Button from "primevue/button";
import LoggerService from "@/services/LoggerService";
import PanelHeader from "@/components/concept/PanelHeader.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ProgressSpinner from "primevue/progressspinner";
import Definition from "@/components/concept/Definition.vue";
import Mappings from "@/components/concept/Mappings.vue";
import UsedIn from "@/components/concept/UsedIn.vue";
import Graph from "@/components/concept/Graph.vue";
import Members from "@/components/concept/Members.vue";
import SecondaryTree from "@/components/concept/SecondaryTree.vue";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import Panel from "primevue/panel";
import EntityService from "@/services/EntityService";
import ConfigService from "@/services/ConfigService";

Object.assign(navigator, {
  clipboard: {
    writeText: () => {}
  }
});

describe("Concept.vue", () => {
  let wrapper;
  let mockStore;
  let mockRouter;
  let mockToast;
  let clipboardSpy;
  let docSpy;
  let windowSpy

  beforeEach(() => {
    jest.resetAllMocks();
    clipboardSpy = jest.spyOn(navigator.clipboard, "writeText");
    EntityService.getSemanticProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"takes place in care setting","@id":"http://endhealth.info/im#51000252106"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"}}]});
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"has admission source","@id":"http://endhealth.info/im#hasAdmissionSource"},"type":{"name":"Critical care admission source","@id":"http://endhealth.info/im#1041000252100"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has critical care unit function","@id":"http://endhealth.info/im#hasCriticalCareUnitFunction"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{"name":"Encounter (record type)","@id":"http://endhealth.info/im#Encounter"}}]});
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({data: {
      "@id":"http://endhealth.info/im#CriticalCareEncounter",
      "http://endhealth.info/im#isA":[{"@id":"http://endhealth.info/im#1161000252102","name":"Hospital encounter"}],
      "http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},
      "http://www.w3.org/2000/01/rdf-schema#comment":"An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://endhealth.info/im#RecordType","name":"Record type"},{"@id":"http://www.w3.org/ns/shacl#NodeShape","name":"Node shape"},{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],
      "http://www.w3.org/2000/01/rdf-schema#label":"Critical care encounter (record type)",
      }});
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({ data: [{"name":"Adult critical care encounter","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#1641000252107"},{"name":"Neonatal critical care encounter","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#831000252103"},{"name":"Paediatric critical care encounter","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#2811000252102"}]});
    EntityService.getEntityTermCodes = jest.fn().mockResolvedValue({ data: [{"name":"Critical care encounter (record type)"}]});
    EntityService.getAxioms = jest.fn().mockResolvedValue({ data: {"entity":{"@id":"http://endhealth.info/im#841000252107","http://www.w3.org/2000/01/rdf-schema#comment":"An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Critical care encounter","http://www.w3.org/2002/07/owl#equivalentClass":[{"http://www.w3.org/2002/07/owl#intersectionOf":[{"@id":"http://endhealth.info/im#1161000252102","name":"Hospital encounter"},{"http://www.w3.org/2002/07/owl#someValuesFrom":{"@id":"http://endhealth.info/im#211000252109","name":"Critical care unit function"},"http://www.w3.org/2002/07/owl#onProperty":{"@id":"http://endhealth.info/im#51000252106","name":"takes place in care setting"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{"@id":"http://www.w3.org/2002/07/owl#Restriction","name":"Restriction"}}]}]},"predicates":[{"name":"someValuesFrom","@id":"http://www.w3.org/2002/07/owl#someValuesFrom"},{"name":"comment","@id":"http://www.w3.org/2000/01/rdf-schema#comment"},{"name":"onProperty","@id":"http://www.w3.org/2002/07/owl#onProperty"},{"name":"type","@id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},{"name":"intersectionOf","@id":"http://www.w3.org/2002/07/owl#intersectionOf"},{"name":"label","@id":"http://www.w3.org/2000/01/rdf-schema#label"},{"name":"equivalentClass","@id":"http://www.w3.org/2002/07/owl#equivalentClass"}]}})
    ConfigService.getComponentLayout = jest.fn().mockResolvedValue({ data: [
      {"label":"Name","predicate":"http://www.w3.org/2000/01/rdf-schema#label","type":"TextWithLabel","size":"50%","order":0},
      {"label":"Iri","predicate":"@id","type":"TextWithLabel","size":"50%","order":1},
      {"label":"Status","predicate":"http://endhealth.info/im#status","type":"ObjectNameWithLabel","size":"50%","order":2},
      {"label":"Types","predicate":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","type":"ArrayObjectNamesToStringWithLabel","size":"50%","order":3},
      {"label":"Description","predicate":"http://www.w3.org/2000/01/rdf-schema#comment","type":"TextHTMLWithLabel","size":"100%","order":4},
      {"label":"Divider","predicate":"None","type":"Divider","size":"100%","order":5},
      {"label":"Is a","predicate":"http://endhealth.info/im#isA","type":"ArrayObjectNameListboxWithLabel","size":"50%","order":6},
      {"label":"Has sub types","predicate":"subtypes","type":"ArrayObjectNameListboxWithLabel","size":"50%","order":7},
      {"label":"Divider","predicate":"None","type":"Divider","size":"100%","order":8},
      {"label":"Semantic properties","predicate":"semanticProperties","type":"SemanticProperties","size":"100%","order":9},
      {"label":"Divider","predicate":"None","type":"Divider","size":"100%","order":10},
      {"label":"Data model properties","predicate":"dataModelProperties","type":"DataModelProperties","size":"100%","order":11}
    ]});
    mockStore = {
      state: {
        conceptIri: "http://endhealth.info/im#CriticalCareEncounter",
        selectedEntityType: "Class"
      },
      commit: jest.fn(),
      dispatch: jest.fn()
    };
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    console.error = jest.fn();

    windowSpy = jest.spyOn(window, "getComputedStyle");
    windowSpy.mockReturnValue({ getPropertyValue: jest.fn().mockReturnValue("16px") });

    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    wrapper = shallowMount(Concept, {
      global: {
        components: {
          Definition,
          Mappings,
          ContextMenu,
          Button,
          TabPanel,
          TabView,
          SecondaryTree,
          UsedIn,
          Members,
          Graph,
          PanelHeader,
          Panel,
          DownloadDialog,
          ProgressSpinner
        },
        mocks: { $store: mockStore, $router: mockRouter, $toast: mockToast },
        directives: { "tooltip": Tooltip, "clipboard": VueClipboard }
      }
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  })

  it("starts with data from mounted", async() => {
    await flushPromises();
    expect(wrapper.vm.editDialogView).toBeTruthy();
    expect(wrapper.vm.showDownloadDialog).toBeFalsy();
    expect(wrapper.vm.configs).toStrictEqual([{"label":"Name","predicate":"http://www.w3.org/2000/01/rdf-schema#label","type":"TextWithLabel","size":"50%","order":0},{"label":"Iri","predicate":"@id","type":"TextWithLabel","size":"50%","order":1},{"label":"Status","predicate":"http://endhealth.info/im#status","type":"ObjectNameWithLabel","size":"50%","order":2},{"label":"Types","predicate":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type","type":"ArrayObjectNamesToStringWithLabel","size":"50%","order":3},{"label":"Description","predicate":"http://www.w3.org/2000/01/rdf-schema#comment","type":"TextHTMLWithLabel","size":"100%","order":4},{"label":"Divider","predicate":"None","type":"Divider","size":"100%","order":5},{"label":"Is a","predicate":"http://endhealth.info/im#isA","type":"ArrayObjectNameListboxWithLabel","size":"50%","order":6},{"label":"Has sub types","predicate":"subtypes","type":"ArrayObjectNameListboxWithLabel","size":"50%","order":7},{"label":"Divider","predicate":"None","type":"Divider","size":"100%","order":8},{"label":"Semantic properties","predicate":"semanticProperties","type":"SemanticProperties","size":"100%","order":9},{"label":"Divider","predicate":"None","type":"Divider","size":"100%","order":10},{"label":"Data model properties","predicate":"dataModelProperties","type":"DataModelProperties","size":"100%","order":11}]);
    expect(wrapper.vm.concept).toStrictEqual({
      "@id":"http://endhealth.info/im#CriticalCareEncounter",
      "axioms":{"axiomString":"Equivalent class\n    Intersection of\n        Hospital encounter\n        Having type Restriction on property takes place in care setting\n            Some values from\n                Critical care unit function","count": 1},
      "http://endhealth.info/im#isA":[{"@id":"http://endhealth.info/im#1161000252102","name":"Hospital encounter"}],
      "http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},
      "http://www.w3.org/2000/01/rdf-schema#comment":"An entry recording information about a criticial care encounter.<p>common data model attributes for Critical care encounter",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://endhealth.info/im#RecordType","name":"Record type"},{"@id":"http://www.w3.org/ns/shacl#NodeShape","name":"Node shape"},{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],
      "http://www.w3.org/2000/01/rdf-schema#label":"Critical care encounter (record type)",
      "subtypes":[{"name":"Adult critical care encounter","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#1641000252107"},{"name":"Neonatal critical care encounter","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#831000252103"},{"name":"Paediatric critical care encounter","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#2811000252102"}],
      "semanticProperties":[{"property":{"name":"takes place in care setting","@id":"http://endhealth.info/im#51000252106"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"}}],
      "dataModelProperties":[{"property":{"name":"has admission source","@id":"http://endhealth.info/im#hasAdmissionSource"},"type":{"name":"Critical care admission source","@id":"http://endhealth.info/im#1041000252100"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has critical care unit function","@id":"http://endhealth.info/im#hasCriticalCareUnitFunction"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{"name":"Encounter (record type)","@id":"http://endhealth.info/im#Encounter"}}],"termCodes":[{"name":"Critical care encounter (record type)"}]});
    expect(wrapper.vm.definitionText).toBe("");
    expect(wrapper.vm.display).toBeFalsy();
    expect(wrapper.vm.types).toStrictEqual([{"@id": "http://endhealth.info/im#RecordType", "name": "Record type"}, {"@id": "http://www.w3.org/ns/shacl#NodeShape", "name": "Node shape"}, {"@id": "http://www.w3.org/2002/07/owl#Class", "name": "Class"}]);
    expect(wrapper.vm.header).toBe("Critical care encounter (record type)");
    expect(wrapper.vm.dialogHeader).toBe("");
    expect(wrapper.vm.active).toBe(0);
    expect(wrapper.vm.contentHeight).not.toBe("");
    expect(wrapper.vm.contentHeightValue).not.toBe(0);
  });

  it("inits and setsHeights on mounted", async() => {
    await flushPromises();
    expect(wrapper.vm.contentHeightValue).not.toBe(0);
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter", ["http://www.w3.org/2000/01/rdf-schema#label", "@id", "http://endhealth.info/im#status", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/2000/01/rdf-schema#comment", "http://endhealth.info/im#isA"]);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter")
  });

  it("adds event listener to setContentHeights on resize", async() => {
    await flushPromises();
    const spy = jest.spyOn(wrapper.vm, "setContentHeight");
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
  });

  it("can remove eventListener", () => {
    const spy = jest.spyOn(global, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
  });

  it("sets container size ___ container fail", async() => {
    wrapper.vm.setContentHeight();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.contentHeightValue).toBe(800);
  });

  it("sets container size ___ container success", async() => {
    const mockElement = document.createElement("div");
    mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ height: 100 })
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setContentHeight();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.contentHeightValue).not.toBe(800);
    docSpy.mockReset();
    jest.clearAllMocks();
  });

  it("can check for a set ___ false", async() => {
    expect(Concept.computed.isSet.call({types: [{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]})).toBe(false);
  });

  it("can check for a set ___ true", async() => {
    expect(Concept.computed.isSet.call({types: [{"name":"Concept Set","@id":"http://endhealth.info/im#ConceptSet"}]})).toBe(true);
  });

  it("can check isClass ___ true", () => {
    expect(Concept.computed.isClass.call({types: [{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]})).toBe(true);
  });

  it("can check isClass ___ false", () => {
    expect(Concept.computed.isClass.call({types: [{"name":"Concept Set","@id":"http://endhealth.info/im#ConceptSet"}]})).toBe(false);
  });

  it("inits on iri change", async() => {
    wrapper.vm.init = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://endhealth.info/im#DiscoveryOntology");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.init).toHaveBeenCalledTimes(1);
  });

  it("can update focusTree", () => {
    wrapper.vm.focusTree();
    expect(mockStore.commit).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledWith("updateFocusTree", true);
  });

  it("can routeToEdit", async() => {
    await flushPromises();
    wrapper.vm.directToEditRoute();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "Edit",
      params: { iri: "http://endhealth.info/im#CriticalCareEncounter" }
    });
  });

  it("can route to create", () => {
    wrapper.vm.directToCreateRoute();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Create" });
  });

  it("can getConcept ___ pass", async() => {
    await flushPromises();
    jest.clearAllMocks();
    await wrapper.vm.$nextTick();
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({data:{"@id":"http://snomed.info/sct#298382003","http://endhealth.info/im#isA":[{"@id":"http://snomed.info/sct#64217002","name":"Curvature of spine (disorder)"},{"@id":"http://snomed.info/sct#928000","name":"Disorder of musculoskeletal system (disorder)"},{"@id":"http://snomed.info/sct#699699005","name":"Disorder of vertebral column (disorder)"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"}});
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({ data: [{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"}]});
    jest.clearAllMocks();
    wrapper.vm.getConcept("http://snomed.info/sct#298382003");
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003", ["http://www.w3.org/2000/01/rdf-schema#label", "@id", "http://endhealth.info/im#status", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/2000/01/rdf-schema#comment", "http://endhealth.info/im#isA"]);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#298382003")
    expect(wrapper.vm.concept).toStrictEqual({"@id":"http://snomed.info/sct#298382003","http://endhealth.info/im#isA":[{"@id":"http://snomed.info/sct#64217002","name":"Curvature of spine (disorder)"},{"@id":"http://snomed.info/sct#928000","name":"Disorder of musculoskeletal system (disorder)"},{"@id":"http://snomed.info/sct#699699005","name":"Disorder of vertebral column (disorder)"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)","subtypes":[{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"}],"termCodes":[{"name":"Critical care encounter (record type)"}]});
  });

  it("can getConcept ___ no isa", async() => {
    await flushPromises();
    jest.clearAllMocks();
    await wrapper.vm.$nextTick();
    EntityService.getPartialEntity = jest.fn().mockResolvedValue({data:{"@id":"http://snomed.info/sct#298382003","http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)"}});
    // wrapper.vm.getConcept("http://snomed.info/sct#111266001");
    EntityService.getEntityChildren = jest.fn().mockResolvedValue({ data: [{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"}]});
    // jest.clearAllMocks();
    wrapper.vm.getConcept("http://snomed.info/sct#298382003");
    await flushPromises();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#298382003", ["http://www.w3.org/2000/01/rdf-schema#label", "@id", "http://endhealth.info/im#status", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/2000/01/rdf-schema#comment", "http://endhealth.info/im#isA"]);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#298382003")
    expect(wrapper.vm.concept).toStrictEqual({"@id":"http://snomed.info/sct#298382003","http://endhealth.info/im#isA":[],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis deformity of spine (disorder)","subtypes":[{"name":"Acquired scoliosis (disorder)","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://snomed.info/sct#205045003"}],"termCodes":[{"name":"Critical care encounter (record type)"}]});
  });

  it("can getConcept ___ fail", async() => {
    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();
    EntityService.getPartialEntity = jest.fn().mockRejectedValue(false);
    EntityService.getEntityChildren = jest.fn().mockRejectedValue(false);
    EntityService.getEntityTermCodes = jest.fn().mockRejectedValue(false);
    wrapper.vm.getConcept("http://snomed.info/sct#111266001");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getPartialEntity).toHaveBeenCalledTimes(1);
    expect(EntityService.getPartialEntity).toHaveBeenCalledWith("http://snomed.info/sct#111266001", ["http://www.w3.org/2000/01/rdf-schema#label", "@id", "http://endhealth.info/im#status", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/2000/01/rdf-schema#comment", "http://endhealth.info/im#isA"]);
    expect(EntityService.getEntityChildren).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityChildren).toHaveBeenCalledWith("http://snomed.info/sct#111266001");
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#111266001")
    expect(mockToast.add).toHaveBeenCalledTimes(3);
    expect(mockToast.add).toHaveBeenNthCalledWith(1, LoggerService.error("Failed to get concept partial entity from server."));
    expect(mockToast.add).toHaveBeenNthCalledWith(2, LoggerService.error("Failed to get subtypes from server."));
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to get terms from server"));
  });

  it("can get properties ___ pass both", async() => {
    await flushPromises();
    await wrapper.vm.$nextTick();
    EntityService.getSemanticProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"takes place in care setting","@id":"http://endhealth.info/im#51000252106"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"}}]});
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data:[{"property":{"name":"has admission source","@id":"http://endhealth.info/im#hasAdmissionSource"},"type":{"name":"Critical care admission source","@id":"http://endhealth.info/im#1041000252100"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has critical care unit function","@id":"http://endhealth.info/im#hasCriticalCareUnitFunction"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}}]});
    wrapper.vm.getProperties("http://endhealth.info/im#CriticalCareEncounter");
    await flushPromises();
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(wrapper.vm.concept.semanticProperties).toStrictEqual([{"property":{"name":"takes place in care setting","@id":"http://endhealth.info/im#51000252106"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"}}]);
    expect(wrapper.vm.concept.dataModelProperties).toStrictEqual([{"property":{"name":"has admission source","@id":"http://endhealth.info/im#hasAdmissionSource"},"type":{"name":"Critical care admission source","@id":"http://endhealth.info/im#1041000252100"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has critical care unit function","@id":"http://endhealth.info/im#hasCriticalCareUnitFunction"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}}]);
  });

  it("can get properties ___ both fail", async() => {
    await flushPromises();
    EntityService.getSemanticProperties = jest.fn().mockRejectedValue({ code: 403, message: "Semantic error"});
    EntityService.getDataModelProperties = jest.fn().mockRejectedValue({ code: 403, message: "Data error"});
    wrapper.vm.getProperties("http://endhealth.info/im#CriticalCareEncounter");
    await flushPromises();
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(mockToast.add).toHaveBeenCalledTimes(2);
    expect(mockToast.add).toHaveBeenNthCalledWith(1, LoggerService.error("Failed to get semantic properties from server", { code: 403, message: "Semantic error"}));
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to get data model properties from server", { code: 403, message: "Data error"}));
  });

  it("can getConfig ___ pass", async() => {
    jest.clearAllMocks();
    await flushPromises();
    wrapper.vm.getConfig("description");
    await flushPromises();
    expect(ConfigService.getComponentLayout).toHaveBeenCalledTimes(1);
    expect(ConfigService.getComponentLayout).toHaveBeenCalledWith("description");
    expect(wrapper.vm.configs).toStrictEqual([{"label": "Name", "order": 0, "predicate": "http://www.w3.org/2000/01/rdf-schema#label", "size": "50%", "type": "TextWithLabel"}, {"label": "Iri", "order": 1, "predicate": "@id", "size": "50%", "type": "TextWithLabel"}, {"label": "Status", "order": 2, "predicate": "http://endhealth.info/im#status", "size": "50%", "type": "ObjectNameWithLabel"}, {"label": "Types", "order": 3, "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "size": "50%", "type": "ArrayObjectNamesToStringWithLabel"}, {"label": "Description", "order": 4, "predicate": "http://www.w3.org/2000/01/rdf-schema#comment", "size": "100%", "type": "TextHTMLWithLabel"}, {"label": "Divider", "order": 5, "predicate": "None", "size": "100%", "type": "Divider"}, {"label": "Is a", "order": 6, "predicate": "http://endhealth.info/im#isA", "size": "50%", "type": "ArrayObjectNameListboxWithLabel"}, {"label": "Has sub types", "order": 7, "predicate": "subtypes", "size": "50%", "type": "ArrayObjectNameListboxWithLabel"}, {"label": "Divider", "order": 8, "predicate": "None", "size": "100%", "type": "Divider"}, {"label": "Semantic properties", "order": 9, "predicate": "semanticProperties", "size": "100%", "type": "SemanticProperties"}, {"label": "Divider", "order": 10, "predicate": "None", "size": "100%", "type": "Divider"}, {"label": "Data model properties", "order": 11, "predicate": "dataModelProperties", "size": "100%", "type": "DataModelProperties"}]);
  });

  it("can getConfig ___ fail", async() => {
    ConfigService.getComponentLayout = jest.fn().mockRejectedValue(false);
    jest.clearAllMocks();
    await flushPromises();
    wrapper.vm.getConfig("description");
    await flushPromises();
    expect(ConfigService.getComponentLayout).toHaveBeenCalledTimes(1);
    expect(ConfigService.getComponentLayout).toHaveBeenCalledWith("description");
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get config data from server"));
  });

  it("Inits ___ Class", async() => {
    await flushPromises();
    jest.clearAllMocks();
    wrapper.vm.getProperties = jest.fn();
    wrapper.vm.getConcept = jest.fn();
    wrapper.vm.getConfig = jest.fn();
    wrapper.vm.concept = {"@id":"http://snomed.info/sct#47518006","http://endhealth.info/im#isA":[{"@id":"http://snomed.info/sct#111266001","name":"Acquired scoliosis (disorder)"},{"@id":"http://snomed.info/sct#212904005","name":"Radiation therapy complication (disorder)"},{"@id":"http://snomed.info/sct#724614007","name":"Disorder of musculoskeletal system following procedure (disorder)"},{"@id":"http://snomed.info/sct#442544003","name":"Deformity of spine due to injury (disorder)"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis caused by radiation (disorder)","subtypes":[],"semanticProperties":[],"dataModelProperties":[]};
    wrapper.vm.init();
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    expect(wrapper.vm.getConfig).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getConfig).toHaveBeenCalledWith("definition");
    expect(wrapper.vm.getProperties).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(wrapper.vm.getConcept).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getConcept).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(wrapper.vm.types).toStrictEqual([{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]);
    expect(wrapper.vm.header).toBe("Scoliosis caused by radiation (disorder)");
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateSelectedEntityType", "Ontology");
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateModuleSelectedEntities", { module: "Ontology", iri: "http://endhealth.info/im#CriticalCareEncounter" });
    expect(wrapper.vm.loading).toBe(false);
  });


  it("Inits ___ Set", async() => {
    wrapper.vm.getProperties = jest.fn();
    wrapper.vm.getConcept = jest.fn();
    wrapper.vm.concept = {"@id":"http://snomed.info/sct#47518006","http://endhealth.info/im#isA":[{"@id":"http://snomed.info/sct#111266001","name":"Acquired scoliosis (disorder)"},{"@id":"http://snomed.info/sct#212904005","name":"Radiation therapy complication (disorder)"},{"@id":"http://snomed.info/sct#724614007","name":"Disorder of musculoskeletal system following procedure (disorder)"},{"@id":"http://snomed.info/sct#442544003","name":"Deformity of spine due to injury (disorder)"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"name":"Concept Set","@id":"http://endhealth.info/im#ConceptSet"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis caused by radiation (disorder)","subtypes":[],"semanticProperties":[],"dataModelProperties":[]};
    wrapper.vm.init();
    await flushPromises();
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateSelectedEntityType", "Sets");
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateModuleSelectedEntities", { module: "Sets", iri: "http://endhealth.info/im#CriticalCareEncounter" });
  });

  it("Inits ___ Query", async() => {
    wrapper.vm.getProperties = jest.fn();
    wrapper.vm.getConcept = jest.fn();
    wrapper.vm.concept = {"@id":"http://snomed.info/sct#47518006","http://endhealth.info/im#isA":[{"@id":"http://snomed.info/sct#111266001","name":"Acquired scoliosis (disorder)"},{"@id":"http://snomed.info/sct#212904005","name":"Radiation therapy complication (disorder)"},{"@id":"http://snomed.info/sct#724614007","name":"Disorder of musculoskeletal system following procedure (disorder)"},{"@id":"http://snomed.info/sct#442544003","name":"Deformity of spine due to injury (disorder)"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"name":"Query template","@id":"http://endhealth.info/im#QueryTemplate"}],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis caused by radiation (disorder)","subtypes":[],"semanticProperties":[],"dataModelProperties":[]};
    wrapper.vm.init();
    await flushPromises();
    expect(mockStore.commit).toHaveBeenNthCalledWith(1, "updateSelectedEntityType", "Queries");
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateModuleSelectedEntities", { module: "Queries", iri: "http://endhealth.info/im#CriticalCareEncounter" });
  });

  it("can openDownloadDialog", async() => {
    wrapper.vm.openDownloadDialog();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showDownloadDialog).toBe(true);
  });

  it("can closeDialog", async() => {
    wrapper.vm.closeDownloadDialog();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showDownloadDialog).toBe(false);
  });

  it("can convert conceptObjectToCopyString ___ array 0 1", () => {
    expect(wrapper.vm.conceptObjectToCopyString("http://endhealth.info/im#isA", [{"@id":"http://snomed.info/sct#64217002","name":"Curvature of spine (disorder)"},{"@id":"http://snomed.info/sct#928000","name":"Disorder of musculoskeletal system (disorder)"},{"@id":"http://snomed.info/sct#699699005","name":"Disorder of vertebral column (disorder)"}], 0, 1)).toStrictEqual({"label": "Is a", "value": "Is a: [\n\tCurvature of spine (disorder),\n\tDisorder of musculoskeletal system (disorder),\n\tDisorder of vertebral column (disorder)\n]"});
  });

  it("can convert conceptObjectToCopyString ___ array 1 4", () => {
    expect(wrapper.vm.conceptObjectToCopyString("http://endhealth.info/im#isA", [{"@id":"http://snomed.info/sct#64217002","name":"Curvature of spine (disorder)"},{"@id":"http://snomed.info/sct#928000","name":"Disorder of musculoskeletal system (disorder)"},{"@id":"http://snomed.info/sct#699699005","name":"Disorder of vertebral column (disorder)"}], 1, 4)).toStrictEqual({"label": "Is a", "value": "Is a: [\n\tCurvature of spine (disorder),\n\tDisorder of musculoskeletal system (disorder),\n\tDisorder of vertebral column (disorder)\n],\n"});
  });

  it("can convert conceptObjectToCopyString ___ array object property.name", () => {
    expect(wrapper.vm.conceptObjectToCopyString("http://endhealth.info/im#isA", [{"@id":"http://snomed.info/sct#64217002","property": {"name":"Curvature of spine (disorder)"}},{"@id":"http://snomed.info/sct#928000","property": {"name":"Disorder of musculoskeletal system (disorder)"}},{"@id":"http://snomed.info/sct#699699005","property": {"name":"Disorder of vertebral column (disorder)"}}], 1, 4)).toStrictEqual({"label": "Is a", "value": "Is a: [\n\tCurvature of spine (disorder),\n\tDisorder of musculoskeletal system (disorder),\n\tDisorder of vertebral column (disorder)\n],\n"});
  });

  it("can convert conceptObjectToCopyString ___ array object error", () => {
    const err = console.warn;
    console.warn = jest.fn();
    expect(wrapper.vm.conceptObjectToCopyString("http://endhealth.info/im#isA", [{"@id":"http://snomed.info/sct#64217002","property": {"firstName":"Curvature of spine (disorder)"}},{"@id":"http://snomed.info/sct#928000","property": {"firstName":"Disorder of musculoskeletal system (disorder)"}},{"@id":"http://snomed.info/sct#699699005","property": {"firstName":"Disorder of vertebral column (disorder)"}}], 1, 4)).toStrictEqual({"label": "Is a", "value": "Is a: [\n\t\n],\n"});
    expect(console.warn).toHaveBeenLastCalledWith("Uncovered object property or missing name found for key: http://endhealth.info/im#isA at conceptObjectToCopyString within Concept.vue");
    console.warn = err;
  });

  it("can convert conceptObjectToCopyString ___ empty array 0 1", () => {
    expect(wrapper.vm.conceptObjectToCopyString("http://endhealth.info/im#isA", [], 0, 1)).toStrictEqual({"label": "Is a", "value": "Is a: [\n\t\n]"});
  });

  it("can convert conceptObjectToCopyString ___ empty array 1 4", () => {
    expect(wrapper.vm.conceptObjectToCopyString("http://endhealth.info/im#isA", [], 1, 4)).toStrictEqual({"label": "Is a", "value": "Is a: [\n\t\n],\n"});
  });

  it("can convert conceptObjectToCopyString ___ object 0 1", () => {
    expect(wrapper.vm.conceptObjectToCopyString("http://endhealth.info/im#status", {"@id":"http://endhealth.info/im#Active","name":"Active"}, 0, 1)).toStrictEqual({"label": "Status", "value": "Status: Active"});
  });

  it("can convert conceptObjectToCopyString ___ object 1 4", () => {
    expect(wrapper.vm.conceptObjectToCopyString("http://endhealth.info/im#status", {"@id":"http://endhealth.info/im#Active","name":"Active"}, 1, 4)).toStrictEqual({"label": "Status", "value": "Status: Active,\n"});
  });

  it("can copy concept to clipboard", async() => {
    await flushPromises();
    expect(wrapper.vm.copyConceptToClipboard()).toBe("Iri: http://endhealth.info/im#CriticalCareEncounter,\nIs a: [\n\tHospital encounter\n],\nStatus: Active,\nDescription: An entry recording information about a criticial care encounter.\n\tcommon data model attributes for Critical care encounter,\nTypes: [\n\tRecord type,\n\tNode shape,\n\tClass\n],\nName: Critical care encounter (record type),\nHas sub types: [\n\tAdult critical care encounter,\n\tNeonatal critical care encounter,\n\tPaediatric critical care encounter\n],\nSemantic properties: [\n\ttakes place in care setting\n],\nData model properties: [\n\thas admission source,\n\thas critical care unit function,\n\tadditional Practitioners\n],\n");
  });

  it("can copy concept to clipboard ___ empty arrays", async() => {
    await flushPromises();
    wrapper.vm.concept = {"@id":"http://snomed.info/sct#47518006","http://endhealth.info/im#isA":[],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[],"http://www.w3.org/2000/01/rdf-schema#label":"Scoliosis caused by radiation (disorder)","subtypes":[],"semanticProperties":[],"dataModelProperties":[]};
    wrapper.vm.semanticProperties = [];
    wrapper.vm.dataModelProperties = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.copyConceptToClipboard()).toBe("Iri: http://snomed.info/sct#47518006,\nIs a: [\n\t\n],\nStatus: Active,\nTypes: [\n\t\n],\nName: Scoliosis caused by radiation (disorder),\nHas sub types: [\n\t\n],\nSemantic properties: [\n\t\n],\nData model properties: [\n\t\n]");
  });

  it("toasts onCopy", () => {
    wrapper.vm.onCopy();
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.success("Value copied to clipboard"));
  });

  it("toasts onCopyError", () => {
    wrapper.vm.onCopyError();
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to copy value to clipboard"));
  });

  it("can set copy menu items", async() => {
    await flushPromises();
    wrapper.vm.copyMenuItems = [];
    wrapper.vm.concept = {"@id":"http://endhealth.info/im#Encounter","http://endhealth.info/im#isA":[{"@id":"http://endhealth.info/im#PatientHealthEvent","name":"Patient health event (record type)"},{"@id":"http://snomed.info/sct#325841000000109","name":"Encounter type (record artifact)"},{"@id":"http://endhealth.info/im#903031000252104","name":"Encounter related value concept"},{"@id":"http://endhealth.info/im#DiscoveryCommonDataModel","name":"Discovery common data  model"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/2000/01/rdf-schema#comment":"An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://endhealth.info/im#RecordType","name":"Record type"},{"@id":"http://www.w3.org/ns/shacl#NodeShape","name":"Node shape"},{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Encounter (record type)","subtypes":[{"name":"Administrative entry","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#1731000252106"},{"name":"Consultation","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#31000252100"},{"name":"Hospital encounter","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#1161000252102"}],"semanticProperties":[],"dataModelProperties":[{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}},{"property":{"name":"has section","@id":"http://endhealth.info/im#hasSection"},"type":{"name":"Section (structural)","@id":"http://endhealth.info/im#Section"},"inheritedFrom":{}},{"property":{"name":"linked appointment","@id":"http://endhealth.info/im#linkedAppointment"},"type":{"name":"Appointment (slot)  (record type)","@id":"http://endhealth.info/im#Appointment"},"inheritedFrom":{}},{"property":{"name":"linked care episode","@id":"http://endhealth.info/im#linkedCareEpisode"},"type":{"name":"Episode of care  (record type)","@id":"http://endhealth.info/im#EpisodeOfCare"},"inheritedFrom":{}},{"property":{"name":"location","@id":"http://endhealth.info/im#location"},"type":{"name":"Location  (record type)","@id":"http://endhealth.info/im#Location"},"inheritedFrom":{}},{"property":{"name":"providing Organisation/ services or departments","@id":"http://endhealth.info/im#providingOrganisation_ServicesOrDepartments"},"type":{"name":"Organisation  (record type)","@id":"http://endhealth.info/im#Organisation"},"inheritedFrom":{}},{"property":{"name":"is subencounter of","@id":"http://endhealth.info/im#isSubEnctounterOf"},"type":{"name":"Encounter (record type)","@id":"http://endhealth.info/im#Encounter"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has subject","@id":"http://endhealth.info/im#hasSubject"},"type":{"name":"Patient (person)","@id":"http://snomed.info/sct#116154003"},"inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"practitioner","@id":"http://endhealth.info/im#hasPractitioner"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"date","@id":"http://endhealth.info/im#date"},"type":{"@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}},{"property":{"name":"end date","@id":"http://endhealth.info/im#endDate"},"type":{"@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}}]};
    wrapper.vm.setCopyMenuItems();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.copyMenuItems).toHaveLength(12);
    expect(wrapper.vm.copyMenuItems[0]).toStrictEqual({
      label: "Copy",
      disabled: true
    });
    expect(wrapper.vm.copyMenuItems[1]).toStrictEqual({
      separator: true
    });
    expect(Object.keys(wrapper.vm.copyMenuItems[2])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[2].label).toBe("All");
    expect(Object.keys(wrapper.vm.copyMenuItems[3])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[3].label).toBe("Iri");
    expect(Object.keys(wrapper.vm.copyMenuItems[4])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[4].label).toBe("Is a");
    expect(Object.keys(wrapper.vm.copyMenuItems[5])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[5].label).toBe("Status");
    expect(Object.keys(wrapper.vm.copyMenuItems[6])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[6].label).toBe("Description");
    expect(Object.keys(wrapper.vm.copyMenuItems[7])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[7].label).toBe("Types");
    expect(Object.keys(wrapper.vm.copyMenuItems[8])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[8].label).toBe("Name");
    expect(Object.keys(wrapper.vm.copyMenuItems[9])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[9].label).toBe("Has sub types");
    expect(Object.keys(wrapper.vm.copyMenuItems[10])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[10].label).toBe("Semantic properties");
    expect(Object.keys(wrapper.vm.copyMenuItems[11])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[11].label).toBe("Data model properties");
  });

  it("can set copy menu items ___ empty arrays", async() => {
    await flushPromises();
    wrapper.vm.copyMenuItems = [];
    wrapper.vm.concept = {"@id":"http://endhealth.info/im#Encounter","http://endhealth.info/im#isA":[],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/2000/01/rdf-schema#comment":"An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[],"http://www.w3.org/2000/01/rdf-schema#label":"Encounter (record type)","subtypes":[],"semanticProperties":[],"dataModelProperties":[]}
    wrapper.vm.setCopyMenuItems();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.copyMenuItems).toHaveLength(12);
    expect(wrapper.vm.copyMenuItems[0]).toStrictEqual({
      label: "Copy",
      disabled: true
    });
    expect(wrapper.vm.copyMenuItems[1]).toStrictEqual({
      separator: true
    });
    expect(Object.keys(wrapper.vm.copyMenuItems[2])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[2].label).toBe("All");
    expect(Object.keys(wrapper.vm.copyMenuItems[3])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[3].label).toBe("Iri");
    expect(Object.keys(wrapper.vm.copyMenuItems[4])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[4].label).toBe("Is a");
    expect(Object.keys(wrapper.vm.copyMenuItems[5])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[5].label).toBe("Status");
    expect(Object.keys(wrapper.vm.copyMenuItems[6])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[6].label).toBe("Description");
    expect(Object.keys(wrapper.vm.copyMenuItems[7])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[7].label).toBe("Types");
    expect(Object.keys(wrapper.vm.copyMenuItems[8])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[8].label).toBe("Name");
    expect(Object.keys(wrapper.vm.copyMenuItems[9])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[9].label).toBe("Has sub types");
    expect(Object.keys(wrapper.vm.copyMenuItems[10])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[10].label).toBe("Semantic properties");
    expect(Object.keys(wrapper.vm.copyMenuItems[11])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[11].label).toBe("Data model properties");
  });

  it("can run commands from copymenuItems ___ pass", async() => {
    clipboardSpy.mockResolvedValue(true);
    await flushPromises();
    wrapper.vm.concept = {"@id":"http://endhealth.info/im#Encounter","http://endhealth.info/im#isA":[{"@id":"http://endhealth.info/im#PatientHealthEvent","name":"Patient health event (record type)"},{"@id":"http://snomed.info/sct#325841000000109","name":"Encounter type (record artifact)"},{"@id":"http://endhealth.info/im#903031000252104","name":"Encounter related value concept"},{"@id":"http://endhealth.info/im#DiscoveryCommonDataModel","name":"Discovery common data  model"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/2000/01/rdf-schema#comment":"An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://endhealth.info/im#RecordType","name":"Record type"},{"@id":"http://www.w3.org/ns/shacl#NodeShape","name":"Node shape"},{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Encounter (record type)","subtypes":[{"name":"Administrative entry","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#1731000252106"},{"name":"Consultation","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#31000252100"},{"name":"Hospital encounter","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#1161000252102"}],"semanticProperties":[],"dataModelProperties":[{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}},{"property":{"name":"has section","@id":"http://endhealth.info/im#hasSection"},"type":{"name":"Section (structural)","@id":"http://endhealth.info/im#Section"},"inheritedFrom":{}},{"property":{"name":"linked appointment","@id":"http://endhealth.info/im#linkedAppointment"},"type":{"name":"Appointment (slot)  (record type)","@id":"http://endhealth.info/im#Appointment"},"inheritedFrom":{}},{"property":{"name":"linked care episode","@id":"http://endhealth.info/im#linkedCareEpisode"},"type":{"name":"Episode of care  (record type)","@id":"http://endhealth.info/im#EpisodeOfCare"},"inheritedFrom":{}},{"property":{"name":"location","@id":"http://endhealth.info/im#location"},"type":{"name":"Location  (record type)","@id":"http://endhealth.info/im#Location"},"inheritedFrom":{}},{"property":{"name":"providing Organisation/ services or departments","@id":"http://endhealth.info/im#providingOrganisation_ServicesOrDepartments"},"type":{"name":"Organisation  (record type)","@id":"http://endhealth.info/im#Organisation"},"inheritedFrom":{}},{"property":{"name":"is subencounter of","@id":"http://endhealth.info/im#isSubEnctounterOf"},"type":{"name":"Encounter (record type)","@id":"http://endhealth.info/im#Encounter"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has subject","@id":"http://endhealth.info/im#hasSubject"},"type":{"name":"Patient (person)","@id":"http://snomed.info/sct#116154003"},"inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"practitioner","@id":"http://endhealth.info/im#hasPractitioner"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"date","@id":"http://endhealth.info/im#date"},"type":{"@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}},{"property":{"name":"end date","@id":"http://endhealth.info/im#endDate"},"type":{"@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}}]};
    wrapper.vm.setCopyMenuItems();
    await wrapper.vm.$nextTick();

    wrapper.vm.copyMenuItems[2].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Iri: http://endhealth.info/im#Encounter,\nIs a: [\n\tPatient health event (record type),\n\tEncounter type (record artifact),\n\tEncounter related value concept,\n\tDiscovery common data  model\n],\nStatus: Active,\nDescription: An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \n\tIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.,\nTypes: [\n\tRecord type,\n\tNode shape,\n\tClass\n],\nName: Encounter (record type),\nHas sub types: [\n\tAdministrative entry,\n\tConsultation,\n\tHospital encounter\n],\nSemantic properties: [\n\t\n],\nData model properties: [\n\tadditional Practitioners,\n\tcompletion Status,\n\tduration,\n\thas section,\n\tlinked appointment,\n\tlinked care episode,\n\tlocation,\n\tproviding Organisation/ services or departments,\n\tis subencounter of,\n\thas subject,\n\tpractitioner,\n\tdate,\n\tend date\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Concept copied to clipboard"));

    wrapper.vm.copyMenuItems[3].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Iri: http://endhealth.info/im#Encounter");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Iri copied to clipboard"));

    wrapper.vm.copyMenuItems[4].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Is a: [\n\tPatient health event (record type),\n\tEncounter type (record artifact),\n\tEncounter related value concept,\n\tDiscovery common data  model\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Is a copied to clipboard"));

    wrapper.vm.copyMenuItems[5].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Status: Active");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Status copied to clipboard"));

    wrapper.vm.copyMenuItems[6].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Description: An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \n\tIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Description copied to clipboard"));

    wrapper.vm.copyMenuItems[7].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Types: [\n\tRecord type,\n\tNode shape,\n\tClass\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Types copied to clipboard"));

    wrapper.vm.copyMenuItems[8].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Name: Encounter (record type)");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Name copied to clipboard"));

    wrapper.vm.copyMenuItems[9].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Has sub types: [\n\tAdministrative entry,\n\tConsultation,\n\tHospital encounter\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Has sub types copied to clipboard"));

    wrapper.vm.copyMenuItems[10].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Semantic properties: [\n\t\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Semantic properties copied to clipboard"));

    wrapper.vm.copyMenuItems[11].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Data model properties: [\n\tadditional Practitioners,\n\tcompletion Status,\n\tduration,\n\thas section,\n\tlinked appointment,\n\tlinked care episode,\n\tlocation,\n\tproviding Organisation/ services or departments,\n\tis subencounter of,\n\thas subject,\n\tpractitioner,\n\tdate,\n\tend date\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Data model properties copied to clipboard"));
  });

  it("can run commands from copymenuItems ___ fail", async() => {
    clipboardSpy.mockRejectedValue(false);
    await flushPromises();
    wrapper.vm.concept = {"@id":"http://endhealth.info/im#Encounter","http://endhealth.info/im#isA":[{"@id":"http://endhealth.info/im#PatientHealthEvent","name":"Patient health event (record type)"},{"@id":"http://snomed.info/sct#325841000000109","name":"Encounter type (record artifact)"},{"@id":"http://endhealth.info/im#903031000252104","name":"Encounter related value concept"},{"@id":"http://endhealth.info/im#DiscoveryCommonDataModel","name":"Discovery common data  model"}],"http://endhealth.info/im#status":{"@id":"http://endhealth.info/im#Active","name":"Active"},"http://www.w3.org/2000/01/rdf-schema#comment":"An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.","http://www.w3.org/1999/02/22-rdf-syntax-ns#type":[{"@id":"http://endhealth.info/im#RecordType","name":"Record type"},{"@id":"http://www.w3.org/ns/shacl#NodeShape","name":"Node shape"},{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"}],"http://www.w3.org/2000/01/rdf-schema#label":"Encounter (record type)","subtypes":[{"name":"Administrative entry","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#1731000252106"},{"name":"Consultation","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#31000252100"},{"name":"Hospital encounter","hasChildren":true,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#1161000252102"}],"semanticProperties":[],"dataModelProperties":[{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}},{"property":{"name":"has section","@id":"http://endhealth.info/im#hasSection"},"type":{"name":"Section (structural)","@id":"http://endhealth.info/im#Section"},"inheritedFrom":{}},{"property":{"name":"linked appointment","@id":"http://endhealth.info/im#linkedAppointment"},"type":{"name":"Appointment (slot)  (record type)","@id":"http://endhealth.info/im#Appointment"},"inheritedFrom":{}},{"property":{"name":"linked care episode","@id":"http://endhealth.info/im#linkedCareEpisode"},"type":{"name":"Episode of care  (record type)","@id":"http://endhealth.info/im#EpisodeOfCare"},"inheritedFrom":{}},{"property":{"name":"location","@id":"http://endhealth.info/im#location"},"type":{"name":"Location  (record type)","@id":"http://endhealth.info/im#Location"},"inheritedFrom":{}},{"property":{"name":"providing Organisation/ services or departments","@id":"http://endhealth.info/im#providingOrganisation_ServicesOrDepartments"},"type":{"name":"Organisation  (record type)","@id":"http://endhealth.info/im#Organisation"},"inheritedFrom":{}},{"property":{"name":"is subencounter of","@id":"http://endhealth.info/im#isSubEnctounterOf"},"type":{"name":"Encounter (record type)","@id":"http://endhealth.info/im#Encounter"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has subject","@id":"http://endhealth.info/im#hasSubject"},"type":{"name":"Patient (person)","@id":"http://snomed.info/sct#116154003"},"inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"practitioner","@id":"http://endhealth.info/im#hasPractitioner"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"date","@id":"http://endhealth.info/im#date"},"type":{"@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}},{"property":{"name":"end date","@id":"http://endhealth.info/im#endDate"},"type":{"@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}}]};
    wrapper.vm.setCopyMenuItems();
    await wrapper.vm.$nextTick();

    wrapper.vm.copyMenuItems[2].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Iri: http://endhealth.info/im#Encounter,\nIs a: [\n\tPatient health event (record type),\n\tEncounter type (record artifact),\n\tEncounter related value concept,\n\tDiscovery common data  model\n],\nStatus: Active,\nDescription: An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \n\tIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.,\nTypes: [\n\tRecord type,\n\tNode shape,\n\tClass\n],\nName: Encounter (record type),\nHas sub types: [\n\tAdministrative entry,\n\tConsultation,\n\tHospital encounter\n],\nSemantic properties: [\n\t\n],\nData model properties: [\n\tadditional Practitioners,\n\tcompletion Status,\n\tduration,\n\thas section,\n\tlinked appointment,\n\tlinked care episode,\n\tlocation,\n\tproviding Organisation/ services or departments,\n\tis subencounter of,\n\thas subject,\n\tpractitioner,\n\tdate,\n\tend date\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy concept to clipboard"));

    wrapper.vm.copyMenuItems[3].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Iri: http://endhealth.info/im#Encounter");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Iri to clipboard"));

    wrapper.vm.copyMenuItems[4].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Is a: [\n\tPatient health event (record type),\n\tEncounter type (record artifact),\n\tEncounter related value concept,\n\tDiscovery common data  model\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Is a to clipboard"));

    wrapper.vm.copyMenuItems[5].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Status: Active");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Status to clipboard"));

    wrapper.vm.copyMenuItems[6].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Description: An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \n\tIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Description to clipboard"));

    wrapper.vm.copyMenuItems[7].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Types: [\n\tRecord type,\n\tNode shape,\n\tClass\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Types to clipboard"));

    wrapper.vm.copyMenuItems[8].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Name: Encounter (record type)");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Name to clipboard"));

    wrapper.vm.copyMenuItems[9].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Has sub types: [\n\tAdministrative entry,\n\tConsultation,\n\tHospital encounter\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Has sub types to clipboard"));

    wrapper.vm.copyMenuItems[10].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Semantic properties: [\n\t\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Semantic properties to clipboard"));

    wrapper.vm.copyMenuItems[11].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Data model properties: [\n\tadditional Practitioners,\n\tcompletion Status,\n\tduration,\n\thas section,\n\tlinked appointment,\n\tlinked care episode,\n\tlocation,\n\tproviding Organisation/ services or departments,\n\tis subencounter of,\n\thas subject,\n\tpractitioner,\n\tdate,\n\tend date\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy Data model properties to clipboard"));
  });
});


