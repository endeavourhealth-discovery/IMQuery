<template>
  <template v-for="(item, index) in withTempUUID(clause)" :key="item.temp_id">
    <div>
      <div class="clause-item flex">
        <!-- Operator  -->
        <template v-if="operator">
          <div
            class="clause-item__operator inline text-green-600 font-semibold hover:underline mr-4"
          >
            {{ operator.split(":")[1] }}
          </div>
        </template>

        <!-- top level match clause with rdfs:label  -->
        <template v-if="item['rdfs:label']">
          <div
            :class="'inline w-full text-blue-600 font-semibold hover:underline'"
          >
            {{ item["rdfs:label"] }}
          </div>
        </template>
        <!-- child match clause without label -->
        <template v-if="!item['rdfs:label']">
          <ClauseItem
            v-if="index == 0"
            class="inline"
            :clause="item[getOperator(item)]"
            :operator="getOperator(item)"
            :operatorIris="['im:and', 'im:or', 'im:not']"
          >
          </ClauseItem>
        </template>
      </div>

      <!-- child match clause without label -->
      <template v-if="!item['rdfs:label']">
        <ClauseItem

          v-if="index > 0"
          class="inline"
          :clause="item[getOperator(item)]"
          :operator="getOperator(item)"
          :operatorIris="['im:and', 'im:or', 'im:not']"
        >
        </ClauseItem>
      </template>
    </div>
  </template>















  
  <!-- <template v-else>
    Operator 
    <template v-if="operator">
      <div
        class="clause-item__operator inline text-green-600 font-semibold hover:underline mr-4"
      >
        {{ operator.split(":")[1] }}
      </div>
    </template>
  </template> -->

  <!-- <SectionToggler
        v-if="item.clause && item.clause.length > 1"
        :expanded="!collapsedItems.includes(item.id)"
        @click="
          collapsedItems.includes(item.id)
            ? (collapsedItems = collapsedItems.filter((i: any) => i != item.id))
            : collapsedItems.push(item.id)
        "
        :class="
          'inline clause-item__toggler' +
            [index != 0 && item.where ? ' ml-4' : '']
        "
      /> -->

  <!-- 
      <div
    v-if="index != 0 && item.where"
    class="clause-item__operator text-green-600 font-semibold hover:underline mr-4"
  >
    {{ operator }}
  </div>
    <template v-if="item.name" class="w-full non-selectable">
      <div :class="'inline text-blue-600 font-semibold hover:underline'">
        {{ item.name }}
      </div>
    </template>
    <div
      v-if="'notExist' in item && item.notExist == true"
      class="ml-3 text-red-600"
    >
      DOES NOT EXIST
    </div>
    <template
      v-if="!collapsedItems.includes(item.id) && item.clause"
      class="w-full non-selectable"
    >
      <div class="inline text-black font-semibold">
        <ClauseItem
          class="hover:underline"
          :operator="item.operator"
          :clause="item.clause"
          :nestingCount="nestingCount + 1"
        >
        </ClauseItem>
      </div>
    </template> -->
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import{ v4 } from "uuid";
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
      return this.operatorIris.some((operatorIri: any) => {
        return item[operatorIri];
      });
    },
    getOperator(item: any): any {
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
