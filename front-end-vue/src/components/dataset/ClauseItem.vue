<template>
  <!-- Any object that is not preceded by an operator should be ignored -->
  <template v-if="isOperator(clause)">
    <!-- Iterate over the children in the array of the oeprator -->
    <div
      v-for="(item, index) in withTempUUID(clause[getOperatorIri(clause)])"
      :key="item.temp_id"
      class="block w-full flex"
    >
      <SectionToggler
        :expanded="!collapsedItems.includes(item.temp_id)"
        @click="
          collapsedItems.includes(item.temp_id)
            ? (collapsedItems = collapsedItems.filter(
                (i: any) => i != item.temp_id
              ))
            : collapsedItems.push(item.temp_id)
        "
        :class="'inline clause-item__toggler' + [true ? '' : '']"
      />

      <!-- Display Operator (first item invisible)  -->
      <div v-if="index == 0" class="invisible"></div>
      <!-- Display Operator (the rest is visible ) -->
      <div
        v-else
        class="clause-item__operator inline text-green-600 font-semibold hover:underline mr-4"
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
        class="clause-item__label inline w-full text-blue-600 font-semibold hover:underline"
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
          :propertyPath="`${propertyPath}.${getOperatorIri(clause)}[${index}]`"
          :clause="item"
          :operatorIris="['im:and', 'im:or', 'im:not']"
        />
      </div>
    </div>
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
    SectionToggler,
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
  width: 40px;
}
</style>
