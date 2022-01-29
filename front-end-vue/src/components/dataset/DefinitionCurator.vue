<template>
  <div
    v-for="(item, index) in clauseWithUUID"
    :key="item.id"
    class="clause-item flex"
  >
    <SectionToggler
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
    />

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
    <!-- <template v-else>
      <div
        v-if="item.where"
        :class="'inline text-yellow-600 font-semibold hover:underline'"
      >
        WHERE CLAUSE
      </div>
    </template> -->
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
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";

// import Constraint from "@/components/dataset/Constraint.vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "DefinitionCurator",
  props: ["operator", "clause", "nestingCount"],
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
  },
  computed: {
    clauseWithUUID(): any {
      return this.clause.map((item: any) => {
        return { temp_id: "urn:uuid:" + v4(), ...item };
      });
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
