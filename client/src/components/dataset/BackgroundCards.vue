<template>
<div class= "non-selectable absolute background-cards h-full w-full">
      <div
        class="absolute background-card1 transform rotate-2 bg-pink-500 rounded-3xl"
      ></div>
      <div
        class="absolute background-card2 transform -rotate-2 bg-blue-500 rounded-3xl"
      ></div>
    </div>
  
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "BackgroundCards",
  props: ["prop"],
});
</script>

<style scoped>

.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}


.background-cards {
  z-index: -10;
}

.background-card1 {
  z-index: -9;
  top: 3%;
  bottom: 18%;
  left: 2%;
  right: 2%;
  box-shadow: 0px 4px 22px 0px rgba(0, 0, 0, 0.42);
}

.background-card2 {
  background: #38bdf8;
  z-index: -8;
  top: 3%;
  bottom: 18%;
  left: 2%;
  right: 2%;
  box-shadow: 0px 4px 22px 0px rgba(0, 0, 0, 0.42);
}

</style>
