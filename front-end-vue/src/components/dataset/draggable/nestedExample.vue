<template>
  <div class="flex flex-col pl-10 pt-10">
    <div class="mb-20">Profile 1</div>
    <nestedDraggable class="profile mx-5" :children="profile1" />
  </div>
  <div class="flex flex-col pl-10 pt-10">
    <div class="mb-20">Profile 2</div>
    <nestedDraggable class="profile mx-5" :children="profile2" />
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
          type: "operator",
          include: true,
          operator: "and",
          children: [
            {
              type: "match",
              name: "GP Register",
              include: true,
              operator: "and",
              children: [],
            },
            {
              type: "operator",
              include: true,
              operator: "and",
              children: [
                {
                  name: "Regular Patient",
                  type: "match",
                  // include: true,
                  // operator: "and",
                  children: [],
                },
                {
                  name: "Age over 18",
                  type: "match",
                  // include: true,
                  // operator: "and",
                  children: [],
                },
              ],
            },
            {
              name: "Unresolved SMI",
              type: "match",
              include: true,
              operator: "and",
              children: [],
            },
          ],
        },
      ],
      profile2: [
        {
          name: "GP Register",
          include: true,
          operator: "or",
          children: [
            {
              name: "Regular Patient",
              include: true,
              operator: "or",
              children: [],
            },
            {
              name: "Age over 18",
              include: true,
              operator: "and",
              children: [],
            },
          ],
        },
        {
          name: "Unresolved SMI",
          include: true,
          operator: "and",
          children: [],
        },
      ],
    };
  },
});
</script>
<style scoped>
.profile {
  height: 300px;
}
</style>
