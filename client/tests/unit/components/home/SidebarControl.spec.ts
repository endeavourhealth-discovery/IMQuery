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
        filters: {
          selectedStatus: ["Active", "Draft", "Inactive"],
          selectedSchemes: [
            {
              iri: "http://endhealth.info/im#DiscoveryCodeScheme",
              name: "Discovery code"
            },
            {
              iri: "http://endhealth.info/im#SnomedCodeScheme",
              name: "Snomed-CT code"
            },
            {
              iri: "http://endhealth.info/im#TermOnlyCodeScheme",
              name: "Term based code"
            }
          ],
          selectedTypes: [
            "Class",
            "ObjectProperty",
            "DataProperty",
            "DataType",
            "Annotation",
            "Individual",
            "Record",
            "ValueSet",
            "Folder",
            "Legacy"
          ]
        }
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
    expect(wrapper.vm.active).toBe(2);
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

  it("can checkKey ___ enter", () => {
    wrapper.vm.search = jest.fn();
    wrapper.vm.checkKey({ code: "Enter" });
    expect(wrapper.vm.search).toHaveBeenCalledTimes(1);
  });

  it("can checkKey ___ other", () => {
    wrapper.vm.search = jest.fn();
    wrapper.vm.checkKey({ code: "Space" });
    expect(wrapper.vm.search).toHaveBeenCalledTimes(0);
  });

  it("can remove eventListener", () => {
    const spy = jest.spyOn(global, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
  });
});
