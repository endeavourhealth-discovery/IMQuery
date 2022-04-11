<template>
  <div class="content-container">
    <div class="p-d-flex p-flex-row p-jc-start summary-container">
      <div class="left-side">
        <div class="p-d-flex p-flex-row p-jc-start p-ai-center">
          <p>
            <strong>Name:</strong>
            {{ concept.name }}
          </p>
        </div>
        <p class="break-text">
          <strong>Iri:</strong>
          {{ concept.iri }}
        </p>
        <p>
          <strong>Status: </strong>
          {{ concept.status ? concept.status : "None" }}
        </p>
        <p>
          <strong>Types: </strong>
          {{ conceptTypes ? conceptTypes : "None" }}
        </p>
      </div>
      <div class="right-side" v-if="concept.description">
        <strong>Description:</strong>
        <Description :description="descriptionHTML" />
      </div>
    </div>
    <Divider />
    <div class="p-d-flex p-flex-row p-jc-start definitional-container">
      <div class="left-side">
        <strong>is a: </strong>{{ concept.isa?.length }}
        <Listbox
          :options="concept.isa"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected['@id'])"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option?.name || slotProps.option?.["@id"] }}
            </div>
          </template>
        </Listbox>
      </div>
      <div class="right-side">
        <strong>has sub types: </strong>{{ concept.subtypes?.length }}
        <Listbox
          :options="concept.subtypes"
          listStyle="height: 12rem;"
          v-model="selected"
          @change="navigate(selected['@id'])"
        >
          <template #option="slotProps">
            <div>
              {{ slotProps.option.name || slotProps.option["@id"] }}
            </div>
          </template>
        </Listbox>
      </div>
    </div>
    <Divider />
    <SemanticProperties
      :semanticProperties="semanticProperties"
      :dataModelProperties="dataModelProperties"
      :contentHeight="contentHeight"
    />
    <Divider />
    <DataModelProperties
      :dataModelProperties="dataModelProperties"
      :contentHeight="contentHeight"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouteRecordName } from "node_modules/vue-router/dist/vue-router";
import Description from "./Description.vue";
import SemanticProperties from "./SemanticProperties.vue";
import DataModelProperties from "./DataModelProperties.vue";

export default defineComponent({
  name: "Definition",
  components: { Description, SemanticProperties, DataModelProperties },
  props: [
    "concept",
    "semanticProperties",
    "dataModelProperties",
    "contentHeight"
  ],
  computed: {
    conceptTypes(): string | undefined {
      if ({}.hasOwnProperty.call(this.concept, "types")) {
        return this.concept.types
          .map(function(type: any) {
            return type.name;
          })
          .join(", ");
      } else {
        return undefined;
      }
    },

    descriptionHTML(): string | undefined {
      if ({}.hasOwnProperty.call(this.concept, "description")) {
        const text = this.concept.description.replace(
          /<p>/g,
          "</p>\n<p class='description-p'>"
        );
        return "<p class='description-p'>" + text + "</p>";
      } else {
        return undefined;
      }
    }
  },
  data() {
    return {
      selected: {},
      copyMenuItems: [] as any
    };
  },
  methods: {
    navigate(iri: any) {
      const currentRoute = this.$route.name as RouteRecordName | undefined;
      if (iri)
        this.$router.push({
          name: currentRoute,
          params: { selectedIri: iri }
        });
    }
  }
});
</script>

<style scoped>
.content-container {
  height: 100%;
}

.summary-container {
  width: 100%;
  gap: 7px;
}

.definitional-container {
  gap: 7px;
}

.left-side {
  width: 50%;
}

.right-side {
  width: 50%;
}

.custom .p-scrollpanel-wrapper {
  border-right: 9px solid #f4f4f4;
}

.custom .p-scrollpanel-bar {
  background-color: #1976d2 !important;
  opacity: 1;
  transition: background-color 0.3s;
}

.custom .p-scrollpanel-bar:hover {
  background-color: #135ba1 !important;
}

p {
  margin: 0;
}

#synonyms-button {
  margin-left: 0.5em;
}

.break-text {
  word-break: break-all;
}

.description {
  height: 100%;
  width: 100%;
}
.link {
  cursor: pointer;
}
</style>
