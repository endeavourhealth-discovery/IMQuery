<template>
  <DataTable
    :value="patients1"
    :paginator="true"
    class="p-datatable-dataset shadow-middle"
    showGridlines
    :rows="10"
    dataKey="nhsID"
    v-model:filters="filters1"
    filterDisplay="menu"
    :loading="loading1"
    responsiveLayout="scroll"
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
      <div class="flex justify-between">
        <span></span>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters1['global'].value"
            placeholder="Type to Search"
          />
        </span>
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Reset Filters"
          class="p-button-outlined"
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
    <Column
      filterField="nhsID"
      header="NHS ID"
      dataType="numeric"
      style="min-width:12rem"
    >
      <template #body="{data}">
        <div :class="`${classes.tbody}`">{{ data.nhsID }}</div>
      </template>

      <template #filter="{filterModel}">
        <!-- <InputNumber v-model="filterModel.value" /> -->
        <!-- <InputNumber
          v-model="filterModel.value"
          mode="decimal"
          showButtons
          buttonLayout="vertical"
          decrementButtonClass="p-button-secondary"
          incrementButtonClass="p-button-secondary"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          :min="0"
          :max="150"
        /> -->

        <InputNumber
          v-model="filterModel.value"
          showButtons
          buttonLayout="horizontal"
          decrementButtonClass="p-button-danger"
          incrementButtonClass="p-button-success"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          mode="decimal"
        />
      </template>
    </Column>
    <Column field="firstName" header="First Name" style="min-width:12rem">
      <template #body="{data}">
        <div :class="`${classes.tbody}`">{{ data.firstName }}</div>
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
    <Column field="lastName" header="Last Name" style="min-width:12rem">
      <template #body="{data}">
        <div :class="`${classes.tbody}`">{{ data.lastName }}</div>
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
      style="min-width:20rem; max-width:20rem;"
    >
      <template #body="{data}">
        <div :class="`${classes.tbody}`">{{ data.organisation }}</div>
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
      style="min-width:18rem"
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
      <!-- <template #filter="{filterModel}">
        <Calendar
          v-model="filterModel.value"
          dateFormat="mm/dd/yyyy"
          placeholder="mm/dd/yyyy"
        />
      </template> -->
    </Column>
    <Column field="statedGender" header="Stated Gender" style="min-width:18rem">
      <template #body="{data}">
        <div :class="`${classes.tbody}`">{{ data.statedGender }}</div>
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
    <!-- <Column
          header="nhsID"
          filterField="nhsID"
          dataType="numeric"
          style="min-width:10rem"
        >
          <template #body="{data}">
            {{ formatCurrency(data.balance) }}
          </template>
          <template #filter="{filterModel}">
            <InputNumber
              v-model="filterModel.value"
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </template>
        </Column> -->
    <!-- <Column
          field="status"
          header="Status"
          :filterMenuStyle="{ width: '14rem' }"
          style="min-width:12rem"
        >
          <template #body="{data}">
            <span :class="'customer-badge status-' + data.status">{{
              data.status
            }}</span>
          </template>
          <template #filter="{filterModel}">
            <Dropdown
              v-model="filterModel.value"
              :options="statuses"
              placeholder="Any"
              class="p-column-filter"
              :showClear="true"
            >
              <template #value="slotProps">
                <span
                  :class="'customer-badge status-' + slotProps.value"
                  v-if="slotProps.value"
                  >{{ slotProps.value }}</span
                >
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <span :class="'customer-badge status-' + slotProps.option">{{
                  slotProps.option
                }}</span>
              </template>
            </Dropdown>
          </template>
        </Column> -->
    <!-- <Column
          field="activity"
          header="Activity"
          :showFilterMatchModes="false"
          style="min-width:12rem"
        >
          <template #body="{data}">
            <ProgressBar
              :value="data.activity"
              :showValue="false"
            ></ProgressBar>
          </template>
          <template #filter="{filterModel}">
            <Slider v-model="filterModel.value" range class="m-3"></Slider>
            <div class="flex align-items-center justify-content-center px-2">
              <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
              <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
            </div>
          </template>
        </Column> -->
    <!-- <Column
          field="verified"
          header="Verified"
          dataType="boolean"
          bodyClass="text-center"
          style="min-width:8rem"
        >
          <template #body="{data}">
            <i
              class="pi"
              :class="{
                'true-icon pi-check-circle': data.verified,
                'false-icon pi-times-circle': !data.verified,
              }"
            ></i>
          </template>
          <template #filter="{filterModel}">
            <TriStateCheckbox v-model="filterModel.value" />
          </template>
        </Column> -->
  </DataTable>
</template>

<script>
import DataService from "@/services/DataService";
import { FilterMatchMode, FilterOperator } from "primevue/api";

export default {
  name: "DataViewer",
  data() {
    return {
      classes: {
        theader: "text-black text-bold",
        tbody: "",
      },
      patients1: null,
      filters1: {
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
      loading1: true,
      //   loading2: true,
    };
  },
  created() {
    this.dataService = new DataService();
    // this.initFilters();
  },
  mounted() {
    this.dataService.getData().then((data) => {
      this.patients1 = data;
      this.loading1 = false;
      this.patients1.forEach(
        (customer) => (customer.date = new Date(customer.date))
      );
    });

    // this.dataService.getData().then((data) => {
    //   this.customers2 = data;
    //   this.loading2 = false;
    //   this.customers2.forEach(
    //     (customer) => (customer.date = new Date(customer.date))
    //   );
    // });
  },
  methods: {
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
    initFilters() {
      this.filters1 = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        patientId: {
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
      };
    },
  },
};
</script>

<style>
.p-datatable-dataset {
  /* background-color:white !important; */
  max-height: 700px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 10px !important;
}

.p-datatable-dataset .p-datatable-header {
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
}

.p-datatable-dataset .paginator {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>

<style lang="scss">
// ::v-deep(.p-paginator) {
//   .p-paginator-current {
//     margin-left: auto !important;
//   }
// }

// ::v-deep(.p-progressbar) {
//   height: 0.5rem;
//   background-color: #d8dadc !important;

//   .p-progressbar-value {
//     background-color: #607d8b !important;
//   }
// }

// ::v-deep(.p-datepicker) {
//   min-width: 25rem !important;

//   td {
//     font-weight: 400 !important;
//   }
// }

// ::v-deep(.p-datatable.p-datatable-dataset) {

//   .p-datatable-header {
//     padding: 1rem !important;
//     text-align: left !important;
//     font-size: 1.5rem !important;
//   }

//   .p-paginator {
//     padding: 1rem !important;
//   }

//   .p-datatable-thead > tr > th {
//     text-align: left !important;
//     font-size: 14px !important;

//     // width: 100%;
//   }

//   .p-datatable-tbody > tr > td {
//     cursor: auto !important;
//     font-size: 14px !important;
//   }

//   .p-dropdown-label:not(.p-placeholder) {
//     text-transform: uppercase !important;
//   }
// }
</style>
