<template>
  <div id="concept-main-container">
    <!-- <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div> -->
    <Panel>
      <template #icons>
        <div class="icons-container">
          <button class="p-panel-header-icon p-link p-mr-2" @click="focusTree" v-tooltip.left="'Focus hierarchy tree to this concept'">
            <i class="fas fa-sitemap" aria-hidden="true"></i>
          </button>
          <div
            v-if="
              Object.keys(concept).includes('http://endhealth.info/im#isA') &&
                Object.keys(concept).includes('subtypes') &&
                Object.keys(concept).includes('dataModelProperties')
            "
            class="copy-container"
          >
            <Button
              icon="far fa-copy"
              class="p-button-rounded p-button-text p-button-secondary"
              v-clipboard:copy="copyConceptToClipboard()"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
              v-tooltip="'Copy concept to clipboard \n (right click to copy individual properties)'"
              @contextmenu="onCopyRightClick"
            />
            <ContextMenu ref="copyMenu" :model="copyMenuItems" />
          </div>
          <button class="p-panel-header-icon p-link p-mr-2" @click="openDownloadDialog" v-tooltip.bottom="'Download concept'">
            <i class="fas fa-cloud-download-alt" aria-hidden="true"></i>
          </button>
          <!--<button
            class="p-panel-header-icon p-link p-mr-2"
            @click="directToCreateRoute"
            v-tooltip.bottom="'Create new concept'"
          >
            <i class="fas fa-plus-circle" aria-hidden="true"></i>
          </button>
          <button
            class="p-panel-header-icon p-link p-mr-2"
            @click="directToEditRoute"
            v-tooltip.bottom="'Edit concept'"
          >
            <i class="fas fa-pencil-alt" aria-hidden="true"></i>
          </button>-->
        </div>
      </template>
      <template #header>
        <PanelHeader :types="types" :header="header" />
      </template>
      <div id="concept-content-dialogs-container">
        <div id="concept-panel-container">
          <TabView v-model:activeIndex="active" :lazy="true">
            <TabPanel header="Definition">
              <div v-if="loading" class="loading-container" :style="contentHeight">
                <ProgressSpinner />
              </div>
              <div v-else class="concept-panel-content" id="definition-container" :style="contentHeight">
                <Definition :concept="concept" :configs="configs" />
              </div>
            </TabPanel>
            <TabPanel header="Maps" v-if="showMappings">
              <div class="concept-panel-content" id="mappings-container" :style="contentHeight">
                <Mappings :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Used in">
              <div class="concept-panel-content" id="usedin-container" :style="contentHeight">
                <UsedIn :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Graph" v-if="showGraph">
              <div class="concept-panel-content" id="graph-container" :style="contentHeight">
                <Graph :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Properties" v-if="isRecordModel">
              <div class="concept-panel-content" id="properties-container" :style="contentHeight">
                <Properties :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Members" v-if="isSet">
              <div class="concept-panel-content" id="members-container" :style="contentHeight">
                <Members :conceptIri="conceptIri" @memberClick="active = 0" />
              </div>
            </TabPanel>
            <TabPanel header="Hierarchy position">
              <div class="concept-panel-content" id="secondary-tree-container" :style="contentHeight">
                <SecondaryTree :conceptIri="conceptIri" />
              </div>
            </TabPanel>
          </TabView>
        </div>
        <DownloadDialog v-if="showDownloadDialog" @closeDownloadDialog="closeDownloadDialog" :showDialog="showDownloadDialog" :conceptIri="conceptIri" />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Graph from "../components/concept/Graph.vue";
