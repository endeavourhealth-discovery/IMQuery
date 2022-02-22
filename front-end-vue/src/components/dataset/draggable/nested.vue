<template>
  <draggable class="dragArea" tag="ul" :list="tasks" :group="{ name: 'g1' }">
    <li v-for="el in tasks" :key="el.name">
      <p>{{ el.name }}</p>
      <nested-draggable :tasks="el.tasks" />
    </li>
  </draggable>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { ref, onMounted, defineComponent } from "vue";



export default defineComponent({
  props: {
    tasks: [] as any,
  },
  components: {
    draggable
  },
  name: "nested-draggable"
});

</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
};

</style>