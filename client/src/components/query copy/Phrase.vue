<template>
  <div :class="'phrase   ' + [highlighted ? 'highlighted' : '']">
    <!-- Custom Sentences - add new ones here  -->
    <div v-if="template == 'IncludeEntity' && entity" class="horizontal">
      <Keyword> Include</Keyword>
      <Static> {{ a }}</Static>
      <Selector type="clause" :path="path" :modelValue="entity" :edit="edit"></Selector>
      <Static> who</Static>
    </div>
    <div v-else-if="template == 'entityInSet' && valueType == 'TTIriRef'" class="horizontal flex-wrap">
      <Keyword class="ml"> {{ parent?.notExist == true ? "is not" : "is" }} </Keyword>
      <Keyword> part of the results of the search </Keyword>
      <Selector type="clause" :path="path" :modelValue="entity"></Selector>
    </div>
    <!-- /Custom Sentences - add new ones here -->

    <!-- Operator and Match Clauses-->
    <template v-else-if="valueType == 'match' && entity">
      <!-- Match Clause -->
      <div v-if="hasKey(entity, 'property')" :class="'property horizontal' + [index > 0 ? ' ' : '']">
        <Keyword v-if="index > 0 || operator == 'or'" :class="'operator-label'"> {{ operator }}</Keyword>
        <Selector v-if="entity" class="" type="clause" :path="path" :modelValue="entity" :edit="edit"></Selector>
      </div>
      <!-- Match Clause -->

      <!-- Operator Clause  -->
      <template v-else v-for="(child, childIndex) in children(entity)" :key="child.path">
        <div v-if="isOperator(child?.path)" class="operator horizontal">
          <Keyword class="operator-label">{{ showOperator(path, index, childIndex) ? operator : "" }}</Keyword>
          <div class="operator-items">
            <Phrase
              v-for="(grandChild, grandChildIndex) in children(child.value)"
              :object="object"
              :path="`${path}.${child?.path}[${grandChildIndex}]`"
              valueType="match"
              :operator="grandChildIndex > 0 ? child.path : ''"
              :index="grandChildIndex"
              :edit="edit"
            >
            </Phrase>
          </div>
        </div>
        <div v-else-if="child.path == 'entityInSet'">
          <div class="operator-label">{{ childIndex > 0 ? operator : "" }}</div>

          <Phrase
            v-for="(grandChild, grandChildIndex) in child.value"
            :object="object"
            :parentPath="`${path}`"
            :path="`${path}.${child.path}[${grandChildIndex}]`"
            template="entityInSet"
            valueType="TTIriRef"
            :index="grandChildIndex"
          >
          </Phrase>
        </div>
      </template>
      <!-- Operator Clause  -->
    </template>
    <!-- /Operator and Match Clauses-->

    <!-- Child phrases -->
    <slot> </slot>
    <!-- Child phrases -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Static from "./Static.vue";
import Selector from "./Selector.vue";
import Keyword from "./Keyword.vue";
import _ from "lodash";

export default defineComponent({
  name: "Phrase",
  components: { Selector, Static, Keyword },
  props: ["template", "modelValue", "object", "path", "parentPath", "valueType", "keys", "excludedKeys", "operator", "highlighted", "index", "edit"],
  emits: ["selectedClauseUpdated"],
  methods: {
    showOperator(path: string, index: number, childIndex: number): boolean {
      // console.log("path", path);
      // console.log("childIndex", index);
      // console.log("operator", this.operator == "or" );
      if ((index == 0 || childIndex == 0) && this.operator == "or") {
        // this.operator = "either";
        return true;
      }
      if (index > 0 || childIndex > 0) return true;

      return false;
    },
    isOperator(testString: any): boolean {
      return ["and", "or"].includes(testString);
    },
    hasKey(testObjecty: any, comparatorKey: string): boolean {
      return Object.keys(testObjecty).some(key => key == comparatorKey);
    },
    children(testObject: any) {
      // console.log("keys", Object.keys(testObject));
      let children = Object.keys(testObject).map((key: string) => {
        const isIncludedKey = ["and", "or", "property"].includes(key);
        const isExcludedKey = ["entityType"].includes(key);
        const isNumber = typeof parseInt(key) == "number";

        if ((isIncludedKey || isNumber) && !isExcludedKey) {
          return { path: key, value: testObject[key] };
        } else {
          return {};
        }
      });
      children = children.filter(child => child.path);
      return children;
    }
  },
  data() {
    return {
      editMode: this.edit,
      entity: this.path ? _.get(this.object, this.path) : this.object,
      parent: this.parentPath ? _.get(this.object, this.parentPath) : null
    };
  },
  computed: {
    a: {
      get() {
        const testString = this?.entity?.name;
        if (!testString || testString == "") return "a";
        return ["a", "e", "i", "o", "u"].some((letter: string) => letter.toLowerCase() == testString.substring(0, 1).toLowerCase()) ? "an" : "a";
      },
      set() {}
    }
  },
  watch: {
    edit(newValue: boolean) {
      this.editMode = newValue;
    }
  }
});
</script>

<style>
.ml {
  margin-left: 10px;
}

.flex-wrap {
  flex-wrap: wrap;
}

.phrase,
.phrase .static {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #000 !important;
}

.phrase .vertical {
  display: inline-flex;
  flex-direction: column;
}

.subphrase {
  display: inline-flex;
}

.horizontal {
  display: flex;
}

.horizontal > :not(:first-child),
.subset > :not(:first-child) {
  margin-left: 5px;
}

.phrase.highlighted .operator-label,
.phrase.highlighted .keyword {
  font-weight: 700;
  color: #7e22ce;
}

.phrase.highlighted .iriref {
  font-weight: 700;
  color: #2563eb;
}

.phrase .iriref:hover {
  cursor: pointer;
}

.static {
  display: inline-flex;
}

.iriref {
  display: flex;
  /* margin-left: 10px; */
}

.phrase .operator,
.phrase .property {
  position: relative;
  margin-bottom: 5px;
  padding: 0 5px;
  border-radius: 0.375rem;
  border-width: 1px;
  border-color: transparent;
}

.phrase .operator:hover,
.phrase .property:hover {
  background-color: rgb(156 163 175 / 0.05) !important;
  border-color: rgb(156 163 175) !important;
}

.operator-items {
  display: flex;
  flex-direction: column;
}

.operator-label {
  min-width: 30px;
}

.operator-items:first-child {
  margin-left: 20px;
}
</style>
