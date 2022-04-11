<template>
  <div id="term-table-container">
    <DataTable
      :value="terms"
      :rowsPerPageOptions="[25, 50, 100]"
      :paginator="terms.length > rows ? true : false"
      :rows="rows"
      rowGroupMode="subheader"
      groupRowsBy="scheme.name"
      sortMode="single"
      sortField="scheme.name"
      :sortOrder="1"
      :scrollable="true"
      showGridlines
      :scrollHeight="scrollHeight"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
      currentPageReportTemplate="Displaying {first} to {last} of {totalRecords} results"
      class="p-datatable-sm"
      id="terms-table"
      @page="scrollToTop"
      :loading="loading"
    >
      <Column field="scheme.name" header="Scheme" />
      <Column field="term" header="Term" style="flex: 0 0 65%" />
      <Column
        field="code"
        header="Code"
        style="flex: 0 0 35%; word-break: break-all;"
      />
      <template #groupheader="slotProps">
        <span style="font-weight: 700; color:rgba(51,153,255,0.8)">
          Scheme : {{ slotProps.data.scheme.name }}
        </span>
      </template>
      <template #empty>
        No terms found.
      </template>
      <template #loading>
        Loading data. Please wait...
      </template>
    </DataTable>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Terms",
  components: {},
  props: ["conceptIri"],
  watch: {
    async conceptIri(newValue) {
      await this.getTerms(newValue);
    }
  },
  async mounted() {
    window.addEventListener("resize", this.onResize);
    await this.getTerms(this.conceptIri);
    this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      selected: {} as any,
      loading: false,
      terms: [],
      scrollHeight: "500px",
      rows: 25
    };
  },
  methods: {
    onResize(): void {
      this.setTableWidth();
      this.setScrollHeight();
    },

    async getTerms(iri: string) {
      this.loading = true;
      await EntityService.getEntityTermCodes(iri)
        .then(res => {
          this.terms = res.data;
        })
        .catch(err => {
          this.$toast.add(
            LoggerService.error("Concept term codes server request failed", err)
          );
        });
      this.loading = false;
    },

    setScrollHeight(): void {
      const container = document.getElementById(
        "terms-container"
      ) as HTMLElement;
      const terms = document.getElementById("terms-table") as HTMLElement;
      const paginator = terms?.getElementsByClassName(
        "p-paginator"
      )[0] as HTMLElement;
      if (paginator && container) {
        this.scrollHeight =
          container.getBoundingClientRect().height -
          paginator.getBoundingClientRect().height -
          1 +
          "px";
      } else if (container) {
        this.scrollHeight = container.getBoundingClientRect().height - 1 + "px";
      }
    },

    setTableWidth(): void {
      const container = document.getElementById(
        "terms-container"
      ) as HTMLElement;
      const table = container?.getElementsByClassName(
        "p-datatable-table"
      )[0] as HTMLElement;
      if (table) {
        table.style.width = "100%";
      }
    },

    scrollToTop(): void {
      const tableContainer = document.getElementById(
        "term-table-container"
      ) as HTMLElement;
      const scrollBox = tableContainer?.getElementsByClassName(
        "p-datatable-wrapper"
      )[0] as HTMLElement;
      if (scrollBox) {
        scrollBox.scrollTop = 0;
      }
    }
  }
});
</script>

<style scoped>
#term-table-container {
  height: 100%;
  overflow-y: auto;
}

#term-table-container ::v-deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
}

#term-table-container ::v-deep(.p-datatable-wrapper) {
  flex-grow: 6;
}
</style>
