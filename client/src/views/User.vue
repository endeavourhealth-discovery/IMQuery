<template>
  <div class="flex flex-col justify-center user-container">
  
      <button-bar class="absolute top-10 left-2/4 -translate-x-2/4 " />

    <div class="flex w-full justify-start card-button-container">
      <div class="h-full w-full overflow-y-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ButtonBar from "@/components/user/ButtonBar.vue";

export default defineComponent({
  name: "User",
  components: {
    ButtonBar: ButtonBar
  }
});
</script>

<style scoped>
.user-container {
  width: 100%;
  /* overflow-y: auto; */
}

.card-button-container {
  height: 100%;
  /* margin-top: 5vh; */
  height: 100%;
}

#user-card-container {
  height: 100%;
  overflow-y: auto;
}
</style>
