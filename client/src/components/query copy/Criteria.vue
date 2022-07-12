<template>
  <div v-if="activePath" class="criteria flex-col w-full mr-2 border-r">
    <!-- <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Edit Criteria</h3>
    </div> -->

    <div class="criteria-item flex-col">
      <!-- <Row name="path" class="bg-gray-100">{{ activePath }} </Row> -->
      <Row name="name" class=""> <Curator valueType="string" :path="activePath + '.name'" :modelValue="activeClause?.name" /> </Row>
      <Curator template="include" :clause="activeClause">
        <Curator v-if="activeClause?.valueObject?.property" template="property" :clause="activeClause"> </Curator>
        <Curator
          v-else-if="activeClause?.valueObject?.and || activeClause?.valueObject?.or"
          v-for="(property, index) in activeClause?.valueObject?.and || activeClause?.valueObject?.or"
          template="property"
          :modelValue="property"
          :index="index"
          :clause="activeClause"
        >
        </Curator>
      </Curator>

      <!-- <Row name="Entity" class="bg-gray-100 ">
        <div class="flex-col">
          <RadioButton class="" value="main" v-model="entity" />
          <label class="text-xl font-bold text-gray-700 ml-2">Person (Main Data Type)</label> <br />
          <RadioButton class="" name="criteriaType" value="other" v-model="entity" />
          <label class="text-xl font-bold text-gray-700 ml-2">Other</label> <br />
          <Curator valueType="iriref" target="datamodel"></Curator>
        </div>
      </Row>
      <Row name="Conditions"></Row> -->
    </div>
  </div>
  <div v-else class="text-2xl font-medium ">Select Criteria (blue text on the right) to open the Editor</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import _ from "lodash";

import Row from "@/components/query/Row.vue";
import Curator from "@/components/query/Curator.vue";

export default defineComponent({
  name: "Criteria",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  components: {
    Row,
    Curator
  },
  data() {
    return {
      entity: ""
      // activeQuery: {},
      // activeClause: {},
    };
  },
  computed: {
    ...mapState(["activeQueryId", "activeClausePath", "queryBuilder"]),
    a: {
      get(): any {
        return "an";
      },
      set(value: any): void {}
    },
    activeQuery: {
      get(): any {
        return this.queryBuilder.dataSet.get(this.activeQueryId);
      },
      set(value: any): void {}
    },
    activePath: {
      get(): any {
        return _.get(this.activeClausePath, this.activeQueryId);
      },
      set(value: any): void {}
    },
    activeClause: {
      get(): any {
        return _.get(this.activeQuery, this.activePath);
      },
      set(value: any): void {}
    }
  }
});
</script>

<style scoped></style>
