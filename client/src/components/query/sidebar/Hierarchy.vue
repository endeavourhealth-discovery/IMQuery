<template>
  <div
    class="p-d-flex p-flex-column p-jc-start"
    id="hierarchy-tree-bar-container"
  >
    <div
      class="p-d-flex p-flex-row p-jc-start p-ai-center"
      id="hierarchy-selected-bar"
    >
      <Button
        :label="parentLabel"
        :disabled="parentLabel === ''"
        icon="pi pi-chevron-up"
        @click="expandParents"
        class="p-button-text p-button-plain"
      />
      <Button
        icon="pi pi-home"
        @click="resetConcept"
        class="p-button-rounded p-button-text p-button-plain"
      >
        <i class="fas fa-home" aria-hidden="true"></i>
      </Button>
      <Button
        v-if="$store.state.treeLocked"
        class="p-button-rounded p-button-text p-button-plain"
        @click="toggleTreeLocked(false)"
        v-tooltip.right="'Toggle hierarchy tree to update on concept search'"
      >
        <i class="fas fa-link" aria-hidden="true"></i>
      </Button>
      <Button
        v-else
        class="p-button-rounded p-button-text p-button-plain"
        @click="toggleTreeLocked(true)"
        v-tooltip.right="'Toggle hierarchy tree to update on concept search'"
      >
        <i class="fas fa-unlink" aria-hidden="true"></i>
      </Button>
    </div>

    <Tree
      :value="root"
      selectionMode="single"
      v-model:selectionKeys="selectedKey"
      :expandedKeys="expandedKeys"
      @node-select="onNodeSelect"
      @node-expand="expandChildren"
      class="tree-root"
    >
      <template #default="slotProps">
        <span v-if="!slotProps.node.loading">
          <i
            :class="'fas fa-fw ' + slotProps.node.typeIcon"
            :style="'color:' + slotProps.node.color"
            aria-hidden="true"
          />
        </span>
        <ProgressSpinner v-if="slotProps.node.loading" />
        {{ slotProps.node.label }}
      </template>
    </Tree>
  </div>
</template>

<script lang="ts">
import { HistoryItem } from "@/models/HistoryItem";
import { defineComponent } from "vue";
import { mapState } from "vuex";
import EntityService from "@/services/EntityService";
import { RDFS } from "@/vocabulary/RDFS";
import { RDF } from "@/vocabulary/RDF";
import { IM } from "@/vocabulary/IM";
import LoggerService from "@/services/LoggerService";
import {
  getColourFromType,
  getIconFromType
} from "@/helpers/ConceptTypeMethods";
import { TreeNode } from "@/models/TreeNode";

