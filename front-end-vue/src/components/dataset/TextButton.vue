<template>
  <div :class="['text-button', 'non-selectable', 'p-d-flex', 'p-jc-center', 'p-ai-center', (color == 'primary' ? 'color-primary': (color == 'warning' ? 'color-warning': (color == 'danger' ? 'color-danger' : '')))]">
    <div>
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

export default defineComponent({
  name: "TextButton",
  props: ["title", "color"],
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

div.text-button {
  padding-left: 10px;
  padding-right: 10px;
   border: 1px solid transparent;
   border-radius: 3px;
  /* background-color: #edf7ff; */
}

div.color-primary:hover {
  border: 1px solid #0d89ec;
  background-color: #edf7ff;
}


.color-primary {
  color: #0d89ec;
}

.color-warning {
  color: #FBC02D;
}

div.color-warning:hover {
  border: 1px solid #FBC02D;
  background-color: #FFFDF8;
}


.color-danger {
  color: #D32F2F;
}

div.color-danger:hover {
  border: 1px solid #D32F2F;
  background-color: #FDF7F7;
}

</style>
