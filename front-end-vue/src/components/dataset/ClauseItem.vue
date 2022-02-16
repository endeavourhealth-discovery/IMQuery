<template>
  <!-- Any object that is not preceded by an operator should be ignored -->
  <template v-if="isOperator(clause)">
    <!-- Iterate over the children in the array of the oeprator -->

    <template
      v-for="(item, index) in withTempUUID(clause[getOperatorIri(clause)])"
      :key="item.temp_id"
    >
      <div class="block w-full flex clause-item">
        <div class="inline-flex flex-col h-full connections">
        <!-- ring  -->
          <div class="inline circle"></div>
          <!-- Line -->
          <div
            v-if="
              index != withTempUUID(clause[getOperatorIri(clause)]).length - 1
            "
            :class="
              'inline' +
                [
                  getOperatorIri(clause).split(':')[1] == 'or'
                    ? ' line-dotted'
                    : ' line'
                ]
            "
          ></div>
          <!-- <div class="ring-inner"></div> -->
        </div>

        <!-- Display Operator (first item invisible)  -->

        <div
          v-if="index == 0 && getOperatorIri(clause).split(':')[1] == 'or'"
          class="clause-item__operator inline text-indigo-700 font-semibold hover:underline mr-2"
        >
          either
        </div>
        <!-- Display Operator (the rest is visible ) -->
        <div
          v-else-if="index > 0"
          class="clause-item__operator inline text-indigo-700 font-semibold hover:underline mr-2"
        >
          {{ getOperatorIri(clause).split(":")[1] }}
        </div>

        <!-- Display Label  -->
        <div
          @click="
            queryBuilder.activeClause = `${propertyPath}.${getOperatorIri(
              clause
            )}[${index}]`
          "
          v-if="item['rdfs:label']"
          class="clause-item__label inline w-full text-black font-semibold hover:text-blue-600 hover:underline"
        >
          {{ item["rdfs:label"] }}
        </div>

        <!-- If there's no label   -->
        <div
          v-if="!item['rdfs:label']"
          v-show="!collapsedItems.includes(item.temp_id)"
          class="inline-block w-full flex flex-col"
        >
          <ClauseItem
            :propertyPath="
              `${propertyPath}.${getOperatorIri(clause)}[${index}]`
            "
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
  },
  data() {
    return {
      collapsedItems: [] as any[],
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
    isOperator(item: any): boolean {
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
  width: 50px;
}

.circle {
  /* padding-top: 5px; */
  margin: 5px 15px 5px 0px;
  min-width: 13px;
  min-height: 13px;
  background: white;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  border: 2px solid rgb(94, 94, 233);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}



.line-dotted {
  width: 7px;
  height: 100%;

  border-right: 2px solid rgb(94, 94, 233);
  border-style: dotted;
}


.line {
  width: 7px;
  height: 100%;
  min-height: 12px;
  border-right: 2px solid rgb(94, 94, 233);
}
</style>
