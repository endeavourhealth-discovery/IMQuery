<template>
  <div id="search-results-container" class="p-field">
    <div
      class="p-d-flex p-flex-row p-jc-center"
      v-if="$store.state.loading.get('searchResults')"
    >
      <div class="p-text-center">
        <ProgressSpinner />
      </div>
    </div>
    <DataTable
      v-else
      :value="searchResults"
      v-model:selection="selectedResult"
      @row-select="onNodeSelect"
      selectionMode="single"
      class="p-datatable-sm"
      :scrollable="true"
      removableSort
      :paginator="true"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      :rowsPerPageOptions="[15, 25, 50]"
      currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
      :rows="15"
      @page="scrollToTop"
    >
      <template #empty>
        None
      </template>
      <template #loading>
        Loading...
      </template>
      <Column field="name" header="Results">
        <template #body="slotProps">
          <div
            class="result-container"
            @mouseenter="showOverlay($event, slotProps.data)"
            @mouseleave="hideOverlay()"
          >
            <div class="result-icon-container">
              <i
                :class="getPerspectiveByConceptType(slotProps.data.entityType)"
                class="result-icon"
                :style="getColorByConceptType(slotProps.data.entityType)"
                aria-hidden="true"
              />
            </div>
            <div class="result-text-container">
              {{ slotProps.data.match }}<br />
              <small style="color:lightgrey">{{ slotProps.data.name }}</small>
            </div>
            <div class="button-container">
              <Button
                icon="pi pi-copy"
                class="p-button-rounded p-button-text p-button-secondary"
                v-clipboard:copy="copyConceptToClipboard(slotProps.data)"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyError"
                v-tooltip.right="
                  'Copy concept summary to clipboard \n (right click to copy individual properties)'
                "
                @contextmenu="onCopyRightClick"
              />
              <ContextMenu ref="copyMenu" :model="copyMenuItems" />
            </div>
          </div>
        </template>
      </Column>
    </DataTable>

    <OverlayPanel
      ref="op"
      id="overlay-panel"
      style="width: 25vw"
      :dismissable="true"
    >
      <div class="result-overlay">
        <div class="left-side" v-if="hoveredResult.iri">
          <p>
            <strong>Name: </strong>
            <span>
              {{ hoveredResult.name }}
            </span>
          </p>
          <p>
            <strong>Iri: </strong>
            <span style="word-break:break-all;">
              {{ hoveredResult.iri }}
            </span>
          </p>
          <p>
            <strong>Code: </strong>
            <span>
              {{ hoveredResult.code }}
            </span>
          </p>
        </div>
        <div class="right-side" v-if="hoveredResult.iri">
          <p>
            <strong>Status: </strong>
            <span v-if="hoveredResult.status">
              {{ hoveredResult.status.name }}
            </span>
          </p>
          <p>
            <strong>Scheme: </strong>
            <span v-if="hoveredResult.scheme">
              {{ hoveredResult.scheme.name }}
            </span>
          </p>
          <p>
            <strong>Type: </strong>
            <span>
              {{ getConceptTypes(hoveredResult) }}
            </span>
          </p>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script lang="ts">
import { ConceptSummary } from "@/models/search/ConceptSummary";
import { SearchResponse } from "@/models/search/SearchResponse";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "vue";
import { mapState } from "vuex";
import {
  getColourFromType,
  getIconFromType
} from "../../helpers/ConceptTypeMethods";

export default defineComponent({
  name: "SearchResults",
  components: {},
  computed: mapState(["searchResults"]),
  watch: {
    searchResults(newValue) {
      this.results = newValue;
    }
  },
  data() {
    return {
      results: new SearchResponse() as SearchResponse,
      selectedResult: {} as ConceptSummary,
      hoveredResult: {} as ConceptSummary | any,
      copyMenuItems: [] as any
    };
  },
  methods: {
    getPerspectiveByConceptType(conceptType: any): any {
      return getIconFromType(conceptType);
    },

    getColorByConceptType(conceptType: any): any {
      return "color:" + getColourFromType(conceptType);
    },

    onNodeSelect(): void {
      this.$router.push({
        name: "Concept",
        params: { selectedIri: this.selectedResult.iri }
      });
    },

    scrollToTop(): void {
      const resultsContainer = document.getElementById(
        "search-results-container"
      ) as HTMLElement;
      const scrollBox = resultsContainer?.getElementsByClassName(
        "p-datatable-wrapper"
      )[0] as HTMLElement;
      if (scrollBox) {
        scrollBox.scrollTop = 0;
      }
    },

    hideOverlay(): void {
      const x = this.$refs.op as any;
      x.hide();
    },

    async showOverlay(event: any, data: any): Promise<void> {
      this.hoveredResult = data;
      this.setCopyMenuItems();
      const x = this.$refs.op as any;
      x.show(event, event.target);
    },

    getConceptTypes(concept: any): any {
      return concept.entityType
        .map(function(type: any) {
          return type.name;
        })
        .join(", ");
    },

    copyConceptToClipboard(data: any): string {
      let typesString = "";
      if (data.entityType.length > 0) {
        typesString = data.entityType
          .map((item: any) => item.name)
          .join(",\n\t");
      }
      return (
        "Name: " +
        data.name +
        ",\nIri: " +
        data.iri +
        ",\nCode: " +
        data.code +
        ",\nStatus: " +
        data.status.name +
        ",\nScheme: " +
        data.scheme.name +
        ",\nTypes: " +
        "[\n\t" +
        typesString +
        "\n]"
      );
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
              .writeText(this.copyConceptToClipboard(this.hoveredResult))
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
              .writeText(this.hoveredResult.name)
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
              .writeText(this.hoveredResult.iri)
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
          label: "Code",
          command: async () => {
            await navigator.clipboard
              .writeText(this.hoveredResult.code)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Code copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy code to clipboard", err)
                );
              });
          }
        },
        {
          label: "Status",
          command: async () => {
            await navigator.clipboard
              .writeText(this.hoveredResult.status.name)
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
          label: "Scheme",
          command: async () => {
            await navigator.clipboard
              .writeText(this.hoveredResult.scheme.name)
              .then(() => {
                this.$toast.add(
                  LoggerService.success("Scheme copied to clipboard")
                );
              })
              .catch(err => {
                this.$toast.add(
                  LoggerService.error("Failed to copy scheme to clipboard", err)
                );
              });
          }
        },
        {
          label: "Types",
          command: async () => {
            await navigator.clipboard
              .writeText(this.getConceptTypes(this.hoveredResult))
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
        }
      ];
    }
  }
});
</script>

<style scoped>
#search-results-container {
  flex-grow: 5;
  overflow-y: auto;
}

#search-results-container ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

#search-results-container ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}

.result-container {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

.result-icon-container {
  height: 100%;
  margin-right: 1em;
}

.result-text-container {
  height: fit-content;
  flex-grow: 10;
}

.result-icon {
  font-size: 2.5rem;
  color: lightgrey;
  padding: 5px;
}

#overlay-panel:hover {
  transition-delay: 2s;
}

@media screen and (min-width: 1024px) {
  .result-overlay {
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    width: 100%;
    gap: 7px;
  }

  .left-side,
  .right-side {
    max-width: 50%;
    flex-grow: 2;
  }

  .button-container {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: fit-content;
  }
}

@media screen and (max-width: 1023px) {
  .result-overlay {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    width: 100%;
    gap: 7px;
  }

  .left-side,
  .right-side {
    width: 100%;
    flex-grow: 2;
  }

  .button-container {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}
</style>
