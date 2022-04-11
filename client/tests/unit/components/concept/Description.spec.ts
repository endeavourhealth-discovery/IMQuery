import { shallowMount } from "@vue/test-utils";
import Description from "@/components/concept/Description.vue";
import ScrollPanel from "primevue/scrollpanel";

describe("Description.vue", () => {
  let wrapper: any;
  let docSpy: any;
  let mockElement: any;

  beforeEach(() => {
    jest.resetAllMocks();
    mockElement = document.createElement("div");
    mockElement.innerHTML = "";
    docSpy = jest.spyOn(document, "getElementById");
    docSpy.mockReturnValue(mockElement);

    wrapper = shallowMount(Description, {
      global: {
        components: { ScrollPanel }
      },
      props: { description: "<p class='description-p'>An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.</p>" }
    });
  });

  it("watches description", async() => {
    wrapper.vm.init = jest.fn();
    wrapper.vm.$options.watch.description.call(wrapper.vm, "Test")
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.init).toHaveBeenCalledTimes(1);
  });

  it("adds description in container", async() => {
    await wrapper.vm.$nextTick();
    expect(mockElement.innerHTML).toBe('<p class="description-p">An interaction between a patient (or on behalf of the patient) and a health professional or health provider. \nIt includes consultations as well as care processes such as admission, discharges. It also includes the noting of a filing of a document or report.</p>');
  });

  it("adds description in container", async() => {
    mockElement.innerHTML = "";
    docSpy.mockClear();
    docSpy.mockReturnValue(undefined);
    wrapper.vm.init();
    await wrapper.vm.$nextTick();
    expect(docSpy).toHaveBeenCalledTimes(1);
    expect(mockElement.innerHTML).toBe("");
  });
});
