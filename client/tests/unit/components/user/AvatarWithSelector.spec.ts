import { shallowMount } from "@vue/test-utils";
import AvatarWithSelector from "@/components/user/AvatarWithSelector.vue";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";
import OverlayPanel from "primevue/overlaypanel";

describe("AvatarWithSelector.vue", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallowMount(AvatarWithSelector, {
      props: { selectedAvatar: { value: "colour/002-man.png" } },
      global: {
        components: { Button, SelectButton, OverlayPanel }
      }
    });
  });

  it("starts with prop value selected", async () => {
    expect(wrapper.vm.newAvatar).toStrictEqual({ value: "colour/002-man.png" });
  });

  it("starts with a list of avatars", async () => {
    expect(wrapper.vm.avatarOptions.length).toBeGreaterThan(1);
  });

  it("returns the correct image url", async () => {
    jest.mock("@/assets/avatars/colour/013-woman.png", () => {
      return "/img/013-woman.7f32b854.png"
    })
    const url = wrapper.vm.getUrl("colour/013-woman.png");
    expect(url).toBe("/img/013-woman.7f32b854.png");
  });
})
