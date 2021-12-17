<template>
  <div class="widget">

    <template  v-for="(step, index1) in activeQuery.data.steps" :key="step.id">
      <div class="py-3">
        <!-- Header -->
        <div class="section-title flex w-full px-3 items-center">
          <!-- Toggler -->
          <SectionToggler
            :expanded="expandedSteps.includes(step.id)"
            @click="
              expandedSteps.includes(step.id)
                ? (expandedSteps = expandedSteps.filter(
                    (item: any) => item != step.id
                  ))
                : expandedSteps.push(step.id)
            "
          />
          <!-- / Toggler -->
          <!-- Title -->
          <div
            class="title-input w-full inline-flex h-7 ml-5 outline-none text-black"
          >
            {{ step.name }}
          </div>
          <!-- /Title -->
        </div>
        <!-- /Header -->

        <!-- Content -->
        <div v-show="expandedSteps.includes(step.id)" class="pt-3 px-3">
          <div class="w-full flex">
            <div
              :class="
                'content-input w-full flex flex-col outline-none text-gray-700 text-base'
              "
            >
              <Section name="Copy all data from">
                <template v-for="(item, index2) in step.copy" :key="item.iri">
                  <Selector
                    :propertyPath="`data.steps[${index1}].copy[${index2}]`"
                    :stepIri="step.iri"
                    type="query"
                    class="mb-1"
                    :modelValue="item"
                  >
                  </Selector>
                </template>
              </Section>
              <Section
                v-if="step.inclusionCriteria.length"
                name="Include patients if"
              >
                <div
                  class="flex flex-col"
                  v-for="(criterion, index3) in step.inclusionCriteria"
                  :key="criterion.id"
                >
                  <div class="flex">
                    <div>
                      <Selector
                        :propertyPath="
                          `data.steps[${index1}].inclusionCriteria[${index3}].datamodelEntity`
                        "
                        :stepIri="step.iri"
                        type="datamodel"
                        class="mb-1 inline"
                        :modelValue="criterion.datamodelEntity"
                      ></Selector>
                    </div>

                    <KeywordWidget
                      class="inline"
                      :modelValue="criterion.modifier.name"
                    />
                  </div>

                  <div
                    v-show="expandedSteps.includes(step.id)"
                    class="widget-content inline bg-white pb-3 pl-3 rounded-b-xl"
                  >
                    <template
                      v-for="node in criterion.constraints"
                      :key="node.id"
                    >
                      <Constraint :node="node" />
                    </template>
                  </div>
                </div>
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
import Selector from "@/components/dataset/Selector.vue";
import Widget from "@/components/dataset/Widget.vue";
const _ = require("lodash");
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import Constraint from "@/components/dataset/Constraint.vue";
import KeywordWidget from "@/components/dataset/KeywordWidget.vue";
// import RichInput from "@/components/dataset/RichInput.vue";

export default defineComponent({
  name: "StepCurator",
  components: {
    // RoundButton,
    // HeroIcon,
    // Widget,
    Selector,
    Section,
    SectionToggler,
    Constraint,
    KeywordWidget,
  },
  emit: ["update:activeQuery", "update:openQueries", "update:name"],
  props: ["activeQuery", "openQueries"],
  data() {
    return {
      expandedSteps: [] as any[],
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

  methods: {
    // updateName(name: string): void {
    //   let newActiveQuery = this.activeQuery;
    //   newActiveQuery.name = name;
    //   console.log(newActiveQuery);
    //   this.$emit("update:activeQuery", newActiveQuery);
    // },
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
  font-weight: 600;
}

.widget-content {
  padding-left: 53px;
}

.steps {
  position: relative;
  display: table;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
}

.steps div:after {
  content: "";
  width: 2px;
  position: absolute;
  top: 0.5rem;
  bottom: 0rem;
  left: 60px;
  z-index: 1;
  background: #c5c5c5;
}

.steps h3 {
  position: -webkit-sticky;
  position: sticky;
  top: 5rem;
  color: #888;
  margin: 0;
  font-size: 1em;
  font-weight: 400;
}

@media (min-width: 62em) {
  .steps h3 {
    font-size: 1.1em;
  }
}

.steps section.year {
  position: relative;
}

.steps section.year:first-child section {
  margin-top: -1.3em;
  padding-bottom: 0px;
}

.steps section.year section {
  position: relative;
  padding-bottom: 1.25em;
  margin-bottom: 2.2em;
}

.steps section.year section h4 {
  position: absolute;
  bottom: 0;
  font-size: 0.9em;
  font-weight: 400;
  line-height: 1.2em;
  margin: 0;
  padding: 0 0 0 89px;
  color: #c5c5c5;
}

@media (min-width: 62em) {
  .steps section.year section h4 {
    font-size: 1em;
  }
}

.steps section.year section ul {
  list-style-type: none;
  padding: 0 0 0 75px;
  margin: -1.35rem 0 1em;
  max-width: 32rem;
  font-size: 1em;
}

@media (min-width: 62em) {
  .steps section.year section ul {
    font-size: 1.1em;
    padding: 0 0 0 81px;
  }
}

.steps section.year section ul:last-child {
  margin-bottom: 0;
}

.steps section.year section ul:first-of-type:after {
  content: "";
  width: 10px;
  height: 10px;
  background: #c5c5c5;
  border: 2px solid #ffffff;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  border-radius: 50%;
  position: absolute;
  left: 54px;
  top: 3px;
  z-index: 2;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.steps section.year section ul li {
  margin-left: 0.5rem;
}

.steps section.year section ul li:before {
  /*  old
	content: '·';
	 margin-left: -.5rem;
	padding-right: .3rem; 	*/

  content: "";
  width: 5px;
  height: 5px;
  background: #000000;
  /* border: 1px solid #000000; */
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  border-radius: 50%;

  position: absolute;
  left: 77px;
  margin-top: 11px;

  z-index: 2;

  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.steps section.year section ul li:not(:first-child) {
  margin-top: 0.5rem;
}

.steps section.year section ul li span.price {
  color: mediumturquoise;
  font-weight: 500;
}

#price {
  display: inline;
}

/* svg {
	border: 3px solid white;
	border-radius: 50%;
	box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
} */

/* .li-event-title:hover, .transcript-item-title  {
	color: #0072CE;
} */

/* Scrollbar */
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ededee;
  /* darker colour: #f1f1f1; */
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* .widget {
  width: 100%;
} */
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
