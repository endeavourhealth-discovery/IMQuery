<template>
  <!-- Any object that is not preceded by an operator should be ignored -->
  <template v-if="hasOperator(clause)">
    <!-- Iterate over the children in the array of the oeprator -->

    <template v-for="(item, index) in currentClause" :key="item.temp_id">
      <div
        :class="'clause-item block w-full flex bg-white hover:bg-indigo-100'"
      >
        <div class="inline-flex flex-col">
          <!-- ring  -->
          <div
            :class="
              'inline circle' +
                [
                  queryBuilder.activeClause == pathToClause(index)
                    ? ' bg-black'
                    : '',
                ]
            "
          ></div>
          <!-- Line -->
          <div
            v-if="index != currentClause.length - 1"
            :class="
              'inline' +
                [
                  getOperatorIri(clause).split(':')[1] == 'or'
                    ? ' line-dotted'
                    : ' line',
                ]
            "
          ></div>
          <!-- <div class="ring-inner"></div> -->
        </div>

        <!-- Display Operator (first item invisible)  -->

        <div
          v-if="index == 0 && getOperatorIri(clause).split(':')[1] == 'or'"
          class="clause-item__operator inline text-indigo-700 font-semibold hover:text-blue-600  hover:underline"
        >
          either
        </div>
        <!-- Display Operator (the rest is visible ) -->
        <!-- <div
          v-else-if="
            index == 0 && getOperatorIri(clause).split(':')[1] == 'and'
          "
          class="clause-item__operator inline invisible"
        ></div> -->

        <div
          v-else-if="index > 0"
          class="clause-item__operator inline text-indigo-700 font-semibold hover:text-blue-600  hover:underline"
        >
          {{ getOperatorIri(clause).split(":")[1] }}
        </div>

        <!-- Display Label  -->
        <div
          @click="queryBuilder.activeClause = pathToClause(index)"
          v-if="item['rdfs:label']"
          class="clause-item__label inline-flex w-full text-black font-semibold hover:font-semibold hover:text-blue-600 hover:underline"
        >
          <div>
            {{ item["rdfs:label"] }}
          </div>
          <div
            v-if="item['rdfs:label']"
            class="clause-item_arrow flex flex-col items-center pt-1 ml-2"
          >
            <HeroIcon
              v-if="queryBuilder.activeClause == pathToClause(index)"
              class="inline text-blue-500"
              icon="chevron_right"
              strokewidth="2"
              width="20"
              height="20"
            />
          </div>
        </div>

        <!-- If there's no label   -->
        <div
          v-if="!item['rdfs:label']"
          v-show="!collapsedItems.includes(item.temp_id)"
          class="inline-block w-full flex flex-col"
        >
          <ClauseItem
            :propertyPath="pathToClause(index)"
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
  ],
  emits: ["update:modelValue"],
  components: {
    // SectionToggler,
    HeroIcon,
  },
  data() {
    return {
      collapsedItems: [] as any[],
      componentState: "default", // Options #"default", #"hover", #"focus", #"",
      isHover: false,
      activeClause: "",
      isLoading: false,
    };
  },
  methods: {
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
    getOperatorIri(item: any): any {
      // console.log("item", item);
      const _keys = Object.keys(item);
      return _keys.filter((key: any) => {
        return this.operatorIris.includes(key);
      })[0];
    },
    test(val: any): void {
      alert(val);
    },
    pathToClause(index: number): any {
      return `${this.propertyPath}.${this.getOperatorIri(
        this.clause
      )}[${index}]`;
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
  cursor: pointer;
  font-size: 14px;
}

.clause-item__toggler {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.clause-item__operator {
  width: 55px;
  padding-right: 10px;
}

.clause-item_arrow {
  min-width: 20px;
  width: 20px;
}

.clause-item:hover {
  background-color: #ebeff3;
}

.circle {
  /* padding-top: 5px; */
  margin: 5px 10px 5px 0px;
  min-width: 13px;
  min-height: 13px;
  /* background: white; */
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  border: 2px solid #caccf7;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.line-dotted {
  width: 7px;
  height: 100%;
  min-height: 10px;
  border-right: 2px solid #caccf7;
  border-style: dotted;
}

.line {
  width: 7px;
  height: 100%;
  min-height: 10px;
  border-right: 2px solid #caccf7;
}

/* .clause-item.hover .circle {
  background-color: #caccf7 !important;
  color: #caccf7 !important;
} */
</style>
