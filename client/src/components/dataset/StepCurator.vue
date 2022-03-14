<template>
  <div class="w-full h-full">
    <!-- Description -->
    <div class="header flex justify-center">
      <slot> </slot>
    </div>
    <!-- /Description -->

    <!-- Steps -->
    <div class="w-full h-full wrapper-steps pt-20">
      <div class="steps">
        <template
          v-for="(step, index1) in activeQuery.data.steps"
          :key="step.id"
        >
          <section class="item text-gray-900 w-full flex">
            <div class="flex flex-col h-full">
              <input class="step-title outline-none" :value="step.name" />
            </div>
            <section class="step-content">
              <ul>
                <li class=" px-3 w-full flex">
                  <div
                    :class="
                      'content-input w-full flex flex-col outline-none text-gray-700 text-base'
                    "
                  >
                    <Section name="Copy all data from">
                      <template
                        v-for="(item, index2) in step.copy"
                        :key="item.iri"
                      >
                        <Selector
                          :propertyPath="
                            `data.steps[${index1}].copy[${index2}]`
                          "
                          :stepIri="step.iri"
                          type="query"
                          class="mb-1"
                          :modelValue="item"
                        >
                        </Selector>
                      </template>
                    </Section>
                    <Section
                    class=""
                      v-if="step.inclusionCriteria.length"
                      name="Include patients if"
                    >
                      <div
                        class="section flex flex-col"
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
                        
                          class="widget-content w-full inline bg-white pb-3 pl-3 rounded-b-xl"
                        >
                          <template
                            v-for="node in criterion.constraints"
                            :key="node.id"
                          >
                            <Constraint class="w-full" :node="node" />
                          </template>
                        </div>
                      </div>
                    </Section>
                  </div>
                </li>
              </ul>
              <!-- Content -->
            </section>
          </section>
        </template>
      </div>
    </div>
    <!-- Steps -->
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { mapState } from "vuex";

import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import Section from "@/components/dataset/Section.vue";
// import SectionToggler from "@/components/dataset/SectionToggler.vue";
import Selector from "@/components/dataset/Selector.vue";
import Widget from "@/components/dataset/Widget.vue";
import _ from "lodash";
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
    // SectionToggler,
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
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.section { 
    /* width: 100%; */
  /* max-width: 400px; */
  width: 400px;
}

.divider {
  border-bottom: 1px solid #eef0f2;
}

.section-toggler {
  margin-top: 5px;
}

.step-title {
  font-size: 16px !important;
  font-weight: 600;
}

.widget-content {
  padding-left: 53px;
}

.wrapper-steps {
  display: flex;
  overflow-y: auto;
  /* padding: 0rem 1rem 0rem 1rem; */
  /* max-height: 715px; */
}

.steps {
  position: relative;
  display: table;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
      width: 100%;
    max-width: 1024px;
  /* margin-top: 2rem; */
}

/* Line on which nodes are drawn  */
.steps:after {
  content: "";
  width: 2px;
  position: absolute;
  top: 0.5rem;
  bottom: 0rem;
  left: 300px;
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

.steps section.item {
  position: relative;
}

/* .steps section.item:first-child section {
  margin-top: -1.3em;
  padding-bottom: 0px;
} */

.steps section.item section {
  position: relative;
  padding-bottom: 1.25em;
  /* margin-bottom: 2.2em; */
}

.steps section.item section h4 {
  position: absolute;
  bottom: 0;
  font-size: 0.9em;
  font-weight: 400;
  line-height: 1.2em;
  margin: 0;
  padding: 0 0 0 89px;
  color: #c5c5c5;
}

/* @media (min-width: 62em) {
  .steps section.item section h4 {
    font-size: 1em;
  }
} */

.steps section.item section ul {
  list-style-type: none;
  padding: 0 0 0 75px;
  /* margin: -1.35rem 0 1em; */
  max-width: 32rem;
  font-size: 1em;
}
/* Node Icon on Line  */
.steps section.item section ul:first-of-type:after {
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
  left: 100px;
  top: 3px;
  z-index: 2;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

/* One Step (section)  */
.steps section.item section ul li {
  margin-left: 40px;
  width: 100%;
  max-width: 400px;
}

/* Scrollbar */
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ffffff;
  /* darker colour: #f1f1f1; */
}

/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(136, 136, 136, 0.233);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* @media (min-width: 62em) {
  .steps section.item section ul {
    font-size: 1.1em;
    padding: 0 0 0 81px;
  }
} */

/* .steps section.item section ul:last-child {
  margin-bottom: 0;
} */

/* Bullet Icon */
/* .steps section.item section ul li:before {
  content: "";
  width: 5px;
  height: 5px;
  background: #000000;
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
} */

/* .steps section.item section ul li:not(:first-child) {
  margin-top: 0.5rem;
} */

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
