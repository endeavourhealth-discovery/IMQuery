<template>
  <div
    class="widget mt-1 relative non-selectable "
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
  
    <button
      type="button"
      :class="
        'widget-button relative bg-white rounded-md pl-3 pr-2 pb-2 text-left border border-transparent cursor-default outline-none sm:text-sm' +
          [isHover ? ' hover shadow-sm' : ''] +
          [componentState == 'focus' ? ' focus shadow-sm' : ''] +
          [componentState == 'typing' ? ' typing shadow-sm' : '']
      "
      @click="
        componentState == 'focus'
          ? (componentState = 'default')
          : (componentState = 'focus')
      "
      @blur="isHover ? null : (componentState = 'default')"
    >
      <div class="button-content flex items-center justify between">
        <span class="flex items-center">
          <HeroIcon
            :class="
              'widget-icon text-white ' + getIconMeta(modelValue.iri).class
            "
            :icon="getIconMeta(modelValue.iri).icon"
            strokewidth="2"
            width="20"
            height="20"
          />

          <div class="widget-title ml-4 block truncate text-black font-medium">
            <template v-if="type == 'query'">
              {{ modelValue.name }}
            </template>

            <template v-else-if="type == 'datamodel'">
              {{ modelValue.name.replace("(record type)", "") }}
            </template>
          </div>
        </span>
        <HeroIcon
          v-show="
            componentState == 'focus' || componentState == 'typing' || isHover
          "
          class="widget-icon text-gray- ml-2"
          icon="selector"
          strokewidth="2"
          width="20"
          height="20"
        />
      </div>
    </button>

    <!-- Autocomplete  -->
    <div
      v-show="componentState == 'focus' || componentState == 'typing'"
      class="autocomplete absolute z-10 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <label
      v-show="
        componentState == 'focus' || componentState == 'typing' || isHover
      "
      class="inline text-sm font-medium text-gray-600 mb-4 py-1"
    >
      {{ getPrompt() }}
    </label>
      <div class="relative searchbox flex w-full overflow-none py-2">
        <HeroIcon
          class="widget-icon text-gray- ml-3"
          icon="search"
          strokewidth="2"
          width="20"
          height="20"
        />
        <input
          type="text"
          class="search-input outline-none ml-4"
          placeholder="Type to search"
          @blur="isHover ? null : (componentState = 'default')"
          @focus="componentState = 'typing'"
        />
      </div>

      <ul class="relative mt-1 w-full  text-base  sm:text-sm" role="listbox">
        <!-- One Item   -->
        <li
          v-for="entity in filteredEntities()"
          :key="entity.iri"
          class="relative ext-gray-900 cursor-default select-none relative py-2 pl-3 pr-12 hover:bg-gray-100"
          role="option"
          @click="updateEntity(entity)"
        >
          <div class="flex items-center">
            <HeroIcon
              :class="'widget-icon text-white ' + getIconMeta(entity.iri).class"
              :icon="getIconMeta(entity.iri).icon"
              strokewidth="2"
              width="20"
              height="20"
            />

            <div
              class="widget-title ml-4 block truncate text-black font-medium rounded-t-md"
            >
              <template v-if="type == 'query'">
                {{ entity.name }}
              </template>

              <template v-else-if="type == 'datamodel'">
                {{ entity.summary.name.replace("(record type)", "") }}
              </template>
            </div>
          </div>

          <!-- /Checkmark not currently necessary  -->
          <span
            v-if="false"
            class="autocomplete-check text-indigo-500 absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <!-- Heroicon name: solid/check -->
            <HeroIcon
              class="text-indigo-500"
              icon="check"
              strokewidth="3"
              width="20"
              height="20"
            />
          </span>
          <!-- Checkmark not currently necessary  -->
        </li>
        <!-- / One Item   -->
      </ul>
    </div>

    <!-- More items... -->

    <!--/  Autocomplete  -->
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
// import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "Selector",
  props: ["modelValue", "type", "stepIri", "propertyPath"],
  emits: ["update:modelValue"],
  components: {
    HeroIcon,
  },
  data() {
    return {
      componentState: "default", // Options #"default", #"hover", #"focus", #""
      isHover: false,
    };
  },
  methods: {
    getPrompt(): string {
      switch (this.type) {
        case "query":
          return "Select a source, query or step:";
        case "datamodel":
          return "Select a health record type:";
        default:
          return "Select an item";
      }
    },
    getIconMeta(iri: string): any {
      if (iri == "im:DDS") {
        return { icon: "cloud", class: " text-green-600" };
      } else if (iri.split(":")[0] == "dds") {
        if (iri.split(":")[1].substring(0, 4) == "Step") {
          return { icon: "template", class: " text-indigo-600" }; //if it is a step
        } else {
          return { icon: "database", class: " text-yellow-600" }; //if it is a query
        }
      } else if (
        this.$store.state.prefetched_datamodel.some(
          (entity: any) => entity.iri == iri
        )
      ) {
        return { icon: "document_text", class: " text-red-600" }; //if datamodel entity
      } else {
        return { icon: "document_text", class: " text-gray-500" }; //if unknown entity
      }
    },
    updateEntity(entity: any): void {
      this.$store.commit("updateEntity", {
        ...entity,
        propertyPath: this.propertyPath,
      });
      this.componentState = "default";
    },

    filteredEntities(): any {
      
      let _maxHits = 5;
      if (this.type == "query") {
        let _steps = this.$store.state.openQueries.filter(
          (query: any) => query.id == this.$store.state.activeQueryId
        )[0].data.steps;
        let _queries = this.$store.state.openQueries.slice(
          0,
          this.$store.state.openQueries.length < _maxHits
            ? this.$store.state.openQueries.length - 1
            : _maxHits
        );
        let _sources = [{ iri: "im:DDS", name: "Discovery Data Service" }];
        let _dataEntities = [..._steps, ..._queries, ..._sources];

        //returns everything except for:
        // 1. currently Iri of currently selected item (modelValue)
        // 2. current step (to avoid an infinite loop)

        let _filterArray = [this.stepIri, this.modelValue.iri];

        // 3. a step referencing itself in .copy attribute of step.
        _steps.forEach((step: any) => {
          step.copy.forEach((copy: any) => {
            if (copy.iri == this.stepIri) {
              _filterArray.push(step.iri);
            }
          });
        });

        // console.log("_filterArray: ", _filterArray);

        let _filteredDataEntities = _dataEntities.filter(
          (entity: any) => !_filterArray.includes(entity.iri)
        );

        // console.log("_filteredDataEntities: ", _filteredDataEntities);

        return _filteredDataEntities;
      } else if (this.type == "datamodel") {
        return this.$store.state.prefetched_datamodel.slice(0, _maxHits);
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

.button-content {
  padding-top: 3px;
}

.widget-buton {
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 0 0 5px 5px;
}

.widget-button.focus,
.widget-button.hover,
.widget-button.typing {
  min-width: 175px;
  border-left: 1px solid rgb(207, 210, 218);
  border-right: 1px solid rgb(207, 210, 218);
  border-bottom: 1px solid rgb(207, 210, 218);
  border-radius: 0 0 5px 5px;
}

.widget-label {
  position: absolute;
  background: #fff;
  margin-top: -24px;
  width: calc(100%);
  z-index: 9;
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
  top: 45px;
  border-color: rgb(207, 210, 218);
  box-shadow: rgb(207, 210, 218) 0px 2px 6px;
}
</style>
