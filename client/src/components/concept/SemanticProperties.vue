<template>
  <DataTable
    :value="semanticProperties"
    :paginator="semanticProperties.length > 5 ? true : false"
    :rows="5"
    id="semantic-properties-table"
  >
    <template #empty>
      No records found
    </template>
    <template #header>
      Semantic properties
    </template>
    <Column field="property.name" header="Name" :sortable="true">
      <template #body="slotProps">
        <div class="link" @click="navigate(slotProps.data.property?.['@id'])">
          {{ slotProps.data.property?.name }}
        </div>
      </template>
    </Column>
    <Column field="type.name" header="Type" :sortable="true">
      <template #body="slotProps">
        <div class="link" @click="navigate(slotProps.data.type['@id'])">
          {{ slotProps.data.type?.name || slotProps.data.type?.["@id"] }}
        </div>
      </template>
    </Column>
  </DataTable>
</template>
<script lang="ts">
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "SemanticProperties",
  components: {},
  props: ["semanticProperties", "contentHeight"],
  methods: {
    navigate(iri: any) {
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
div.link {
  cursor: pointer;
}
</style>
