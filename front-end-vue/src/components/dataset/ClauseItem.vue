<template>
  <template v-if="isOperator(clause)">
    <!-- iterate over its children  -->
    <div
      v-for="(item, index) in withTempUUID(clause[getOperatorIri(clause)])"
      :key="item.temp_id"
      class="block w-full"
    >
      <div class="flex bg-blue-500">
        <!-- Display Operator  -->
        <div v-if="index != 0" class="inline bg-red-500">
          {{ getOperatorIri(clause).split(":")[1] }}
        </div>

        <div v-if="item['rdfs:label']" class="inline bg-white">
          {{ item["rdfs:label"] }}
        </div>

        <template v-if="!item['rdfs:label']">
          <div class="inline-block w-full flex flex-col">
            <ClauseItem
              class=""
              :clause="item"
              :operatorIris="['im:and', 'im:or', 'im:not']"
            />
          </div>
        </template>
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
      console.log("items", items);
      if (items) {
        return items.map((item: any) => {
          return { temp_id: "urn:uuid:" + v4(), ...item };
        });
      }
    },
    isOperator(item: any): boolean {
      console.log("item", item);
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
  },
  computed: {},
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.clause-item {
  /* margin-left: 15px; */
  /* height: 30px; */
  cursor: pointer;
}

.clause-item__toggler {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.clause-item__operator {
  /* margin-left: 5px; */
}
</style>
