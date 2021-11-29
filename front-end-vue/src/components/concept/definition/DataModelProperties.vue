<template>
  <div v-if="data.length" id="datamodel-properties-container" :style="{ width: size }">
    <div class="head-container">
      <strong class="label">{{ label }}: </strong>
      <span>&nbsp;({{ data.length }})</span>
      <Button
        :icon="buttonExpanded ? 'pi pi-minus' : 'pi pi-plus'"
        class="p-button-rounded p-button-text p-button-primary p-button-sm expand-button"
        @click="setButtonExpanded()"
        v-styleclass="{
          selector: '#datamodel-properties-table',
          enterClass: 'p-d-none',
          enterActiveClass: 'my-fadein',
          leaveActiveClass: 'my-fadeout',
          leaveToClass: 'p-d-none'
        }"
      />
    </div>
    <DataTable :value="data" :paginator="data.length > 5 ? true : false" :rows="5" id="datamodel-properties-table" class="p-d-none">
      <template #empty>
        No records found
      </template>
      <template #header>
        {{ label }}
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
          <div v-if="slotProps.data.inheritedFrom?.name" class="link" @click="navigate(slotProps.data.inheritedFrom?.['@id'])">
            {{ slotProps.data.inheritedFrom?.name }}
          </div>
          <div v-else>-</div>
        </template>
      </Column>
      <Column field="cardinality" header="Cardinality">
        <template #body="slotProps">
          <div v-if="slotProps.data">
            {{
              `${slotProps.data.minExclusive || slotProps.data.minInclusive || 0} :
              ${slotProps.data.maxExclusive || slotProps.data.maxInclusive || "*"}`
            }}
          </div>
          <div v-else>-</div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script lang="ts">
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  name: "DataModelProperties",
  components: {},
  props: {
    label: { type: String },
    data: { type: Array as PropType<Array<unknown>> },
    size: { type: String }
  },
  data() {
    return {
      buttonExpanded: false
    };
  },
  methods: {
    navigate(iri: any) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (iri)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: iri }
        });
    },

    setButtonExpanded() {
      this.buttonExpanded ? (this.buttonExpanded = false) : (this.buttonExpanded = true);
    }
  }
});
</script>

<style lang="scss" scoped>
#datamodel-properties-table {
  margin: 0.5rem 0 0 0;
}

div.link {
  cursor: pointer;
}

.head-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

@keyframes my-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes my-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.my-fadein {
  animation: my-fadein 150ms linear;
}

.my-fadeout {
  animation: my-fadeout 150ms linear;
}
</style>
