<template>
  <div class="definition-editor">
    <ClauseItem
      :clause="modelValue[definitionIri][0]['im:and']"
      :operator="'im:and'"
      :operatorIris="['im:and', 'im:or', 'im:not']"
    />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";
import ClauseItem from "@/components/dataset/ClauseItem.vue";

// import Constraint from "@/components/dataset/Constraint.vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "DefinitionEditor",
  props: [
    "modelValue",
    "operatorIris",
    "definitionIri",
    "operator",
    "clause",
    "nestingCount",
  ],
  emits: ["update:modelValue"],
  components: {
    // SectionToggler,
    ClauseItem,
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
    withTempUUID(items: any[]): any[] {
      console.log("items", items);
      return items.map((item: any) => {
        return { temp_id: "urn:uuid:" + v4(), ...item };
      });
    },
    isOperator(item: any): boolean {
      return this.operatorIris.some((operatorIri: any) => {
        return item[operatorIri];
      });
    },
    getOperator(item: any): any {
      console.log("item", item);
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
