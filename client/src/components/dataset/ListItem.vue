<template>
  <div class="py-2 flex w-full">
    <!-- Title -->
    <div class="section-name inline-flex w-full px-3 text-black">
      {{ modelValue }}
    </div>
    <!-- /Title -->

    <div class="inline-flex justify-between outline-none text-gray-700">
      <div class="inline-flex mx-6">
        {{ count }}
      </div>

      <div class="inline-flex">
        <HeroIcon
          class="text-blue-500"
          icon="chevron_right"
          strokewidth="2"
          width="20"
          height="20"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
// import RoundButton from "@/components/dataset/RoundButton.vue";
import Utils from "@/helpers/Utils";

// import RichTag from "@/components/dataset/RichTag.vue";

export default defineComponent({
  name: "ListItem",
  components: {
    HeroIcon,
    // RoundButton,
  },
  props: ["modelValue", "content", "count"],
  emits: ["update:modelValue", "update:content"],
  data() {
    return {
      snippetType: "any",
      componentState: "focus",
      expanded: true,
    };
  },
  methods: {
    getTitlePlaceholder(): string {
      switch (this.snippetType) {
        case "Include":
          return "";
        default:
          return "Type to create or search snippets e.g. 'Patients currently registered at a GP practice.'";
      }
    },
    getContentPlaceholder(): string {
      switch (this.snippetType) {
        case "Include":
          return "";
        default:
          return "Or describe your data using Progressive Query Language e.g. 'Include patients if latest registration status is registered.'";
      }
    },
    getTokens(): any {
      return Utils.tokeniseStatement(this.content);
    },
  },
  // comonents: {
  //   RichTag,
  // },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.section-name {
  font-size: 14px !important;
  font-weight: 500;
}

</style>
