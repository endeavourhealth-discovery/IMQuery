<template>
  <div class="text-definition text-black text-2xl text-bold">
    <div class="flex flex-col">
      <!-- A sentence from the template    -->
      <div v-for="(sentence, sentenceIndex) in children.data" :key="sentence.uuid" class="sentence flex">
        <!-- Words in a sentence   -->
        <template v-for="(phrase, phraseIndex) in sentence" :key="phrase.uuid">
          <!-- References  -->

          <div v-if="phrase.type == 'reference'" :class="'reference flex flex-col '">
            <div v-for="(entity, entityIndex) in phrase.data" :key="entity['@id']" :class="'entity flex '">
              <div v-if="entityIndex != 0" class="inline mr-5 text-green-500 font-bold">or</div>
              <div   :class="'inline ' + 'text-blue-700 font-medium cursor-pointer hover:underline'">
                {{ entity._text || entity.name || entity["rdfs:label"] }}
              </div>
            </div>
          </div>

          <div
            v-else-if="phrase.type == 'transformedReferences'"
            :class="'transformedReferences ' + 'text-indigo-700 font-medium cursor-pointer  '"
          >
            {{ phrase.text }}
          </div>

          <div v-else class="phrase flex">
            {{ phrase.text }}
          </div>

          <div class="space inline-block"></div>
        </template>
      </div>

      <!-- Child sentence - assumes only the first resulting template is used (others unmatched ones are removed)  -->
      <template v-if="children?.children?.length > 0">
        <TextDefinition v-for="child in children.children" :key="child.uuid" :children="child" class="ml-14 flex" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextDefinition",
  props: ["templates", "activeClausePath", "children", "theme", "themeClasses"],
  methods: {
    click(entity: any): void {
      const _entityIri = encodeURIComponent(entity["@id"]);
      const _url = `https://dev.endhealth.co.uk/viewer/#/concept/${_entityIri}`;
      window.open(_url, "_blank");
    },
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
