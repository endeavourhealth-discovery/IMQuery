<template>
  <div class="clause-editor relative flex flex-col px-2">
    <!-- <div class="font-semibold text-black">Label</div> -->
    <div
      class="clause-editor__label flex item-center text-black border border-gray-300 bg-gray-100 py-1 px-3 rounded-t-md"
    >
      <input
        :readonly="componentState != 'edit'"
        :class="'label__input outline-none w-full bg-transparent text-gray-900 font-semibold border border-transparent' + [componentState == 'edit' ? ' focus:border-b-blue-600 focus:border-b-2' : '' ]"
        placeholder="Unnamed Feature"
        :value="modelValue['rdfs:label']"
        @input="updateLabel($event.target.value)"
      />
      <HeroIcon
        @click="componentState = 'edit'"
        class="inline text-black mt-1"
        icon="dots_horizontal"
        strokewidth="2"
        width="20"
        height="20"
      />
    </div>
    <!-- </textarea> -->

    <div
      class="clause-editor__description text-gray-700 border border-gray-300 bg-white py-1 px-3 rounded-b-md"
    >
      {{ queryBuilder.interpolatedTemplate }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";
import InputDescription from "@/components/dataset/InputDescription.vue";
import QueryTools from "@/models/query/QueryTools";
import HeroIcon from "@/components/search/HeroIcon.vue";

// import Constraint from "@/components/dataset/Constraint.vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "ClauseEditor",
  props: ["modelValue"],
  // emits: ["update:modelValue"],
  components: {
    // InputDescription,
    HeroIcon,
  },
  mounted() {
    console.log(
      "active template",
      JSON.stringify(this.queryBuilder.activeTemplate)
    );
    console.log("clause", JSON.stringify(this.modelValue));
    QueryTools.flattenObject(this.modelValue);
  },
  data() {
    return {
      componentState: "default",
      interpolatedTemplate: "d",
      inputMeta: {
        label: {
          title: "Name",
          explanation:
            "<b>Purpose</b><br>Label your search criteria with a name",
          placeholder: "Enter a Name",
        },
      },
    };
  },
  methods: {
    test(): void {
      return;
    },
    updateLabel(value: string): void {
      this.queryBuilder.activeClause['rdfs:label'] = value;
    }
  },
  computed: {
    InterpolatedTemplate: {
      get(): any {
        return this.interpolatedTemplate;
      },
      set(value: any): void {
        this.interpolatedTemplate = value;
      },
    },
    queryBuilder: {
      get(): any {
        return this.$store.state.queryBuilder;
      },
      set({ action, payload }: any): void {
        this.$store.commit("queryBuilder", {
          action: action,
          payload: payload,
        });
      },
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

.clause-editor__label {
  border-bottom: none;
  font-size: 18px;
}
.clause-editor__description {
  /* border-bottom: none; */
  font-size: 18px;
}

.clause-editor__label::before {
  background-color: #c7c7c7;
  /* border-color: 1px solid #f3f4f6; */
  position: absolute;
  top: 11px;
  right: 100%;
  left: -2px;
  display: block;
  width: 10px;
  height: 16px;
  pointer-events: none;
  content: " ";
  -webkit-clip-path: polygon(0 50%, 100% 0, 100% 100%);
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
}


/* .label__input.border-bottom {
  border-bottom: 2px solid #2563eb;
} */
</style>
