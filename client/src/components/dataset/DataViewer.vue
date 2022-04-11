<template>
  <DataTable
    :value="datasetData"
    class="p-datatable-dataset shadow-middle"
    :rows="visibleRows"
    dataKey="nhsID"
    v-model:filters="filters"
    filterDisplay="menu"
    :loading="loading"
    responsiveLayout="scroll"
    :paginator="true"
    stripedRows
    v-model:selection="selectedRows"
    :globalFilterFields="[
      'uuid',
      'nhsID',
      'organisation',
      'firstName',
      'lastName',
      'dateOfBirth',
      'statedGender',
    ]"
  >
    <template #header>
      <div class="flex justify-between mx-2">
        <div style="text-left">
          <!-- <MultiSelect
            :modelValue="selectedColumns"
            :options="columns"
            optionLabel="header"
            @update:modelValue="onToggle"
            placeholder="Select Columns"
            style="max-width: 20em"
          /> -->
        </div>
        <span class="p-input-icon-left">
          <i class="pi pi-search ml-2 !text-black" />
          <InputText
            class="ml-3 w-min-200"
            v-model="filters['global'].value"
            placeholder="Type to Search"
          />
        </span>
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Reset Filters"
          class="p-button p-button-secondary"
          @click="clearFilter()"
        />
      </div>
    </template>
    <template #empty>
      <div class="text-center text-3xl font-bold text-gray-400">
        No items.
      </div>
    </template>
    <template #loading>
      Loading Data. Please wait.
    </template>
    <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
    <Column
      filterField="nhsID"
      header="NHS ID"
      dataType="numeric"
      style="min-width: 10rem"
    >
      <template #body="{data}">
        <div :class="`${classes.tbody}`">{{ data.nhsID }}</div>
      </template>

      <template #filter="{filterModel}">
        <InputNumber
          v-model="filterModel.value"
          showButtons
          buttonLayout="horizontal"
          decrementButtonClass="p-button-danger"
          incrementButtonClass="p-button-success"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          mode="decimal"
          :min="1000000000"
          :max="9999999999"
        />
      </template>
    </Column>
    <Column
      field="firstName"
      header="First Name"
      style="min-width: 10rem"
      :sortable="true"
    >
      <template #body="{data}">
        <div :class="`${classes.tbody}`">{{ toTitleCase(data.firstName) }}</div>
      </template>
      <template #filter="{filterModel}">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by First Name"
        />
      </template>
    </Column>
    <Column
      field="lastName"
      header="Last Name"
      style="min-width: 10rem"
      :sortable="true"
    >
      <template #body="{data}">
        <div :class="`${classes.tbody}`">{{ toTitleCase(data.lastName) }}</div>
      </template>
      <template #filter="{filterModel}">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by Last Name"
        />
      </template>
    </Column>
    <Column
      field="organisation"
      header="Organisation"
      style="max-width:30rem;"
      :sortable="true"
    >
      <template #body="{data}">
        <div :class="`${classes.tbody}`">
          {{ toTitleCase(data.organisation) }}
        </div>
      </template>
      <template #filter="{filterModel}">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by Organisation"
        />
      </template>
    </Column>

    <Column
      header="Date Of Birth"
      filterField="dateOfBirth"
      dataType="date"
      style="min-width:12rem"
    >
      <template #body="{data}">
        <div :class="`${classes.tbody}`">
          {{ formatDate(data.dateOfBirth) }}
        </div>
      </template>
      <template #filter="{filterModel}">
        <Calendar
          v-model="filterModel.value"
          dateFormat="mm/dd/yy"
          placeholder="mm/dd/yyyy"
        />
      </template>
    </Column>
    <Column
      field="statedGender"
      header="Stated Gender"
      style="min-width:12rem"
      :sortable="true"
    >
      <template #body="{data}">
        <div :class="`${classes.tbody}`">
          {{ toTitleCase(data.statedGender) }}
        </div>
      </template>
      <template #filter="{filterModel}">
        <InputText
          type="text"
          v-model="filterModel.value"
          class="p-column-filter"
          placeholder="Search by Stated Gender"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script>
