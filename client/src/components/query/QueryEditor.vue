<template>
  <div :class="'flex flex-col border-b transition duration-500 ease-in-out ' + [edit ? '#border-b-blue-500 ' : 'border-b-gray-300']">
    <!-- Header -->
    <div v :class="'header flex items-center justify-between  pr-5 '">
      <div v-if="!edit">
        <!-- Icon -->
        <div
          :class="
            ' inline-flex justify-center items-center rounded-full w-12 h-12 ml-5    ' + [false ? ' bg-transparent text-white' : ' bg-gray-100 text-black']
          "
        >
          <svg v-if="query.select?.entityType?.name == 'Person'" xmlns="http://www.w3.org/2000/svg" :class="'h-7 w-7'" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <svg
            v-else-if="query.select?.entityType?.name == 'Appointment'"
            xmlns="http://www.w3.org/2000/svg"
            :class="'h-7 w-7'"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="query.select?.entityType?.name == 'Organisation'"
            xmlns="http://www.w3.org/2000/svg"
            :class="'h-7 w-7'"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" :class="'h-7 w-7'" viewBox="0 0 20 20" fill="transparent" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <!-- /Icon -->
        <!-- Title  -->
        <div :class="'inline-flex select-none font-semibold text-3xl ml-4 text-gray-800' + [false ? ' text-white' : '']">
          {{ mainEntity?.name ? mainEntity?.name : "Search" }}
        </div>
        <!-- /Title  -->
      </div>

      <div v-else class="action-buttons flex items-center space-x-2 mb-5 ">
        <template v-for="option in editOptions" :key="option.id">
          <Button v-if="option.visible" label="Submit" :icon="'pi pi-' + option.icon" iconPos="left" :class="'action-button p-button-text ' + option.classes">
            <HeroIcon :icon="option.icon" strokewidth="3" class=" h-8 w-8 mr-3 "></HeroIcon>
            <span class="font-bold text-2xl"> {{ option.name }}</span>
          </Button>
        </template>
      </div>
      <Button v-show="edit" @click="$emit('stopEditing')" class="p-button-danger p-button-rounded p-button-outlined" icon="pi pi-times"></Button>

      <!-- <ToggleButton v-model="edit" onLabel="Stop Editing" offLabel="Edit" onIcon="pi pi-times" offIcon="pi pi-pencil" /> -->
    </div>
    <!-- Header -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "QueryEditor",
  props: ["edit"],
  emits: ["update:modelValue"],
  methods: {
    updateValue(name: string): void {
      this.$emit("update:modelValue", name);
    }
  },
  data() {
    return {
      editOptions: [
        {
          id: "abc89209-fcc5-4770-9a4b-bb1655104258",
          name: "Add",
          icon: "plus",
          classes: "",
          visible: true
        },
        {
          id: "afcd1608-3d79-4e10-90b6-1e9d354b9283",
          name: "Copy",
          icon: "document_duplicate",
          classes: "p-button-secondary",
          visible: true
        },
        {
          id: "23cdb75120e0ee94-b1d4-4c63-865f-e1c16f60d464",
          name: "Paste",
          icon: "clipboard_copy",
          classes: "p-button-secondary",
          visible: true
        },
        {
          id: "23cdb751b04edc4a-79ad-41da-a44c-7e871902a8a9",
          name: "Cut",
          icon: "scissors",
          classes: "p-button-warning",
          visible: true
        },
        {
          id: "23cdb75120e0ee94-b1d4-4c63-865f-e1c16f60d464",
          name: "Move",
          icon: "arrow_right",
          classes: "p-button-warning",
          visible: true
        },
        {
          id: "bf34d743-35b2-4e3c-b50f-5989b0bd3174",
          name: "Delete",
          icon: "x",
          classes: "p-button-danger",
          visible: true
        }
      ]
    };
  }
});
</script>

<style scoped>
.definition .edit {
  width: 100%;
  max-width: 100%;
}
</style>
