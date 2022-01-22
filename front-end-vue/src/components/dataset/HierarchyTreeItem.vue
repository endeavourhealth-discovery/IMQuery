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
      <div
        @click="loadFile(value)"
        v-if="isHover"
        class="non-selectable text-lg text-blue-600 font-semibold hover:underline"
      >
        Open
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
const prettier = require("prettier/standalone");
const prettierBabylon = require("prettier/parser-babylon");
// import Constraint from "@/components/dataset/Constraint.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "HierarchyTreeItem",
  props: ["value"],
  components: {
    SectionToggler,
    HeroIcon,
  },
  computed: {
    JSONContent: {
      get(): any {
        return this.$store.state.JSONContent;
      },
      set(JSONContent: any): void {
        this.$store.commit("updateJSONContent", JSONContent);
      },
    },
    LabelContent: {
      get(): any {
        return this.$store.state.LabelContent;
      },
      set(LabelContent: any): void {
        this.$store.commit("updateLabelContent", LabelContent);
      },
    },
    queryBuilder: {
      get(): any {
        return this.$store.state.queryBuilder;
      },
      set({ action, payload }: any): void {
        this.$store.commit("queryBuilder", {
          action: action,
          payload: payload,
        });
      },
    },
  },
  methods: {

    //populates JSON, graph and labels
    loadFile(entity: any): void {
      const _entityType = entity["rdf:type"][0]["@id"];
      let _json: any;

      if (_entityType == "im:Folder") {
        const _folderIri = entity["@id"];
        _json = JSON.stringify(this.queryBuilder.getProfiles(_folderIri));
      } else if (_entityType == "im:Profile") {
        const _profileIri = entity["@id"];

        _json = JSON.stringify(this.queryBuilder.getProfile(_profileIri));
        this.LabelContent = this.queryBuilder.getLabelPaths(entity["@id"]);
      } else {
        return;
      }

      _json = prettier.format(_json, {
        parser: "json",
        plugins: [prettierBabylon],
      });
      this.JSONContent = _json;
    },
    test(entity: any): void {
      const _entityType = entity["rdf:type"][0]["@id"];
      if (_entityType == "im:Profile") {
        // this.queryBuilder.getGraphData(entity["@id"]);
      
      }
    },
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
  border-left: 1px solid #eef0f2;
}
</style>
