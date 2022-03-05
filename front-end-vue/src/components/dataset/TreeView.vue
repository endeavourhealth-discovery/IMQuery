<template>
            <div v-if="activeFileView == 'Folder Hierarchy'">
              <div
                v-if="queryBuilder.hierarchyTree(topLevelFolder)"
                class="left inline-flex flex-col w-full h-full"
              
                <div
                  v-if="
                    queryBuilder.hierarchyTree(topLevelFolder).children.length
                  "
                  class="folder-viewer padding-text"
                >

                  <HierarchyTreeItem
                    :value="queryBuilder.hierarchyTree(topLevelFolder)"
                  />
                </div>
              </div>
            </div>
  
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import HierarchyTreeItem from "@/components/dataset/HierarchyTreeItem.vue";

export default defineComponent({
  name: "TreeView",
  props: ["prop"],
  componenets: {
        HierarchyTreeItem,
  }
});
</script>

<style scoped>

.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

</style>
