<template>
    <div class="group p-0.5 rounded-lg flex bg-gray-100 hover:bg-gray-200">
    <button
      x-ref="preview"
      type="button"
      class="flex focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-md focus:outline-none focus-visible:ring-offset-gray-100"
    >
      <span
        x-show="false"
        class="p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium bg-white shadow-sm ring-1 ring-black ring-opacity-5"
        style="display: none;"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          fill="none"
          class="lg:mr-2 text-teal-500"
        >
          <path
            d="M17.25 10c0 1-1.75 6.25-7.25 6.25S2.75 11 2.75 10 4.5 3.75 10 3.75 17.25 9 17.25 10z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <circle
            cx="10"
            cy="10"
            r="2.25"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></circle>
        </svg>
        <span class="text-gray-900 sr-only lg:not-sr-only">Preview</span>
      </span>
      <span
        x-show="true"
        class="p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium bg-white shadow-sm ring-1 ring-black ring-opacity-5"
        :class="
          activeTab === 'preview'
            ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5'
            : ''
        "
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          fill="none"
          class="lg:mr-2 text-teal-500"
          :class="
            activeTab === 'preview'
              ? 'text-teal-500'
              : 'text-gray-500 group-hover:text-gray-900'
          "
        >
          <path
            d="M17.25 10c0 1-1.75 6.25-7.25 6.25S2.75 11 2.75 10 4.5 3.75 10 3.75 17.25 9 17.25 10z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <circle
            cx="10"
            cy="10"
            r="2.25"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></circle>
        </svg>
        <span
          class="sr-only lg:not-sr-only text-gray-900"
          :class="
            activeTab === 'preview'
              ? 'text-gray-900'
              : 'text-gray-600 group-hover:text-gray-900'
          "
          >Preview</span
        >
      </span>
    </button>
    <button
      x-ref="code"
      type="button"
      class="ml-0.5 p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm text-gray-600 font-medium focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-offset-gray-100"
    >
      <HeroIcon class="text-gray-500 mr-2" strokewidth="2" width="16" height="16" icon="database" />
      <span
        class="sr-only lg:not-sr-only text-gray-600 group-hover:text-gray-900"
        :class="
          activeTab === 'code'
            ? 'text-gray-900'
            : 'text-gray-600 group-hover:text-gray-900'
        "
        >Code</span
      >
    </button>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "HorizontalNavButtons",
  props: ["prop"],
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
