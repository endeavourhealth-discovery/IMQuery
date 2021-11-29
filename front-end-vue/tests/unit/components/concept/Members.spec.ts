import { flushPromises, shallowMount } from "@vue/test-utils";
import Members from "@/components/concept/Members.vue";
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import Button from "primevue/button";
import EntityService from "@/services/EntityService";
import { FilterMatchMode } from "primevue/api";
import LoggerService from "@/services/LoggerService";
import Swal from "sweetalert2";

describe("Members.vue", () => {
  let wrapper: any;
  let mockRouter: any;
  let mockToast: any;
  let docSpy: any;

  beforeEach(async () => {
    jest.resetAllMocks();

    EntityService.getEntityMembers = jest.fn().mockResolvedValue({
      data: {
        valueSet: {
          name: "CEG 16+1 Ethnic category (concept set)",
          "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16"
        },
        members: [
          {
            entity: { name: "African American (ethnic group)", "@id": "http://snomed.info/sct#15086000" },
            code: "15086000",
            scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
            label: 'Subset - "other Black, African or Caribbean background"',
            type: "SUBSET",
            directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
          },
          {
            entity: { name: "African race (racial group)", "@id": "http://snomed.info/sct#413464008" },
            code: "413464008",
            scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
            label: 'Subset - "other Black, African or Caribbean background"',
            type: "SUBSET",
            directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
          },
          {
            entity: { name: "Abyssinians (Amharas) (ethnic group)", "@id": "http://snomed.info/sct#88790004" },
            code: "88790004",
            scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
            label: "Subset - African",
            type: "SUBSET",
            directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
          },
          {
            entity: { name: "African - ethnic category 2001 census (finding)", "@id": "http://snomed.info/sct#92491000000104" },
            code: "92491000000104",
            scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
            label: "Subset - African",
            type: "SUBSET",
            directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
          },
          {
            entity: { name: "African origin (finding)", "@id": "http://snomed.info/sct#160514004" },
            code: "160514004",
            scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
            label: "Subset - African",
            type: "SUBSET",
            directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
          }
        ],
        limited: false
      }
    });
    mockRouter = { push: jest.fn() };
    mockToast = { add: jest.fn() };

    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(undefined);

    const warn = console.warn;
    console.warn = jest.fn();

    const error = console.error;
    console.error = jest.fn();

    wrapper = shallowMount(Members, {
      global: {
        components: { DataTable, InputText, Checkbox, Column, Button },
        mocks: { $router: mockRouter, $toast: mockToast }
      },
      props: { conceptIri: "http://endhealth.info/im#VSET_EthnicCategoryCEG16" }
    });

    await flushPromises();
    await wrapper.vm.$nextTick();
    jest.clearAllMocks();

    console.warn = warn;
    console.error = error;
  });

  it("mounts", () => {
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.members).toStrictEqual({
      valueSet: {
        name: "CEG 16+1 Ethnic category (concept set)",
        "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16"
      },
      members: [
        {
          entity: { name: "African American (ethnic group)", "@id": "http://snomed.info/sct#15086000" },
          code: "15086000",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: 'Subset - "other Black, African or Caribbean background"',
          type: "SUBSET",
          directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
        },
        {
          entity: { name: "African race (racial group)", "@id": "http://snomed.info/sct#413464008" },
          code: "413464008",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: 'Subset - "other Black, African or Caribbean background"',
          type: "SUBSET",
          directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
        },
        {
          entity: { name: "Abyssinians (Amharas) (ethnic group)", "@id": "http://snomed.info/sct#88790004" },
          code: "88790004",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: "Subset - African",
          type: "SUBSET",
          directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
        },
        {
          entity: { name: "African - ethnic category 2001 census (finding)", "@id": "http://snomed.info/sct#92491000000104" },
          code: "92491000000104",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: "Subset - African",
          type: "SUBSET",
          directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
        },
        {
          entity: { name: "African origin (finding)", "@id": "http://snomed.info/sct#160514004" },
          code: "160514004",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: "Subset - African",
          type: "SUBSET",
          directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
        }
      ],
      limited: false
    });
    expect(wrapper.vm.combinedMembers).toStrictEqual([
      {
        entity: { name: "African American (ethnic group)", "@id": "http://snomed.info/sct#15086000" },
        code: "15086000",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      },
      {
        entity: { name: "African race (racial group)", "@id": "http://snomed.info/sct#413464008" },
        code: "413464008",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      },
      {
        entity: { name: "Abyssinians (Amharas) (ethnic group)", "@id": "http://snomed.info/sct#88790004" },
        code: "88790004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "African - ethnic category 2001 census (finding)", "@id": "http://snomed.info/sct#92491000000104" },
        code: "92491000000104",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "African origin (finding)", "@id": "http://snomed.info/sct#160514004" },
        code: "160514004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      }
    ]);
    expect(wrapper.vm.filters1).toStrictEqual({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    expect(wrapper.vm.expandMembers).toBe(false);
    expect(wrapper.vm.expandSubsets).toBe(false);
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.subsets).toStrictEqual(['Subset - "other Black, African or Caribbean background"', "Subset - African"]);
    expect(wrapper.vm.expandedRowGroups).toStrictEqual(["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"]);
  });

  it("adds event listener to setTableWidth on resize", async () => {
    console.error = jest.fn();
    await flushPromises();
    const spy = jest.spyOn(wrapper.vm, "setTableWidth");
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
  });

  it("can remove eventListener", () => {
    console.error = jest.fn();
    const spy = jest.spyOn(global, "removeEventListener");
    wrapper.unmount();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
  });

  it("can resize", () => {
    console.error = jest.fn();
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.onResize();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can watch conceptIri", async () => {
    wrapper.vm.getMembers = jest.fn();
    wrapper.vm.$options.watch.conceptIri.call(wrapper.vm, "http://snomed.info/sct#92491000000104");
    expect(wrapper.vm.expandMembers).toBe(false);
    expect(wrapper.vm.expandSubsets).toBe(false);
    expect(wrapper.vm.getMembers).toHaveBeenCalledTimes(1);
  });

  it("can watch expandMembers", async () => {
    wrapper.vm.getMembers = jest.fn();
    wrapper.vm.$options.watch.expandMembers.call(wrapper.vm, true);
    expect(wrapper.vm.getMembers).toHaveBeenCalledTimes(1);
  });

  it("can watch expandSubsets", async () => {
    wrapper.vm.getMembers = jest.fn();
    wrapper.vm.$options.watch.expandSubsets.call(wrapper.vm, true);
    expect(wrapper.vm.subsets).toStrictEqual([]);
    expect(wrapper.vm.getMembers).toHaveBeenCalledTimes(1);
  });

  it("can set width onRowGroupExpand", () => {
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.onRowGroupExpand();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can set width onRowGroupExpand", () => {
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.onRowGroupCollapse();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can route onRowSelect", () => {
    wrapper.vm.selected = { entity: { "@id": "testIri" } };
    wrapper.vm.onRowSelect();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "Concept", params: { selectedIri: "testIri" } });
    expect(wrapper.emitted().memberClick).toBeTruthy();
  });

  it("can route onRowSelect ___ selected error", () => {
    wrapper.vm.selected = { "@id": "testIri" };
    wrapper.vm.onRowSelect();
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(wrapper.emitted().memberClick).toBeFalsy();
  });

  it("can getMembers ___ success", async () => {
    wrapper.vm.members = {};
    wrapper.vm.expandMembersSizeCheck = jest.fn();
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.getMembers();
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.expandedRowGroups).toStrictEqual(["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"]);
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.subsets).toStrictEqual([]);
    expect(EntityService.getEntityMembers).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityMembers).toHaveBeenCalledWith("http://endhealth.info/im#VSET_EthnicCategoryCEG16", false, false, undefined);
    await flushPromises();
    expect(wrapper.vm.members).toStrictEqual({
      valueSet: {
        name: "CEG 16+1 Ethnic category (concept set)",
        "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16"
      },
      members: [
        {
          entity: { name: "African American (ethnic group)", "@id": "http://snomed.info/sct#15086000" },
          code: "15086000",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: 'Subset - "other Black, African or Caribbean background"',
          type: "SUBSET",
          directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
        },
        {
          entity: { name: "African race (racial group)", "@id": "http://snomed.info/sct#413464008" },
          code: "413464008",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: 'Subset - "other Black, African or Caribbean background"',
          type: "SUBSET",
          directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
        },
        {
          entity: { name: "Abyssinians (Amharas) (ethnic group)", "@id": "http://snomed.info/sct#88790004" },
          code: "88790004",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: "Subset - African",
          type: "SUBSET",
          directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
        },
        {
          entity: { name: "African - ethnic category 2001 census (finding)", "@id": "http://snomed.info/sct#92491000000104" },
          code: "92491000000104",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: "Subset - African",
          type: "SUBSET",
          directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
        },
        {
          entity: { name: "African origin (finding)", "@id": "http://snomed.info/sct#160514004" },
          code: "160514004",
          scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
          label: "Subset - African",
          type: "SUBSET",
          directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
        }
      ],
      limited: false
    });
    expect(wrapper.vm.expandMembersSizeCheck).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can getMembers ___ fail", async () => {
    EntityService.getEntityMembers = jest.fn().mockRejectedValue(false);
    wrapper.vm.members = {};
    wrapper.vm.expandMembersSizeCheck = jest.fn();
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.getMembers();
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.expandedRowGroups).toStrictEqual(["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"]);
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.subsets).toStrictEqual([]);
    expect(EntityService.getEntityMembers).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityMembers).toHaveBeenCalledWith("http://endhealth.info/im#VSET_EthnicCategoryCEG16", false, false, undefined);
    await flushPromises();
    expect(wrapper.vm.members).toStrictEqual({});
    expect(wrapper.vm.expandMembersSizeCheck).not.toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Failed to get members from server"));
  });

  it("can getMembers ___ expandMembers", async () => {
    EntityService.getEntityMembers = jest.fn().mockRejectedValue(false);
    wrapper.vm.members = {};
    wrapper.vm.expandMembers = true;
    wrapper.vm.expandMembersSizeCheck = jest.fn();
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.getMembers();
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.expandedRowGroups).toStrictEqual(["MemberExpanded"]);
    expect(wrapper.vm.selected).toStrictEqual({});
    expect(wrapper.vm.subsets).toStrictEqual([]);
    expect(EntityService.getEntityMembers).toHaveBeenCalledTimes(1);
    expect(EntityService.getEntityMembers).toHaveBeenCalledWith("http://endhealth.info/im#VSET_EthnicCategoryCEG16", true, false, 2000);
  });

  it("can setSubsets", () => {
    wrapper.vm.combinedMembers.push({
      entity: { name: "Gambians (ethnic group)", "@id": "http://snomed.info/sct#90822005" },
      code: "90822005",
      scheme: { name: "Snomed-CT code", "@id": "http://endhealth.info/im#SnomedCodeScheme" },
      type: "MemberIncluded"
    });
    wrapper.vm.subsets = [];
    wrapper.vm.setSubsets();
    expect(wrapper.vm.subsets).toStrictEqual(['Subset - "other Black, African or Caribbean background"', "Subset - African"]);
  });

  it("can setSubsets ___ none", () => {
    wrapper.vm.combinedMembers = [
      {
        entity: { name: "Gambians (ethnic group)", "@id": "http://snomed.info/sct#90822005" },
        code: "90822005",
        scheme: { name: "Snomed-CT code", "@id": "http://endhealth.info/im#SnomedCodeScheme" },
        label: "MemberIncluded",
        type: "INCLUDED"
      }
    ];
    wrapper.vm.subsets = [];
    wrapper.vm.setSubsets();
    expect(wrapper.vm.subsets).toStrictEqual([]);
  });

  it("can expandMembersSizeCheck ___ unlimited", async () => {
    wrapper.vm.combinedMembers = [];
    wrapper.vm.sortMembers = jest.fn();
    wrapper.vm.setSubsets = jest.fn();
    wrapper.vm.download = jest.fn();
    wrapper.vm.expandMembersSizeCheck();
    expect(wrapper.vm.sortMembers).toHaveBeenCalled();
    expect(wrapper.vm.setSubsets).toHaveBeenCalled();
    expect(wrapper.vm.download).not.toHaveBeenCalled();
    expect(wrapper.vm.combinedMembers).toStrictEqual([
      {
        entity: { name: "African American (ethnic group)", "@id": "http://snomed.info/sct#15086000" },
        code: "15086000",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      },
      {
        entity: { name: "African race (racial group)", "@id": "http://snomed.info/sct#413464008" },
        code: "413464008",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      },
      {
        entity: { name: "Abyssinians (Amharas) (ethnic group)", "@id": "http://snomed.info/sct#88790004" },
        code: "88790004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "African - ethnic category 2001 census (finding)", "@id": "http://snomed.info/sct#92491000000104" },
        code: "92491000000104",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "African origin (finding)", "@id": "http://snomed.info/sct#160514004" },
        code: "160514004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      }
    ]);
  });

  it("can expandMembersSizeCheck ___ swal confirm", async () => {
    Swal.fire = jest.fn().mockImplementation(() => Promise.resolve({ isConfirmed: true }));
    wrapper.vm.members.limited = true;
    wrapper.vm.sortMembers = jest.fn();
    wrapper.vm.setSubsets = jest.fn();
    wrapper.vm.download = jest.fn();
    wrapper.vm.expandMembersSizeCheck();
    expect(wrapper.vm.sortMembers).not.toHaveBeenCalled();
    expect(wrapper.vm.setSubsets).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "warning",
      title: "Large data set",
      text: "Expanding this set results in a large amount of data.\n Would you like to download it instead?",
      confirmButtonText: "Download",
      showCancelButton: true
    });
    await flushPromises();
    expect(wrapper.vm.download).toHaveBeenCalledTimes(1);
  });

  it("can expandMembersSizeCheck ___ swal cancel", async () => {
    Swal.fire = jest.fn().mockImplementation(() => Promise.resolve({ isConfirmed: false }));
    wrapper.vm.members.limited = true;
    wrapper.vm.sortMembers = jest.fn();
    wrapper.vm.setSubsets = jest.fn();
    wrapper.vm.download = jest.fn();
    wrapper.vm.expandMembersSizeCheck();
    expect(wrapper.vm.sortMembers).not.toHaveBeenCalled();
    expect(wrapper.vm.setSubsets).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "warning",
      title: "Large data set",
      text: "Expanding this set results in a large amount of data.\n Would you like to download it instead?",
      confirmButtonText: "Download",
      showCancelButton: true
    });
    await flushPromises();
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.warn("Member expansion cancelled as results exceeded displayable limit."));
    expect(wrapper.vm.download).not.toHaveBeenCalled();
  });

  it("can download ___ success", () => {
    const openStore = window.open;
    window.open = jest.fn().mockReturnValue(true);
    wrapper.vm.download(true);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      "/test/api/entity/download?iri=http:%2F%2Fendhealth.info%2Fim%23VSET_EthnicCategoryCEG16&members=true&expandMembers=true&format=excel"
    );
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.success("Download will begin shortly"));
    window.open = openStore;
  });

  it("can download ___ fail", () => {
    const openStore = window.open;
    window.open = jest.fn().mockReturnValue(false);
    wrapper.vm.download(true);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(
      "/test/api/entity/download?iri=http:%2F%2Fendhealth.info%2Fim%23VSET_EthnicCategoryCEG16&members=true&expandMembers=true&format=excel"
    );
    expect(mockToast.add).toHaveBeenCalledTimes(1);
    expect(mockToast.add).toHaveBeenCalledWith(LoggerService.error("Download failed from server"));
    window.open = openStore;
  });

  it("can sort members", () => {
    wrapper.vm.members.members = [
      {
        entity: { name: "Asian race (racial group)", "@id": "http://snomed.info/sct#413582008" },
        code: "413582008",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - any other Asian background",
        type: "SUBSET",
        directParent: { name: "any other Asian background", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_L" }
      },
      {
        entity: { name: "Mozambiquans (ethnic group)", "@id": "http://snomed.info/sct#41076003" },
        code: "41076003",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "Black, other, non-mixed origin (ethnic group)", "@id": "http://snomed.info/sct#185989004" },
        code: "185989004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      }
    ];
    wrapper.vm.sortMembers();
    expect(wrapper.vm.members.members).toStrictEqual([
      {
        entity: { name: "Black, other, non-mixed origin (ethnic group)", "@id": "http://snomed.info/sct#185989004" },
        code: "185989004",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: 'Subset - "other Black, African or Caribbean background"',
        type: "SUBSET",
        directParent: { name: '"other Black, African or Caribbean background"', "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_P" }
      },
      {
        entity: { name: "Mozambiquans (ethnic group)", "@id": "http://snomed.info/sct#41076003" },
        code: "41076003",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - African",
        type: "SUBSET",
        directParent: { name: "African", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_N" }
      },
      {
        entity: { name: "Asian race (racial group)", "@id": "http://snomed.info/sct#413582008" },
        code: "413582008",
        scheme: { name: "Snomed-CT namespace", "@id": "http://snomed.info/sct#" },
        label: "Subset - any other Asian background",
        type: "SUBSET",
        directParent: { name: "any other Asian background", "@id": "http://endhealth.info/im#VSET_EthnicCategoryCEG16_L" }
      }
    ]);
  });

  it("resizes", () => {
    wrapper.vm.setTableWidth = jest.fn();
    wrapper.vm.onResize();
    expect(wrapper.vm.setTableWidth).toHaveBeenCalledTimes(1);
  });

  it("can setTableWidth", () => {
    const mockElement = document.createElement("div");
    mockElement.getBoundingClientRect = jest.fn().mockReturnValue({ width: 100 });
    mockElement.getElementsByClassName = jest.fn().mockReturnValue([mockElement]);
    mockElement.style.width = "10px";
    docSpy.mockReturnValue(mockElement);
    wrapper.vm.setTableWidth();
    expect(mockElement.style.width).not.toBe("10px");
  });

  it("can setTableWidth ___ table fail", () => {
    LoggerService.error = jest.fn();
    docSpy.mockReturnValue(undefined);
    wrapper.vm.setTableWidth();
    expect(LoggerService.error).toHaveBeenCalledTimes(1);
    expect(LoggerService.error).toHaveBeenCalledWith(undefined, "Failed to set members table width. Required element(s) not found.");
  });
});
