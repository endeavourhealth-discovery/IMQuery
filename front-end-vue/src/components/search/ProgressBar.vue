<template>
  <div
    class="non-selectable parent-container"
    :class="{ 'flex-row-reverse': !isDirectionLTR }"
  >
    <div
<<<<<<< HEAD
      class="progress-container bg-blue-600 dark:bg-white"
=======
      class="progress-container bg-blue-500"
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
      :style="{ width: widthPercentage + '%' }"
    ></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "ProgressBar",
  props: ["loading"],
  data() {
    return {
      isLoading: this.loading,
      widthPercentage: 20,
      interval: 0,
      isDirectionLTR: true, //left to right or right to left movement
      isIncreasing: true,
    };
  },
  mounted() {
    this.interval = window.setInterval(() => {
      if (
        this.isDirectionLTR &&
        this.isIncreasing &&
        this.widthPercentage < 100 && this.widthPercentage > 0
      ) {
        this.widthPercentage = this.widthPercentage + 1;
      } else if (
        this.isDirectionLTR &&
        this.isIncreasing &&
        this.widthPercentage == 100
      ) {
        this.isDirectionLTR = false;
        this.isIncreasing = false;
        this.widthPercentage = 99;
      } else if (
        !this.isDirectionLTR &&
        !this.isIncreasing &&
        this.widthPercentage < 100 && this.widthPercentage > 0
      ) {
        this.widthPercentage = this.widthPercentage - 1;
      } else if (
        !this.isDirectionLTR &&
        !this.isIncreasing &&
        this.widthPercentage == 0
      ) {
        this.isIncreasing = true;
        this.widthPercentage = 1;
      } else if (
        !this.isDirectionLTR &&
        this.isIncreasing &&
        this.widthPercentage > 0 && this.widthPercentage < 100
      ) {
        this.widthPercentage = this.widthPercentage + 1;
      } else if (
        !this.isDirectionLTR &&
        this.isIncreasing &&
        this.widthPercentage == 100
      ) {
        this.isDirectionLTR = true;
        this.isIncreasing = false;
        this.widthPercentage = 99;
      } else if (
        this.isDirectionLTR &&
        !this.isIncreasing &&
        this.widthPercentage < 100 && this.widthPercentage > 0
      ) {
        this.widthPercentage = this.widthPercentage - 1;
      } else if (
        this.isDirectionLTR &&
        !this.isIncreasing &&
        this.widthPercentage == 0
      ) {
        this.widthPercentage = 1;
        this.isIncreasing = true;
      }
    }, 10);
  },
  unmounted() {

    window.clearInterval(this.interval);
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

.parent-container {
  position: fixed;
  display: flex;
<<<<<<< HEAD
  left: 0;
  top: 60px;
=======
  top: 0;
>>>>>>> parent of 4247fee (1. added search functionality for profiles (and content definition), 2. restructured project and removed all unnecessary components, state, etc.)
  width: 100%;
  height: 2px;
}

.progress-container {
  height: 100%;
}
</style>
