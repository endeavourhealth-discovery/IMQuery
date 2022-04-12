<template>
  <div class="flex flex-col space-y-3 overflow-y-auto">
    <div
      v-for="result in results"
      :key="result.iri"
      class="non-selectable group rounded-md transition duration-500 ease-in-out appearance-none relative block px-4 py-3 bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-400 placeholder-gray-400 rounded-md focus:outline-none focus:z-10 hover:shadow-md"
    >
      <!-- <div>
        <div class="text-lg  flex row-col items-center">
          <div class="inline text-black">
            {{ urlDomain(result.url) + "/" }}
          </div>
          <div class="inline text-gray-500">
            {{ urlParams(result.url) }}
          </div>
        </div>
      </div> -->
      <div class="text-3xl text-blue-600 group-hover:text-blue-800 font-normal">
        {{ result.name}}
      </div>
      <div class="text-2xl text-gray-900 mt-2">
         {{ result.scheme.name}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";

export default defineComponent({
  name: "SearchResults",
  //components: {HeroIcon},
  props: ["results", "searchstring"],
  data() {
    return {
      exampleResults: [
        {
          url: "https://im.endeavourhealth.net/#/search?q=comborbidities+associated+with+diabetes+in+east+london",
          title: "Create Dataset",
          description: "Extract data from health records",
          module: "data",
          icon: {
            id: "tables",
            collection: "hero"
          }
        },
        {
          url: "https://im.endeavourhealth.net/#/search?q=comborbidities+associated+with+diabetes",
          title: "Browse Organisations",
          description: "View organisations on a map and add them to lists to source data",
          module: "data",
          icon: {
            id: "tables",
            collection: "hero"
          }
        },
        {
          url: "https://im.endeavourhealth.net/#/search?q=comborbidities+associated+with+diabetes",
          title: "View Disease Profile",
          description: "Find conditions, symptoms, observations and other health record entries associated with diabetes",
          module: "data",
          icon: {
            id: "tables",
            collection: "hero"
          }
        }
      ]
    };
  },
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
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}
</style>
