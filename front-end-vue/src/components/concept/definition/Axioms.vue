<template>
  <div v-if="axiomString !== 'None'" id="axioms-container" :style="{ width: size }">
    <div class="head-container">
      <strong class="label">{{ label }}</strong>
      <span>&nbsp;({{ data.count }})</span>
      <Button
        :icon="buttonExpanded ? 'pi pi-minus' : 'pi pi-plus'"
        class="p-button-rounded p-button-text p-button-primary p-button-sm expand-button"
        @click="setButtonExpanded()"
        v-styleclass="{
          selector: '.axiom-string',
          enterClass: 'p-d-none',
          enterActiveClass: 'my-fadein',
          leaveActiveClass: 'my-fadeout',
          leaveToClass: 'p-d-none'
        }"
      />
    </div>
    <pre class="p-d-none axiom-string">{{ data.axiomString }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Axioms",
  props: {
    label: { type: String },
    data: { type: Object, required: true },
    size: { type: String }
  },
  mounted() {
    if (Object.prototype.hasOwnProperty.call(this.data, "axiomString") && this.data.axiomString.length) {
      this.axiomString = this.data.axiomString;
    }
    if (Object.prototype.hasOwnProperty.call(this.data, "count")) {
      this.count = this.data.count;
    }
  },
  data() {
    return {
      buttonExpanded: false,
      axiomString: "None",
      count: 0
    };
  },
  methods: {
    setButtonExpanded() {
      this.buttonExpanded ? (this.buttonExpanded = false) : (this.buttonExpanded = true);
    }
  }
});
</script>

<style scoped>
.axiom-string {
  border: 1px solid #dee2e6;
  border-radius: 3px;
  padding: 0.5rem;
  margin: 0.5rem 0 0 0;
  overflow: auto;
}

.head-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
}

@keyframes my-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes my-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.my-fadein {
  animation: my-fadein 150ms linear;
}

.my-fadeout {
  animation: my-fadeout 150ms linear;
}
</style>
