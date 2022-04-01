<template>
  <div id="concept-main-container">
    <Panel>
      <template #icons>
        <div class="icons-container">
          <button
            class="p-panel-header-icon p-link p-mr-2"
            @click="focusTree"
            v-tooltip.left="'Focus hierarchy tree to this concept'"
          >
            <i class="fas fa-sitemap" aria-hidden="true"></i>
          </button>
          <div v-if="Object.keys(concept).length" class="copy-container">
            <Button
              icon="far fa-copy"
              class="p-button-rounded p-button-text p-button-secondary"
              v-clipboard:copy="copyConceptToClipboard()"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
              v-tooltip="
                'Copy concept to clipboard \n (right click to copy individual properties)'
              "
              @contextmenu="onCopyRightClick"
            />
            <ContextMenu ref="copyMenu" :model="copyMenuItems" />
          </div>
          <button
            class="p-panel-header-icon p-link p-mr-2"
            @click="openDownloadDialog"
            v-tooltip.bottom="'Download concept'"
          >
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
        <div v-if="Object.keys(concept).length" id="concept-panel-container">
          <TabView v-model:activeIndex="active" :lazy="true">
            <TabPanel header="Definition">
              <div
                class="concept-panel-content"
                id="definition-container"
                :style="contentHeight"
              >
                <Definition
                  :concept="concept"
                  :semanticProperties="semanticProperties"
                  :dataModelProperties="dataModelProperties"
                  :contentHeight="contentHeightValue"
                />
              </div>
            </TabPanel>
            <TabPanel header="Terms">
              <div
                class="concept-panel-content"
                id="terms-container"
                :style="contentHeight"
              >
                <Terms :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Maps" v-if="isClass">
              <div
                class="concept-panel-content"
                id="complex-mappings-container"
                :style="contentHeight"
              >
                <ComplexMappings
                  :conceptIri="conceptIri"
                  @toTermsClicked="showTerms"
                />
              </div>
            </TabPanel>
            <TabPanel header="Used in">
              <div
                class="concept-panel-content"
                id="usedin-container"
                :style="contentHeight"
              >
                <UsedIn :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Graph" v-if="isClass">
              <div
                class="concept-panel-content"
                id="graph-container"
                :style="contentHeight"
              >
                <Graph :conceptIri="conceptIri" />
              </div>
            </TabPanel>
            <TabPanel header="Members" v-if="isSet">
              <div
                class="concept-panel-content"
                id="members-container"
                :style="contentHeight"
              >
                <Members :conceptIri="conceptIri" @memberClick="active = 0" />
              </div>
            </TabPanel>
            <TabPanel header="Hierarchy position">
              <div
                class="concept-panel-content"
                id="secondary-tree-container"
                :style="contentHeight"
              >
                <SecondaryTree :conceptIri="conceptIri" />
              </div>
            </TabPanel>
          </TabView>
        </div>
        <DownloadDialog
          v-if="showDownloadDialog"
          @closeDownloadDialog="closeDownloadDialog"
          :showDialog="showDownloadDialog"
          :conceptIri="conceptIri"
        />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Graph from "../components/concept/Graph.vue";
import Terms from "../components/concept/Terms.vue";
import Definition from "../components/concept/Definition.vue";
import UsedIn from "../components/concept/UsedIn.vue";
import Members from "../components/concept/Members.vue";
import PanelHeader from "../components/concept/PanelHeader.vue";
import ComplexMappings from "../components/concept/ComplexMappings.vue";
import { isValueSet, isClass, isQuery } from "@/helpers/ConceptTypeMethods";
import { mapState } from "vuex";
import DownloadDialog from "@/components/concept/DownloadDialog.vue";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import SecondaryTree from "../components/concept/SecondaryTree.vue";