import Definition from "../components/concept/Definition.vue";
import UsedIn from "../components/concept/UsedIn.vue";
import Members from "../components/concept/Members.vue";
import PanelHeader from "../components/concept/PanelHeader.vue";
import Mappings from "../components/concept/Mappings.vue";
import { isOfTypes, isValueSet } from "@/helpers/ConceptTypeMethods";
import { mapState } from "vuex";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import EntityService from "@/services/EntityService";
import ConfigService from "@/services/ConfigService";
import LoggerService from "@/services/LoggerService";
import SecondaryTree from "../components/concept/SecondaryTree.vue";
import { IM } from "@/vocabulary/IM";
import { RDF } from "@/vocabulary/RDF";
import { RDFS } from "@/vocabulary/RDFS";
import { MODULE_IRIS } from "@/helpers/ModuleIris";
import { OWL } from "@/vocabulary/OWL";
import { SHACL } from "@/vocabulary/SHACL";
import Properties from "@/components/concept/Properties.vue";

export default defineComponent({
  name: "Concept",
  components: {
    PanelHeader,
    Graph,
    UsedIn,
    Members,
    Definition,
    DownloadDialog,
    SecondaryTree,
    Mappings,
    Properties
  },
  computed: {
    isSet(): boolean {
      return isValueSet(this.types);
    },

    showGraph(): boolean {
      return isOfTypes(this.types, OWL.CLASS, SHACL.NODESHAPE);
    },

    showMappings(): boolean {
      return isOfTypes(this.types, OWL.CLASS) && !isOfTypes(this.types, SHACL.NODESHAPE);
    },

    isClass(): boolean {
      return isOfTypes(this.types, OWL.CLASS);
    },

    isQuery(): boolean {
      return isOfTypes(this.types, IM.QUERY_TEMPLATE);
    },

    isRecordModel(): boolean {
      return isOfTypes(this.types, SHACL.NODESHAPE);
    },

    isFolder(): boolean {
      return isOfTypes(this.types, IM.FOLDER);
    },

    isProperty(): boolean {
      return isOfTypes(this.types, OWL.OBJECT_PROPERTY, IM.DATA_PROPERTY);
    },

    ...mapState(["conceptIri", "selectedEntityType", "conceptActivePanel", "activeModule"])
  },
  watch: {
    async conceptIri() {
      this.init();
    },

    selectedEntityType(newValue, oldValue) {
      this.setActivePanel(newValue, oldValue);
    },

    active(newValue) {
      this.$store.commit("updateConceptActivePanel", newValue);
    }
  },
  async mounted() {
    await this.init();
    if (this.activeModule === "Sets") {
      this.active = 2;
    }
    if (this.activeModule === "DataModel") {
      this.active = 3;
    }

    window.addEventListener("resize", this.onResize);

    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      loading: false,
      editDialogView: true,
      showDownloadDialog: false,
      concept: {} as any,
      definitionText: "",
      display: false,
      types: [],
      header: "",
      dialogHeader: "",
      active: 0,
      contentHeight: "",
      contentHeightValue: 0,
      copyMenuItems: [] as any,
      configs: [] as any,
      axiomObject: {} as any
    };
  },
  methods: {
    onResize(): void {
      this.setContentHeight();
    },

    focusTree(): void {
      this.$store.commit("updateFocusTree", true);
    },

    directToEditRoute(): void {
      this.$router.push({
        name: "Edit",
        params: { iri: this.concept["@id"] }
      });
    },

    directToCreateRoute(): void {
      this.$router.push({ name: "Create" });
    },

    async getConcept(iri: string) {
      const predicates = this.configs
        .filter((c: any) => c.type !== "Divider")
        .filter((c: any) => c.predicate !== "subtypes")
        .filter((c: any) => c.predicate !== "semanticProperties")
        .filter((c: any) => c.predicate !== "dataModelProperties")
        .filter((c: any) => c.predicate !== "termCodes")
        .filter((c: any) => c.predicate !== "axioms")
        .map((c: any) => c.predicate);

      await EntityService.getPartialEntity(iri, predicates)
        .then(res => {
          this.concept = res.data;
          if (!Object.prototype.hasOwnProperty.call(this.concept, IM.IS_A)) {
            this.concept[IM.IS_A] = [];
          }
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get concept partial entity from server.", err));
        });

      await EntityService.getEntityChildren(iri)
        .then(res => {
          this.concept["subtypes"] = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get subtypes from server.", err));
        });

      await EntityService.getEntityTermCodes(iri)
        .then(res => {
          this.concept["termCodes"] = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get terms from server", err));
        });
    },

    async getProperties(iri: string) {
      await EntityService.getSemanticProperties(iri)
        .then(res => {
          this.concept["semanticProperties"] = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get semantic properties from server", err));
        });

      await EntityService.getDataModelProperties(iri)
        .then(res => {
          this.concept["dataModelProperties"] = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get data model properties from server", err));
        });
    },

    async getAxioms(iri: string) {
      await EntityService.getAxioms(iri)
        .then(res => {
          this.axiomObject = res.data;
          if (Object.prototype.hasOwnProperty.call(this.axiomObject, "entity")) {
            const predicateCount = Object.keys(this.axiomObject.entity)
              .filter(key => key !== RDF.TYPE)
              .filter(key => key !== RDFS.COMMENT)
              .filter(key => key !== RDFS.LABEL)
              .filter(key => key !== "@id").length;
            this.concept["axioms"] = {
              axiomString: this.axiomToString(this.axiomObject.entity),
              count: predicateCount
            };
          }
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get axioms from server", err));
        });
    },

    async getConfig(name: string) {
      await ConfigService.getComponentLayout(name)
        .then(res => {
          this.configs = res.data;
          this.configs.sort((a: any, b: any) => {
            return a.order - b.order;
          });
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get config data from server", err));
        });
    },

    async init() {
      this.loading = true;
      await this.getConfig("definition");
      await this.getConcept(this.conceptIri);
      await this.getProperties(this.conceptIri);
      await this.getAxioms(this.conceptIri);
      this.types = Object.prototype.hasOwnProperty.call(this.concept, RDF.TYPE) ? this.concept[RDF.TYPE] : [];
      this.header = this.concept[RDFS.LABEL];
      this.setCopyMenuItems();
      this.setStoreType();
      this.loading = false;
    },

    setStoreType() {
      let type;
      if (this.isSet) {
        type = "Sets";
      } else if (this.isClass && !this.isRecordModel) {
        type = "Ontology";
      } else if (this.isQuery) {
        type = "Queries";
      } else if (this.isRecordModel) {
        type = "DataModel";
      } else {
        type = this.activeModule;
      }

      this.$store.commit("updateSelectedEntityType", type);
      if (!MODULE_IRIS.includes(this.conceptIri)) {
        this.$store.commit("updateModuleSelectedEntities", {
          module: type,
          iri: this.conceptIri
        });
      }
    },

    setActivePanel(newType: string, oldType: string) {
      if (newType === oldType) {
        this.active = this.conceptActivePanel;
      } else {
        if (newType === "Sets") {
          this.active = 2;
        } else if (newType === "DataModel") {
          this.active = 3;
        } else {
          this.active = 0;
        }
      }
    },

    setContentHeight(): void {
      const container = document.getElementById("concept-main-container") as HTMLElement;
      const header = container?.getElementsByClassName("p-panel-header")[0] as HTMLElement;
      const nav = container?.getElementsByClassName("p-tabview-nav")[0] as HTMLElement;
      const currentFontSize = parseFloat(window.getComputedStyle(document.documentElement, null).getPropertyValue("font-size"));
      if (header && container && nav && currentFontSize) {
        const calcHeight =
          container.getBoundingClientRect().height - header.getBoundingClientRect().height - nav.getBoundingClientRect().height - 4 * currentFontSize - 1;
        this.contentHeight = "height: " + calcHeight + "px;max-height: " + calcHeight + "px;";
        this.contentHeightValue = calcHeight;
      } else {
        this.contentHeight = "height: 800px; max-height: 800px;";
        this.contentHeightValue = 800;
        LoggerService.error("Content sizing error", "failed to get element(s) for concept content resizing");
      }
    },

    openDownloadDialog(): void {
      this.showDownloadDialog = true;
    },

    closeDownloadDialog(): void {
      this.showDownloadDialog = false;
    },

    conceptObjectToCopyString(key: string, value: any, counter: number, totalKeys: number): { label: string; value: string } | undefined {
      let newString = "";
      let returnString = "";
      const label = this.configs.find((config: any) => config.predicate === key);
      if (!label) {
        return;
      }
      let newKey = label.label;
      if (Array.isArray(value)) {
        if (value.length) {
          if (Object.prototype.hasOwnProperty.call(value[0], "name")) {
            newString = value.map(item => item.name).join(",\n\t");
          } else if (Object.prototype.hasOwnProperty.call(value[0], "property") && Object.prototype.hasOwnProperty.call(value[0].property, "name")) {
            newString = value.map(item => item.property.name).join(",\n\t");
          } else {
            LoggerService.warn(
              undefined,
              "Uncovered object property or missing name found for key: " + key + " at conceptObjectToCopyString within Concept.vue"
            );
          }
          if (counter === totalKeys - 1) {
            returnString = newKey + ": [\n\t" + newString + "\n]";
          } else {
            returnString = newKey + ": [\n\t" + newString + "\n],\n";
          }
        } else {
          if (counter === totalKeys - 1) {
            returnString = newKey + ": [\n\t\n]";
          } else {
            returnString = newKey + ": [\n\t\n],\n";
          }
        }
      } else if (Object.prototype.toString.call(value) === "[object Object]" && Object.prototype.hasOwnProperty.call(value, "name")) {
        newString = value.name;
        if (counter === totalKeys - 1) {
          returnString = newKey + ": " + newString;
        } else {
          returnString = newKey + ": " + newString + ",\n";
        }
      } else if (Object.prototype.toString.call(value) === "[object Object]" && Object.prototype.hasOwnProperty.call(value, "axiomString")) {
        newString = value.axiomString;
        if (counter === totalKeys - 1) {
          returnString = newKey + ': "\n' + newString + '\n"';
        } else {
          returnString = newKey + ': "\n' + newString + '\n",\n';
        }
      } else if (typeof value === "string") {
        newString = value.replace(/\n/g, "\n\t").replace(/<p>/g, "\n\t") as string;
        if (counter === totalKeys - 1) {
          returnString = newKey + ": " + newString;
        } else {
          returnString = newKey + ": " + newString + ",\n";
        }
      } else {
        returnString = JSON.stringify(value);
      }
      return { label: newKey, value: returnString };
    },

    copyConceptToClipboard(): string {
      const totalKeys = Object.keys(this.concept).length;
      let counter = 0;
      let returnString = "";
      let key: string;
      let value: any;
      for ([key, value] of Object.entries(this.concept)) {
        const copyString = this.conceptObjectToCopyString(key, value, counter, totalKeys);
        if (copyString) returnString += copyString.value;
        counter++;
      }
      return returnString;
    },

    onCopy(): void {
      this.$toast.add(LoggerService.success("Value copied to clipboard"));
    },

    onCopyError(): void {
      this.$toast.add(LoggerService.error("Failed to copy value to clipboard"));
    },

    onCopyRightClick(event: any) {
      const x = this.$refs.copyMenu as any;
      x.show(event);
    },

    setCopyMenuItems() {
      this.copyMenuItems = [
        {
          label: "Copy",
          disabled: true
        },
        {
          separator: true
        },
        {
          label: "All",
          command: async () => {
            await navigator.clipboard
              .writeText(this.copyConceptToClipboard())
              .then(() => {
                this.$toast.add(LoggerService.success("Concept copied to clipboard"));
              })
              .catch(err => {
                this.$toast.add(LoggerService.error("Failed to copy concept to clipboard", err));
              });
          }
        }
      ];

      let key: string;
      let value: any;
      for ([key, value] of Object.entries(this.concept)) {
        let result = this.conceptObjectToCopyString(key, value, 0, 1);
        if (!result) return;
        const label = result.label;
        const text = result.value;
        this.copyMenuItems.push({
          label: label,
          command: async () => {
            await navigator.clipboard
              .writeText(text)
              .then(() => {
                this.$toast.add(LoggerService.success(label + " copied to clipboard"));
              })
              .catch(err => {
                this.$toast.add(LoggerService.error("Failed to copy " + label + " to clipboard", err));
              });
          }
        });
      }
    },

    axiomToString(entity: any): string {
      let axiomString = "";
      let depth = 0;
      if (Object.prototype.hasOwnProperty.call(entity, OWL.EQUIVALENT_CLASS)) {
        axiomString += "Equivalent class";
        let axiom = entity[OWL.EQUIVALENT_CLASS];
        axiom.forEach((element: any) => {
          axiomString += this.processAxiom(element, depth);
        });
      }
      if (Object.prototype.hasOwnProperty.call(entity, RDFS.SUB_PROPERTY_OF)) {
        axiomString += "Sub property of";
        let axiom = entity[RDFS.SUB_PROPERTY_OF];
        axiom.forEach((element: any) => {
          axiomString += this.processAxiom(element, depth);
        });
      }
      if (Object.prototype.hasOwnProperty.call(entity, RDFS.SUBCLASS_OF)) {
        axiomString += "Subclass of";
        let axiom = entity[RDFS.SUBCLASS_OF];
        axiom.forEach((element: any) => {
          axiomString += this.processAxiom(element, depth);
        });
      }
      return axiomString;
    },

    processAxiom(axiom: any, depth: number) {
      let axiomString = "";
      if (Array.isArray(axiom)) {
        axiom.forEach((element: any) => {
          axiomString += this.childToString(element, depth + 1);
        });
      }
      if (Object.prototype.toString.call(axiom) === "[object Object]") {
        axiomString += this.childToString(axiom, depth + 1);
      }
      return axiomString;
    },

    childToString(child: any, depth: number) {
      let childString = "";
      if (Object.prototype.toString.call(child) === "[object Object]") {
        if (Object.prototype.hasOwnProperty.call(child, "name")) {
          childString += "\n" + "    ".repeat(depth) + child.name;
        }
        if (Object.prototype.hasOwnProperty.call(child, OWL.INTERSECTION_OF)) {
          childString += "\n" + "    ".repeat(depth) + "Intersection of";
          childString += this.processAxiom(child[OWL.INTERSECTION_OF], depth);
        }
        if (Object.prototype.hasOwnProperty.call(child, RDF.TYPE)) {
          childString += "\n" + "    ".repeat(depth) + "Having";
          if (Object.prototype.hasOwnProperty.call(child, RDF.TYPE)) {
            childString += " type " + child[RDF.TYPE].name;
          }
          if (Object.prototype.hasOwnProperty.call(child, OWL.ON_PROPERTY)) {
            childString += " on property " + child[OWL.ON_PROPERTY].name;
          }
          if (Object.prototype.hasOwnProperty.call(child, OWL.SOME_VALUES_FROM)) {
            childString += "\n" + "    ".repeat(depth + 1) + "Some values from";
            childString += this.processAxiom(child[OWL.SOME_VALUES_FROM], depth + 1);
          }
        }
      }
      return childString;
    }
  }
});
</script>
<style scoped>
#concept-main-container {
  grid-area: content;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow-y: auto;
  background-color: #ffffff;
}

.p-tabview-panel {
  min-height: 100%;
}

.p-panel {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: 100%;
}

.concept-panel-content {
  overflow: auto;
  background-color: #ffffff;
}

.copy-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.icons-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}

.loading-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
</style>
