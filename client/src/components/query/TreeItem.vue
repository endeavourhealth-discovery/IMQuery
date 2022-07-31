<template>
  <!-- Primitive Components: pathTo (and its subcommponent "path"), en   -->
  <template v-if="type == 'pathTo'">
    <div class="mainEntity name flex">
      <NodeIcon class="icon " strokewidth="2" width="22" height="22" icon="user"></NodeIcon>
      {{ mainEntity?.name }}
    </div>
    <div class="paths">
      <template v-if="Array.isArray(pathTo) && pathTo?.length > 0" v-for="(pathItem, pathIndex) in pathTo" :key="pathItem">
        <TreeItem v-if="pathIndex % 2 == 0" :pathItem="pathItem" :pathIndex="pathIndex" :data="data" :path="path" :pathLength="pathTo?.length" type="path">
          <div v-if="pathIndex == pathTo?.length - 1" :class="'entity name flex ml-4 '">
            <!--  clause definition ends up here   -->
            <slot></slot>
            <!--  clause definition ends up here   -->
          </div>
          <div v-else class="flex">
            <NodeIcon class="icon " strokewidth="2" width="22" height="22" icon="document_text"></NodeIcon>
            {{ pathTo[pathIndex + 1]?.name }}
          </div>
        </TreeItem>
      </template>
    </div>
  </template>

  <template v-if="type == 'path'">
    <div :class="'property name flex my-2  ' + `ml-[${pathIndex * 72}px]`">
      <NodeIcon class="icon first_child text-green-700 min-w-[10px]" strokewidth="2" width="22" height="22" icon="property_first"></NodeIcon>
      <div class="ml-4 text-black text-xl font-normal">{{ pathItem?.name }}</div>
      <NodeIcon class="ml-4 mt-1.5 text-green-700 min-w-[20px]" strokewidth="3" width="14" height="14" icon="arrow_right_small"></NodeIcon>
      <!-- linked entity goes here  -->
      <slot></slot>
      <!-- linked entity goes here  -->
    </div>
  </template>

  <template v-if="type == 'entity' || type == 'section'">
    <div class="treeitem relative">
      <!-- <div :style="{ marginLeft: margin + 'px' }" class="treeitem-section"> -->

      <div :class="'treeitem-section group'">
        <div v-if="edit" @click="true" class="group-hover:inline hidden  rounded-full bg-blue-600 hover:bg-blue-800 absolute -translate-y-1 -left-10 z-20">
          <NodeIcon class="m-2  text-white  #hover:text-blue-800 mr-2" strokewidth="3" width="16" height="16" icon="plus" />
        </div>
        <NodeIcon v-if="type == 'section'" class="icon first_child" strokewidth="3" width="14" height="17" icon="first_child"></NodeIcon>
        <NodeIcon v-if="type == 'entity'" class="icon" strokewidth="2" width="22" height="22" icon="document_text"></NodeIcon>
        <NodeIcon v-else-if="type == 'section'" class="icon" strokewidth="2" width="20" height="20" icon="color_swatch"></NodeIcon>
        <div class="name hover:underline cursor-pointer">{{ name }}</div>

        <div
          v-if="edit"
          @click="onPropertyDelete(path, propertyPath, propIndex)"
          class=" group-hover:inline absolute rounded-full hover:bg-red-800 text-red-500 hover:text-white hidden -translate-y-2 -right-10 z-20"
        >
          <NodeIcon class="m-2" strokewidth="3" width="20" height="20" icon="x" />
        </div>
      </div>
      <div class="tree-item-relationship">
        <slot name="section"> </slot>
      </div>
      <div class="tree-item-property">
        <slot name="property"></slot>
      </div>
    </div>
  </template>
  <!-- Primitive Components  -->

  <!-- / Higher Level   -->
  <template v-if="type == 'linkedEntity'">
    <!-- Full Tree Connection Between Main Entity and Linked Entity  -->
    <template v-if="showDetails">
      <TreeItem
        type="pathTo"
        :mainEntity="data?.select?.entityType"
        :pathTo="getPathTo() || definition?.pathTo"
        :linkedEntity="definition?.entityType"
        :data="data"
        :path="path"
      >
        <!-- Final Linked Entity Definition  is slotted In Here instead of below  -->
        <!-- !!! Copy any changes here to the component below-->
        <TreeItem :name="definition?.entityType?.name" :edit="edit" :data="data" :path="path" connector="none" type="entity" propertyPath="entityType">
          <template #section>
            <TreeItem :name="'Any Entry'" :edit="edit" v-if="definition?.property" :data="data" :path="path" type="section" propertyPath="property">
              <template #property>
                <div v-for="(prop, propIndex) in definition?.property" :key="prop['@id']" class="group ">
                  <div
                    v-if="edit"
                    @click="true"
                    class="group-hover:inline hidden  rounded-full bg-blue-600 hover:bg-blue-800 absolute -translate-y-2 left-0 z-20"
                  >
                    <NodeIcon class="m-2  text-white  #hover:text-blue-800 mr-2" strokewidth="3" width="16" height="16" icon="plus" />
                  </div>
                  <Property class="ml10  relative z-10 rounded-md" :modelValue="prop" notExist="" :data="data" :path="path"> </Property>
                  <div
                    v-if="edit"
                    @click="onPropertyDelete(path, 'property', propIndex)"
                    class=" group-hover:inline absolute rounded-full hover:bg-red-800 text-red-500 hover:text-white hidden -translate-y-10 -right-10 z-20"
                  >
                    <NodeIcon class="m-2" strokewidth="3" width="20" height="20" icon="x" />
                  </div>
                </div>
              </template>
            </TreeItem>

            <TreeItem
              :name="getOrderLimitLabel()"
              v-if="definition?.orderLimit && definition?.testProperty"
              :data="data"
              :path="path"
              propertyPath="orderLimit"
              type="section"
              :edit="edit"
            >
              <template #property>
                <div v-for="(prop, propIndex) in definition?.testProperty" :key="prop['@id']" class="group">
                  <div
                    v-if="edit"
                    @click="true"
                    class="group-hover:inline hidden  rounded-full bg-blue-600 hover:bg-blue-800 absolute -translate-y-2 left-0 z-20"
                  >
                    <NodeIcon class="m-2  text-white  #hover:text-blue-800 mr-2" strokewidth="3" width="16" height="16" icon="plus" />
                  </div>
                  <Property class="ml10  relative z-10 rounded-md" :modelValue="prop" notExist="" :data="data" :path="path"> </Property>
                  <div
                    v-if="edit"
                    @click="onPropertyDelete(path, 'testProperty', propIndex)"
                    class="roup-hover:inline absolute rounded-full hover:bg-red-800 text-red-500 hover:text-white hidden -translate-y-10 -right-10 z-20"
                  >
                    <NodeIcon class="m-2" strokewidth="3" width="20" height="20" icon="x" />
                  </div>
                </div>
              </template>
            </TreeItem>
          </template>
        </TreeItem>
        <!-- Final Linked Entity Definition  is slotted In Here instead of below  -->
      </TreeItem>
    </template>
    <!-- Full Tree Connection Between Main Entity and Linked Entity  -->

    <!-- Tree is shown as a property/entity path with arrows in between  -->
    <template v-else>
      <!-- path  -->
      <div class="im-definition-header pathTo">
        <span class="ml10"> {{ data?.select?.entityType?.name }} </span>
        <NodeIcon class="ml10 arrow-right" strokewidth="3" width="14" height="14" icon="arrow_right"></NodeIcon>
        <template v-if="definition?.pathTo?.length > 0" v-for="pathTo in definition?.pathTo" :key="pathTo.name">
          <span class="ml10"> {{ pathTo.name }} </span>
          <NodeIcon class="ml10 arrow-right" strokewidth="3" width="14" height="14" icon="arrow_right"></NodeIcon>
        </template>
        <div class="ml10">{{ definition?.entityType?.name }}</div>
      </div>
      <!-- / path  -->
      <!-- / Tree is shown as a property/entity path with arrows in between  -->

      <!-- Linked Entity Definition (when it's show below the path instead of embedded within the tree)  -->
      <!-- !!! Copy any changes here to the component above  -->
      <TreeItem :name="definition?.entityType?.name" :data="data" :path="path" connector="none" type="entity">
        <template #section>
          <TreeItem :name="'Any Entry'" v-if="definition?.property" :data="data" :path="path" type="section">
            <template #property>
              <Property class="ml10" v-for="prop in definition?.property" :key="prop['@id']" :modelValue="prop"> </Property>
            </template>
          </TreeItem>

          <TreeItem :name="getOrderLimitLabel()" v-if="definition?.orderLimit && definition?.testProperty" :data="data" :path="path" type="section">
            <template #property>
              <Property class="ml10" v-for="prop in definition?.testProperty" :key="prop['@id']" :modelValue="prop"> </Property>
            </template>
          </TreeItem>
        </template>
      </TreeItem>
    </template>

    <!-- Linked Entity Definition (when it's show below the path instead of embedded within the tree)  -->
  </template>
  <!-- / Higher Level   -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import NodeIcon from "./NodeIcon.vue";
import Property from "./Property.vue";
export default defineComponent({
  name: "TreeItem",
  props: [
    "modelValue",
    "mainEntity",
    "pathTo",
    "linkedEntity",
    "pathItem",
    "pathIndex",
    "pathLength",
    "currentIndex",
    "type",
    "data",
    "path",
    "showDetails",
    "name",
    "margin",
    "connector",
    "propertyPath",
    "edit"
  ],
  emits: ["update:modelValue"],
  components: { NodeIcon, Property },
  methods: {
    getPathTo() {
      return null;
      //used for testing component
      return [
        {
          "@id": "im:dataController",
          name: "data Controller"
        },
        {
          "@id": "im:Organisation",
          name: "Organisation"
        },
        {
          "@id": "im:mainLocation",
          name: "main Location"
        },
        {
          "@id": "im:Organisation",
          name: "Organisation"
        },
        {
          "@id": "im:mainLocation",
          name: "main Location"
        }
      ];
    },
    onPropertyDelete(clausePath, propertyPath, index) {
      let payload = { action: "deleteClause", clausePath: clausePath, propertyPath: propertyPath, index: index };
      this.$store.commit("updateProperty", payload);
      this.emitter.emit("update-imdefinition", payload.clausePath);
    },
    getOrderLimitLabel(): any {
      if (this.definition?.orderLimit?.orderBy["@id"] == "http://endhealth.info/im#effectiveDate") {
        if (this.definition?.orderLimit?.direction?.toLowerCase() == "descending") return "Latest Entry";
        else if (this.definition?.orderLimit?.direction?.toLowerCase() == "ascending") return "Earliest Entry";
      } else {
        return "Any Entry";
      }

      // return `First ${this.definition?.orderLimit?.count == 1 ? "" : this.definition?.orderLimit?.count}
      //     ${this.definition?.orderLimit?.count > 1 ? "entries" : "entry"} after sorting by ${this.definition?.orderLimit?.direction?.toLowerCase()}
      //     ${this.definition?.orderLimit?.orderBy?.name}:`;
    }
  },
  data() {
    return {
      index: this.currentIndex || 0,
      definition: this.modelValue ? this.modelValue : _.get(this.data, this.path)
    };
  },
  watch: {
    modelValue() {
      this.definition = this.modelValue ? this.modelValue : _.get(this.data, this.path);
    },
    path() {
      this.definition = this.modelValue ? this.modelValue : _.get(this.data, this.path);
    }
  }
});
</script>

<style scoped>
.treeitem-section {
  display: flex;
  position: relative;
}

.icon {
  color: #2563eb;
  margin-right: 10px;
}
.icon.first_child {
  position: relative;
  margin-right: 6px;
  margin-left: 5px;
  top: -2px;
  margin-left: 8px;
  color: #059669;
}

.name {
  font-weight: 700;
  font-size: 14px;
}

.treeitem-section {
  /* margin-top: 5px; */
  margin-bottom: 7px;
}

.tree-item-property {
  margin-left: 13px;
}
</style>
