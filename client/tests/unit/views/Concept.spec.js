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
import Definition from "@/components/concept/Definition.vue";
import Terms from "@/components/concept/Terms.vue";
import ComplexMappings from "@/components/concept/ComplexMappings.vue";
import UsedIn from "@/components/concept/UsedIn.vue";
import Graph from "@/components/concept/Graph.vue";
import Members from "@/components/concept/Members.vue";
import SecondaryTree from "@/components/concept/SecondaryTree.vue";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import Panel from "primevue/panel";
import EntityService from "@/services/EntityService";

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
    EntityService.getSemanticProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}]});
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data:[{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}}]});
    EntityService.getEntityDefinitionDto = jest.fn().mockResolvedValue({data:{"iri":"http://snomed.info/sct#298382003","name":"Scoliosis deformity of spine (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Curvature of spine (disorder)","@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","@id":"http://snomed.info/sct#699699005"}],"subtypes":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203639008"},{"name":"Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#30611007"},{"name":"Kyphoscoliosis and scoliosis (disorder)","@id":"http://snomed.info/sct#203638000"},{"name":"Kyphoscoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#405773007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Neuromuscular scoliosis (disorder)","@id":"http://snomed.info/sct#203662005"},{"name":"Postural scoliosis (disorder)","@id":"http://snomed.info/sct#203645000"},{"name":"Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#719162001"},{"name":"Scoliosis in connective tissue anomalies (disorder)","@id":"http://snomed.info/sct#203664006"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"},{"name":"Scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#298392006"},{"name":"Scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#298591003"},{"name":"Scoliosis of thoracic spine (disorder)","@id":"http://snomed.info/sct#298494008"}]}});
    mockStore = {
      state: {
        conceptIri: "http://snomed.info/sct#298382003"
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
          ComplexMappings,
          ContextMenu,
          Button,
          TabPanel,
          TabView,
          Terms,
          SecondaryTree,
          UsedIn,
          Members,
          Graph,
          PanelHeader,
          Panel,
          DownloadDialog
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
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editDialogView).toBeTruthy();
    expect(wrapper.vm.showDownloadDialog).toBeFalsy();
    expect(wrapper.vm.concept).toStrictEqual({"iri":"http://snomed.info/sct#298382003","name":"Scoliosis deformity of spine (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Curvature of spine (disorder)","@id":"http://snomed.info/sct#64217002"},{"name":"Disorder of musculoskeletal system (disorder)","@id":"http://snomed.info/sct#928000"},{"name":"Disorder of vertebral column (disorder)","@id":"http://snomed.info/sct#699699005"}],"subtypes":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Acrodysplasia scoliosis (disorder)","@id":"http://snomed.info/sct#773773006"},{"name":"Congenital scoliosis due to bony malformation (disorder)","@id":"http://snomed.info/sct#205045003"},{"name":"Distal arthrogryposis type 4 (disorder)","@id":"http://snomed.info/sct#715575001"},{"name":"Duane anomaly, myopathy, scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#722432000"},{"name":"Horizontal gaze palsy with progressive scoliosis (disorder)","@id":"http://snomed.info/sct#702381007"},{"name":"Idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203639008"},{"name":"Idiopathic scoliosis AND/OR kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#30611007"},{"name":"Kyphoscoliosis and scoliosis (disorder)","@id":"http://snomed.info/sct#203638000"},{"name":"Kyphoscoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#405773007"},{"name":"Lordoscoliosis (disorder)","@id":"http://snomed.info/sct#111268000"},{"name":"Neuromuscular scoliosis (disorder)","@id":"http://snomed.info/sct#203662005"},{"name":"Postural scoliosis (disorder)","@id":"http://snomed.info/sct#203645000"},{"name":"Radioulnar synostosis with microcephaly and scoliosis syndrome (disorder)","@id":"http://snomed.info/sct#719162001"},{"name":"Scoliosis in connective tissue anomalies (disorder)","@id":"http://snomed.info/sct#203664006"},{"name":"Scoliosis in neurofibromatosis (disorder)","@id":"http://snomed.info/sct#203663000"},{"name":"Scoliosis in skeletal dysplasia (disorder)","@id":"http://snomed.info/sct#203661003"},{"name":"Scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#298392006"},{"name":"Scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#298591003"},{"name":"Scoliosis of thoracic spine (disorder)","@id":"http://snomed.info/sct#298494008"}]});
    expect(wrapper.vm.semanticProperties).toStrictEqual([{"property":{"name":"Associated morphology (attribute)","@id":"http://snomed.info/sct#116676008"},"type":{"name":"Lateral abnormal curvature (morphologic abnormality)","@id":"http://snomed.info/sct#31739005"}}]);
    expect(wrapper.vm.dataModelProperties).toStrictEqual([{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}}]);
    expect(wrapper.vm.definitionText).toBe("");
    expect(wrapper.vm.display).toBeFalsy();
    expect(wrapper.vm.types).toStrictEqual([{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]);
    expect(wrapper.vm.header).toBe("Scoliosis deformity of spine (disorder)");
    expect(wrapper.vm.dialogHeader).toBe("");
    expect(wrapper.vm.active).toBe(0);
    expect(wrapper.vm.contentHeight).not.toBe("");
    expect(wrapper.vm.contentHeightValue).not.toBe(0);
  });

  it("inits and setsHeights on mounted", async() => {
    await flushPromises();
    expect(wrapper.vm.contentHeightValue).not.toBe(0);
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
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

  it("updates copyMenuItems on concept change ___ newValue success", async() => {
    wrapper.vm.setCopyMenuItems = jest.fn();
    wrapper.vm.$options.watch.concept.call(wrapper.vm, {"iri":"http://snomed.info/sct#298591003","name":"Scoliosis of lumbar spine (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Deformity of lumbar spine (finding)","@id":"http://snomed.info/sct#298589006"},{"name":"Scoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#298382003"},{"name":"Disorder of lumbar spine (disorder)","@id":"http://snomed.info/sct#129139009"}],"subtypes":[{"name":"Idiopathic scoliosis of lumbar spine (disorder)","@id":"http://snomed.info/sct#712581001"}]});
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.setCopyMenuItems).toHaveBeenCalledTimes(1);
  });

  it("updates copyMenuItems on concept change ___ newValue fail", async() => {
    wrapper.vm.setCopyMenuItems = jest.fn();
    wrapper.vm.$options.watch.concept.call(wrapper.vm, undefined);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.setCopyMenuItems).toHaveBeenCalledTimes(0);
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
      params: { iri: "http://snomed.info/sct#298382003" }
    });
  });

  it("can route to create", () => {
    wrapper.vm.directToCreateRoute();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Create" });
  });

  it("can getConcept ___ pass", async() => {
    EntityService.getEntityDefinitionDto = jest.fn().mockResolvedValue({data:{"iri":"http://snomed.info/sct#111266001","name":"Acquired scoliosis (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Acquired curvature of spine (disorder)","@id":"http://snomed.info/sct#12903001"},{"name":"Scoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#298382003"}],"subtypes":[{"name":"Acquired kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#405771009"},{"name":"Adolescent idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203646004"},{"name":"Infantile idiopathic scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#310421000119106"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis caused by radiation (disorder)","@id":"http://snomed.info/sct#47518006"},{"name":"Thoracogenic scoliosis (disorder)","@id":"http://snomed.info/sct#72992003"}]}});
    wrapper.vm.getConcept("http://snomed.info/sct#111266001");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledWith("http://snomed.info/sct#111266001");
    expect(wrapper.vm.concept).toStrictEqual({"iri":"http://snomed.info/sct#111266001","name":"Acquired scoliosis (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Acquired curvature of spine (disorder)","@id":"http://snomed.info/sct#12903001"},{"name":"Scoliosis deformity of spine (disorder)","@id":"http://snomed.info/sct#298382003"}],"subtypes":[{"name":"Acquired kyphoscoliosis (disorder)","@id":"http://snomed.info/sct#405771009"},{"name":"Adolescent idiopathic scoliosis (disorder)","@id":"http://snomed.info/sct#203646004"},{"name":"Infantile idiopathic scoliosis of cervical spine (disorder)","@id":"http://snomed.info/sct#310421000119106"},{"name":"Post-surgical scoliosis (disorder)","@id":"http://snomed.info/sct#203647008"},{"name":"Scoliosis caused by radiation (disorder)","@id":"http://snomed.info/sct#47518006"},{"name":"Thoracogenic scoliosis (disorder)","@id":"http://snomed.info/sct#72992003"}]});
  });

  it("can getConcept ___ fail", async() => {
    EntityService.getEntityDefinitionDto = jest.fn().mockRejectedValue({code: 403, message: "test message"});
    wrapper.vm.getConcept("http://snomed.info/sct#111266001");
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledTimes(2);
    expect(EntityService.getEntityDefinitionDto).toHaveBeenCalledWith("http://snomed.info/sct#111266001");
    expect(mockToast.add).toHaveBeenCalledTimes(2);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get concept definition dto from server", {code: 403, message: "test message"}));
  });

  it("can get properties ___ pass both", async() => {
    EntityService.getSemanticProperties = jest.fn().mockResolvedValue({data: [{"property":{"name":"takes place in care setting","@id":"http://endhealth.info/im#51000252106"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"}}]});
    EntityService.getDataModelProperties = jest.fn().mockResolvedValue({data:[{"property":{"name":"has admission source","@id":"http://endhealth.info/im#hasAdmissionSource"},"type":{"name":"Critical care admission source","@id":"http://endhealth.info/im#1041000252100"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has critical care unit function","@id":"http://endhealth.info/im#hasCriticalCareUnitFunction"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}}]});
    wrapper.vm.getProperties("http://endhealth.info/im#CriticalCareEncounter");
    await flushPromises();
    expect(EntityService.getSemanticProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getSemanticProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(EntityService.getDataModelProperties).toHaveBeenCalledTimes(1);
    expect(EntityService.getDataModelProperties).toHaveBeenCalledWith("http://endhealth.info/im#CriticalCareEncounter");
    expect(wrapper.vm.semanticProperties).toStrictEqual([{"property":{"name":"takes place in care setting","@id":"http://endhealth.info/im#51000252106"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"}}]);
    expect(wrapper.vm.dataModelProperties).toStrictEqual([{"property":{"name":"has admission source","@id":"http://endhealth.info/im#hasAdmissionSource"},"type":{"name":"Critical care admission source","@id":"http://endhealth.info/im#1041000252100"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has critical care unit function","@id":"http://endhealth.info/im#hasCriticalCareUnitFunction"},"type":{"name":"Critical care unit function","@id":"http://endhealth.info/im#211000252109"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}}]);
  });

  it("can get properties ___ both fail", async() => {
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

  it("Inits ___ Class", async() => {
    wrapper.vm.getProperties = jest.fn();
    wrapper.vm.getConcept = jest.fn();
    wrapper.vm.concept = {"iri":"http://snomed.info/sct#47518006","name":"Scoliosis caused by radiation (disorder)","status":"Active","types":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Acquired scoliosis (disorder)","@id":"http://snomed.info/sct#111266001"},{"name":"Radiation therapy complication (disorder)","@id":"http://snomed.info/sct#212904005"},{"name":"Disorder of musculoskeletal system following procedure (disorder)","@id":"http://snomed.info/sct#724614007"},{"name":"Deformity of spine due to injury (disorder)","@id":"http://snomed.info/sct#442544003"}],"subtypes":[]};
    wrapper.vm.init();
    await flushPromises();
    expect(wrapper.vm.getProperties).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getProperties).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.getConcept).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.getConcept).toHaveBeenCalledWith("http://snomed.info/sct#298382003");
    expect(wrapper.vm.types).toStrictEqual([{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}]);
    expect(wrapper.vm.header).toBe("Scoliosis caused by radiation (disorder)");
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateSelectedEntityType", "Class");
  });


  it("Inits ___ Set", async() => {
    wrapper.vm.getProperties = jest.fn();
    wrapper.vm.getConcept = jest.fn();
    wrapper.vm.concept = {"iri":"http://endhealth.info/im#VSET_RecordType_FamilyHistory","name":"Family history","description":"Family history value set not including negative family history","types":[{"name":"Concept Set","@id":"http://endhealth.info/im#ConceptSet"}],"isa":[],"subtypes":[]};
    wrapper.vm.init();
    await flushPromises();
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateSelectedEntityType", "Set");
  });

  it("Inits ___ Query", async() => {
    wrapper.vm.getProperties = jest.fn();
    wrapper.vm.getConcept = jest.fn();
    wrapper.vm.concept = {"iri":"http://endhealth.info/im#1000051000252106","name":"Frailty flag (query definition)","description":"Queries the health record of a patient to ascertain potential frailty","types":[{"name":"Query template","@id":"http://endhealth.info/im#QueryTemplate"}],"isa":[],"subtypes":[]};
    wrapper.vm.init();
    await flushPromises();
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateSelectedEntityType", "Query");
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

  it("can copy concept to clipboard", async() => {
    await flushPromises();
    expect(wrapper.vm.copyConceptToClipboard()).toBe("Name: Scoliosis deformity of spine (disorder),\nIri: http://snomed.info/sct#298382003,\nStatus: Active,\nTypes: [\n\tClass\n],\nIs-a: [\n\tCurvature of spine (disorder),\n\tDisorder of musculoskeletal system (disorder),\n\tDisorder of vertebral column (disorder)\n],\nSubtypes: [\n\tAcquired scoliosis (disorder),\n\tAcrodysplasia scoliosis (disorder),\n\tCongenital scoliosis due to bony malformation (disorder),\n\tDistal arthrogryposis type 4 (disorder),\n\tDuane anomaly, myopathy, scoliosis syndrome (disorder),\n\tHorizontal gaze palsy with progressive scoliosis (disorder),\n\tIdiopathic scoliosis (disorder),\n\tIdiopathic scoliosis AND/OR kyphoscoliosis (disorder),\n\tKyphoscoliosis and scoliosis (disorder),\n\tKyphoscoliosis deformity of spine (disorder),\n\tLordoscoliosis (disorder),\n\tNeuromuscular scoliosis (disorder),\n\tPostural scoliosis (disorder),\n\tRadioulnar synostosis with microcephaly and scoliosis syndrome (disorder),\n\tScoliosis in connective tissue anomalies (disorder),\n\tScoliosis in neurofibromatosis (disorder),\n\tScoliosis in skeletal dysplasia (disorder),\n\tScoliosis of cervical spine (disorder),\n\tScoliosis of lumbar spine (disorder),\n\tScoliosis of thoracic spine (disorder)\n],\nSemantic properties: [\n\tAssociated morphology (attribute)\n],\nData model properties: [\n\tadditional Practitioners\n]");
  });

  it("can copy concept to clipboard ___ empty arrays", async() => {
    await flushPromises();
    wrapper.vm.concept = {name: "Test Name", iri: "TestIri", status: "TestStatus", types: [], subtypes: [], isa: []};
    wrapper.vm.semanticProperties = [];
    wrapper.vm.dataModelProperties = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.copyConceptToClipboard()).toBe("Name: Test Name,\nIri: TestIri,\nStatus: TestStatus,\nTypes: [\n\t\n],\nIs-a: [\n\t\n],\nSubtypes: [\n\t\n],\nSemantic properties: [\n\t\n],\nData model properties: [\n\t\n]");
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
    wrapper.vm.concept = {"iri":"http://endhealth.info/im#Encounter","name":"Encounter (record type)","description":"An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.","status":"Active","types":[{"name":"Record type","@id":"http://endhealth.info/im#RecordType"},{"name":"Node shape","@id":"http://www.w3.org/ns/shacl#NodeShape"},{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"},{"name":"Encounter type (record artifact)","@id":"http://snomed.info/sct#325841000000109"},{"name":"Encounter related value concept","@id":"http://endhealth.info/im#903031000252104"},{"name":"Discovery common data  model","@id":"http://endhealth.info/im#DiscoveryCommonDataModel"}],"subtypes":[{"name":"Administrative entry","@id":"http://endhealth.info/im#1731000252106"},{"name":"Consultation","@id":"http://endhealth.info/im#31000252100"},{"name":"Hospital encounter","@id":"http://endhealth.info/im#1161000252102"}]}
    wrapper.vm.dataModelProperties = [{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}},{"property":{"name":"has section","@id":"http://endhealth.info/im#hasSection"},"type":{"name":"Section (structural)","@id":"http://endhealth.info/im#Section"},"inheritedFrom":{}},{"property":{"name":"linked appointment","@id":"http://endhealth.info/im#linkedAppointment"},"type":{"name":"Appointment (slot)  (record type)","@id":"http://endhealth.info/im#Appointment"},"inheritedFrom":{}},{"property":{"name":"linked care episode","@id":"http://endhealth.info/im#linkedCareEpisode"},"type":{"name":"Episode of care  (record type)","@id":"http://endhealth.info/im#EpisodeOfCare"},"inheritedFrom":{}},{"property":{"name":"location","@id":"http://endhealth.info/im#location"},"type":{"name":"Location  (record type)","@id":"http://endhealth.info/im#Location"},"inheritedFrom":{}},{"property":{"name":"providing Organisation/ services or departments","@id":"http://endhealth.info/im#providingOrganisation_ServicesOrDepartments"},"type":{"name":"Organisation  (record type)","@id":"http://endhealth.info/im#Organisation"},"inheritedFrom":{}},{"property":{"name":"is subencounter of","@id":"http://endhealth.info/im#isSubEnctounterOf"},"type":{"name":"Encounter (record type)","@id":"http://endhealth.info/im#Encounter"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has subject","@id":"http://endhealth.info/im#hasSubject"},"type":{"name":"Patient (person)","@id":"http://snomed.info/sct#116154003"},"inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"practitioner","@id":"http://endhealth.info/im#hasPractitioner"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"date","@id":"http://endhealth.info/im#date"},"type":{"name":"string","@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}},{"property":{"name":"end date","@id":"http://endhealth.info/im#endDate"},"type":{"name":"string","@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}}];
    wrapper.vm.semanticProperties = [];
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
    expect(wrapper.vm.copyMenuItems[3].label).toBe("Name");
    expect(Object.keys(wrapper.vm.copyMenuItems[4])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[4].label).toBe("Iri");
    expect(Object.keys(wrapper.vm.copyMenuItems[5])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[5].label).toBe("Status");
    expect(Object.keys(wrapper.vm.copyMenuItems[6])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[6].label).toBe("Types");
    expect(Object.keys(wrapper.vm.copyMenuItems[7])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[7].label).toBe("Is a");
    expect(Object.keys(wrapper.vm.copyMenuItems[8])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[8].label).toBe("Subtypes");
    expect(Object.keys(wrapper.vm.copyMenuItems[9])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[9].label).toBe("Semantic properties");
    expect(Object.keys(wrapper.vm.copyMenuItems[10])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[10].label).toBe("Data model properties");
    expect(Object.keys(wrapper.vm.copyMenuItems[11])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[11].label).toBe("Description");
  });

  it("can set copy menu items ___ empty arrays", async() => {
    await flushPromises();
    wrapper.vm.copyMenuItems = [];
    wrapper.vm.concept = {"iri":"http://endhealth.info/im#Encounter","name":"Encounter (record type)","description":"An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.","status":"Active","types":[],"isa":[],"subtypes":[]}
    wrapper.vm.dataModelProperties = [];
    wrapper.vm.semanticProperties = [];
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
    expect(wrapper.vm.copyMenuItems[3].label).toBe("Name");
    expect(Object.keys(wrapper.vm.copyMenuItems[4])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[4].label).toBe("Iri");
    expect(Object.keys(wrapper.vm.copyMenuItems[5])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[5].label).toBe("Status");
    expect(Object.keys(wrapper.vm.copyMenuItems[6])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[6].label).toBe("Types");
    expect(Object.keys(wrapper.vm.copyMenuItems[7])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[7].label).toBe("Is a");
    expect(Object.keys(wrapper.vm.copyMenuItems[8])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[8].label).toBe("Subtypes");
    expect(Object.keys(wrapper.vm.copyMenuItems[9])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[9].label).toBe("Semantic properties");
    expect(Object.keys(wrapper.vm.copyMenuItems[10])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[10].label).toBe("Data model properties");
    expect(Object.keys(wrapper.vm.copyMenuItems[11])).toStrictEqual(["label", "command"]);
    expect(wrapper.vm.copyMenuItems[11].label).toBe("Description");
  });

  it("can run commands from copymenuItems ___ pass", async() => {
    clipboardSpy.mockResolvedValue(true);
    await flushPromises();
    wrapper.vm.dataModelProperties = [{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}},{"property":{"name":"has section","@id":"http://endhealth.info/im#hasSection"},"type":{"name":"Section (structural)","@id":"http://endhealth.info/im#Section"},"inheritedFrom":{}},{"property":{"name":"linked appointment","@id":"http://endhealth.info/im#linkedAppointment"},"type":{"name":"Appointment (slot)  (record type)","@id":"http://endhealth.info/im#Appointment"},"inheritedFrom":{}},{"property":{"name":"linked care episode","@id":"http://endhealth.info/im#linkedCareEpisode"},"type":{"name":"Episode of care  (record type)","@id":"http://endhealth.info/im#EpisodeOfCare"},"inheritedFrom":{}},{"property":{"name":"location","@id":"http://endhealth.info/im#location"},"type":{"name":"Location  (record type)","@id":"http://endhealth.info/im#Location"},"inheritedFrom":{}},{"property":{"name":"providing Organisation/ services or departments","@id":"http://endhealth.info/im#providingOrganisation_ServicesOrDepartments"},"type":{"name":"Organisation  (record type)","@id":"http://endhealth.info/im#Organisation"},"inheritedFrom":{}},{"property":{"name":"is subencounter of","@id":"http://endhealth.info/im#isSubEnctounterOf"},"type":{"name":"Encounter (record type)","@id":"http://endhealth.info/im#Encounter"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has subject","@id":"http://endhealth.info/im#hasSubject"},"type":{"name":"Patient (person)","@id":"http://snomed.info/sct#116154003"},"inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"practitioner","@id":"http://endhealth.info/im#hasPractitioner"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"date","@id":"http://endhealth.info/im#date"},"type":{"name":"string","@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}},{"property":{"name":"end date","@id":"http://endhealth.info/im#endDate"},"type":{"name":"string","@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}}];
    wrapper.vm.semanticProperties = [];
    wrapper.vm.concept = {"iri":"http://endhealth.info/im#Encounter","name":"Encounter (record type)","description":"An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.","status":"Active","types":[{"name":"Record type","@id":"http://endhealth.info/im#RecordType"},{"name":"Node shape","@id":"http://www.w3.org/ns/shacl#NodeShape"},{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"},{"name":"Encounter type (record artifact)","@id":"http://snomed.info/sct#325841000000109"},{"name":"Encounter related value concept","@id":"http://endhealth.info/im#903031000252104"},{"name":"Discovery common data  model","@id":"http://endhealth.info/im#DiscoveryCommonDataModel"}],"subtypes":[{"name":"Administrative entry","@id":"http://endhealth.info/im#1731000252106"},{"name":"Consultation","@id":"http://endhealth.info/im#31000252100"},{"name":"Hospital encounter","@id":"http://endhealth.info/im#1161000252102"}]}
    wrapper.vm.setCopyMenuItems();
    await wrapper.vm.$nextTick();

    wrapper.vm.copyMenuItems[2].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Name: Encounter (record type),\nIri: http://endhealth.info/im#Encounter,\nStatus: Active,\nTypes: [\n\tRecord type,\n\tNode shape,\n\tClass\n],\nIs-a: [\n\tPatient health event (record type),\n\tEncounter type (record artifact),\n\tEncounter related value concept,\n\tDiscovery common data  model\n],\nSubtypes: [\n\tAdministrative entry,\n\tConsultation,\n\tHospital encounter\n],\nSemantic properties: [\n\t\n],\nData model properties: [\n\tadditional Practitioners,\n\tcompletion Status,\n\tduration,\n\thas section,\n\tlinked appointment,\n\tlinked care episode,\n\tlocation,\n\tproviding Organisation/ services or departments,\n\tis subencounter of,\n\thas subject,\n\tpractitioner,\n\tdate,\n\tend date\n],\nDescription: An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Concept copied to clipboard"));

    wrapper.vm.copyMenuItems[3].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Name: Encounter (record type)");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Name copied to clipboard"));

    wrapper.vm.copyMenuItems[4].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Iri: http://endhealth.info/im#Encounter");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Iri copied to clipboard"));

    wrapper.vm.copyMenuItems[5].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Status: Active");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Status copied to clipboard"));

    wrapper.vm.copyMenuItems[6].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Types: [\n\tRecord type,\n\tNode shape,\n\tClass\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Types copied to clipboard"));

    wrapper.vm.copyMenuItems[7].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Is-a: [\n\tPatient health event (record type),\n\tEncounter type (record artifact),\n\tEncounter related value concept,\n\tDiscovery common data  model\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Is-a's copied to clipboard"));

    wrapper.vm.copyMenuItems[8].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Subtypes: [\n\tAdministrative entry,\n\tConsultation,\n\tHospital encounter\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Subtypes copied to clipboard"));

    wrapper.vm.copyMenuItems[9].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Semantic properties: [\n\t\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Semantic properties copied to clipboard"));

    wrapper.vm.copyMenuItems[10].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Data model properties: [\n\tadditional Practitioners,\n\tcompletion Status,\n\tduration,\n\thas section,\n\tlinked appointment,\n\tlinked care episode,\n\tlocation,\n\tproviding Organisation/ services or departments,\n\tis subencounter of,\n\thas subject,\n\tpractitioner,\n\tdate,\n\tend date\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Data model properties copied to clipboard"));

    wrapper.vm.copyMenuItems[11].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Description: An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.success("Description copied to clipboard"));
  });

  it("can run commands from copymenuItems ___ fail", async() => {
    clipboardSpy.mockRejectedValue(false);
    await flushPromises();
    wrapper.vm.dataModelProperties = [{"property":{"name":"additional Practitioners","@id":"http://endhealth.info/im#additionalPractitioners"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"inheritedFrom":{}},{"property":{"name":"completion Status","@id":"http://endhealth.info/im#completionStatus"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"inheritedFrom":{}},{"property":{"name":"duration","@id":"http://endhealth.info/im#duration"},"type":{"name":"Concept class","@id":"http://endhealth.info/im#894281000252100"},"minExclusive":"1","inheritedFrom":{}},{"property":{"name":"has section","@id":"http://endhealth.info/im#hasSection"},"type":{"name":"Section (structural)","@id":"http://endhealth.info/im#Section"},"inheritedFrom":{}},{"property":{"name":"linked appointment","@id":"http://endhealth.info/im#linkedAppointment"},"type":{"name":"Appointment (slot)  (record type)","@id":"http://endhealth.info/im#Appointment"},"inheritedFrom":{}},{"property":{"name":"linked care episode","@id":"http://endhealth.info/im#linkedCareEpisode"},"type":{"name":"Episode of care  (record type)","@id":"http://endhealth.info/im#EpisodeOfCare"},"inheritedFrom":{}},{"property":{"name":"location","@id":"http://endhealth.info/im#location"},"type":{"name":"Location  (record type)","@id":"http://endhealth.info/im#Location"},"inheritedFrom":{}},{"property":{"name":"providing Organisation/ services or departments","@id":"http://endhealth.info/im#providingOrganisation_ServicesOrDepartments"},"type":{"name":"Organisation  (record type)","@id":"http://endhealth.info/im#Organisation"},"inheritedFrom":{}},{"property":{"name":"is subencounter of","@id":"http://endhealth.info/im#isSubEnctounterOf"},"type":{"name":"Encounter (record type)","@id":"http://endhealth.info/im#Encounter"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{}},{"property":{"name":"has subject","@id":"http://endhealth.info/im#hasSubject"},"type":{"name":"Patient (person)","@id":"http://snomed.info/sct#116154003"},"inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"practitioner","@id":"http://endhealth.info/im#hasPractitioner"},"type":{"name":"Practitioner in role  (record type)","@id":"http://endhealth.info/im#ThePractitionerInRole"},"minExclusive":"1","maxExclusive":"1","inheritedFrom":{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"}},{"property":{"name":"date","@id":"http://endhealth.info/im#date"},"type":{"name":"string","@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}},{"property":{"name":"end date","@id":"http://endhealth.info/im#endDate"},"type":{"name":"string","@id":"http://www.w3.org/2001/XMLSchema#string"},"inheritedFrom":{"name":"Health event (record type)","@id":"http://endhealth.info/im#HealthEvent"}}];
    wrapper.vm.semanticProperties = [];
    wrapper.vm.concept = {"iri":"http://endhealth.info/im#Encounter","name":"Encounter (record type)","description":"An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.","status":"Active","types":[{"name":"Record type","@id":"http://endhealth.info/im#RecordType"},{"name":"Node shape","@id":"http://www.w3.org/ns/shacl#NodeShape"},{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"isa":[{"name":"Patient health event (record type)","@id":"http://endhealth.info/im#PatientHealthEvent"},{"name":"Encounter type (record artifact)","@id":"http://snomed.info/sct#325841000000109"},{"name":"Encounter related value concept","@id":"http://endhealth.info/im#903031000252104"},{"name":"Discovery common data  model","@id":"http://endhealth.info/im#DiscoveryCommonDataModel"}],"subtypes":[{"name":"Administrative entry","@id":"http://endhealth.info/im#1731000252106"},{"name":"Consultation","@id":"http://endhealth.info/im#31000252100"},{"name":"Hospital encounter","@id":"http://endhealth.info/im#1161000252102"}]}
    wrapper.vm.setCopyMenuItems();
    await wrapper.vm.$nextTick();

    wrapper.vm.copyMenuItems[2].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Name: Encounter (record type),\nIri: http://endhealth.info/im#Encounter,\nStatus: Active,\nTypes: [\n\tRecord type,\n\tNode shape,\n\tClass\n],\nIs-a: [\n\tPatient health event (record type),\n\tEncounter type (record artifact),\n\tEncounter related value concept,\n\tDiscovery common data  model\n],\nSubtypes: [\n\tAdministrative entry,\n\tConsultation,\n\tHospital encounter\n],\nSemantic properties: [\n\t\n],\nData model properties: [\n\tadditional Practitioners,\n\tcompletion Status,\n\tduration,\n\thas section,\n\tlinked appointment,\n\tlinked care episode,\n\tlocation,\n\tproviding Organisation/ services or departments,\n\tis subencounter of,\n\thas subject,\n\tpractitioner,\n\tdate,\n\tend date\n],\nDescription: An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy concept to clipboard"));

    wrapper.vm.copyMenuItems[3].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Name: Encounter (record type)");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy name to clipboard"));

    wrapper.vm.copyMenuItems[4].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Iri: http://endhealth.info/im#Encounter");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy iri to clipboard"));

    wrapper.vm.copyMenuItems[5].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Status: Active");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy status to clipboard"));

    wrapper.vm.copyMenuItems[6].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Types: [\n\tRecord type,\n\tNode shape,\n\tClass\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy types to clipboard"));

    wrapper.vm.copyMenuItems[7].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Is-a: [\n\tPatient health event (record type),\n\tEncounter type (record artifact),\n\tEncounter related value concept,\n\tDiscovery common data  model\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy is-a's to clipboard"));

    wrapper.vm.copyMenuItems[8].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Subtypes: [\n\tAdministrative entry,\n\tConsultation,\n\tHospital encounter\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy subtypes to clipboard"));

    wrapper.vm.copyMenuItems[9].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Semantic properties: [\n\t\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy semantic properties to clipboard"));

    wrapper.vm.copyMenuItems[10].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Data model properties: [\n\tadditional Practitioners,\n\tcompletion Status,\n\tduration,\n\thas section,\n\tlinked appointment,\n\tlinked care episode,\n\tlocation,\n\tproviding Organisation/ services or departments,\n\tis subencounter of,\n\thas subject,\n\tpractitioner,\n\tdate,\n\tend date\n]");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy data model properties to clipboard"));

    wrapper.vm.copyMenuItems[11].command();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith("Description: An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.");
    expect(mockToast.add).toHaveBeenLastCalledWith(LoggerService.error("Failed to copy description to clipboard"));
  });

  it("can show terms", () => {
    wrapper.vm.setContentHeight = jest.fn();
    wrapper.vm.showTerms();
    expect(wrapper.vm.active).toBe(1);
  })
});


