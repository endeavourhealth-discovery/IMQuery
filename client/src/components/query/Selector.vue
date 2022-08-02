<template>
  <!-- Inserted Component  -->
  <div :class="'selector'" @click="onToggle">
    <slot> </slot>
  </div>
  <!-- Inserted Component  -->

  <OverlayPanel ref="overlay-selector" @show="onShow()" @hide="onHide()">
    <!-- datatype property  -->
    <template v-if="propertyMeta['sh:datatype']">
      <div class="group transitiion duration-500 ease-in-out flex items-center max-h-40px">
        <!-- comparison  -->
        <div class="selector-dropdown  text-gray-500 font-bold text-lg mb-4 flex-col">
          <div class="invisible group-hover:visible">Comparison</div>
          <Dropdown
            ref="toggler"
            class=" max-h-[40px] "
            v-model="comparison"
            :options="getOptions('value', 'value.comparison')"
            optionLabel="name"
            placeholder="Select an option"
          />
        </div>
        <!-- comparison  -->

        <!-- valueData  -->
        <div class="ml-8 text-gray-500 font-bold text-lg mb-4 flex-col">
          <div class="invisible group-hover:visible">Value</div>
          <input
            class=" outline-none text-2xl font-semibold text-gray-900 border-b-2 border-b-slate-400 min-h-[30px] focus:border-sky-400 p-1 max-w-[125px]"
            :type="getInputType()"
            v-model="valueData"
            placeholder="Enter a value"
          />
        </div>
        <!-- valueData  -->
      </div>
    </template>
    <!-- data type property  -->

    <!-- concept set or concept  -->
    <template v-else-if="propertyMeta['sh:class']">
      Set or Concept
    </template>
    <!-- concept set or concept  -->
  </OverlayPanel>
</template>

<script lang="ts">
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { defineComponent } from "vue";
import _ from "lodash";
import QueryUtils from "@/helpers/QueryUtils";
import * as pathMap from "@/models/text/Config/PathMap.json";

