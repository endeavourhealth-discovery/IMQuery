<template>
  <!-- Linked Datamodel entities  -->

  <template v-if="modelValue?.pathTo?.length > 0 || definition?.pathTo?.length > 0">
    <div class="im-definition">
      <div class="im-definition-body">
        <!-- <div v-if="definition?.pathTo?.length == 0">
          <SearchInput v-model="searchString" @updateActiveClause="updateActiveClause"> </SearchInput>
        </div> -->

        <!-- <TreeItem v-if="modelValue" type="linkedEntity" :modelValue="modelValue"  :showDetails="showDetails"> </TreeItem>
        <TreeItem v-else type="linkedEntity" :data="data" :path="path" :showDetails="showDetails"> </TreeItem> -->
        <TreeItem :edit="edit" type="linkedEntity" :modelValue="definition" :data="queryDefinition" :path="path" :showDetails="showDetails"> </TreeItem>
      </div>
    </div>
  </template>
  <!-- /Linked Datamodel entities  -->
  <!-- Direct Property of Main Entity  -->
  <template v-else>
    <div class="pathTo flex-col ">
      <div class="mainEntity name flex ml-5">
        <NodeIcon class="icon text-blue-600" strokewidth="2" width="22" height="22" icon="user"></NodeIcon>
        <div class="text-gray-900 text-xl font-bold  mt-1 ml-4">{{ data?.select?.entityType?.name }}</div>
      </div>
      <!-- <TreeItem type="directProperty" :data="data" :path="path"> </TreeItem> -->
      <Property class="ml10 mt-2" :modelValue="modelValue || definition"> </Property>
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
  props: ["modelValue", "type", "data", "path", "showDetails", "updateActiveClause", "preview", "edit"],
  components: {
    NodeIcon,
    Property,
    TreeItem
    // SearchInput,
  },
  mounted() {
    this.emitter.on("update-imdefinition", () => {
      this.setDefinition();
    });
  },
  data() {
    return {
      searchString: "",
      definition: this.modelValue ? this.modelValue : _.get(this.queryDefinition, this.path)
    };
  },
  methods: {
    setDefinition(): any {
      // this.definition = _.get(this.queryDefinition, this.path);
      this.definition = this.modelValue ? this.modelValue : _.get(this.queryDefinition, this.path);
    }
  },
  watch: {
    modelValue() {
      this.setDefinition();
    },
    path() {
      this.setDefinition();
    }
  },
  computed: {
    queryDefinition: {
      get(): any {
        return this.$store.state.queryBuilder.dataSet.get(this.$store.state.activeQueryId);
      },
      set(value: any): void {
        return;
      }
    }
  }
});
</script>

<style scoped></style>

<style>
.im-definition {
  /* background-color: #f8fafc; */
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
