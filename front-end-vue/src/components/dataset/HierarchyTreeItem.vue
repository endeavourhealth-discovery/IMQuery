<template>
  <button
    class="cursor-pointer block transition duration-300 ease-in-out rounded-md border border-transparent relative z-0 focus:z-10 focus:ring-blue-600 focus:outline-none focus:ring-2 "
  >
    <div
      :style="{ paddingLeft: `${paddingLeft}px` }"
      :class="
        'hierachytreeitem cursor-pointer relative group py-2 pl-3 rounded-md flex justify-start items-center text-black' +
          [isHover ? ' hover bg-blue-50' : ''] +
          [isActive(value['@id']) ? ' active bg-blue-50' : '']
      "
      @click="onClick(value)"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    >
      <!-- Toggler  -->
      <SectionToggler
        :class="
          'hierachytreeitem__toggler mr-3 border-none group-hover:bg-blue-50'
        "
        v-if="value['rdf:type'][0]['@id'] == 'im:Folder'"
        :expanded="expandedItems.includes(value['@id'])"
      />
      <div v-else class="ml-9"></div>

      <!-- Icon  -->
      <HeroIcon
        :active="true"
        :class="
          'hierachytreeitem__icon inline mr-2' +
            [isHover || isActive(value['@id']) ? ' ' : ''] +
            [
              value['rdf:type'][0]['@id'] == 'im:Folder'
                ? ' text-blue-600'
                : ' text-cyan-500',
            ]
        "
        strokewidth="2"
        width="20"
        height="20"
        :icon="
          value['rdf:type'][0]['@id'] == 'im:Folder' ? 'folder' : 'document'
        "
      />

      <!-- Label  -->
      <div :class="'mr-3 font-normal text-md w-full text-left'">
        {{ value["rdfs:label"] }}
      </div>

      <!-- Hover Options -->
      <div
        v-if="isHover"
        class="hierachytreeitem__hoveroptions absolute right-0 bg-blue-50 cursor-pointer text-blue-600 font-semibold h-full"
      >
        <div class="top-2/4 translate-y-1/4 ">
          {{
            value["rdf:type"][0]["@id"] == "im:Folder"
              ? expandedItems.includes(value["@id"])
                ? "Collapse"
                : "Expand"
              : "Open"
          }}
        </div>
      </div>
    </div>

    <div v-if="value.children.length" class="hierachytreeitem">
      <HierarchyTreeItem
        class="w-full"
        v-if="expandedItems.includes(value['@id'])"
        v-for="item in value.children"
        :key="item['@id']"
        :value="item"
        :nestingCount="nestingCount + 1"
      />
    </div>
  </button>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import{ v4 } from "uuid";
import SectionToggler from "@/components/dataset/SectionToggler.vue";
import prettier from "prettier/standalone";
import prettierBabylon from "prettier/parser-babylon";
// import Constraint from "@/components/dataset/Constraint.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";

export default defineComponent({
  name: "HierarchyTreeItem",
  props: ["value", "nestingCount"],
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
        // for folders get all profiles it contains
        // const _folderIri = entity["@id"];
        // _json = JSON.stringify(this.queryBuilder.getProfilesByFolder(_folderIri));
      } else if (_entityType == "im:Profile") {
        const _profileIri = entity["@id"];
        this.queryBuilder.loadProfile(_profileIri);
      } else {
        return;
      }

      // _json = prettier.format(_json, {
      //   parser: "json",
      //   plugins: [prettierBabylon],
      // });
      // this.JSONContent = _json;
    },
    onClick(entity: any): void {
      const _entityType = entity["rdf:type"][0]["@id"];
      if (_entityType == "im:Folder") {
        if (this.expandedItems.includes(entity["@id"])) {
          this.expandedItems = this.expandedItems.filter(
            (i: any) => i != entity["@id"]
          );
        } else {
          this.expandedItems.push(entity["@id"]);
        }
      } else {
        this.loadFile(entity);
      }
    },
    isActive(id: string): boolean {
      // console.log(this.queryBuilder.Loaded)
      return (
        this.queryBuilder.activeProfile &&
        this.queryBuilder.activeProfile["@id"] == id
      );
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
      paddingLeft: this.nestingCount == 0 ? 10 : 10 + this.nestingCount * 10,
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

.hierachytreeitem {
  font-size: 14px;
}

.hierachytreeitem__icon {
  margin-top: 2px;
}

.hierachytreeitem__hoveroptions {
  min-width: 45px;
  margin-right: 10px;
}

/* .hierachytreeitem.active {
  border: 1px solid #0d89ec;
  background-color: #edf7ff;
  color: #0d89ec;
} */
</style>
