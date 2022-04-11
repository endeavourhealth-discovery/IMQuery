<template>
  <div
    class="p-d-flex p-flex-row p-jc-center p-ai-center loading -container"
    v-if="$store.state.loading.get('mappings')"
  >
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
    <template #terms="slotProps">
      <a class="terms-link" @click="toTerms">
        <span>{{ slotProps.node.data.label }}</span>
      </a>
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
            @mouseenter="toggle($event, mapItem)"
            @mouseleave="toggle($event, mapItem)"
          >
            <td>{{ mapItem.name }}</td>
            <td>{{ mapItem.priority }}</td>
          </tr>
        </tbody>
      </table>
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
</template>

<script lang="ts">
import EntityService from "@/services/EntityService";
import { IM } from "@/vocabulary/IM";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ComplexMappings",
  props: ["conceptIri"],
  emits: ["toTermsClicked"],
  watch: {
    async conceptIri() {
      this.$store.commit("updateLoading", {
        key: "mappings",
        value: true
      });
      await this.getMappings();
      this.data = this.createChartStructure(this.mappings);
      this.$store.commit("updateLoading", {
        key: "mappings",
        value: false
      });
    }
  },
  data() {
    return {
      mappings: {} as any,
      data: {} as any,
      hoveredResult: {} as any
    };
  },
  async mounted() {
    this.$store.commit("updateLoading", {
      key: "mappings",
      value: true
    });
    await this.getMappings();
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
          this.mappings = res.data[IM.HAS_MAP] || {};
          this.data = {};
        })
        .catch(() => {
          this.mappings = [];
          this.data = {};
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
      position: number
    ): {
      key: string;
      type: string;
      data: any;
    } {
      return {
        key: location + "_" + position,
        type: "childList",
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

    generateChildNodes(
      mapObject: any,
      location: string,
      level: number,
      positionInLevel: number
    ) {
      if (Object.keys(mapObject[0]).includes(IM.MATCHED_TO)) {
        const matchedList = [] as any;
        mapObject.forEach((item: any) => {
          matchedList.push({
            name: item[IM.MATCHED_TO].name,
            iri: item[IM.MATCHED_TO]["@id"],
            priority: item[IM.MAP_PRIORITY],
            assuranceLevel: item[IM.ASSURANCE_LEVEL].name
          });
        });
        return [
          this.createChartTableNode(
            matchedList.sort(this.byPriority),
            location,
            positionInLevel
          )
        ];
      } else {
        const results = [];
        let count = 0;
        for (const item of mapObject) {
          let mapNode = this.createChartMapNode(
            Object.keys(item)[0],
            location,
            count
          );
          if (mapNode) {
            mapNode.children = this.generateChildNodes(
              item[Object.keys(item)[0]],
              location,
              level + 1,
              count
            );
          }
          results.push(mapNode);
          count++;
        }
        return results;
      }
    },

    createChartStructure(mappingObject: any): any {
      if (!Object.keys(mappingObject).length) {
        return [];
      }
      const parentNode = {
        key: "0",
        type: "hasMap",
        data: { label: "Has map" },
        children: [] as any
      };
      parentNode.children = this.generateChildNodes(mappingObject, "0", 0, 0);
      parentNode.children.push({
        key: "0" + parentNode.children.length,
        type: "terms",
        data: { label: "Term maps" }
      });
      return parentNode;
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

    toggle(event: any, data: any): void {
      this.hoveredResult = data;
      const x = this.$refs.opMap as any;
      x.toggle(event);
    },

    toTerms() {
      this.$emit("toTermsClicked");
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

.terms-link {
  cursor: pointer;
}
</style>
