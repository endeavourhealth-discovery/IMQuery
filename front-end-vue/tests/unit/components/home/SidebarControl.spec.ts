import { flushPromises, shallowMount } from "@vue/test-utils";
import SidebarControl from "@/components/home/SidebarControl.vue";
import InputText from "primevue/inputtext";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Hierarchy from "@/components/sidebar/Hierarchy.vue";
import History from "@/components/sidebar/History.vue";
import SearchResults from "@/components/sidebar/SearchResults.vue";
import Filters from "@/components/sidebar/Filters.vue";
import LoggerService from "@/services/LoggerService";

describe("SidebarControl.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockToast: any;
  let testError: Error;
  jest.useFakeTimers();

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = {
      state: {
        selectedFilters: {"status":[{"name":"Active","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Active"},{"name":"Draft","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Draft"}],"schemes":[{"iri":"http://endhealth.info/im#","prefix":"im","name":"Discovery namespace"},{"iri":"http://snomed.info/sct#","prefix":"sn","name":"Snomed-CT namespace"}],"types":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"},{"@id":"http://endhealth.info/im#Folder","name":"Folder"},{"@id":"http://www.w3.org/ns/shacl#NodeShape","name":"Node shape"},{"@id":"http://www.w3.org/2002/07/owl#ObjectProperty","name":"ObjectProperty"},{"@id":"http://endhealth.info/im#QueryTemplate","name":"Query template"},{"@id":"http://endhealth.info/im#RecordType","name":"Record type"},{"@id":"http://endhealth.info/im#ValueSet","name":"Value set"}]},
        filterOptions: {"status":[{"name":"Active","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Active"},{"name":"Draft","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Draft"},{"name":"Inactive","hasChildren":false,"type":[{"name":"Class","@id":"http://www.w3.org/2002/07/owl#Class"}],"@id":"http://endhealth.info/im#Inactive"}],"scheme":[{"iri":"http://endhealth.info/bc#","prefix":"bc","name":"Barts Cerner namespace"},{"iri":"http://endhealth.info/ceg16#","prefix":"ceg13","name":"CEG ethnicity 16+ category"},{"iri":"http://endhealth.info/im#","prefix":"im","name":"Discovery namespace"},{"iri":"http://endhealth.info/emis#","prefix":"emis","name":"EMIS (inc. Read2 like) namespace"},{"iri":"http://endhealth.info/icd10#","prefix":"icd10","name":"ICD10 namespace"},{"iri":"http://endhealth.info/reports#","prefix":"reports","name":"IM internal reports"},{"iri":"http://endhealth.info/kchapex#","prefix":"kchapex","name":"KCH Apex codes"},{"iri":"http://endhealth.info/kchwinpath#","prefix":"kchwinpath","name":"KCH Winpath codes"},{"iri":"http://endhealth.info/nhsethnic2001#","prefix":"nhse2001","name":"NHS Ethnicitity categories 2001 census"},{"iri":"http://endhealth.info/ods#","prefix":"ods","name":"ODS code scheme"},{"iri":"http://endhealth.info/opcs4#","prefix":"opcs4","name":"OPCS4 namespace"},{"iri":"https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#","prefix":"orole","name":"OPS roles namespace"},{"iri":"http://www.w3.org/2002/07/owl#","prefix":"owl","name":"OWL2 namespace"},{"iri":"http://www.w3.org/ns/prov#","prefix":"prov","name":"PROV namespace"},{"iri":"http://endhealth.info/prsb#","prefix":"prsb","name":"PRSB namespace"},{"iri":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","prefix":"rdf","name":"RDF namespace"},{"iri":"http://www.w3.org/2000/01/rdf-schema#","prefix":"rdfs","name":"RDFS namespace"},{"iri":"http://www.w3.org/ns/shacl#","prefix":"sh","name":"SHACL namespace"},{"iri":"http://snomed.info/sct#","prefix":"sn","name":"Snomed-CT namespace"},{"iri":"http://endhealth.info/tpp#","prefix":"tpp","name":"TPP (inc.CTV3) namespace"},{"iri":"http://endhealth.info/vision#","prefix":"vis","name":"Vision (incl. Read2) namespace"},{"iri":"http://www.w3.org/2001/XMLSchema#","prefix":"xsd","name":"xsd namespace"}],"type":[{"@id":"http://www.w3.org/2002/07/owl#Class","name":"Class"},{"@id":"http://endhealth.info/im#Folder","name":"Folder"},{"@id":"http://endhealth.info/im#LegacyEntity","name":"Legacy concept"},{"@id":"http://www.w3.org/ns/shacl#NodeShape","name":"Node shape"},{"@id":"http://www.w3.org/2002/07/owl#ObjectProperty","name":"ObjectProperty"},{"@id":"http://endhealth.info/im#QueryTemplate","name":"Query template"},{"@id":"http://endhealth.info/im#RecordType","name":"Record type"},{"@id":"http://endhealth.info/im#ValueSet","name":"Value set"}]}
      },
      commit: jest.fn(),
      dispatch: jest.fn().mockResolvedValue("true")
    };
    mockToast = {
      add: jest.fn()
    };
    wrapper = shallowMount(SidebarControl, {
      global: {
        components: { InputText, TabPanel, TabView, Hierarchy, History, SearchResults, Filters },
        mocks: { $store: mockStore, $toast: mockToast }
      },
      props: { focusHierarchy: false }
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("adds event listener to setsContainerHeights on resize", async() => {
    const spy1 = jest.spyOn(wrapper.vm, "setContainerHeights");
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(spy1).toHaveBeenCalledTimes(1);
    spy1.mockReset();
  });

  it("can update on focusHierarchy", async() => {
    wrapper.vm.$options.watch.focusHierarchy.call(wrapper.vm, true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.active).toBe(0);
    expect(wrapper.emitted().hierarchyFocused).toBeTruthy();
    wrapper.vm.active = 3;
    wrapper.vm.$options.watch.focusHierarchy.call(wrapper.vm, false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.active).toBe(3);
  });

  it("only searches with 3 or more characters ___ 0", async() => {
    wrapper.vm.searchTerm = "";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.active).toBe(0);
    expect(mockStore.commit).not.toHaveBeenCalled();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it("only searches with 3 or more characters ___ 2", async() => {
    wrapper.vm.searchTerm = "we";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.active).toBe(0);
    expect(mockStore.commit).not.toHaveBeenCalled();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it("only searches with 3 or more characters ___ 2", async() => {
    wrapper.vm.searchTerm = "sco";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.active).toBe(1);
    expect(mockStore.commit).toHaveBeenCalled();
  });

  it("cancels existing requests on new search", async() => {
    wrapper.vm.searchTerm = "sco";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    const spy = jest.spyOn(wrapper.vm.request, "cancel");
    wrapper.vm.searchTerm = "pul";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
  });

  it("updated loading on dispatch success", async() => {
    wrapper.vm.searchTerm = "sco";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", {
      key: "searchResults",
      value: false
    });
    expect(mockToast.add).not.toHaveBeenCalled();
  });

  it("updated loading and fire toast on dispatch fail", async() => {
    mockStore.dispatch = jest.fn().mockResolvedValue("false")
    wrapper.vm.searchTerm = "sco";
    wrapper.vm.search();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    expect(mockStore.commit).toHaveBeenCalledTimes(2);
    expect(mockStore.commit).toHaveBeenLastCalledWith("updateLoading", {
      key: "searchResults",
      value: false
    });
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Search results server request failed"));
  });

  it("debounces", async() => {
    const spy = jest.spyOn(wrapper.vm, "search")
    wrapper.vm.debounceForSearch();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.debounce).toBeGreaterThan(0);
    expect(spy).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("sets container size", async() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return { height: 100, width: 0, top: 0, bottom: 0, right: 0, x: 0, y: 0, left: 0, toJSON: jest.fn() }
    });
    let docSpy: any;
    const mockElement = document.createElement("div");
    mockElement.style.height = 100 + "px";
    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setContainerHeights();
    await wrapper.vm.$nextTick();
    expect(mockElement.style.maxHeight).toBeTruthy();
  });

  it("can remove eventListener", () => {
    const spy = jest.spyOn(global, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
  });
});
