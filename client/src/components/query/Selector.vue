<template>
  <!-- Inserted Component  -->
  <div :class="'selector'" @click="onToggle">
    <slot> </slot>
  </div>
  <!-- Inserted Component  -->

  <OverlayPanel ref="overlay-selector" @show="onShow()" @hide="onHide()">
    <!-- datatype property  -->
    <template v-if="propertyMeta['sh:datatype']">
      <div class="border-b ">
        <div class="selector-dropdown text-xl font-semibold text-gray-500">
          <Dropdown
            ref="toggler"
            class=" max-h-[40px] "
            v-model="inclusion"
            :options="[
              { name: 'Include', value: true },
              { name: 'Exclude', value: false }
            ]"
            optionLabel="name"
            placeholder="Select an option"
          />
          entries if
          {{ get("name") }}
        </div>
      </div>

      <div class="group transitiion duration-500 ease-in-out flex items-center max-h-40px border-b">
        <!-- comparison  -->
        <div class="text-gray-500 font-semibold text-xl flex-col #pt-[18px] ml-3 mr-1">
          is
        </div>
        <!-- comparison  -->

        <!-- comparison  -->
        <div class="selector-dropdown  text-purple-600 font-bold text-lg  flex-col">
          <!-- <div class="invisible #group-hover:visible">Comparison</div> -->
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
        <div class="ml-8 text-purple-600 font-bold text-lg flex-col">
          <!-- <div class="invisible #group-hover:visible">Value</div> -->
          <input
            class=" outline-none text-2xl font-semibold text-gray-900 border-b-2 border-b-transparent min-h-[30px] focus:border-purple-400 p-1 max-w-[125px]"
            :type="inputType"
            v-model="valueData"
            placeholder="Enter a value"
          />
        </div>
        <!-- valueData  -->
      </div>

      <div v-if="get('function')" class="border-b">
        <div class="selector-dropdown text-2xl font-semibold text-gray-400">
          <Dropdown ref="toggler" class=" max-h-[40px] mx-1" v-model="units" :options="getUnits()" optionLabel="name" placeholder="units" />
          <Dropdown
            ref="toggler"
            class=" max-h-[40px] mx-1"
            v-model="beforeAfter"
            :options="[
              { name: 'before', value: true },
              { name: 'after', value: false }
            ]"
            optionLabel="name"
            placeholder="chronology"
          />
          <Dropdown
            ref="toggler"
            class=" max-h-[40px] mx-1"
            v-model="comparisonDate"
            :options="[
              { name: 'the Reference Date', value: '$referenceDate' },
              { name: 'the Baseline Date', value: '$referenceDate' },
              { name: 'the Date of', value: '$' }
            ]"
            optionLabel="name"
            placeholder="other date"
          />
          <div @click="deleteFunction()" class="inline-flex relative text-red-700">
            <NodeIcon class="mx-2  relative top-1" strokewidth="3" width="16" height="16" icon="x" />
          </div>
        </div>
      </div>
      <!-- Functions  -->
      <div v-if="getFunctions().length > 0" class="selector-dropdown flex pt-2 border-t ">
        <div class="text-2xl font-semibold text-blue-600">
          Add
          <Dropdown
            ref="toggler"
            class=" max-h-[40px] "
            @change="functionAdded"
            v-model="currentFunction"
            :options="getFunctions()"
            optionLabel="rdfs:label"
            placeholder="Transformations"
          />
        </div>
      </div>

      <!-- Functions  -->
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
import Datamodel from "@/logic/Datamodel";
// import ButtonCRUD from "@/components/query/ButtonCRUD.vue";
import NodeIcon from "@/components/query/NodeIcon.vue";

