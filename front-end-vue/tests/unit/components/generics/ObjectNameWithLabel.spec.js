import { shallowMount } from "@vue/test-utils";
import ObjectNameWithLabel from "@/components/generics/ObjectNameWithLabel.vue";

describe("ObjectNameWithLabel.vue", () => {
  let wrapper;

  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = shallowMount(ObjectNameWithLabel, {
      props: { label: "Status", data: { name: "Active" }, size: "50%" }
    });
  });

  it("can mount and check is object with name", () => {
    const text = wrapper.get(".data");
    expect(text.text()).toBe("Active");
    const label = wrapper.get(".label");
    expect(label.text()).toBe("Status:");
  });

  it("can check isObjectWithname ___ true", () => {
    expect(ObjectNameWithLabel.computed.isObjectWithName.call({data: {"name":"Active","@id":"http://endhealth.info/im#Active"}})).toBe(true);
  });

  it("can check isObjectWithname ___ false no name", () => {
    expect(ObjectNameWithLabel.computed.isObjectWithName.call({data: {"statusname":"Active","@id":"http://endhealth.info/im#Active"}})).toBe(false);
  });

  it("can check isObjectWithname ___ false no data", () => {
    expect(ObjectNameWithLabel.computed.isObjectWithName.call({data: undefined})).toBe(false);
  });

  it("can check isObjectWithname ___ false no Object", () => {
    expect(ObjectNameWithLabel.computed.isObjectWithName.call({data: []})).toBe(false);
  });
});
