<template>
  <div
    class="mt-1 relative"
    @mouseenter="
      componentState == 'focus'
        ? (componentState = 'focus')
        : (componentState = 'hover')
    "
    @mouseleave="
      componentState == 'focus'
        ? (componentState = 'focus')
        : (componentState = 'default')
    "
  >
    <label
      v-show="componentState == 'focus' || componentState == 'hover'"
      class="widget-label inline text-sm font-medium text-gray-600 mb-4
        "
    >
      Select a step, query or data service.
    </label>
    <button
      type="button"
      :class="
        'widget-button relative w-full bg-white rounded-md px-3 pb-2 text-left border border-transparent cursor-default outline-none sm:text-sm' +
          [componentState == 'hover' ? ' hover shadow-sm' : ''] +
          [componentState == 'focus' ? ' focus' : '']
      "
      @focus="componentState = 'focus'"
      @blur="
        autocompleteHover
          ? (componentState = 'focus')
          : (componentState = 'default')
      "
    >
      <div class="flex items-center justify between">
        <span class="flex items-center">
          <HeroIcon
            :class="
              'widget-icon text-white ' +
                [target.iri == 'im:DDS' ? 'bg-green-600' : 'bg-indigo-600']
            "
            :icon="[target.iri == 'im:DDS' ? 'cloud' : 'puzzle']"
            strokewidth="2"
            width="20"
            height="20"
          />

          <div class="widget-title ml-4 block truncate text-black font-medium">
            {{ target.name }}
          </div>
        </span>
        <HeroIcon
          v-show="componentState == 'focus' || componentState == 'hover'"
          class="widget-icon text-gray- ml-3"
          icon="selector"
          strokewidth="2"
          width="20"
          height="20"
        />
      </div>
    </button>

    <!-- Autocomplete  -->
    <ul
      v-show="componentState == 'focus'"
      class="autocomplete absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
      role="listbox"
    >
      <!-- One Item   -->
      <li
        class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
        role="option"
      >
        <div class="flex items-center">
          <HeroIcon
            :class="
              'widget-icon text-white ' +
                [target.iri == 'im:DDS' ? 'bg-green-600' : 'bg-indigo-600']
            "
            :icon="[target.iri == 'im:DDS' ? 'database' : 'puzzle']"
            strokewidth="2"
            width="20"
            height="20"
          />

          <div
            class="widget-title ml-4 block truncate text-black font-medium rounded-t-md"
          >
            Current Hospital Inpatients
          </div>
        </div>

        <span
          class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4"
        >
          <!-- Heroicon name: solid/check -->
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </li>
      <!-- / One Item   -->

      <!-- More items... -->
    </ul>

    <!--/  Autocomplete  -->
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
// import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "EntityWidget",
  props: ["target"],
  components: {
    HeroIcon,
  },
  data() {
    return {
      componentState: "default", // Options #"default", #"hover", #"focus", #""
    };
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

.widget-buton {
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 0 0 5px 5px;
}

.widget-button.focus,
.widget-button.hover {
  border-left: 1px solid rgb(207, 210, 218);
  border-right: 1px solid rgb(207, 210, 218);
  border-bottom: 1px solid rgb(207, 210, 218);
  border-radius: 0 0 5px 5px;
}

.widget-label {
  position: absolute;
  background: #fff;
  margin-top: -18px;
  width: calc(100%);
  z-index: 989;
  cursor: default;
  border-radius: 5px 5px 0 0;
  border-top: 1px solid rgb(207, 210, 218);
  border-left: 1px solid rgb(207, 210, 218);
  border-right: 1px solid rgb(207, 210, 218);
  padding-left: 10px;
}

.widget:hover {
  /* border: 1px solid #d1d5db; */
  background: white; /* #f9fafb;*/
}


.widget-title {
  font-size: 14px !important;
  font-weight: 500;
}

.widget-icon {
  width: 26px;
  padding: 4px;
  height: auto;
  margin-top: 2px;
  border-radius: 50%;
}

.autocomplete {
  border: 1px solid rgb(207, 210, 218);
    border-color: rgb(207, 210, 218);
  box-shadow: rgb(207, 210, 218) 0px 2px 6px;
}
</style>
