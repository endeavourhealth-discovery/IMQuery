import { mount } from "@vue/test-utils";
import Filters from "@/components/sidebar/Filters.vue";
import MultiSelect from "primevue/multiselect";
import { IM } from "@/vocabulary/IM";

describe("Filters.vue", () => {
  let wrapper: any;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      state: {
        filters: {
          selectedStatus: true,
          selectedSchemes: true,
          selectedTypes: true
        }
      }
    };
    wrapper = mount(Filters, {
      props: { search: jest.fn(), searchTerm: "sco" },
      global: {
        components: { MultiSelect },
        mocks: { $store: mockStore }
      }
    });
  });
  it("sets data returns", () => {
    expect(wrapper.vm.statusOptions).toStrictEqual(["Active", "Draft", "Inactive"]);
    expect(wrapper.vm.schemeOptions).toStrictEqual([
      {
        iri: IM.CODE_SCHEME_BARTS,
        name: "Barts Cerner code"
      },
      {
        iri: IM.CODE_SCHEME_CTV3,
        name: "CTV3 Code"
      },
      {
        iri: IM.DISCOVERY_CODE,
        name: "Discovery code"
      },
      {
        iri: IM.CODE_SCHEME_EMIS,
        name: "EMIS local code"
      },
      {
        iri: "http://endhealth.info/im#581000252100",
        name: "Homerton Cerner code"
      },
      {
        iri: IM.CODE_SCHEME_ICD10,
        name: "ICD10 code"
      },
      {
        iri: IM.CODE_SCHEME_OPCS4,
        name: "OPCS4 code"
      },
      {
        iri: IM.CODE_SCHEME_READ,
        name: "Read 2 code"
      },
      {
        iri: IM.CODE_SCHEME_SNOMED,
        name: "Snomed-CT code"
      },
      {
        iri: "http://endhealth.info/im#631000252102",
        name: "TPP local codes"
      },
      {
        iri: IM.CODE_SCHEME_TERMS,
        name: "Term based code"
      }
    ]);
    expect(wrapper.vm.typeOptions).toStrictEqual([
      "Class",
      "ObjectProperty",
      "DataProperty",
      "DataType",
      "Annotation",
      "Individual",
      "Record",
      "ValueSet",
      "Folder",
      "Term",
      "Legacy",
      "CategoryGroup"
    ]);
  });

  it("can check for search", () => {
    wrapper.vm.checkForSearch();
    expect(wrapper.vm.search).toHaveBeenCalled();
  });

  it("can check for search ___ no searchterm", async() => {
    await wrapper.setProps({ searchTerm: "" });
    wrapper.vm.checkForSearch();
    expect(wrapper.vm.search).not.toHaveBeenCalled();
  });
})
