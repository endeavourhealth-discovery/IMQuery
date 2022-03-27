<template>
  <div class="text-definition text-black text-2xl text-bold">
    <div class="flex flex-col">
      <!-- A sentence from the template    -->
      <div v-for="sentence in children.data" :key="sentence.uuid" class="sentence flex">
        <!-- Words in a sentence   -->
        <template v-for="(phrase, phraseIndex) in sentence" :key="phrase.uuid">
          <!-- References  -->
         
          <div v-if="phrase.type == 'reference'" class="flex flex-col">
            <div v-for="entity in phrase.data" :key="entity['@id']">
              {{ entity._text || entity.name }}
            </div>
          </div>

          <div v-else class="phrase flex">
            {{ phrase.text }}
          </div>

          <div class="space inline-block"></div>
        </template>
      </div>

      <!-- Child sentence - assumes only the first resulting template is used (others unmatched ones are removed)  -->
      <TextDefinition v-if="children.children[0]" :children="children.children[0]" class="ml-10 flex" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextDefinition",
  props: ["templates", "activeClausePath", "children", "theme", "themeClasses"],
  methods: {
    capitalise(obj: any) {
      return typeof obj == "string" ? obj.charAt(0).toUpperCase() + obj.slice(1) : obj;
    }
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

.sentence .space {
  min-width: 5px;
}
</style>
