<template>
  <MainEntity :class="`${theme.}`">



  </MainEntity>
</template>

<script lang="ts">
import { defineComponent } from "vue";


import {themeLight as theme} from '@/models/query/Theme'

export default defineComponent({
  name: "CascadingTemplate",
  props: {
    profileDefinition: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
     
    };
  },
});
</script>

<style>




</style>