export default defineComponent({
  name: "Hierarchy",
  components: {},
  props: ["active"],
  emits: ["showTree"],
  computed: mapState([
    "conceptIri",
    "focusTree",
    "treeLocked",
    "sideNavHierarchyFocus"
  ]),
  watch: {
    async conceptIri(newValue) {
      if (this.homeIris.includes(newValue)) {
        this.selectedKey = {};
        await this.getConceptAggregate(newValue);
        this.createTree(
          this.conceptAggregate.concept,
          this.conceptAggregate.parents,
          this.conceptAggregate.children
        );
      } else {
        await this.getConceptAggregate(newValue);
        this.createTree(
          this.conceptAggregate.concept,
          this.conceptAggregate.parents,
          this.conceptAggregate.children
        );
        this.$store.commit("updateHistory", {
          url: this.$route.fullPath,
          conceptName: this.conceptAggregate.concept[RDFS.LABEL],
          view: this.$route.name
        } as HistoryItem);
      }
    },
    focusTree(newValue) {
      if (newValue === true) {
        this.refreshTree(
          this.conceptAggregate.concept,
          this.conceptAggregate.parents,
          this.conceptAggregate.children
        );
        this.$store.commit("updateFocusTree", false);
        this.$emit("showTree");
      }
    },
    active(newValue, oldValue) {
      if (!this.treeLocked && newValue === 0 && oldValue !== 0) {
        this.refreshTree(
          this.conceptAggregate.concept,
          this.conceptAggregate.parents,
          this.conceptAggregate.children
        );
      }
    },
    treeLocked(newValue) {
      if (!newValue) {
        this.refreshTree(
          this.conceptAggregate.concept,
          this.conceptAggregate.parents,
          this.conceptAggregate.children
        );
      }
    }
  },
  data() {
    return {
      searchResult: "",
      conceptAggregate: {} as any,
      root: [] as TreeNode[],
      expandedKeys: {} as any,
      selectedKey: {} as any,
      parentLabel: "",
      homeIris: [
        IM.NAMESPACE + "Sets",
        IM.NAMESPACE + "DiscoveryOntology",
        IM.NAMESPACE + "QT_QueryTemplates",
        IM.NAMESPACE + "InformationModel"
      ]
    };
  },
  async mounted() {
    await this.getConceptAggregate(this.conceptIri);
    this.createTree(
      this.conceptAggregate.concept,
      this.conceptAggregate.parents,
      this.conceptAggregate.children
    );
    if (!this.homeIris.includes(this.conceptAggregate.concept[IM.IRI])) {
      this.$store.commit("updateHistory", {
        url: this.$route.fullPath,
        conceptName: this.conceptAggregate.concept[RDFS.LABEL],
        view: this.$route.name
      } as HistoryItem);
    }
  },
  methods: {
    async getConceptAggregate(iri: string) {
      await Promise.all([
        EntityService.getPartialEntity(iri, [
          RDFS.LABEL,
          RDFS.COMMENT,
          RDF.TYPE
        ]).then(res => {
          this.conceptAggregate.concept = res.data;
        }),
        EntityService.getEntityParents(iri).then(res => {
          this.conceptAggregate.parents = res.data;
        }),
        EntityService.getEntityChildren(iri).then(res => {
          this.conceptAggregate.children = res.data;
        })
      ]).catch(err => {
        this.$toast.add(
          LoggerService.error(
            "Hierarchy tree concept aggregate fetch failed",
            err
          )
        );
      });
    },
    createTree(concept: any, parentHierarchy: any, children: any): void {
      if (this.root.length == 0) {
        this.refreshTree(concept, parentHierarchy, children);
      } else if (
        concept[IM.IRI] === IM.NAMESPACE + "InformationModel" ||
        concept[IM.IRI] === IM.NAMESPACE + "DiscoveryOntology" ||
        concept[IM.IRI] === IM.NAMESPACE + "Sets" ||
        concept[IM.IRI] === IM.NAMESPACE + "QT_QueryTemplates"
      ) {
        this.refreshTree(concept, parentHierarchy, children);
      }
    },

    refreshTree(concept: any, parentHierarchy: any, children: any): void {
      this.expandedKeys = {};
      const selectedConcept = this.createTreeNode(
        concept[RDFS.LABEL],
        concept[IM.IRI],
        concept[RDF.TYPE],
        concept[RDFS.LABEL],
        concept.hasChildren
      );

      children.forEach((child: any) => {
        selectedConcept.children.push(
          this.createTreeNode(
            child.name,
            child["@id"],
            child.type,
            child.name,
            child.hasChildren
          )
        );
      });
      this.root = [];

      if (parentHierarchy.length) {
        this.parentLabel = parentHierarchy[0].name;
      }

      this.root.push(selectedConcept);
      this.expandedKeys[selectedConcept.key] = true;
      this.selectedKey[selectedConcept.key] = true;
    },

    createTreeNode(
      conceptName: any,
      conceptIri: any,
      conceptTypes: any,
      level: any,
      hasChildren: boolean
    ): TreeNode {
      return {
        key: level,
        label: conceptName,
        typeIcon: getIconFromType(conceptTypes),
        color: getColourFromType(conceptTypes),
        data: conceptIri,
        leaf: !hasChildren,
        loading: false,
        children: []
      };
    },

    onNodeSelect(node: any): void {
      if (
        node.data === IM.NAMESPACE + "InformationModel" ||
        node.data === IM.NAMESPACE + "DiscoveryOntology" ||
        node.data === IM.NAMESPACE + "Sets" ||
        node.data === IM.NAMESPACE + "QT_QueryTemplates"
      ) {
        this.$router.push({ name: "Dashboard" });
      } else {
        this.$router.push({
          name: "Concept",
          params: { selectedIri: node.data }
        });
      }
    },

    async expandChildren(node: TreeNode): Promise<void> {
      node.loading = true;
      this.expandedKeys[node.key] = true;
      let children: any[] = [];
      await EntityService.getEntityChildren(node.data)
        .then(res => {
          children = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept children server request failed", err)
          );
        });

      children.forEach((child: any) => {
        if (!this.containsChild(node.children, child)) {
          node.children.push(
            this.createTreeNode(
              child.name,
              child["@id"],
              child.type,
              child.name,
              child.hasChildren
            )
          );
        }
      });
      node.loading = false;
    },

    containsChild(children: any[], child: any) {
      if (children.some(e => e.data === child["@id"])) {
        return true;
      }
      return false;
    },

    async expandParents(): Promise<void> {
      this.expandedKeys[this.root[0].key] = true;

      let parents: any[] = [];
      const parentsNodes: any[] = [];
      await EntityService.getEntityParents(this.root[0].data)
        .then(async res => {
          parents = res.data;
          parents.forEach((parent: any) => {
            parentsNodes.push(
              this.createTreeNode(
                parent.name,
                parent["@id"],
                parent.type,
                parent.name,
                true
              )
            );
          });

          parentsNodes.forEach((parentNode: TreeNode) => {
            parentNode.children.push(this.root[0]);
            this.expandedKeys[parentNode.key] = true;
          });

          this.root = parentsNodes;

          await EntityService.getEntityParents(this.root[0].data)
            .then(res => {
              if (res.data[0]) {
                this.parentLabel = res.data[0].name;
              } else {
                this.parentLabel = "";
              }
            })
            .catch(err => {
              this.$toast.add(
                LoggerService.error(
                  "Concept parents server request 2 failed",
                  err
                )
              );
            });
          // this refreshes the keys so they start open if children and parents were both expanded
          this.expandedKeys = { ...this.expandedKeys };
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept parents server request 1 failed", err)
          );
        });
    },

    resetConcept(): void {
      if (this.parentLabel !== "Information Model") {
        this.parentLabel = "";
      }
      this.selectedKey = {};
      this.$emit("showTree");
      this.$store.commit("updateConceptIri", this.sideNavHierarchyFocus.iri);
      this.$router.push({ name: "Dashboard" });
    },

    toggleTreeLocked(value: boolean): void {
      this.$store.commit("updateTreeLocked", value);
    }
  }
});
</script>

<style scoped>
#hierarchy-tree-bar-container {
  height: 100%;
}

.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0rem !important;
  transition: box-shadow 3600s 3600s !important;
}

.p-tree-toggler {
  margin-right: 0 !important;
}

.tree-root {
  height: 100%;
  overflow: auto;
}
.p-tree-toggler,
.p-tree-toggler-icon {
  min-width: 2rem;
}

.p-progress-spinner {
  width: 1.25em !important;
  height: 1.25em !important;
}
</style>
