<template>
  <div class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container" v-if="$store.state.loading.get('mappings')">
    <ProgressSpinner />
  </div>
  <OrganizationChart v-else :value="data">
    <template #hasMap="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #oneOf="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #comboOf="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #someOf="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #simpleMaps="slotProps">
      <span>{{ slotProps.node.data.label }}</span>
    </template>
    <template #childList="slotProps">
      <table aria-label="Concept map children">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="mapItem in slotProps.node.data.mapItems"
            :key="mapItem"
            @mouseenter="toggle($event, mapItem, 'opMap')"
            @mouseleave="toggle($event, mapItem, 'opMap')"
          >
            <td>{{ mapItem.name }}</td>
            <td>{{ mapItem.priority }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template #simpleMapsList="slotProps">
      <SimpleMaps v-if="slotProps.node.data.mapItems.length" :data="slotProps.node.data.mapItems" />
      <span v-else>None</span>
    </template>
    <template #default>
      <p class="p-text-centered">None</p>
    </template>
  </OrganizationChart>

  <OverlayPanel ref="opMap" id="overlay-panel-maps">
    <div class="p-d-flex p-flex-column p-jc-start map-overlay">
      <p><strong>Name: </strong>{{ hoveredResult.name }}</p>
      <p><strong>Iri: </strong>{{ hoveredResult.iri }}</p>
      <p><strong>Priority: </strong>{{ hoveredResult.priority }}</p>
      <p>
        <strong>Assurance level: </strong>
        {{ hoveredResult.assuranceLevel }}
      </p>
    </div>
  </OverlayPanel>

  <OverlayPanel ref="opSimpleMaps" id="overlay-panel-simple-maps">
    <div class="p-d-flex p-flex-column p-jc-start simple-maps-overlay">
      <p><strong>Name: </strong>{{ hoveredResult.name }}</p>
      <p><strong>Iri: </strong>{{ hoveredResult.iri }}</p>
      <p><strong>Namespace: </strong>{{ hoveredResult.namespace }}</p>
    </div>
  </OverlayPanel>
</template>

<script lang="ts">
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { IM } from "@/vocabulary/IM";
import { defineComponent } from "vue";
import SimpleMaps from "@/components/concept/mapping/SimpleMaps.vue";

export default defineComponent({
  name: "Mappings",
  components: { SimpleMaps },
  props: ["conceptIri"],
  watch: {
    async conceptIri() {
      this.$store.commit("updateLoading", {
        key: "mappings",
        value: true
      });
      await this.getMappings();
      this.getSimpleMapsNamespaces();
      this.data = this.createChartStructure(this.mappings);
      this.$store.commit("updateLoading", {
        key: "mappings",
        value: false
      });
    }
  },
  data() {
    return {
      mappings: [] as any,
      data: {} as any,
      hoveredResult: {} as any,
      simpleMaps: [] as any,
      namespaces: [] as any
    };
  },
  async mounted() {
    this.$store.commit("updateLoading", {
      key: "mappings",
      value: true
    });
    await this.getMappings();
    this.getSimpleMapsNamespaces();
    this.data = this.createChartStructure(this.mappings);
    this.$store.commit("updateLoading", {
      key: "mappings",
      value: false
    });
  },
  methods: {
    async getMappings(): Promise<void> {
      await EntityService.getPartialEntity(this.conceptIri, [IM.HAS_MAP])
        .then(res => {
          this.mappings = res.data[IM.HAS_MAP] || [];
          this.data = {};
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get concept complex maps from server", err));
          this.mappings = [];
          this.data = {};
        });

      await EntityService.getNamespaces()
        .then(res => {
          this.namespaces = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get namespaces from server", err));
        });

      await EntityService.getPartialEntity(this.conceptIri, [IM.MATCHED_TO])
        .then(res => {
          this.simpleMaps = res.data[IM.MATCHED_TO] || [];
          if (this.simpleMaps.length && this.namespaces) {
            this.simpleMaps.forEach((mapItem: any) => {
              const found = this.namespaces.find((namespace: any) => namespace.iri === mapItem["@id"].split("#")[0] + "#");
              if (found) {
                mapItem.scheme = found.name;
              } else {
                mapItem.scheme = "None";
              }
              mapItem.code = mapItem["@id"].split("#")[1];
            });
          }
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get concept simple maps from server", err));
          this.simpleMaps = [];
        });
    },

    createChartTableNode(
      items: {
        assuranceLevel: string;
        iri: string;
        name: string;
        priority: number;
      }[],
      location: string,
      position: number,
      type: string
    ): {
      key: string;
      type: string;
      data: any;
    } {
      return {
        key: location + "_" + position,
        type: type,
        data: { mapItems: items }
      };
    },

    createChartMapNode(
      item: string,
      location: string,
      positionInLevel: number
    ):
      | {
          key: string;
          type: string;
          data: { label: string };
          children: any[];
        }
      | undefined {
      switch (item) {
        case IM.ONE_OF:
          return {
            key: location + "_" + positionInLevel,
            type: "oneOf",
            data: { label: "One of" },
            children: [] as any
          };
        case IM.COMBINATION_OF:
          return {
            key: location + "_" + positionInLevel,
            type: "comboOf",
            data: { label: "Combination of" },
            children: [] as any
          };
        case IM.SOME_OF:
          return {
            key: location + "_" + positionInLevel,
            type: "someOf",
            data: { label: "Some of" },
            children: [] as any
          };
        default:
          return undefined;
      }
    },

    generateChildNodes(mapObject: any, location: string, positionInLevel: number) {
      if (Object.keys(mapObject[0]).includes(IM.MAPPED_TO)) {
        const mappedList = [] as any;
        mapObject.forEach((item: any) => {
          mappedList.push({
            name: item[IM.MAPPED_TO].name,
            iri: item[IM.MAPPED_TO]["@id"],
            priority: item[IM.MAP_PRIORITY],
            assuranceLevel: item[IM.ASSURANCE_LEVEL].name
          });
        });
        return [this.createChartTableNode(mappedList.sort(this.byPriority), location, positionInLevel, "childList")];
      } else {
        const results = [];
        let count = 0;
        for (const item of mapObject) {
          let mapNode = this.createChartMapNode(Object.keys(item)[0], location, count);
          if (mapNode) {
            mapNode.children = this.generateChildNodes(item[Object.keys(item)[0]], location + "_" + count, 0);
          }
          results.push(mapNode);
          count++;
        }
        return results;
      }
    },

    createChartStructure(mappingObject: any): any {
      const parentNode = {
        key: "0",
        type: "hasMap",
        data: { label: "Has map" },
        children: [] as any
      };
      if ((!mappingObject.length || !Object.keys(mappingObject).length) && !this.simpleMaps.length) {
        return [];
      }
      if (mappingObject.length && Object.keys(mappingObject).length) {
        parentNode.children = this.generateChildNodes(mappingObject, "0", 0);
      }
      if (this.simpleMaps.length) {
        const simpleMapsChildren = this.generateSimpleMapsNodes(this.simpleMaps, "0_" + parentNode.children.length, 0);
        parentNode.children.push({
          key: "0_" + parentNode.children.length,
          type: "simpleMaps",
          data: { label: "Simple maps" },
          children: simpleMapsChildren
        });
      }
      return parentNode;
    },

    generateSimpleMapsNodes(simpleMaps: any, location: string, positionInLevel: number) {
      if (!Array.isArray(simpleMaps) || !simpleMaps.length) {
        return [this.createChartTableNode([], location, positionInLevel, "simpleMapsList")];
      }
      const simpleMapsList = [] as any;
      simpleMaps.forEach((mapItem: any) => {
        simpleMapsList.push({
          name: mapItem.name,
          iri: mapItem["@id"],
          scheme: mapItem.scheme,
          code: mapItem.code
        });
      });
      return [this.createChartTableNode(simpleMapsList.sort(this.byScheme), location, positionInLevel, "simpleMapsList")];
    },

    getSimpleMapsNamespaces() {
      if (this.simpleMaps && this.simpleMaps.length && this.namespaces && this.namespaces.length) {
        this.simpleMaps.forEach((mapItem: any) => {
          const found = this.namespaces.find((namespace: any) => namespace.iri.toLowerCase() === (mapItem["@id"].split("#")[0] + "#").toLowerCase());
          if (found && Object.prototype.hasOwnProperty.call(found, "name")) {
            mapItem.scheme = found.name;
          } else {
            mapItem.scheme = "None";
          }
          mapItem.code = mapItem["@id"].split("#")[1];
        });
      }
    },

    byPriority(a: any, b: any): number {
      if (a.priority < b.priority) {
        return -1;
      } else if (a.priority > b.priority) {
        return 1;
      } else {
        return 0;
      }
    },

    byScheme(a: any, b: any): number {
      if (a.scheme < b.scheme) {
        return -1;
      } else if (a.scheme > b.scheme) {
        return 1;
      } else {
        return 0;
      }
    },

    toggle(event: any, data: any, refId: string): void {
      this.hoveredResult = data;
      const x = this.$refs[refId] as any;
      x.toggle(event);
    }
  }
});
</script>

<style scoped>
td,
th {
  border: 1px solid lightgray;
  padding: 0.5rem;
}

td,
th {
  text-align: left;
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

td,
th {
  overflow-wrap: break-word;
}

.p-organizationchart {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
