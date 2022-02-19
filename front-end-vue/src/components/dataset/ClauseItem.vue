<template>
  <!-- Any object that is not preceded by an operator should be ignored -->
  <template v-if="hasOperator(clause)">
    <!-- Iterate over the children in the array of the oeprator -->

    <template v-for="(item, index) in currentClause" :key="item.temp_id">
      <div
        :class="
          'clause-item block w-full flex hover:bg-white' +
            [index == currentClause.length - 1 ? ' mb-4' : '']
        "
      >
        <!-- Opera tor -->
        <div class="clause-item__operator">
          <!--  Operator (first item invisible unless it's an OR)  -->
          <!-- <div
            v-if="index == 0 && getOperatorIri(clause).split(':')[1] == 'or'"
            class="inline-block w-full text-indigo-700 font-semibold hover:text-blue-600  hover:underline"
          >
            either
          </div>
          <div
            v-if="index == 0 "
            class="inline-block w-full invisible"
          >
            
          </div> -->
          <div
            v-if="index == 0"
            :class="
              'inline-block w-full text-indigo-700 font-semibold hover:text-blue-600  hover:underline' +
                [
                  isIncluded
                    ? ` text-${colors.include}-700`
                    : ` text-${colors.exclude}-700`,
                ]
            "
          >
            Include
          </div>

          <!--  Operator (all other items are visible ) -->
          <div
            v-else-if="index > 0"
            :class="
              'inline-block w-full font-semibold hover:text-blue-600 hover:underline' +
                [
                  getOperatorIri(clause).split(':')[1] == 'and'
                    ? ` text-${colors.and}-700`
                    : ` text-${colors.or}-700`,
                ]
            "
          >
            {{ getOperatorLabel(clause) }}
          </div>
        </div>
        <!-- / Operator -->

        <!-- Ring + Line  -->
        <div class="inline-flex flex-col">
          <!-- ring  -->
          <div
            :class="
              'inline border border-transparent' +
                [
                  getOperatorIri(clause).split(':')[1] == 'and'
                    ? ` circle b-2 border-${colors.and}-700`
                    : ` circle b-2 border-${colors.or}-700`,
                ]
            "
          ></div>
          <!-- / ring  -->

          <!-- Line -->
          <div
            v-if="index != currentClause.length - 1"
            :class="
              'inline border-r border-r-transparent' +
                [
                  getOperatorIri(clause).split(':')[1] == 'and'
                    ? ` line b-2 border-r-${colors.and}-700`
                    : ` line border-dotted b-2 border-r-${colors.or}-700`,
                ]
            "
          ></div>
          <!-- / Line -->
        </div>
        <!-- /Ring + Line  -->

        <!-- Display Label  -->
        <div
          v-if="item['rdfs:label']"
          :class="
            'clause-item__label w-full outline-none pr-2 font-semibold bg-transparent inline-flex w-full border border-transparent b-2 rounded-md text-black' +
              [
                queryBuilder.activePath == getPathToClause(index)
                  ? ' selected'
                  : '',
              ]
          "
          @click="queryBuilder.activePath = getPathToClause(index)"
        >
          {{ item["rdfs:label"] }}
        </div>
        <!-- </div> -->
        <!-- <div
          v-show="
            item['rdfs:label'] &&
              queryBuilder.activePath == getPathToClause(index)
          "
          class="clause-item_arrow flex flex-col items-center justify-center rounded-sm"
        >
          <HeroIcon
            class="inline text-blue-500"
            icon="chevron_right"
            strokewidth="2"
            width="20"
            height="20"
          />
        </div> -->

        <!-- If there's no label   -->
        <div
          v-if="!item['rdfs:label']"
          v-show="!collapsedItems.includes(item.temp_id)"
          class="inline-block w-full flex flex-col"
        >
          <ClauseItem
            :propertyPath="getPathToClause(index)"
            :clause="item"
            :operatorIris="['im:and', 'im:or', 'im:not']"
          />
        </div>
      </div>
    </template>
  </template>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

// import Constraint from "@/components/dataset/Constraint.vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "ClauseItem",
  props: [
    "propertyPath",
    "modelValue",
    "operatorIris",
    "definitionIri",
    "clause",
    "operator",
    "nestingCount",
    "isHover",
  ],
  emits: ["update:modelValue"],
  components: {
    // SectionToggler,
    // HeroIcon,
  },
  data() {
    return {
      colors: {
        and: "purple",
        or: "purple",
        include: "purple",
        exclude: "red",
      },
      collapsedItems: [] as any[],
      componentState: "default", // Options #"default", #"hover", #"focus", #"",
      // isHover: false,
      activeClause: "",
      isLoading: false,
    };
  },
  methods: {
    updateLabel(value: string): void {
      this.queryBuilder.activeClause["rdfs:label"] = value;
    },
    isIncluded(): boolean {
      return true;
    },
    toggleTableSection(item: number): void {
      if (this.collapsedItems.includes(item)) {
        this.collapsedItems = this.collapsedItems.filter(function(value: any) {
          return value !== item;
        });
      } else {
        this.collapsedItems = [...this.collapsedItems, item];
      }
    },
    withTempUUID(items: any[]): any[] | any {
      // console.log("items", items);
      if (items) {
        return items.map((item: any) => {
          return { temp_id: "urn:uuid:" + v4(), ...item };
        });
      }
    },
    hasOperator(item: any): boolean {
      // console.log("item", item);
      return this.operatorIris.some((operatorIri: any) => {
        return item[operatorIri];
      });
    },
    getOperatorIri(clause: any): any {
      // console.log("item", item);
      const _keys = Object.keys(clause);
      return _keys.filter((key: any) => {
        return this.operatorIris.includes(key);
      })[0];
    },
    getOperatorLabel(clause: any): any {
      // console.log("item", item);
      const _keys = Object.keys(clause);
      const _iri = _keys.filter((key: any) => {
        return this.operatorIris.includes(key);
      })[0];
      const _label = _iri.split(":")[1];
      return _label[0].toUpperCase() + _label.substring(1);
    },
    test(val: any): void {
      alert(val);
    },
    getPathToClause(index: number): any {
      const _path = `${this.propertyPath}.${this.getOperatorIri(
        this.clause
      )}[${index}]`;
      console.log(_path);
      console.log("cative", this.queryBuilder.activeClause);
      return _path;
    },
  },
  computed: {
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
    currentClause: {
      get(): any {
        return this.withTempUUID(this.clause[this.getOperatorIri(this.clause)]);
      },
      set(value: any): void {
        return;
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

.clause-item,
.clause-item__operator,
.clause-item__label {
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.clause-item__label {
  /* max-width: 500px; */
  /* width: 100%; */
  width: 300px;
  min-height: 20px;
  position: relative;
  /* border: 1px solid transparent; */

  z-index: 0;
  top: -7px;
  margin: 3px;
  padding: 6px 4px 6px 8px;
}

.definition-editor .hover .clause-item__label {
  background-color: #fff;
  border-color: #d1d5db;
  /* box-shadow: 0 1px 0 #091e4240; */
  /* cursor: pointer; */
  /* display: block; */
  /* margin-bottom: 8px; */

  /* text-decoration: none; */
}
.definition-editor .hover .clause-item__label:hover {
  /* border-color: #d1d5db; */
  border: 1px solid #0d89ec;
  background-color: #edf7ff;
  color: #0d89ec;
}

.definition-editor .clause-item__label.selected {
  background-color: #edf7ff;
  /* color: #0d89ec; */
  border: 1px solid #0d89ec;
  /* box-shadow: rgb(207 210 218) 0px 0px 6px; */
}

/* 
.clause-item__toggler {
  width: 20px;
  height: 20px;
  margin-right: 5px;
} */

.clause-item__operator {
  /* min-width: 55px; */
  min-width: 60px;
  margin-left: 13px;

  /* padding-right: 10px; */
}

.clause-item_arrow {
  margin-top: 4px;
  min-width: 20px;
  width: 20px;
}

.clause-item:hover {
  /* background-color: #ebeff3; */
}

.definition-editor .hover .circle,
.definition-editor .hover .line {
  visibility: visible;
}

.circle {
  visibility: hidden;
  /* margin: 4px; */
  /* padding: 4px; */
  /* padding-top: 5px; */
  margin: 5px 10px 5px 0px;
  min-width: 13px;
  min-height: 13px;
  /* background: white; */
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  /* border: 2px solid #caccf7; */
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.line {
  visibility: hidden;
  width: 7px;
  height: 100%;
  min-height: 10px;
  /* border-right: 2px solid #caccf7; */
}

/* .clause-item.hover .circle {
  background-color: #caccf7 !important;
  color: #caccf7 !important;
} */
</style>
