<template>
  <!-- Linked Datamodel entities  -->
  <template v-if="type == 'clause'">
    <div class="im-definition">
      <div class="im-definition-body">
        <!-- <div v-if="definition?.pathTo?.length == 0">
          <SearchInput v-model="searchString" @updateActiveClause="updateActiveClause"> </SearchInput>
        </div> -->
        <TreeItem v-if="modelValue" type="linkedEntity" :modelValue="modelValue" :showDetails="showDetails"> </TreeItem>
        <TreeItem v-else type="linkedEntity" :data="data" :path="path" :showDetails="showDetails"> </TreeItem>
      </div>
    </div>
  </template>
  <!-- /Linked Datamodel entities  -->

  <!-- Direct Property of Main Entity  -->
  <template v-if="type == 'property'">
    <div class="pathTo ">
      <span class="ml10"> {{ data?.select?.entityType?.name }} </span>
      <Property class="ml10" :modelValue="definition"> </Property>
    </div>
  </template>
  <!-- /Direct Property of Main Entity  -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TreeItem from "./TreeItem.vue";
import NodeIcon from "./NodeIcon.vue";
import Property from "./Property.vue";
import _ from "lodash";
// import SearchInput from "@/components/query/SearchInput.vue";

export default defineComponent({
  name: "IMDefinition",
  props: ["modelValue", "type", "data", "path", "showDetails", "updateActiveClause"],
  components: {
    NodeIcon,
    Property,
    TreeItem
    // SearchInput,
  },
  data() {
    return {
      searchString: "",
      definition: _.get(this.data, this.path)
    };
  }
});
</script>

<style scoped></style>

<style>
.im-definition {
  background-color: #f8fafc;
  border-radius: 5px;
  /* padding: 6px; */
}

.im-definition {
  border: 1px solid #cbd5e1;
}
.im-definition-header {
  border-bottom: 1px solid #cbd5e1;
  padding: 5px 0 5px 5px;
}

.im-definition-body {
  background-color: #fff;
  padding-top: 5px;
  padding-left: 10px;
  /* border: 1px solid #cbd5e1; */
  border-radius: 5px;
  /* padding: 6px; */
}

.pathTo {
  display: flex;
}
.properties {
  display: flex;
  flex-direction: column;
}

.inSet {
  display: flex;
}

.ml10 {
  margin-left: 10px;
}
.ml20 {
  margin-left: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
.ml10 {
  margin-left: 10px;
}
.arrow-right {
  position: relative;
  top: 3px;
  margin-left: 5px;
  min-width: 14px;
  min-height: 14px;
  color: #000;
  /* color: #1d4ed8; */
}
</style>
