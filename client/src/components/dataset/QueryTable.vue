<template>
  <div class="query-table" :style="{ height: tableheight + 'px' }">
    <div
      class="query-row flex"
      v-for="item in filteredQueries"
      :key="item.id"
    >
      <div class="row-cell row-checkbox">
        <input
          class="checkbox"
          type="checkbox"
          :value="item.id"
          v-model="selectedRows"
        />
      </div>
      <div class="row-data flex justify-between">
        <div class="row-cell row-name inline" v-tooltip.top="item.name">
          {{ item.name }}
        </div>
        <div
          class="row-cell row-description inline"
          v-tooltip.top="item.description"
        >
          {{ item.description }}
        </div>
        <div
          class="row-cell row-tags inline"
          v-tooltip.top="item.tags.join(', ')"
        >
          <div class="flex">
            <div class="row-tag inline" :key="tag" v-for="tag in item.tags">
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DatasetService from "@/services/DatasetService";
import LoggerService from "@/services/LoggerService";

import Checkbox from "primevue/checkbox";

export default defineComponent({
  name: "QueryTable",
  props: ["tableheight", "searchstring", "filtertags"],
  data() {
    return {
      selectedRows: [] as any,
      queryData: [] as any,
    };
  },
  async mounted() {
    this.fetchQueryData();
  },
  computed: {
    filteredQueries(): any {
      var filteredData = this.queryData;

      //filter for search string
      if (this.searchstring) {
        filteredData = this.queryData.filter(
          (query: any) =>
            query.description.toLowerCase().includes(this.searchstring) ||
            query.name.toLowerCase().includes(this.searchstring)
        );
      }

      //filter for tags
      if (this.filtertags != null) {
        if (this.filtertags.length > 0) {
          filteredData = filteredData.filter((query: any) =>
            query.tags.some((queryTag: string) =>
              this.filtertags.some(
                (filterTag: string) =>
                  filterTag.toLowerCase() == queryTag.toLowerCase()
              )
            )
          );
        }
      }

      return filteredData;
    },
  },
  methods: {
    async fetchQueryData(): Promise<void> {
      await DatasetService.getDatasets()
        .then((res) => {
          this.queryData = JSON.parse(res).queryData;
        })
        .catch((err) => {
          this.$toast.add(
            LoggerService.error("Failed to fetch Query data", err)
          );
        });
    },
    deleteSelected(): void {
      console.log("delete");
      this.queryData = this.queryData.filter(
        (query: any) => !this.selectedRows.includes(query.id)
      );
    },
  },
});
</script>

<style scoped>
.query-table {
  padding: 10px 0;
  overflow-y: auto;
}

::v-deep(.query-table) {
  font-size: 16px !important;
}

.query-table::-webkit-scrollbar {
  width: 10px;
}

.query-table::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
}

.query-table::-webkit-scrollbar-thumb {
  background-color: #d3d3d3;
  /* outline: 1px solid slategrey; */
}

.query-table > * {
  border-bottom: solid 1px #dde1e2;
  overflow-y: auto;
}

.checkbox {
  border: 2px solid #ced4da;
  background: #ffffff;
  width: 20px;
  height: 20px;
  color: #495057;
  border-radius: 3px;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s,
    box-shadow 0.2s;
}

.checkbox:hover {
  border-color: #2196f3;
}

.query-row {
  padding-right: 20px;
  margin-right: 10px;
  /* padding: 15px 0 15px 15px; */
}

.query-row:hover {
  box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0,
    0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%);
  /* border: solid 0.1px #dde1e2; */
  background: #fefefe;
  z-index: 2;
}

.row-checkbox {
  margin-left: 15px;
  margin-right: 20px;
}

.row-name {
  width: 150px;
  overflow: hidden;
  font-weight: bold;
  margin-right: 20px;
}

.row-description {
  overflow: hidden;
  white-space: nowrap;
  margin-right: 50px;
  width: 100%;
}

.row-tags {
  overflow: hidden;
  padding-right: 30px;
  max-width: 400px;

  margin-right: 5px;
  margin-top: 15px;
}

.row-cell:not(.row-tags) {
  margin-top: 15px;
  margin-bottom: 15px;
}

.row-tag {
  white-space: nowrap;
  padding: 5px;
  margin-right: 10px;
  background-color: #dee2e6 !important;
  border-radius: 5px;
}

/* This is the same as name + description + tags  */
.row-data {
  overflow-x: hidden;
  width: 100%;
}
</style>
