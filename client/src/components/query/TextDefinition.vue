<template>
  <div class="text-definition text-black text-2xl text-bold">
    <div class="flex flex-col">
      <!-- A sentence from the template    -->
      <div v-for="(sentence, sentenceIndex) in children.data" :key="sentence.uuid" class="sentence flex flex-wrap">
        <!-- Words in a sentence   -->
        <template v-for="(phrase, phraseIndex) in sentence" :key="phrase.uuid">
          <!-- References  -->

          <div v-if="phrase.type == 'reference'" :class="'reference flex flex-col'">
            <!-- Array of References  -->
            <template v-if="Array.isArray(phrase.data)">
              <div v-for="(entity, entityIndex) in phrase.data" :key="entity['@id']" :class="'entity flex '">
                <div class="inline mr-4 text-orange-500 font-bold w-7">{{ entityIndex != 0 ? "or" : "" }}</div>
                <div @click="click(entity)" :class="'inline ' + 'text-blue-700 font-medium cursor-pointer hover:underline'">
                  {{ entity._text || entity.name || entity["rdfs:label"] }}
                </div>
              </div>
            </template>
            <!-- Array of References  -->

            <!-- Single References -->
            <template v-else>
              <div :class="'entity flex '">
                <div @click="click(phrase.data)" :class="'inline ' + 'text-blue-700 font-medium cursor-pointer hover:underline'">
                  {{ phrase.data._text || phrase.data["rdfs:label"] || phrase.data.name }}
                </div>
              </div>
            </template>
            <!-- Single References -->
          </div>

          <div v-else-if="phrase.type == 'transformedReferences'" :class="'transformedReferences ' + 'text-purple-700 font-bold cursor-pointer  '">
            {{ phrase.text }}
          </div>

          <div v-else class="phrase flex font-regular text-black">
            {{ phrase.text }}
          </div>

          <div class="space inline-block"></div>
        </template>
        <span>...</span>
      </div>

      <!-- Child sentence - assumes only the first resulting template is used (others unmatched ones are removed)  -->
      <template v-if="children?.children?.length > 0">
        <TextDefinition v-for="child in children.children" :key="child.uuid" :children="child" class="ml-10 flex" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextDefinition",
  props: ["templates", "activeClausePath", "children", "theme", "themeClasses"],
  data() {
    return {
      context: {
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        im: "http://endhealth.info/im#",
        imq: "http://endhealth.info/imq#",
        bc: "http://endhealth.info/bc#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        emis: "http://endhealth.info/emis#",
        sn: "http://snomed.info/sct#",
        ods: "http://endhealth.info/ods#",
        owl: "http://www.w3.org/2002/07/owl#",
        prov: "http://www.w3.org/ns/prov#",
        tpp: "http://endhealth.info/tpp#",
        xml: "http://www.w3.org/XML/1998/namespace#",
        sh: "http://www.w3.org/ns/shacl#",
        opcs4: "http://endhealth.info/opcs4#",
        vis: "http://endhealth.info/vision#",
        orole: "https://directory.spineservices.nhs.uk/STU3/CodeSystem/ODSAPI-OrganizationRole-1#",
        xsd: "http://www.w3.org/2001/XMLSchema#"
      }
    };
  },
  methods: {
    click(entity: any): void {
      const _iri = entity["@id"].replace(":", "#");
      const _contextKey = _iri.split("#")[0];
      const _iriKey = _iri.split("#")[1];
      
      const _encodedIri = encodeURIComponent(this.context[_contextKey] + _iriKey);

      const _url = `https://dev.endhealth.co.uk/viewer/#/concept/${_encodedIri}`;
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
