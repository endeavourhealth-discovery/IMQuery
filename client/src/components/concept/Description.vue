<template>
  <ScrollPanel style="height: 100px" class="custom">
    <!-- div content injected by javascript -->
    <div id="description"></div>
  </ScrollPanel>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Description",
  components: {},
  props: ["description"],
  watch: {
    description() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const descContainer = document.getElementById("description");
      if (descContainer) {
        descContainer.innerHTML = this.description;
      }
    }
  }
});
</script>

<style scoped></style>