export default defineComponent({
  name: "Selector",
  props: ["type", "modelValue", "updateTarget"],
  methods: {
    onShow(): any {
      this.isShown = true;
      //creates local copies
      this.propertPath = _.cloneDeep(this.activePropertyPath);
      this.activePropertyData = _.cloneDeep(this.activeProperty);
      console.log("active property", this.activePropertyData)
    },
    onHide(): any {
      this.isShown = false;
      this.updateQuery();
    },
    getInputType() {
      const isNumber = ["xsd:integer", "xsd:decimal", "xsd:double"].includes(this.dataTypeId);
      const isDate = ["im:DateTime"].includes(this.dataTypeId);
      const isText = ["xsd:string"].includes(this.dataTypeId);

      if (isNumber) return "number";
      if (isDate) return "date";
      if (isText) return "text";
    },
    onToggle(event: any): void {
      this.commitTarget(...this.updateTarget);
      try {
        (this.$refs["overlay-selector"] as any)?.toggle(event); //show();
      } catch (error) {
        console.log("error", error);
      }
    },
    commitTarget(targetType: string, targetAction: string, propertyPath: string) {
      const payload = {
        propertyPath: propertyPath,
        targetType: targetType,
        targetAction: targetAction
      };
      this.$store.commit("updateTarget", payload);
    },
    setValue(): void {},
    onClick(event: any): void {},
    getOptions(type: string, path: string): any {
      return this.options[type].find(option => option.path == path).options;
    },
    updateQuery(): void {
      if (this.hasUpdated) {
        console.log("updateQuery", this.activePropertyData);
        this.$store.commit("updateActiveProperty", { action: "update", propertyPath: this.propertPath, data: this.activePropertyData });
      }
    },
    updated(): void {
      if (this.isShown) {
        this.hasUpdated = true;
      }
    },
    get(path: string): any {
      // console.log("get", path);
      console.log("get", this.activePropertyData);
      const val = _.get(this.activePropertyData, path);
      // console.log("get", val);
      return val;
    },
    set(path: string, value: any): void {
      // console.log("set", path, value);
      _.set(this.activePropertyData, path, value);
    }
  },
  mounted() {
    // this.setValue();
  },
  data() {
    return {
      propertyPath: "",
      isShown: false,
      hasUpdated: false,
      activePropertyData: {},
      _comparison: {
        name: "less than or equal to",
        value: "LESS_THAN_OR_EQUAL"
      },
      _valueData: null,
      options: {
        value: [
          {
            path: "value.comparison",
            type: "enum",
            options: [
              {
                name: "greater than or equal to",
                value: "GREATER_THAN_OR_EQUAL"
              },
              {
                name: "less than or equal to",
                value: "LESS_THAN_OR_EQUAL"
              },
              {
                name: "greater than",
                value: "GREATER_THAN"
              },
              {
                name: "less than",
                value: "LESS_THAN"
              }
            ]
          },
          {
            path: "value.valueData",
            type: "number",
            meta: {
              min: 1,
              max: 10000
            }
          }
        ]
      }
    };
  },
  computed: {
    activeClausePath: {
      get(): any {
        return this.$store.state.activeClausePath;
      },
      set(val: any): void {}
    },
    activePropertyPath: {
      get(): any {
        return this.$store.state.activePropertyPath;
      },
      set(val: any): void {}
    },
    targetType: {
      get(): any {
        return this.$store.state.targetType;
      },
      set(val: any): void {}
    },
    target: {
      get(): boolean {
        return this.targetType.includes("-") ? this.targetType.split("-")[1] : "none";
      },
      set(val: boolean): void {}
    },
    activeQuery: {
      get(): any {
        return this.$store.state.queryBuilder.dataSet.get(this.$store.state.activeQueryId);
      },
      set(val: any): void {}
    },
    activeClause: {
      get(): any {
        const clause = _.get(this.activeQuery, this.activeClausePath);
        // console.log("clause selected", clause);
        return clause;
      },
      set(val: any): void {}
    },
    activeProperty: {
      get(): any {
        const prop = _.get(this.activeQuery, this.activeClausePath + "." + this.activePropertyPath);
        // console.log("property selected", prop);
        return prop;
      },
      set(val: any): void {}
    },
    propertyMeta: {
      get(): any {
        // return "";
        const entityIri = QueryUtils.toIri(this.activeClause?.entityType["@id"]);
        const propertyIri = QueryUtils.toIri(this.activeProperty["@id"]);
        const propertyMeta = this.$store.state.datamodelGraph.getPropertyMeta(propertyIri, entityIri);
        // console.log("propertyMeta", _.cloneDeep(propertyMeta));
        return propertyMeta;
      },
      set(val: any): void {}
    },
    dataTypeId: {
      get(): any {
        return _.get(this.propertyMeta, "sh:datatype[0].@id");
      },
      set(val: any): void {}
    },
    comparison: {
      get(): any {
        const comparisonOptions = this.getOptions("value", "value.comparison");
        const comparison = this.get(pathMap.comparison);
        this._comparison = comparisonOptions.find(c => c.value == comparison);
        // console.log("get comparison");
        // // console.log("comparison", comparison);
        return this._comparison;
      },
      set(val: any): void {
        // console.log("set comparison");
        this._comparison = val;
        this.updated();
        this.set(pathMap.comparison, val.value);
      }
    },
    valueData: {
      get(): any {
        this._valueData = this.get(pathMap.valueData);
        return this._valueData;
      },
      set(val: any): void {
        // console.log("set valueData");
        this._valueData = val;
        this.updated();
        this.set(pathMap.valueData, val);
      }
    }
  }
});
</script>

<style>
/* .selector-dropdown .p-dropdown.p-focus {
  border-color: #2196f3 !important;
} */
</style>

<style>
.selector-dropdown .p-dropdown-label.p-inputtext {
  font-size: 14px !important;
  font-weight: 500 !important;
  /* color: #374151; */
  color: #000;
}
.selector-dropdown .p-dropdown-trigger {
  /* display: none !important; */
  /* visibility: hidden !important; */
}
.selector-dropdown:hover .p-dropdown-trigger {
  /* display: block !important; */
  /* visibility: visible !important; */
}

.selector-dropdown .p-dropdown.p-focus {
  border-color: black !important;
}

.selector-dropdown .p-dropdown {
  border: none;
  /* border-radius: 0; */
  /* border-bottom: 3px solid #ced4da !important; */
  /* border-bottom: 2px solid #94a3b8 !important; */
}
</style>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
