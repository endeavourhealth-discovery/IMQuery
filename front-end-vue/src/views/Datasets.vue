<template>

    <SideNav @hierarchyFocusSelected="focusHierarchy = true" />

    <router-view />

</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import SidebarControl from "@/components/home/SidebarControl.vue";

export default defineComponent({
  name: "Datasets",
  components: {
    SideNav,
  },
});
</script>

<style scoped>
.main-grid {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas: "sidebar content";
  column-gap: 7px;
}
.header-grow {
  flex-grow: 1;
}
.user-menu {
  height: 100%;
  margin-left: 5px;
  width: 12.5rem;
}
.p-menubar {
  height: 100%;
}
</style>
