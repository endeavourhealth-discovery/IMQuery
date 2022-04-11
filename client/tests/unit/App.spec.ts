import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import Toast from "primevue/toast";

describe("App.vue", () => {
  let wrapper: any;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      state: {historyCount: 1},
      commit: jest.fn()
    }
    wrapper = shallowMount(App, {
      global: {
        components: { Toast },
        stubs: ["router-link", "router-view"],
        mocks: { $store: mockStore }
      },
    });
  });

  it("should update store history count on mount", () => {
    expect(mockStore.commit).toBeCalledTimes(1);
  })
});
