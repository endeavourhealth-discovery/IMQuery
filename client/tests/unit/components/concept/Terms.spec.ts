import { flushPromises, shallowMount } from "@vue/test-utils";
import Terms from "@/components/concept/Terms.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

describe("Terms.vue", () => {
  let wrapper: any;
  let mockToast: any;
  let mockRouter: any;
  let windowSpy: any;
  let docSpy: any;

  beforeEach(async() => {
    jest.resetAllMocks();
    mockRouter = {
      push: jest.fn()
    };
    mockToast = {
      add: jest.fn()
    };
    EntityService.getEntityTermCodes = jest.fn().mockResolvedValue({ data: [{"term":"Amputation of right foot (procedure)","code":"723312009","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"}},{"term":"Amputation of right foot (procedure)","code":"3424024017","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"entityTermCode":"3424024017"},{"term":"Amputation of right foot","code":"3424025016","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"entityTermCode":"3424025016"},{"term":"Amputation of right foot","code":"^ESCTAM784250","scheme":{"name":"EMIS code scheme","@id":"http://endhealth.info/im#EMISCodeScheme"},"entityTermCode":"3424025016"}] });

    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    windowSpy = jest.spyOn(window, "getComputedStyle");
    windowSpy.mockReturnValue({ getPropertyValue: jest.fn().mockReturnValue("16px") });

    const warn = console.warn;
    console.warn = jest.fn();

    wrapper = shallowMount(Terms, {
      global: {
        components: { DataTable, Column },
        mocks: { $toast: mockToast, $router: mockRouter }
      },
      props: { conceptIri: "http://snomed.info/sct#723312009" }
    });

    await flushPromises();
    jest.clearAllMocks();

    console.warn = warn;
  });

  it("mounts", async() => {
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.terms).toStrictEqual([{"term":"Amputation of right foot (procedure)","code":"723312009","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"}},{"term":"Amputation of right foot (procedure)","code":"3424024017","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"entityTermCode":"3424024017"},{"term":"Amputation of right foot","code":"3424025016","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"entityTermCode":"3424025016"},{"term":"Amputation of right foot","code":"^ESCTAM784250","scheme":{"name":"EMIS code scheme","@id":"http://endhealth.info/im#EMISCodeScheme"},"entityTermCode":"3424025016"}]);
    expect(wrapper.vm.scrollHeight).toBe("500px");
    expect(wrapper.vm.rows).toBe(25);
  });

  it("can watch conceptIri", () => {
    wrapper.vm.getTerms = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://snomed.info/sct#123037004");
    expect(wrapper.vm.getTerms).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.getTerms).toHaveBeenCalledWith("http://snomed.info/sct#123037004");
  });

  it("adds event listener to setHeight and Scroll on resize", async() => {
    await flushPromises();
    const spy = jest.spyOn(wrapper.vm, "setTableWidth");
    const spy2 = jest.spyOn(wrapper.vm, "setScrollHeight");
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    spy.mockReset();
    spy2.mockReset();
  });

  it("can remove eventListener", () => {
    const spy = jest.spyOn(global, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
  });

  it("can resize", () => {
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.setScrollHeight = jest.fn();
    wrapper.vm.onResize();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.setScrollHeight).toHaveBeenCalledTimes(1);
  });

  it("can getTerms ___ success", async() => {
    wrapper.vm.getTerms("http://snomed.info/sct#723312009");
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#723312009");
    expect(wrapper.vm.terms).toStrictEqual([{"term":"Amputation of right foot (procedure)","code":"723312009","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"}},{"term":"Amputation of right foot (procedure)","code":"3424024017","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"entityTermCode":"3424024017"},{"term":"Amputation of right foot","code":"3424025016","scheme":{"name":"Snomed-CT code","@id":"http://endhealth.info/im#SnomedCodeScheme"},"entityTermCode":"3424025016"},{"term":"Amputation of right foot","code":"^ESCTAM784250","scheme":{"name":"EMIS code scheme","@id":"http://endhealth.info/im#EMISCodeScheme"},"entityTermCode":"3424025016"}]);
    expect(wrapper.vm.loading).toBe(false);
  });


  it("can getTerms ___ fail", async() => {
    EntityService.getEntityTermCodes = jest.fn().mockRejectedValue(false);
    wrapper.vm.terms = [];
    wrapper.vm.getTerms("http://snomed.info/sct#723312009");
    expect(wrapper.vm.loading).toBe(true);
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityTermCodes).toHaveBeenCalledWith("http://snomed.info/sct#723312009");
    expect(wrapper.vm.terms).toStrictEqual([]);
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Concept term codes server request failed"));
    expect(wrapper.vm.loading).toBe(false);
  });

  it("can setScrollHeight ___ fail", () => {
    wrapper.vm.setScrollHeight();
    expect(wrapper.vm.scrollHeight).toBe("500px");
  });

  it("sets scroll height ___ container success", async() => {
    const mockElement = document.createElement("div");
    mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ height: 100 });
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setScrollHeight();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.scrollHeight).not.toBe("500px");
    docSpy.mockReset();
  });


  it("sets scroll height ___ paginator fail", async() => {
    const mockElement = document.createElement("div");
    mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ height: 100 })
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([undefined]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setScrollHeight();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.scrollHeight).not.toBe("500px");
    docSpy.mockReset();
  });

  it("can setTableWidth", () => {
    const mockElement = document.createElement("div");
    mockElement.style.width = "10px";
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setTableWidth();
    expect(mockElement.style.width).toBe("100%");
  });

  it("can setTableWidth ___ element fail", () => {
    const mockElement = document.createElement("div");
    mockElement.style.width = "10px";
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([undefined]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setTableWidth();
    expect(mockElement.style.width).toBe("10px");
  });

  it("can scrollToTop", () => {
    const mockElement = document.createElement("div");
    mockElement.scrollTop = 100;
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.scrollToTop();
    expect(mockElement.scrollTop).toBe(0);
  });

  it("can scrollToTop ___ id element fail", () => {
    const mockElement = document.createElement("div");
    mockElement.scrollTop = 100;
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([undefined]);
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.scrollToTop();
    expect(mockElement.scrollTop).toBe(100);
  });

  it("can scrollToTop ___ class element fail", () => {
    const mockElement = document.createElement("div");
    mockElement.scrollTop = 100;
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([undefined]);
    docSpy.mockReturnValue(undefined);
    wrapper.vm.scrollToTop();
    expect(mockElement.scrollTop).toBe(100);
  });
});
