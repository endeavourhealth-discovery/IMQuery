<template>
  <div class="">
    <!-- <div class="divider"></div> -->
    <template v-for="snippet in activeQuery.data.snippets" :key="snippet.id">
      <div class="py-3">
        <!-- Header -->
        <div class="section-title flex w-full px-3">
          <!-- Toggler -->
          <SectionToggler @click="expanded = !expanded" />
          <!-- / Toggler -->
          <!-- Title -->
          <div
            class="title-input w-full inline-flex h-7 ml-5 outline-nonetext-black"
          >
            {{ snippet.name }}
          </div>
          <!-- /Title -->
        </div>
        <!-- /Header -->

        <!-- Content -->
        <div v-show="expanded" class="pt-3 px-3">
          <div class="w-full flex">
            <div
              :class="
                'content-input w-full flex flex-col outline-none text-blue-700 text-base'
              "
            >
              <Section name="Include all health records from">
                <template v-for="target in snippet.targets" :key="target.iri">
                  <DatasetWidget class="my-3 ml-5" :target="target">
                  </DatasetWidget>
                </template>
              </Section>
              <Section name="If">
                <template
                  v-for="criterion in snippet.inclusionCriteria"
                  :key="criterion.id"
                >
                  <Widget class="my-3 ml-5" :criterion="criterion"></Widget>
                </template>
              </Section>
            </div>
          </div>
        </div>
        <!-- Content -->
      </div>
      <div class="divider"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { mapState } from "vuex";

import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import Section from "@/components/dataset/Section.vue";
import SectionToggler from "@/components/dataset/SectionToggler.vue";
import DatasetWidget from "@/components/dataset/DatasetWidget.vue";
import Widget from "@/components/dataset/Widget.vue";
const _ = require("lodash");
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
// import RichInput from "@/components/dataset/RichInput.vue";

export default defineComponent({
  name: "FilterCurator",
  components: {
    // RoundButton,
    // HeroIcon,
    Widget,
    DatasetWidget,
    Section,
    SectionToggler,
  },
  emit: ["update:activeQuery", "update:openQueries", "update:name"],
  props: ["activeQuery", "openQueries"],
  data() {
    return {
      dataModelProperties: [] as any[],
      expanded: true,
      document: [
        //move this to vuex ASAP.
        {
          id: "c1a2a4a2-c692-4cf3-8f47-bde4d0fa4f1e",
          title: "Patients currently registered at a GP practice",
          content: "Include all patients from current GP register.",
          error: true,
        },
        {
          id: "23b07845-f1b7-4ad0-8bf4-1d893f3d5ea7",
          title: "Get all healthrecord for patients included in this dataset.",
          content: "Get all records for patients.",
          error: false,
        },
      ],
    };
  },
  async mounted() {
    await this.getDataModelProperties("http://endhealth.info/im#EpisodeOfCare");
  },
  methods: {
    updateName(name: string): void {
      let newActiveQuery = this.activeQuery;
      newActiveQuery.name = name;
      console.log(newActiveQuery);
      this.$emit("update:activeQuery", newActiveQuery);
    },
    async getDataModelProperties(iri: string) {
      await EntityService.getDataModelProperties(iri)
        .then((res) => {
          this.dataModelProperties = res.data;
          console.log("datamodel fetched " + iri + " :", res.data);
        })
        .catch((err) => {
          this.$toast.add(
            LoggerService.error(
              "Failed to get data model properties from server",
              err
            )
          );
        });
    },
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

.divider {
  border-bottom: 1px solid #eef0f2;
}

.section-toggler {
  margin-top: 5px;
}

.title-input {
  font-size: 16px !important;
  font-weight: 500;
}
</style>

// // [ ] create language nodes on the fly as you type. You can also raw paste
text into it. // // [ ] only validated input is accepted on nodes // // [ ]
nodes recognise and highlight keyword such as INLUCDE EXCLUDE etc // // [ ]
nodes recognise pills -> Left button delete, middle is text in put, below is
autocomplete (visible on focus no dropdown needed, // // [] convert to text and
back // // [ ] use icons e.g. Date/Time, Number, Concept, Health record type for
recognised DM/CSET/IM PREDICATE (DM
PROPERTIES)/LITERALS/LOGIC/FUNCTIONS/DEFINITIONS // // [ ] pills are recognised
entities (as a result of autocomplete) // // [ ] pills are clickable (dialogue),
typable (autocomplete dropdown), erasable (backspace), hoverable (show
definition) // // [ ] pills 100% width textboxes // // [ ] if a pill is a
keyword its not a pills // // [ ] pills should be edited inline like notion //
// [ ] nodes are collapsible ?