export default defineComponent({
  name: "Selector",
  props: ["type", "modelValue", "updateTarget"],
  components: {
    NodeIcon
  },
  methods: {
    deleteFunction(): void {
      delete this.definition.function;
    },
    functionAdded(event: any): void {
      console.log("ad", event);
      // console.log(this.currentFunction ? "tr": "no")
    },
    onShow(): any {
      this.isShown = true;
      this.setValues();

      console.log("active property", this.definition);
    },
    onHide(): any {
      this.isShown = false;
      this.updateQuery();
    },
    getInputType() {
      const isNumber = ["xsd:integer", "xsd:decimal", "xsd:double"].includes(this.dataTypeId);
      const isDate = ["im:DateTime"].includes(this.dataTypeId);
      const hasFunction = this.get("function") && Object.keys(this.get("function")).length > 0;
      const isText = ["xsd:string"].includes(this.dataTypeId);
      console.log("getInputType", isNumber, isDate, hasFunction, isText);

      if (isText || hasFunction) return "text";
      if (isNumber) return "number";
      if (isDate) return "date";
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
    setValues(): void {
      this.propertPath = _.cloneDeep(this.activePropertyPath);
      this.definition = _.cloneDeep(this.activeProperty);
      // this.units = this.getUnits().filter(u => u.value == this.get(pathMap.units));

      // if (this.get("function")) {
      //   this.currentFunction = Datamodel.getFunction(this.get("function.@id"));
      // }
    },
    onClick(event: any): void {},
    getOptions(type: string, path: string): any {
      return this.options[type].find(option => option.path == path).options;
    },
    updateQuery(): void {
      if (this.hasUpdated) {
        console.log("updateQuery", this.definition);
        this.$store.commit("updateActiveProperty", { action: "update", propertyPath: this.propertPath, data: this.definition });
      }
    },
    updated(): void {
      if (this.isShown) {
        this.hasUpdated = true;
      }
    },
    get(path: string): any {
      // console.log("get", path);
      // console.log("get", this.definition);
      const val = _.get(this.definition, path);
      // console.log("get", val);
      return val;
    },
    set(path: string, value: any): void {
      // console.log("set", path, value);
      _.set(this.definition, path, value);
    },
    getFunctions(): any {
      if (this.get("function.@id")) {
        return Datamodel.functions.filter((f: any) => f["@id"] != QueryUtils.toIri(this.get("function.@id")));
      } else {
        return Datamodel.functions;
      }
    },
    getFunction(iri: string): any {
      return Datamodel.getFunction(iri);
    },
    getUnits(): any {
      return Datamodel.units;
    }
  },
  mounted() {
    // this.setValue();
  },
  data() {
    return {
      comparisonDate: { name: "the Reference Date", value: "$referenceDate" },
      // beforeAfter: { name: "before", value: true },
      inclusion: { name: "Include", value: true },
      currentFunction: {},
      propertyPath: "",
      isShown: false,
      hasUpdated: false,
      definition: {},
      _units: { name: "month", value: "MONTH" },
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
                name: "equal to",
                value: ""
              },
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
    inputType: {
      get(): any {
        if (this.isShown) {
          return this.getInputType();
        } else {
          return "text";
        }
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
    beforeAfter: {
      get(): any {
        console.log("this.get(pathMap.firstDate) ", this.get(pathMap.arg1var));
        if (this.get(pathMap.arg1var) == "$this") {
          return { name: "before", value: true };
        } else {
          return { name: "after", value: false };
        }
      },
      set(val: any): void {
        if (val.value == true) {
          this.set(pathMap.arg1var, "$this");
          this.set(pathMap.arg2var, "$referenceDate");
        } else {
          this.set(pathMap.arg1var, "$referenceDate");
          this.set(pathMap.arg2var, "$this");
        }
        this.updated();
      }
    },
    valueData: {
      get(): any {
        this._valueData = this.get(pathMap.valueData);
        console.log("get valueData", this._valueData);
        return this._valueData;
      },
      set(val: any): void {
        console.log("set valueData", val);
        this._valueData = val;
        this.updated();
        this.set(pathMap.valueData, val);
      }
    },
    units: {
      get(): any {
        console.log("this.get(pathMap.units)", this.get(pathMap.unitsData));
        const units = this.getUnits().find(u => u.value == this.get(pathMap.unitsData));
        // this._units = this.get(pathMap.units);
        console.log("units", units);
        this._units = units;
        console.log("get _units", this._units);
        return this._units;
      },
      set(val: any): void {
        // console.log("set valueData");
        this._units = val;
        this.updated();
        this.set(pathMap.unitsData, val.value);
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
