<template>
  <div class="flex flex-col">
    <TransitionRoot
      appear
      :show="isShown"
      as="div"
      enter="transform transition duration-[500ms]"
      enter-from="opacity-0 -translate-y-5 scale-50"
      enter-to="opacity-100  translate-y-0 scale-100"
      leave="transform duration-[500ms] transition ease-in-out"
      leave-from="opacity-100 rotate-0 scale-100"
      leave-to="opacity-0 scale-50 "
    >
      <div
        v-for="result in results"
        :key="result.iri"
        class="result cursor-pointer relative z-20 hover:scale-105  my-4 group rounded-md transition duration-300 ease-in-out appearance-none  px-4 py-3 bg-white border border-transparent border-gray-200 hover:border-gray-300 hover:shadow-md focus:border-gray-400 placeholder-gray-400 rounded-md focus:outline-none dark:  dark:bg-gradient-to-r dark:border-transparent dark:from-blue-700 dark:to-sky-600 "
        @click="handleView(result.iri)"
      >
        <div class="result-content">
          <div class="text-lg  flex row-col items-center">
            <div class="inline text-black dark:text-gray-400">
              https://im.endhealth.co.uk/query/#/
            </div>
            <div class="inline text-gray-500 dark:text-gray-300">
              {{ encodeURIComponent(result.iri) }}
            </div>
          </div>
          <div class="text-3xl text-blue-600 dark:text-white  font-semibold">
            {{ result.name }}
          </div>
          <!-- <div class="text-xl text-gray-900 dark:text-gray-200 mt-2 flex">
            <div>
              {{ result.scheme.name }}
            </div>
          </div> -->
          <div class="badges flex space-x-3 mt-4">
            <div
              v-for="item in TTIriRefs(result)"
              class="px-2 py-1  inline-flex  text-xl text-gray-900 dark:text-gray-200 border rounded-full border-2 border-gray-200 dar:border-white hover:bg-gray-100 dark:hover:bg-blue-900"
            >
              <template v-if="item.TTIriRefs?.name || item.TTIriRefs[0].name">
                <div class="inline-flex">
                  {{ item.TTIriRefs?.name ? item.TTIriRefs?.name : item.TTIriRefs[0].name }}
                </div>
                <div v-if="item?.TTIriRefs?.length && item?.TTIriRefs?.length > 1" class="inline-flex px-2 mx-2 border rounded-full font-bold">
                  {{ item?.TTIriRefs?.length + " +" }}
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="result-actions rounded-md flex justify-end select-none space-x-5 mr-4">
          <div
            class="invisible group-hover:visible inline-flex items-center text-2xl hover:underline font-semibold text-blue-600 dark:text-white"
            @click="handleView(result.iri)"
          >
            <HeroIcon class="mx-2" strokewidth="2" width="20" height="24" icon="eye" /> View
          </div>
          <div
            class="invisible group-hover:visible inline-flex items-center text-2xl hover:underline font-semibold text-green-600 dark:text-white"
            @click="handleEdit(result.iri)"
          >
            <HeroIcon class="mx-2" strokewidth="2" width="20" height="24" icon="pencil" /> Edit
          </div>
          <div class="invisible group-hover:visible inline-flex items-center text-2xl hover:underline font-semibold text-purple-700 dark:text-white hidden">
            <HeroIcon class="mx-2" strokewidth="2" width="20" height="24" icon="download" /> Download
          </div>
        </div>
      </div>
    </TransitionRoot>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";
import { TransitionRoot } from "@headlessui/vue";
import { _ } from "lodash";

export default defineComponent({
  name: "SearchResults",
  components: { TransitionRoot, HeroIcon },
  emits: ["openItem"],
  props: ["results", "searchstring", "isShown"],
  data() {
    return {
      debounce: 0,
      // exampleResults: [
      //   {
      //     url: "https://im.endeavourhealth.net/#/search?q=comborbidities+associated+with+diabetes+in+east+london",
      //     title: "Create Dataset",
      //     description: "Extract data from health records",
      //     module: "data",
      //     icon: {
      //       id: "tables",
      //       collection: "hero"
      //     }
      //   },
      //   {
      //     url: "https://im.endeavourhealth.net/#/search?q=comborbidities+associated+with+diabetes",
      //     title: "Browse Organisations",
      //     description: "View organisations on a map and add them to lists to source data",
      //     module: "data",
      //     icon: {
      //       id: "tables",
      //       collection: "hero"
      //     }
      //   },
      //   {
      //     url: "https://im.endeavourhealth.net/#/search?q=comborbidities+associated+with+diabetes",
      //     title: "View Disease Profile",
      //     description: "Find conditions, symptoms, observations and other health record entries associated with diabetes",
      //     module: "data",
      //     icon: {
      //       id: "tables",
      //       collection: "hero"
      //     }
      //   }
      // ]
    };
  },
  methods: {
    TTIriRefs(result: any): any {
      const TTIriRefJSONPaths = [
        { text: "Entity Type", jsonPath: "entityType" },
        { text: "Scheme", jsonPath: "scheme" },
        { text: "Status", jsonPath: "status" }
      ];
      const TTIriRefs = TTIriRefJSONPaths.map((path: any) => {
        const iriRefs = _.get(result, path.jsonPath);
        return {
          ...path,
          TTIriRefs: iriRefs
        };
      });
      return TTIriRefs;
    },
    handleView(iri: string) {
      //debouncing necessary to avoid loading items twice
      this.$store.commit("updateIsLoading", true);
      clearTimeout(this.debounce);
      this.debounce = window.setTimeout(() => {
        this.$store.commit("loadFile", iri);
      }, 500);
    },
    handleEdit(iri: string) {
      alert("Coming soon. Stay tuned!");
    }
  }
  // methods: {
  //   urlDomain(url: string): string {
  //     return url
  //       .split("/")
  //       .slice(0, 3)
  //       .join("/");
  //   },
  //   urlParams(url: string): string {
  //     return url
  //       .split("/")
  //       .slice(4, 100)
  //       .join(" > ");
  //   }
  // }
});
</script>

<style scoped>
.result-actions {
  /* display: none; */
  height: 0px;
  transition: height 0.2s ease-out;
}
.result:hover .result-actions {
  /* display: flex; */
  height: 20px;
}
</style>
