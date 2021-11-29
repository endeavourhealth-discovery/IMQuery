<template>
  <Dialog :visible="showDialog" :modal="true" :closable="false" :maximizable="true" :style="{ width: '50vw' }">
    <template #header>
      <h3>Download Concept:</h3>
    </template>
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>
    <div v-else id="content" class="p-d-flex p-flex-column p-jc-center p-ai-center">
      <h4 v-if="concept[RDFS_LABEL]">
        {{ concept[RDFS_LABEL] }}
      </h4>
      <SelectButton class="format-container" v-model="format" :options="formatOptions" datakey="value" optionLabel="name" />
      <div class="options-container p-d-flex p-flex-row p-flex-wrap p-jc-around">
        <div class="checkbox-label">
          <Checkbox :disabled="!includeIsA" id="is-a" :binary="true" value="Include is a" v-model="includeIsA" />
          <label class="label" :class="includeIsA ? null : 'inactive-text'" for="is-a">
            Include is a's
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!includeHasSubTypes" id="has-sub-types" :binary="true" value="Include has sub types" v-model="includeHasSubTypes" />
          <label class="label" :class="includeHasSubTypes ? null : 'inactive-text'" for="has-sub-types">
            Include has sub types
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!includeIsChildOf" id="is-child-of" :binary="true" value="Include is child of" v-model="includeIsChildOf" />
          <label class="label" :class="includeIsChildOf ? null : 'inactive-text'" for="is-child-of">
            Include is child of
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!includeHasChildren" id="has-children" :binary="true" value="Include has children" v-model="includeHasChildren" />
          <label class="label" :class="includeHasChildren ? null : 'inactive-text'" for="has-children">
            Include has children
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!includeTerms" id="terms" :binary="true" value="Include terms" v-model="includeTerms" />
          <label class="label" :class="includeTerms ? null : 'inactive-text'" for="terms">
            Include terms
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!includeDataModelProperties"
            id="data-model-properties"
            :binary="true"
            value="Include data model properties"
            v-model="includeDataModelProperties"
          />
          <label class="label" :class="includeDataModelProperties ? null : 'inactive-text'" for="data-model-properties">
            Include data model properties
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox
            :disabled="!includeSemanticProperties"
            id="semantic-properties"
            :binary="true"
            value="Include semantic properties"
            v-model="includeSemanticProperties"
          />
          <label class="label" :class="includeSemanticProperties ? null : 'inactive-text'" for="semantic-properties">
            Include semantic properties
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!includeMembers" id="members" :binary="true" value="Include members" v-model="includeMembers" />
          <label class="label" :class="includeMembers ? null : 'inactive-text'" for="members">
            Include members
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox :disabled="!includeMembers" id="expandMembers" :binary="true" value="Expand members" v-model="expandMembers" />
          <label class="label" :class="includeMembers ? null : 'inactive-text'" for="expandMembers">
            Expand members
          </label>
        </div>
        <div class="checkbox-label">
          <Checkbox id="inactive" :binary="true" value="Include inactive" v-model="includeInactive" />
          <label class="label" for="inactive">
            Include inactive children/parents
          </label>
        </div>
      </div>
      <div class="download-button-container p-d-flex p-flex-row p-jc-around">
        <Button label="Download Concept" icon="pi pi-download" class="p-button-primary button-download button-left" @click="downloadConcept" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="closeDownloadDialog" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import EntityService from "@/services/EntityService";
import LoggerService from "@/services/LoggerService";
import { defineComponent } from "@vue/runtime-core";
import { RDFS } from "@/vocabulary/RDFS";
import { IM } from "@/vocabulary/IM";

