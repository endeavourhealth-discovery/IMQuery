<template>
  <DataTable
    :value="dataModelProperties"
    :paginator="dataModelProperties.length > 5 ? true : false"
    :rows="5"
    id="datamodel-properties-table"
  >
    <template #empty>
      No records found
    </template>
    <template #header>
      Data model properties
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
    <Column field="inheritedFrom.name" header="Inherited From" :sortable="true">
      <template #body="slotProps">
        <div
          v-if="slotProps.data.inheritedFrom?.name"
          class="link"
          @click="navigate(slotProps.data.inheritedFrom?.['@id'])"
        >
          {{ slotProps.data.inheritedFrom?.name }}
        </div>
        <div v-else>-</div>
      </template>
    </Column>
    <Column field="cardinality" header="Cardinality">
      <template #body="slotProps">
        <div v-if="slotProps.data">
          {{
            `${slotProps.data.minExclusive ||
              slotProps.data.minInclusive ||
              0} :
            ${slotProps.data.maxExclusive ||
              slotProps.data.maxInclusive ||
              "*"}`
          }}
        </div>
        <div v-else>-</div>
      </template>
    </Column>
  </DataTable>
</template>
<script lang="ts">
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "DataModelProperties",
  components: {},
  props: ["dataModelProperties", "contentHeight"],
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
