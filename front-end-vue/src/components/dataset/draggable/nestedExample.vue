<template>
  <div class="flex pl-10 pt-10">
    <nestedDraggable class="mx-5" :children="profile1" />
    <nestedDraggable class="mx-5" :children="profile2" />
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
      profile1: [
        {
          name: "Clause 1",
          include: true,
          operator: "any",
          children: [
            {
              name: "Clause 2",
              include: true,
              operator: "any",
              children: [],
            },
          ],
        },
        {
          name: "Clause 3",
          include: true,
          operator: "all",
          children: [
            {
              name: "Clause 4",
              include: true,
              operator: "all",
              children: [],
            },
          ],
        },
        {
          name: "Clause 5",
          include: false,
          operator: "all",
          children: [],
        },
      ],
      profile2: [
        {
          name: "Clause 6",
          include: true,
          operator: "all",
          children: [
            {
              name: "Clause 7",
              include: true,
              operator: "all",
              children: [],
            },
          ],
        },
        {
          name: "Clause 8",
          include: false,
          operator: "any",
          children: [
            {
              name: "Clause 9",
              include: true,
              operator: "any",
              children: [],
            },
          ],
        },
        {
          name: "Clause 10",
          include: true,
          operator: "all",
          children: [],
        },
      ],
    };
  },
});
</script>
<style scoped></style>
