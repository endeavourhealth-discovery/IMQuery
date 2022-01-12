<template>
  <div>
    <div class="hierachytreeitem flex items-center">
      <SectionToggler
        class="mr-3"
        v-if="value['rdf:type'][0]['@id'] == 'im:Folder'"
        :expanded="expandedItems.includes(value['@id'])"
        @click="
          expandedItems.includes(value['@id'])
            ? (expandedItems = expandedItems.filter(
                (i: any) => i != value['@id']
              ))
            : expandedItems.push(value['@id'])
        "
        :class="
          'inline hierachytreeitem__toggler' + [index != 0 ? '' : '']
        "
      />
      <div v-else class="ml-12">

      </div>
      <div class="mr-3 font-semibold text-lg text-gray-800 ">
        {{ value["rdfs:label"] }}
      </div>
      <div class="inline font-regular text-lg text-gray-700">
        ({{ value["rdf:type"][0]["@id"].split(":")[1] }})
      </div>
    </div>
    <template v-if="value.children.length">
      <HierarchyTreeItem
        v-show="expandedItems.includes(value['@id'])"
        v-for="item in value.children"
        :key="item['@id']"
        class="mt-5"
        :value="item"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
const { v4 } = require("uuid");
import SectionToggler from "@/components/dataset/SectionToggler.vue";

// import Constraint from "@/components/dataset/Constraint.vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "HierarchyTreeItem",
  props: ["value"],
  components: {
    SectionToggler,
  },
  data() {
    return {
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
