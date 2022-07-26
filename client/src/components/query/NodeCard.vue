<template>
  <div class="node-section">
    <div :class="'node-card group'">
      <div :class="'node-card-header  ' + [expanded ? 'expanded' : '']" @click="onClick">
        <NodeIcon :class="`node-icon`" strokewidth="2" width="20" height="20" :icon="icon" />
        <div class="node-card-title" v-html="richTitle()"></div>
        <!-- <div v-if="allowExpansion" class="node-chevron">
        <NodeIcon class="icon" strokewidth="2" width="20" height="20" :icon="expanded ? 'chevron_up' : 'chevron_down'" />
      </div> -->
      </div>
      <div v-if="true || expanded" class="node-card-body">
        <div v-if="activeTab == 'Prettified' && definition?.pathTo" class=" prettified">
          <!-- <IMDefinition type="clause" :data="data" :path="path" :showDetails="showDetails"> </IMDefinition> -->
        </div>
        <div v-else-if="activeTab == 'Prettified' && definition?.alias" class="prettified">
          <!-- <IMDefinition type="property" :data="data" :path="path" :showDetails="showDetails"> </IMDefinition> -->
        </div>
        <div v-if="activeTab == 'Raw JSON'" class="tab-content json">
          {{ definition }}
        </div>

        <div v-if="allowExpansion" class="actions rounded-md flex justify-end items-end select-none space-x-5  transition duration-500 ease-in-out mr-4 ">
          <div
            @click="onCopy()"
            class="invisible group-hover:visible inline-flex items-center text-2xl hover:underline font-semibold text-purple-700 dark:text-white"
          >
            <NodeIcon class="mx-2" strokewidth="2" width="20" height="24" icon="document_duplicate" /> Copy JSON
          </div>
          <!-- <div class="inline-flex items-center text-2xl hover:underline font-semibold text-blue-600 dark:text-white">
          <NodeIcon class="mx-2" strokewidth="2" width="20" height="24" icon="eye" /> View
        </div> -->
          <div
            @click="onEdit()"
            class="invisible group-hover:visible inline-flex items-center text-2xl hover:underline font-semibold text-green-600 dark:text-white"
          >
            <NodeIcon class="mx-2" strokewidth="2" width="20" height="24" icon="eye" /> View Definition
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!added"
      @click="onAdd()"
      class="node-add flex max-w-[100px] rounded-md text-2xl font-semibold text-white bg-blue-600 hover:bg-blue-800 transition duration-500 ease-in-out dark:text-white pl-2 pr-5 py-2 mb-6 cursor-pointer  "
    >
      <NodeIcon class="mx-2" strokewidth="2" width="20" height="24" icon="plus" />
      <div>Add</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IMDefinition from "./IMDefinition.vue";
import NodeIcon from "./NodeIcon.vue";
import jp from "jsonpath";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "NodeCard",
  props: ["icon", "title", "definition", "allowExpansion", "data", "path", "showDetails"],
  emits: ["updateActiveClause"],
  components: { NodeIcon, IMDefinition },
  data() {
    return {
      activeTab: "Prettified",
      tabs: [{ label: "Prettified" }, { label: "Raw JSON" }],
      expanded: false,
      added: false
    };
  },
  methods: {
    richTitle() {
      //populates title with hyperlinks to IM Viewer
      let html: string = `<div>${this.title}</div>`;
      const jsonQuery = `$..[?(@.name && @.@id)]`;
      const names = jp.nodes(this.definition, jsonQuery);
      names.forEach((item: any) => {
        const url = `https://dev.endhealth.co.uk/viewer/#/concept/${encodeURIComponent(item?.value["@id"])}`;
        const name = item?.value?.name;
        html = html.replaceAll(name, `<a target="_blank" href="${url}">${name}</a>`);
      });
      return html;
    },
    onClick() {
      this.expanded = !this.expanded;
      console.log(this.path);
      console.log(this.definition);
    },
    onCopy() {
      navigator.clipboard.writeText(JSON.stringify(this.definition, null, 2)).then(
        function() {
          this.$toast.add(LoggerService.success("Copied to clipboard"));
        },
        function() {
          this.$toast.add(LoggerService.error("Failed to copy to clipboard"));
        }
      );
    },
    onEdit() {
      this.$emit("updateActiveClause", { action: "view", path: this.path, index: 0 });
    },
    onAdd() {
      //improves animation
      this.added = true;
      setTimeout(() => {
        this.added = false;
      }, 500);
      //gets the next path
      const currentPath = this.path; //curent path
      const pathArray = currentPath.split(".");
      const lastItem = pathArray[pathArray.length - 1];
      const currentIndex = lastItem.match(/(?<=\[).+?(?=\])/)[0];
      const newIndex = parseInt(currentIndex) + 1;
      const newLastItem = lastItem.replace(/\[\d+\]/, ``);
      pathArray[pathArray.length - 1] = newLastItem;
      // const newPathArray = pathArray.slice(0, pathArray.length - 1);

      const newPath = pathArray.join(".");
      console.log("newPath", newPath);
      console.log("newLastItem", newIndex);

      // path to be added
      this.$emit("updateActiveClause", { action: "create", path: newPath, index: newIndex });

      //if active clause doesn't exist, it is created AND a special first-time window is show?!
    }
  }
});
</script>

<style scoped>
.node-add {
  display: none;
}

.node-section:hover .node-add {
  display: inline-flex;
}
/* .tab-content {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  padding: 6px;
} */

.actions {
  /* display: none; */
  height: 0;
  transition: height 0.3s ease-out;
}
.node-card:hover .actions {
  /* display: flex; */
  height: 30px;
}

.node-card-body .tabs {
  margin-top: 10px;
  margin-left: 30px;
}

.tabs .tab-item {
  font-weight: 500;
  border-radius: 20px;
  padding: 5px 10px;
  /* border-bottom: transparent 2px solid; */
}
.tabs .tab-item.active {
  background-color: #2563eb;
  color: #fff;
  /* border-bottom: #0f172a 2px solid; */
}

.node-icon {
  color: #2563eb;
  min-height: 20px;
  min-width: 20px;
}
.node-chevron {
  display: flex;
  align-items: center;
  margin-left: 10px;
  color: #374151;
  min-height: 20px;
  min-width: 20px;
}

.node-chevron .icon {
  border: #d1d5db 1px solid;
  border-radius: 50%;
  padding: 2px;
}

.node-card {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #d1d5db;
  top: -5px;
  margin-bottom: 7px;
  border-radius: 7px;
  padding: 6px 10px 6px 10px;
}

.node-card-header {
  display: inline-flex;
  position: relative;
  width: 100%;
}
.node-card-header.expanded {
  padding-bottom: 10px;
  /* border-bottom: 1px solid #d1d5db; */
}
.node-card-title {
  margin-left: 10px;
  margin-top: 2px;
  color: #0f172a;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
}

.node-card:hover {
  cursor: pointer;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.13);
}
</style>

<style>
.node-card-header a {
  color: #1d4ed8 !important;
  font-weight: 700;
}
.node-card-header a:hover {
  text-decoration: underline !important;
}
</style>
