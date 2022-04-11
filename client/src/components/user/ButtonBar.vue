<template>
  <div class="flex">


    <Button class="back-button p-button-lg p-button-rounded " label="Back" icon="pi pi-arrow-circle-left" iconPos="left" v-on:click.prevent="clickedBack" />
    <Button class="home-button p-button-lg p-button-rounded p-button-outlined"  icon="pi pi-home" iconPos="left" label="Home" v-on:click.prevent="$router.push({ name: 'Home' })" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeroIcon from "@/components/general/HeroIcon.vue";

export default defineComponent({
  name: "ButtonBar",
  components: {
    HeroIcon
  },
  methods: {
    clickedBack(): void {
      if (this.$store.state.historyCount === window.history.length) {
        this.$router.push({ name: "Home" });
      } else {
        this.$router.go(-1);
      }
    }
  }
});
</script>

<style scoped>
.back-button {
  /* width: fit-content; */
}

.home-button {
  margin-left: 1em;
  
}

.back-button,
.home-button {
  height: 40px;
  width: auto;
}
</style>
