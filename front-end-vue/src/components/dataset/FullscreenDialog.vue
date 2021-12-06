<template>
  <div class="dialog-background non-selectable"></div>
  <div class="dialog-content non-selectable">
    <div class="content-header p-d-flex p-jc-between p-ai-center">
      <div></div>
      <div>
        {{ title }}
      </div>
      <div @click="$emit('close')"  class="button-close">&times;</div>
    </div>
    <div class="content-body">
      <slot> </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "FullscreenDialog",
  props: ["title"],
  emits: ["close"],
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.w-100 {
  width: 100%;
}

.dialog-background {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.dialog-content {
  border-radius: 10px;
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 2; /* Sit on top */
  background-color: #fefefe;
  top: 50px;
  bottom: 50px;
  right: 50px;
  left: 50px;
   width: calc(100% - 100px);
  height: calc(100% - 100px);
  padding: 20px;
  border: 1px solid #888;
}

.content-header {
  font-size: 20px !important;
  font-weight: bold;
}

.button-close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.button-close:hover,
.button-close:focus {
  color: #d32f2f;
  text-decoration: none;
  cursor: pointer;
}

.content-body {
}
</style>
