<template>
  <SideNav @hierarchyFocusSelected="focusHierarchy = true" />
  <div class="layout-main">
    <div class="main-grid">
      <SidebarControl :focusHierarchy="focusHierarchy" @hierarchyFocused="focusHierarchy = false" />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNav from "@/components/home/SideNav.vue";
import SidebarControl from "@/components/home/SidebarControl.vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "Home",
  components: {
    SideNav,
    SidebarControl
  },
  emits: ["userPopupToggled"],
  computed: mapState(["sideNavHierarchyFocus"]),
  data() {
    return {
      focusHierarchy: false
    };
  },
  async mounted() {
    // check for user and log them in if found or logout if not
    await this.$store.dispatch("authenticateCurrentUser");
    this.updateRoute();
  },
  methods: {
    updateRoute(): void {
      if (this.$route.name === "Home" || this.$route.name === "Dashboard") {
        switch (this.sideNavHierarchyFocus.name) {
          case "InformationModel":
            this.$store.commit("updateConceptIri", "http://endhealth.info/im#InformationModel");
            break;
          case "Ontology":
            this.$store.commit("updateConceptIri", "http://endhealth.info/im#DiscoveryOntology");
            break;
          case "ValueSets":
            this.$store.commit("updateConceptIri", "http://endhealth.info/im#Sets");
            break;
          case "Queries":
            this.$store.commit("updateConceptIri", "http://endhealth.info/im#QT_QueryTemplates");
            break;
        }
      } else if (this.$route.name === "Concept") {
        this.$store.commit("updateConceptIri", this.$route.params.selectedIri as string);
      }
    }
  }
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