export default defineComponent({
  name: "DownloadDialog",
  props: ["conceptIri", "showDialog"],
  emits: ["closeDownloadDialog"],
  watch: {
    async conceptIri(newValue) {
      await this.init(newValue);
    }
  },
  async mounted() {
    await this.init(this.conceptIri);
  },

  data() {
    return {
      concept: {},
      isA: [] as any,
      hasSubTypes: [] as any,
      isChildOf: [] as any,
      hasChildren: [] as any,
      terms: [] as any,
      dataModelProperties: [],
      semanticProperties: [],
      members: {} as any,
      includeHasSubTypes: true,
      includeDataModelProperties: true,
      includeMembers: true,
      expandMembers: false,
      includeIsA: true,
      includeIsChildOf: false,
      includeHasChildren: false,
      includeInactive: false,
      includeSemanticProperties: false,
      includeTerms: false,
      loading: false,
      RDFS_LABEL: RDFS.LABEL,
      format: {
        name: "Excel(.xlsx)",
        value: "excel",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      },
      formatOptions: [
        { name: "JSON", value: "json", mime: "application/json" },
        {
          name: "Excel(.xlsx)",
          value: "excel",
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      ]
    };
  },
  methods: {
    closeDownloadDialog() {
      this.$emit("closeDownloadDialog");
    },

    downloadConcept() {
      const modIri = this.conceptIri.replace(/\//gi, "%2F").replace(/#/gi, "%23");

      const url =
        process.env.VUE_APP_API +
        "api/entity/download?iri=" +
        modIri +
        "&format=" +
        this.format.value +
        "&hasSubTypes=" +
        this.includeHasSubTypes +
        "&dataModelProperties=" +
        this.includeDataModelProperties +
        "&members=" +
        this.includeMembers +
        "&expandMembers=" +
        this.expandMembers +
        "&isA=" +
        this.includeIsA +
        "&semanticProperties=" +
        this.includeSemanticProperties +
        "&terms=" +
        this.includeTerms +
        "&isChildOf=" +
        this.includeIsChildOf +
        "&hasChildren=" +
        this.includeHasChildren +
        "&inactive=" +
        this.includeInactive;
      const popup = window.open(url);
      if (!popup) {
        this.$toast.add(LoggerService.error("Download failed from server"));
      } else {
        this.$toast.add(LoggerService.success("Download will begin shortly"));
      }
      this.closeDownloadDialog();
    },

    async init(iri: string) {
      this.loading = true;
      await EntityService.getPartialEntity(iri, [RDFS.LABEL, IM.IS_CHILD_OF, IM.HAS_CHILDREN, IM.IS_A])
        .then(res => {
          this.concept = res.data;
          if (Object.prototype.hasOwnProperty.call(this.concept, IM.IS_CHILD_OF) && res.data[IM.IS_CHILD_OF].length) {
            this.isChildOf = res.data[IM.IS_CHILD_OF];
          }
          if (Object.prototype.hasOwnProperty.call(this.concept, IM.HAS_CHILDREN) && res.data[IM.HAS_CHILDREN]) {
            this.hasChildren = res.data[IM.HAS_CHILDREN];
          }
          if (Object.prototype.hasOwnProperty.call(this.concept, IM.IS_A) && res.data[IM.IS_A].length) {
            this.isA = res.data[IM.IS_A];
          }
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get concept data from server", err));
        });
      await EntityService.getEntityChildren(iri)
        .then(res => {
          this.hasSubTypes = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get children data from server", err));
        });
      await EntityService.getEntityTermCodes(iri)
        .then(res => {
          this.terms = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get terms from server", err));
        });
      await EntityService.getDataModelProperties(iri)
        .then(res => {
          this.dataModelProperties = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get data model properties from server", err));
        });
      await EntityService.getSemanticProperties(iri)
        .then(res => {
          this.semanticProperties = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get semantic properties from server", err));
        });
      await EntityService.getEntityMembers(iri, this.expandMembers, false)
        .then(res => {
          this.members = res.data;
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Failed to get members from server", err));
        });
      this.setIncludeBooleans();
      this.loading = false;
    },

    setIncludeBooleans() {
      this.includeIsA = !!this.isA.length;
      this.includeHasSubTypes = !!this.hasSubTypes.length;
      this.includeIsChildOf = !!this.isChildOf.length;
      this.includeHasChildren = !!this.hasChildren.length;
      this.includeTerms = !!this.terms.length;
      this.includeDataModelProperties = !!this.dataModelProperties.length;
      this.includeSemanticProperties = !!this.semanticProperties.length;
      this.includeMembers = Object.prototype.hasOwnProperty.call(this.members, "members") && this.members.members.length ? true : false;
    }
  }
});
</script>

<style scoped>
.button-left {
  margin-right: 1rem;
}

.options-container {
  width: 60%;
  margin-bottom: 2rem;
}

.checkbox-label {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin: 0.5em;
}

.label {
  margin-left: 0.5em;
}

.format-container {
  margin-bottom: 1rem;
}

h4 {
  margin-bottom: 1em;
}

.inactive-text {
  color: lightgray;
  text-decoration: line-through;
}

.loading-container {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
</style>
