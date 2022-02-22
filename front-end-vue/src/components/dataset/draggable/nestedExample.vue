<template>
  <div class="">
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
          name: "Profile 1",
          tasks: [
            {
              name: "Profile 2",
              tasks: [],
            },
          ],
        },
        {
          name: "Profile 3",
          tasks: [
            {
              name: "Profile 4",
              tasks: [],
            },
          ],
        },
        {
          name: "Profile 5",
          tasks: [],
        },
      ],
      list2: [
        {
          name: "Profile 6",
          tasks: [
            {
              name: "Profile 7",
              tasks: [],
            },
          ],
        },
        {
          name: "Profile 8",
          tasks: [
            {
              name: "Profile 9",
              tasks: [],
            },
          ],
        },
        {
          name: "Profile 10",
          tasks: [],
        },
      ],
    };
  },
});
</script>
<style scoped></style>
