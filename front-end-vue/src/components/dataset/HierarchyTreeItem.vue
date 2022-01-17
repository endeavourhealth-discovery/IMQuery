<template>
  <div>
    <div
      :class="
        'hierachytreeitem py-3 flex items-center' +
          [ishover == true ? ' hover' : '']
      "
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    >
      <SectionToggler
        class="mr-3 border-none"
        v-if="value['rdf:type'][0]['@id'] == 'im:Folder'"
        :expanded="expandedItems.includes(value['@id'])"
        @click="
          expandedItems.includes(value['@id'])
            ? (expandedItems = expandedItems.filter(
                (i: any) => i != value['@id']
              ))
            : expandedItems.push(value['@id'])
        "
        :class="'inline hierachytreeitem__toggler' + [index != 0 ? '' : '']"
      />
      <div v-else class="ml-9"></div>
      <HeroIcon
        class="inline font-regular text-lg text-gray-700 mr-2"
        strokewidth="2"
        width="20"
        height="20"
        :icon="
          value['rdf:type'][0]['@id'] == 'im:Folder'
            ? 'folder_open'
            : 'document'
        "
      />
      <div class="mr-3 font-semibold text-lg text-gray-800 ">
        {{ value["rdfs:label"] }}
      </div>
    </div>
    <template v-if="value.children.length">
      <div class="hierachytreeitem">
        <HierarchyTreeItem
          v-show="expandedItems.includes(value['@id'])"
          v-for="item in value.children"
          :key="item['@id']"
          class="ml-3"
          :value="item"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";

// import Constraint from "@/components/dataset/Constraint.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "HierarchyTreeItem",
  props: ["value"],
  components: {
    SectionToggler,
    HeroIcon,
  },
  data() {
    return {
      isHover: false,
      expandedItems: [] as any[],
    };
  },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.clause-item {
  /* margin-left: 15px; */
  /* height: 30px; */
}

.clause-item__toggler {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.clause-item__operator {
  /* margin-left: 5px; */
}

.hierachytreeitem__toggler {
  height: 20px;
  width: 20px;
}
</style>

<style>
.hierachytreeitem {
  border-left: 1px solid #EEF0F2;
}
</style>
