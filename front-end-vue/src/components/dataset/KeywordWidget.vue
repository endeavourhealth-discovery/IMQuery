<template>
  <div class="relative inline-block text-left" @click="expanded = !expanded">
    <div class="">
      <RoundButton
        class="h-10 ml-2 non-selectable hover:underline"
        :rounded="false"
        :showRing="true"
        backgroundColor="white"
        hoverBackgroundColor="white"
        borderColor="white"
        hoverBorderColor="white"
        hoverTextColor="blue-600"
        focusTextColor="blue-600"
        textColor="blue-600"
        ringColor="white"
        @blur="expanded = false"
      >
        {{ modelValue }}
      </RoundButton>
    </div>

    <div
      v-if="expanded"
      class="options origin-top-right absolute left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
    >
      <div class="" role="none">
        <template v-for="item in getItems()" :key="item">
          <a
            class="non-selectable text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            @click="expanded = false"
            >{{ item }}</a
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";

export default defineComponent({
  name: "KeywordWidget",
  props: ["modelValue"],
  components: {
    // HeroIcon,
    RoundButton,
  },
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    getItems(): any {
      const SingularInstanceModifierToken = ["latest", "any", "earliest"];

      if (
        SingularInstanceModifierToken.some(
          (token: string) => (token = this.modelValue)
        )
      ) {
        return SingularInstanceModifierToken.filter(
          (token: string) => (token != this.modelValue)
        );
      }
    },
  },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.modifier-widget {
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 800;
  height: 24px;
  border: 1px solid transparent;
  border-radius: 5px;
}

.modifier-widget:hover {
  /* background-color: #eeeeee;*/ /* light beige */
  /* border: 1px solid #ced4da; */
}

.options {
  width: 100px;
}
</style>
