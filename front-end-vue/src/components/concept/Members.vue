<template>
  <div id="members-table-container">
    <DataTable
      :value="combinedMembers"
      showGridlines
      rowGroupMode="subheader"
      groupRowsBy="label"
      :expandableRowGroups="true"
      v-model:expandedRowGroups="expandedRowGroups"
      @rowgroupExpand="onRowGroupExpand"
      @rowgroupCollapse="onRowGroupCollapse"
      v-model:filters="filters1"
      filterDisplay="menu"
      :globalFilterFields="['code', 'entity.name', 'scheme.name', 'label']"
      :scrollable="true"
      sortMode="single"
      sortField="label"
      :sortOrder="1"
      class="p-datatable-sm"
      scrollHeight="flex"
      v-model:selection="selected"
      selectionMode="single"
      :loading="loading"
      @rowSelect="onRowSelect"
    >
      <template #header>
        <div class="p-d-flex p-jc-between">
          <span class="p-input-icon-left">
            <i class="pi pi-search" aria-hidden="true" />
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
          </span>
          <div class="checkboxes-container">
            <div>
              <Button icon="pi pi-cloud-download" label="Download definition" @click="download(false)" />
            </div>
            <div>
              <Button icon="pi pi-cloud-download" label="Download expanded" @click="download(true)" />
            </div>
            <div class="checkbox-label-container" v-if="!expandMembers && subsets.length">
              <label for="expandSubsets">Expand all subsets</label>
              <Checkbox :disabled="expandMembers" id="expandSubsets" v-model="expandSubsets" :binary="true" />
            </div>
            <!-- <div class="checkbox-label-container">
              <label for="expandMembers">
                Expand all members
              </label>
              <Checkbox id="expandMembers" v-model="expandMembers" :binary="true" />
            </div> -->
          </div>
        </div>
      </template>
      <template #empty>
        No members found.
      </template>
      <template #loading>
        Loading data. Please wait...
      </template>
      <Column field="entity.name" header="Name" filter-field="entity.name">
        <template #body="slotProps">
          <div v-if="slotProps.data.type === 'COMPLEX'" class="complex-member-container">
            <ComplexMembers :conceptIri="conceptIri" />
          </div>
          <span v-else>{{ slotProps.data.entity.name }}</span>
        </template>
      </Column>
      <Column v-if="expandMembers" field="code" header="Code" filter-field="code" />
      <Column v-if="expandMembers" field="scheme.name" header="Scheme" filter-field="scheme.name" />
      <template #groupheader="slotProps">
        <span v-for="subSet in subsets" :key="subSet">
          <span v-if="slotProps.data.label === subSet" class="group-header">
            {{ subSet }}
          </span>
        </span>
        <span v-if="slotProps.data.type === 'INCLUDED'" class="group-header">
          Included Members
        </span>
        <span v-if="slotProps.data.type === 'EXCLUDED'" class="group-header">
          Excluded Members
        </span>
        <span v-if="slotProps.data.type === 'EXPANDED'" class="group-header">
          Expanded Members
        </span>
        <span v-if="slotProps.data.type === 'COMPLEX'" class="group-header">
          Complex Members
        </span>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import EntityService from "@/services/EntityService";
import { FilterMatchMode } from "primevue/api";
import Swal from "sweetalert2";
import LoggerService from "@/services/LoggerService";
import ComplexMembers from "@/components/concept/members/ComplexMembers.vue";

