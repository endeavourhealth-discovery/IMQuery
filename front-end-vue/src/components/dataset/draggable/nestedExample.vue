<template>
  <div class="row">
    <div class="col-8">
      <h3>Nested draggable</h3>
      <nestedDraggable :tasks="list" />
    </div>

    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>


<script lang="ts">
import nestedDraggable from "@/components/dataset/draggable/nested.vue";
import rawDisplayer from "@/components/dataset/draggable/rawDisplayer.vue";
import { ref, onMounted, defineComponent } from "vue";



export default defineComponent({
  name: "nestedExample",
  display: "Nested",
  order: 15,
  components: {
    nestedDraggable
  },
  data() {
    return {
      list: [
        {
          name: "task 1",
          tasks: [
            {
              name: "task 2",
              tasks: []
            }
          ]
        },
        {
          name: "task 3",
          tasks: [
            {
              name: "task 4",
              tasks: []
            }
          ]
        },
        {
          name: "task 5",
          tasks: []
        }
      ]
    };
  }
});
</script>
<style scoped></style>