import LoggerService from "@/services/LoggerService";

import DataService from "@/services/DataService";
import { FilterMatchMode, FilterOperator } from "primevue/api";

export default {
  name: "DataViewer",
  data() {
    return {
      columns: [],
      selectedColumns: [],
      selectedRows: null,
      visibleRows: 8,
      classes: {
        theader: "text-black text-bold",
        tbody: "",
      },
      datasetData: null,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        uuid: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        nhsID: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
        },
        organisation: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        firstName: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        lastName: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        dateOfBirth: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
        },
        statedGender: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
      },
      loading: true,
    };
  },
  created() {
    // this.dataService = new DataService();
    // this.initFilters();
  },
  mounted() {
    this.getData("dataset1.json");
    //CEG-Queries-edited
    // this.dataService.getData("dataset1.json").then((data) => {
    //   this.datasetData = data;
    //   this.loading = false;

    //   this.datasetData.forEach((entry) => {
    //     entry.date = new Date(entry.date);
    //   });

    //   if (this.datasetData[0]) {
    //     Object.keys(this.datasetData[0]).forEach((key) => {
    //       const _column = {
    //         field: key,
    //         header: this.capitalise(key),
    //       };
    //       this.columns.push(_column);
    //     });
    //     console.log(this.columns);
    //     this.selectedColumns = this.columns;
    //   }
    // });
  },

  methods: {
    async getData(filename) {
      await DataService.getData(filename)
        .then((json) => {
          this.datasetData = json;
          this.loading = false;
          json.forEach((entry) => {
            entry.date = new Date(entry.date);
          });

          // extract column names
          // useful if you want want to allow the user to select their own columns
          if (this.datasetData[0]) {
            Object.keys(this.datasetData[0]).forEach((key) => {
              const _column = {
                field: key,
                header: this.capitalise(key),
              };
              this.columns.push(_column);
            });
            // console.log(this.columns);
            this.selectedColumns = this.columns;
          }

          return json;
        })
        .catch((err) => {
          this.$toast.add(
            LoggerService.error("Failed to load sample Dataset.", err)
          );
        });
    },
    onToggle(value) {
      this.selectedColumns = this.columns.filter((col) => value.includes(col));
    },
    capitalise(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toTitleCase(phrase) {
      return phrase
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    formatDate(value) {
      const _date = new Date(value);
      return _date.toLocaleDateString("en-UK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    clearFilter() {
      this.initFilters();
    },
  },
};
</script>

<style>
.p-virtualscroller::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.p-virtualscroller::-webkit-scrollbar-track {
  background: #ffffff;
  /* darker colour: #f1f1f1; */
}

/* Handle */
.p-virtualscroller::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(136, 136, 136, 0.233);
}

/* Handle on hover */
.p-virtualscroller::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.p-datatable-dataset {
  max-height: 700px !important;
  width: 100% !important;
  max-width: 900px !important;

  border: 1px solid #d1d5db !important;
  border-radius: 10px !important;
}
.p-datatable-dataset .p-datatable-thead {
  font-size: 12px !important;
}
.p-datatable-dataset .p-datatable-tbody {
  font-size: 14px !important;
}

.p-datatable-dataset .p-datatable-header {
  background-color: #f1f5f9 !important;

  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
}

.p-datatable-dataset .p-paginator {
  position: absolute;
  border-bottom: 0;
  bottom: 10px;
  width: 100%;
}

.p-datatable-dataset tr:hover {
  background-color: #e2e8f0 !important;
}

.p-datatable-dataset .p-datatable-thead > tr > th {
  background-color: #f1f5f9 !important;
}

.p-datatable-dataset .p-inputtext {
  font-size: 14px;
  min-width: 250px !important;
  text-align: center !important;
}

.p-datatable-dataset.p-datatable.p-datatable-gridlines
  .p-datatable-tbody
  > tr
  > td {
  border-right: 0 !important;
  border-left: 0 !important;
}
</style>