export default defineComponent({
  name: "Concept",
  components: {
    PanelHeader,
    Graph,
    Terms,
    UsedIn,
    Members,
    Definition,
    DownloadDialog,
    SecondaryTree,
    ComplexMappings
  },
  computed: {
    isSet(): boolean {
      return isValueSet(this.types);
    },

    isClass(): boolean {
      return isClass(this.types);
    },

    isQuery(): boolean {
      return isQuery(this.types);
    },

    ...mapState(["conceptIri"])
  },
  watch: {
    async conceptIri() {
      this.init();
    },
    concept(newValue) {
      if (newValue && Object.keys(newValue).length) {
        this.setCopyMenuItems();
      }
    }
  },
  async mounted() {
    await this.init();

    window.addEventListener("resize", this.onResize);

    this.setContentHeight();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      editDialogView: true,
      showDownloadDialog: false,
      concept: {} as any,
      semanticProperties: [] as any[],
      dataModelProperties: [] as any[],
      definitionText: "",
      display: false,
      types: [],
      header: "",
      dialogHeader: "",
      active: 0,
      contentHeight: "",
      contentHeightValue: 0,
      copyMenuItems: [] as any
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
        params: { iri: this.concept.iri }
      });
    },

    directToCreateRoute(): void {
      this.$router.push({ name: "Create" });
    },

    setContentHeight(): void {
      const container = document.getElementById(
        "concept-main-container"
      ) as HTMLElement;
      const header = container?.getElementsByClassName(
        "p-panel-header"
      )[0] as HTMLElement;
      const nav = container?.getElementsByClassName(
        "p-tabview-nav"
      )[0] as HTMLElement;
      const currentFontSize = parseFloat(
        window
          .getComputedStyle(document.documentElement, null)
          .getPropertyValue("font-size")
      );
      if (header && container && nav && currentFontSize) {
        const calcHeight =
          container.getBoundingClientRect().height -
          header.getBoundingClientRect().height -
          nav.getBoundingClientRect().height -
          4 * currentFontSize -
          1;
        this.contentHeight =
          "height: " + calcHeight + "px;max-height: " + calcHeight + "px;";
        this.contentHeightValue = calcHeight;
      } else {
        this.contentHeight = "height: 800px; max-height: 800px;";
        this.contentHeightValue = 800;
        LoggerService.error(
          "Content sizing error",
          "failed to get element(s) for concept content resizing"
        );
      }
    },

    async getConcept(iri: string) {
      await EntityService.getEntityDefinitionDto(iri)
        .then(res => {
          this.concept = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get concept definition dto from server",
              err
            )
          );
        });
    },

    async getProperties(iri: string) {
      await EntityService.getSemanticProperties(iri)
        .then(res => {
          this.semanticProperties = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get semantic properties from server",
              err
            )
          );
        });

      await EntityService.getDataModelProperties(iri)
        .then(res => {
          this.dataModelProperties = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get data model properties from server",
              err
            )
          );
        });
    },

    async init() {
      this.active = 0;
      await this.getProperties(this.conceptIri);
      await this.getConcept(this.conceptIri);
      this.types = this.concept.types;
      this.header = this.concept.name;
      this.$store.commit(
        "updateSelectedEntityType",
        this.isSet
          ? "Set"
          : this.isClass
          ? "Class"
          : this.isQuery
          ? "Query"
          : "None"
      );
    },

    openDownloadDialog(): void {
      this.showDownloadDialog = true;
    },

    closeDownloadDialog(): void {
      this.showDownloadDialog = false;
    },

    copyConceptToClipboard(): string {
      let isasString = "";
      let subTypesString = "";
      let semanticPropertiesString = "";
      let dataModelPropertiesString = "";
      let typesString = "";
      if (this.concept.isa.length > 0) {
        isasString = this.concept.isa
          .map((item: any) => item.name)
          .join(",\n\t");
      }
      if (this.concept.subtypes.length > 0) {
        subTypesString = this.concept.subtypes
          .map((item: any) => item.name)
          .join(",\n\t");
      }
      if (this.semanticProperties.length > 0) {
        semanticPropertiesString = this.semanticProperties
          .map((item: any) => item.property.name)
          .join(",\n\t");
      }
      if (this.dataModelProperties.length > 0) {
        dataModelPropertiesString = this.dataModelProperties
          .map((item: any) => item.property.name)
          .join(",\n\t");
      }
      if (this.concept.types.length > 0) {
        typesString = this.concept.types
          .map((item: any) => item.name)
          .join(",\n\t");
      }
      let returnString =
        "Name: " +
        this.concept.name +
        ",\nIri: " +
        this.concept.iri +
        ",\nStatus: " +
        this.concept.status +
        ",\nTypes: " +
        "[\n\t" +
        typesString +
        "\n]" +
        ",\nIs-a: " +
        "[\n\t" +
        isasString +
        "\n]" +
        ",\nSubtypes: " +
        "[\n\t" +
        subTypesString +
        "\n]" +
        ",\nSemantic properties: " +
        "[\n\t" +
        semanticPropertiesString +
        "\n]" +
        ",\nData model properties: " +
        "[\n\t" +
        dataModelPropertiesString +
        "\n]";
      if (this.concept.description) {
        returnString =
          returnString + ",\nDescription: " + this.concept.description;
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
      let isasString = "";
      let subTypesString = "";
      let semanticPropertiesString = "";
      let dataModelPropertiesString = "";
      let typesString = "";
      if ("isa" in this.concept && this.concept.isa.length > 0) {
        isasString = this.concept.isa
          .map((item: any) => item.name)
          .join(",\n\t");
      }
      if ("subtypes" in this.concept && this.concept.subtypes.length > 0) {
        subTypesString = this.concept.subtypes
          .map((item: any) => item.name)
          .join(",\n\t");
      }
      if (this.semanticProperties.length > 0) {
        semanticPropertiesString = this.semanticProperties
          .map((item: any) => item.property.name)
          .join(",\n\t");
      }
      if (this.dataModelProperties.length > 0) {
        dataModelPropertiesString = this.dataModelProperties
          .map((item: any) => item.property.name)
          .join(",\n\t");
      }
      if (this.concept.types.length > 0) {
        typesString = this.concept.types
          .map((item: any) => item.name)
          .join(",\n\t");
      }
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
                this.$toast.add(
                  LoggerService.success("Concept copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy concept to clipboard",
                    err
                  )
                );
              });
          }
        },
        {
          label: "Name",
          command: async () => {
            await navigator.clipboard
              .writeText("Name: " + this.concept.name)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Name copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy name to clipboard", err)
                );
              });
          }
        },
        {
          label: "Iri",
          command: async () => {
            await navigator.clipboard
              .writeText("Iri: " + this.concept.iri)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Iri copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy iri to clipboard", err)
                );
              });
          }
        },
        {
          label: "Status",
          command: async () => {
            await navigator.clipboard
              .writeText("Status: " + this.concept.status)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Status copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy status to clipboard", err)
                );
              });
          }
        },
        {
          label: "Types",
          command: async () => {
            await navigator.clipboard
              .writeText("Types: [\n\t" + typesString + "\n]")
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Types copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy types to clipboard", err)
                );
              });
          }
        },
        {
          label: "Is a",
          command: async () => {
            await navigator.clipboard
              .writeText("Is-a: [\n\t" + isasString + "\n]")
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Is-a's copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy is-a's to clipboard", err)
                );
              });
          }
        },
        {
          label: "Subtypes",
          command: async () => {
            await navigator.clipboard
              .writeText("Subtypes: [\n\t" + subTypesString + "\n]")
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Subtypes copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy subtypes to clipboard",
                    err
                  )
                );
              });
          }
        },
        {
          label: "Semantic properties",
          command: async () => {
            await navigator.clipboard
              .writeText(
                "Semantic properties: [\n\t" + semanticPropertiesString + "\n]"
              )
              .then(() => {
                this.$toast.add(
                  LoggerService.success(
                    "Semantic properties copied to clipboard"
                  )
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy semantic properties to clipboard",
                    err
                  )
                );
              });
          }
        },
        {
          label: "Data model properties",
          command: async () => {
            await navigator.clipboard
              .writeText(
                "Data model properties: [\n\t" +
                  dataModelPropertiesString +
                  "\n]"
              )
              .then(() => {
                this.$toast.add(
                  LoggerService.success(
                    "Data model properties copied to clipboard"
                  )
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy data model properties to clipboard",
                    err
                  )
                );
              });
          }
        }
      ];
      if (this.concept.description) {
        this.copyMenuItems.push({
          label: "Description",
          command: async () => {
            await navigator.clipboard
              .writeText("Description: " + this.concept.description)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Description copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error(
                    "Failed to copy description to clipboard",
                    err
                  )
                );
              });
          }
        });
      }
    },

    showTerms() {
      this.active = 1;
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
</style>
