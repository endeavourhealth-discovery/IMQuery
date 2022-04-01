<template>
  <div
    class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container"
    v-if="loading"
  >
    <ProgressSpinner />
  </div>
  <OrganizationChart v-else :value="graph" :collapsible="true">
    <template #NONE>
      <p class="p-text-centered">None</p>
    </template>
    <template #default="slotProps">
      <span>{{ slotProps.node.name }}</span>
    </template>
    <template #PROPERTIES="slotProps">
      <table aria-label="graph semantic properties table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in slotProps.node.leafNodes" :key="prop">
            <td @click="navigate(prop.iri)">{{ prop.name }}</td>
            <td @click="navigate(prop.valueTypeIri)">
              {{ prop.valueTypeName }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #ISA="slotProps">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="isa in slotProps.node.leafNodes" :key="isa">
            <td @click="navigate(isa.iri)">{{ isa.name }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #SUBTYPE="slotProps">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subtype in slotProps.node.leafNodes" :key="subtype">
            <td @click="navigate(subtype.iri)">{{ subtype.name }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </OrganizationChart>
</template>

<script lang="ts">
import GraphData from "../../models/GraphData";
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import { RouteRecordName } from "vue-router";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Graph",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getGraph(newValue);
    }
  },
  data() {
    return {
      loading: false,
      graph: {} as GraphData
    };
  },
  async mounted() {
    if (this.conceptIri) {
      await this.getGraph(this.conceptIri);
    }
  },
  methods: {
    async getGraph(iri: string) {
      this.loading = true;
      await EntityService.getEntityGraph(iri)
        .then(res => {
          this.graph = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get entity graph data from server",
              err
            )
          );
        });
      this.loading = false;
    },
    navigate(iri: string) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (iri)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: iri }
        });
    }
  }
});
</script>

<style scoped>
td,
th {
  border: 1px solid lightgray;
  padding: 0.5rem;
  overflow-wrap: break-word;
  text-align: left;
}

td {
  cursor: pointer;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

th[scope="col"] {
  background-color: #f8f9fa;
  color: #495057;
}

table {
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
}

.p-organizationchart {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
