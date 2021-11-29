<template>
  <div id="properties-table-container">
    <DataTable :value="dataModelPropsData" :scrollable="true" ref="propertiesTable" :loading="loading">
      <template #empty>
        No records found
      </template>
      <template #loading>
        Loading data. Please wait...
      </template>
      <template #header>
        <div class="table-header">
          Data model properties
          <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" />
        </div>
      </template>
      <Column field="propertyDisplay" header="Name" :sortable="true">
        <template #body="slotProps">
          <div class="link" @click="navigate(slotProps.data.propertyId)">
            {{ slotProps.data.propertyDisplay }}
          </div>
        </template>
      </Column>
      <Column field="typeDisplay" header="Type" :sortable="true">
        <template #body="slotProps">
          <div class="link" @click="navigate(slotProps.data.typeId)">
            {{ slotProps.data.typeDisplay }}
          </div>
        </template>
      </Column>
      <Column field="inheritedDisplay" header="Inherited From" :sortable="true">
        <template #body="slotProps">
          <div class="link" @click="navigate(slotProps.data.inheritedId)">
            {{ slotProps.data.inheritedDisplay }}
          </div>
        </template>
      </Column>
      <Column field="cardinality" header="Cardinality">
        <template #body="slotProps">
          {{ slotProps.data.cardinality }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script lang="ts">
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "@vue/runtime-core";
import { RouteRecordName } from "vue-router";

export default defineComponent({
  name: "Properties",
  components: {},
  props: {
    conceptIri: String
  },
  watch: {
    async conceptIri(newValue) {
      await this.getDataModelProps(newValue);
    }
  },
  data() {
    return {
      loading: false,
      dataModelPropsData: [],
      selected: {} as any,
      scrollHeight: "500px"
    };
  },
  async mounted() {
    if (this.conceptIri) {
      window.addEventListener("resize", this.setScrollHeight);
      this.setScrollHeight();
      await this.getDataModelProps(this.conceptIri);
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setScrollHeight);
  },
  methods: {
    async getDataModelProps(iri: string) {
      this.loading = true;
      let res;
      try {
        res = (await EntityService.getDataModelProperties(iri)).data;
        this.dataModelPropsData = res.map((prop: any) => {
          return {
            propertyId: prop.property["@id"],
            propertyName: prop.property.name,
            propertyDisplay: prop.property.name,
            typeId: prop.type["@id"],
            typeName: prop.type.name,
            typeDisplay: prop.type?.name || prop.type?.["@id"],
            inheritedId: prop.inheritedFrom?.["@id"],
            inheritedName: prop.inheritedFrom?.name,
            inheritedDisplay: prop.inheritedFrom?.name || "-",
            cardinality: `${prop.minExclusive || prop.minInclusive || 0} :
              ${prop.maxExclusive || prop.maxInclusive || "*"}`
          };
        });
      } catch (error) {
        this.$toast.add(LoggerService.error("Failed to get properties from server", error));
      }
      this.loading = false;
    },

    navigate(iri: any) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (iri)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: iri }
        });
    },

    setScrollHeight() {
      const container = document.getElementById("properties-table-container") as HTMLElement;
      const paginator = container?.getElementsByClassName("p-paginator")[0] as HTMLElement;
      if (container && paginator) {
        const height = container.getBoundingClientRect().height - paginator.getBoundingClientRect().height - 1 + "px";
        this.scrollHeight = height;
      } else if (container && !paginator) {
        const height = container.getBoundingClientRect().height - 1 + "px";
        this.scrollHeight = height;
      } else {
        LoggerService.error(undefined, "Failed to set Properties table scroll height. Required elements not found.");
      }
    },

    exportCSV() {
      (this.$refs as any).propertiesTable.exportCSV();
    }
  }
});
</script>

<style scoped>
#properties-table-container {
  height: 100%;
}

div.link {
  cursor: pointer;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
