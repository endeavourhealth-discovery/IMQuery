<template>
  <div class="p-grid">
    <div class="column p-col-12 p-md-6">
      <slot name="left">
      
      </slot>
    </div>

    <div class="column p-col-12 p-md-6">
      <slot name="right">
       
      </slot>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InputSection",
});
</script>

<style scoped>

div.p-grid {
  margin: 20px 0 15px !important;
}

div.column {
  padding: 0 !important;
}

</style>
