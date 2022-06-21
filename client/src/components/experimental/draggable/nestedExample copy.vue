<template>
  <div class="flex">
    <nestedDraggable class="w" :tasks="list1" />
    <nestedDraggable class="w" :tasks="list2" />
    <!-- <rawDisplayer :value="list" title="List" /> -->
  </div>
</template>

<script lang="ts">
import nestedDraggable from "@/components/dataset/draggable/nested.vue";
// import rawDisplayer from "@/components/dataset/draggable/rawDisplayer.vue";
import { ref, onMounted, defineComponent } from "vue";

export default defineComponent({
  name: "nestedExample",
  display: "Nested",
  order: 15,
  components: {
    nestedDraggable,
  },
  data() {
    return {
      list1: [
        {
          name: "Feature 1",
          tasks: [
            {
              name: "Feature 2",
              tasks: [],
            },
          ],
        },
        {
          name: "Feature 3",
          tasks: [
            {
              name: "Feature 4",
              tasks: [],
            },
          ],
        },
        {
          name: "Feature 5",
          tasks: [],
        },
      ],
      list2: [
        {
          name: "Feature 6",
          tasks: [
            {
              name: "Feature 7",
              tasks: [],
            },
          ],
        },
        {
          name: "Feature 8",
          tasks: [
            {
              name: "Feature 9",
              tasks: [],
            },
          ],
        },
        {
          name: "Feature 10",
          tasks: [],
        },
      ],
    };
  },
});
</script>
<style scoped></style>
