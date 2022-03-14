<template>
  <div class="py-3">
    <!-- Title -->
    <div class="section-title flex w-full px-3">
      <!-- Toggler -->

      <RoundButton
        class="section-toggler non-selectable w-5 h-5"
        :rounded="true"
        :showRing="true"
        backgroundColor="white"
        hoverBackgroundColor="white"
        ringColor="blue-600"
        @click="expanded = !expanded"
      >
        <HeroIcon
          :class="expanded ? ' text-gray-400' : 'text-blue-500'"
          :icon="expanded ? 'chevron_down' : 'chevron_right'"
          strokewidth="2"
          width="20"
          height="20"
        />
      </RoundButton>

      <!-- / Toggler -->

      <!-- Input -->
      <div class="w-full inline h-7 ml-5">
        <input
          class="title-input w-full outline-none mb-5 text-black"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="getTitlePlaceholder()"
          :value="modelValue.name"
        />
      </div>
      <!-- /Input -->
    </div>
    <!-- /Title -->

    <!-- Content -->
    <div v-if="expanded" class="pt-3 px-3">
      <div class="line w-full flex">
        <!-- Error Button   -->
        <RoundButton
          v-if="error"
          class="non-selectable"
          :rounded="true"
          :showRing="true"
          backgroundColor="white"
          hoverBackgroundColor="white"
          ringColor="red-500"
          textColor="red-500"
          focusTextColor="white-500"
        >
          <HeroIcon
            class=""
            icon="exclamation_circle"
            strokewidth="2"
            width="16"
            height="16"
          />
        </RoundButton>
        <!-- / Error Button   -->
        <!-- 
        <input
          :class="
            'content-input w-full outline-none text-gray-700' +
              [error ? ' ml-5' : ' ml-10']
          "
          @input="$emit('update:content', $event.target.value)"
          :placeholder="getContentPlaceholder()"
          :value="content"
        /> -->

        <div
          :class="
            'content-input w-full flex outline-none text-gray-700' +
              [error ? ' ml-5' : ' ml-10']
          "
        >
        <!-- token  -->
          <template v-for="token in getTokens()" :key="token.id">
            <div
              :class="
                'token' 
                + [token.tokenSubType == 'primary' ? ' token-primary text-red-600' : '']
                + [token.tokenSubType == 'secondary' ? ' token-secondary text-blue-500' : '']
                + [token.tokenSubType == 'quantityModifier' ? ' token-quantityModifier text-indigo-600' : '']
                + [token.tokenSubType == 'terminator' ? ' token-terminator text-red-500' : '']
                
              "
              >{{ token.value }}</div>
            
            <span class="token token-space"></span>
          </template>
             <!-- token  -->

        </div>
      </div>
    </div>
    <!-- Content -->
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import Utils from "@/helpers/Utils";

// import RichTag from "@/components/dataset/RichTag.vue";

export default defineComponent({
  name: "Snippet",
  components: {
    HeroIcon,
    RoundButton,
  },
  props: ["modelValue", "content", "error"],
  emits: ["update:modelValue", "update:content", "updated:error"],
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

.section-toggler {
  margin-top: 5px;
}

.title-input {
  font-size: 16px !important;
  font-weight: 500;
}
.content-input {
  font-size: 12px !important;
  font-weight: 500;
}

.token {
  display: inline;
}

.token-space {
  width: 5px;
}
</style>