export default defineComponent({
  name: "Members",
  components: { ComplexMembers },
  props: {
    conceptIri: { type: String, required: true }
  },
  emits: ["memberClick"],
  watch: {
    async conceptIri() {
      this.expandMembers = false;
      this.expandSubsets = false;
      await this.getMembers();
    },

    async expandMembers() {
      await this.getMembers();
    },

    async expandSubsets() {
      this.subsets = [];
      await this.getMembers();
    }
  },
  async mounted() {
    window.addEventListener("resize", this.onResize);
    this.expandMembers = false;
    this.expandSubsets = false;
    await this.getMembers();
    this.onResize();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  data() {
    return {
      loading: false,
      members: {} as any,
      combinedMembers: [] as any,
      filters1: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      },
      expandMembers: false,
      expandSubsets: false,
      selected: {} as any,
      subsets: [] as any[],
      expandedRowGroups: ["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"]
    };
  },
  methods: {
    async onRowGroupExpand() {
      this.setTableWidth();
    },

    onRowGroupCollapse() {
      this.setTableWidth();
    },

    onRowSelect() {
      if (this.selected != null && this.selected.entity != null) {
        this.$router.push({
          name: "Concept",
          params: { selectedIri: this.selected.entity["@id"] }
        });
        this.$emit("memberClick");
      }
    },

    async getMembers() {
      this.loading = true;
      if (this.expandMembers) {
        this.expandedRowGroups = ["MemberExpanded"];
      } else {
        this.expandedRowGroups = ["a_MemberIncluded", "b_MemberExcluded", "z_ComplexMember"];
      }
      this.selected = {};
      this.subsets = [];
      await EntityService.getEntityMembers(this.conceptIri as string, this.expandMembers, this.expandSubsets, this.expandMembers ? 2000 : undefined)
        .then(res => {
          this.members = res.data;
          this.expandMembersSizeCheck();
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get members from server", err));
        });
      this.loading = false;
      this.setTableWidth();
    },

    setSubsets() {
      this.combinedMembers.forEach((member: any) => {
        if (!this.subsets.some(e => e === member.label)) {
          if (member.type === "SUBSET") {
            this.subsets.push(member.label);
          }
        }
      });
    },

    async expandMembersSizeCheck() {
      if (this.members.limited) {
        this.expandMembers = false;
        await Swal.fire({
          icon: "warning",
          title: "Large data set",
          text: "Expanding this set results in a large amount of data.\n Would you like to download it instead?",
          confirmButtonText: "Download",
          showCancelButton: true
        }).then(result => {
          if (result.isConfirmed) this.download(true);
          else {
            this.$toast.add(LoggerService.warn("Member expansion cancelled as results exceeded displayable limit."));
          }
        });
      } else {
        this.sortMembers();
        this.combinedMembers = this.members.members;
        this.setSubsets();
      }
    },

    download(expanded: boolean) {
      const modIri = (this.conceptIri as string).replace(/\//gi, "%2F").replace(/#/gi, "%23");
      const popup = window.open(process.env.VUE_APP_API + "api/entity/download?iri=" + modIri + "&members=true&expandMembers=" + expanded + "&format=excel");
      if (!popup) {
        this.$toast.add(LoggerService.error("Download failed from server"));
      } else {
        this.$toast.add(LoggerService.success("Download will begin shortly"));
      }
    },

    sortMembers() {
      this.members.members = this.members.members.sort((a: any, b: any) =>
        a.label.localeCompare(b.label) == 0 ? a.entity.name.localeCompare(b.entity.name) : a.label.localeCompare(b.label)
      );
    },

    onResize() {
      this.setTableWidth();
    },

    setTableWidth(): void {
      const container = document.getElementById("members-table-container") as HTMLElement;
      const table = container?.getElementsByClassName("p-datatable-table")[0] as HTMLElement;
      if (table) {
        table.style.width = "100%";
      } else {
        LoggerService.error(undefined, "Failed to set members table width. Required element(s) not found.");
      }
    }
  }
});
</script>

<style scoped>
#members-table-container {
  height: 100%;
  width: 100%;
}

#members-table-container ::v-deep(.p-datatable-wrapper) {
  overflow-x: hidden;
}

#members-table-container ::v-deep(td) {
  word-break: break-all;
}

.group-header {
  font-weight: 700;
  color: rgba(51, 153, 255, 0.8);
}

.checkboxes-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
}

.complex-member-container {
  width: 100%;
}
</style>
