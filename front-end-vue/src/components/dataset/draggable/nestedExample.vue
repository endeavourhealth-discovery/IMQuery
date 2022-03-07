<template>
  <div class="flex flex-col pl-10 pt-10">
    <div class="mb-20">SMI Population</div>
    <nestedDraggable class="profile mx-5" :children="profile1" />
  </div>
  <div class="flex flex-col pl-10 pt-10">
    <div class="mb-20">Priority1</div>
    <nestedDraggable class="profile mx-5" :children="profile2" />
  </div>
  <div class="flex flex-col pl-10 pt-10">
    <div class="mb-20">Heart rate variability vs blood glucose in diabetics</div>
    <nestedDraggable class="profile mx-5" :children="profile3" />
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
    nestedDraggable
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
              // operator: "and",
              children: []
            },
            {
              type: "operator",
              include: true,
              operator: "and",
              children: [
                {
                  type: "match",
                  name: "Regular Patient",
                  include: true,
                  // operator: "and",
                  children: []
                },
                {
                  type: "match",
                  name: "Age over 18",
                  include: true,
                  // operator: "and",
                  children: []
                }
              ]
            },
            {
              type: "match",
              name: "Unresolved SMI",
              include: true,
              // operator: "and",
              children: []
            }
          ]
        }
      ],
      profile2: [
        {
          type: "operator",
          include: true,
          operator: "and",
          children: [
            {
              type: "match",
              name: "SMI Population",
              include: true,
              // operator: "and",
              children: []
            },
            {
              type: "operator",
              include: true,
              operator: "or",
              children: [
                {
                  type: "operator",
                  include: true,
                  operator: "and",
                  children: [
                    {
                      type: "match",
                      name: "Hypertension (unresolved)",
                      include: true,
                      // operator: "and",
                      children: []
                    },
                    {
                      type: "match",
                      name: "Latest systolic blood pressure in the last 18 months : If Office based and >140",
                      include: true,
                      // operator: "and",
                      children: []
                    }
                  ]
                },
                {
                  type: "operator",
                  include: true,
                  operator: "and",
                  children: [
                    {
                      type: "match",
                      name: "Hypertension (unresolved)",
                      include: true,
                      // operator: "and",
                      children: []
                    },
                    {
                      type: "match",
                      name: "Latest diastolic blood pressure in the last 18 months : if Office based and >90",
                      include: true,
                      // operator: "and",
                      children: []
                    }
                  ]
                },
                {
                  type: "operator",
                  include: true,
                  operator: "and",
                  children: [
                    {
                      type: "match",
                      name: "Hypertension (unresolved)",
                      include: true,
                      // operator: "and",
                      children: []
                    },
                    {
                      type: "match",
                      name: "Latest systolic blood pressure in the last 18 monthsm : if home based >135",
                      include: true,
                      // operator: "and",
                      children: []
                    }
                  ]
                },
                {
                  type: "operator",
                  include: true,
                  operator: "and",
                  children: [
                    {
                      type: "match",
                      name: "Diabetes (not resolved)",
                      include: true,
                      // operator: "and",
                      children: []
                    },
                    {
                      type: "match",
                      name: "Latest diastolic blood pressure in the last 18 months a: if home based and >85",
                      include: true,
                      // operator: "and",
                      children: []
                    }
                  ]
                },
                {
                  type: "operator",
                  include: true,
                  operator: "and",
                  children: [
                    {
                      type: "match",
                      name: "Hypertension (unresolved)",
                      include: true,
                      // operator: "and",
                      children: []
                    },
                    {
                      type: "match",
                      name: "Latest HBA1C in the last 18 months : if >59",
                      include: true,
                      // operator: "and",
                      children: []
                    }
                  ]
                },
                {
                  type: "operator",
                  include: true,
                  operator: "and",
                  children: [
                    {
                      type: "match",
                      name: "Latest QRisk2 or Qrisk 3, : if >10",
                      include: true,
                      // operator: "and",
                      children: []
                    },
                    {
                      type: "match",
                      name: "Not on statins in the last 6 months",
                      include: true,
                      // operator: "and",
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      profile3: [
        {
          type: "operator",
          include: true,
          operator: "and",
          children: [
            {
              type: "operator",
              include: true,
              operator: "or",
              children: [
                {
                  type: "match",
                  name: "Latest HbA1c is 48 mmol/mol or higher",
                  include: true,
                  children: []
                },
                {
                  type: "match",
                  name: "Unresolved Diabetes",
                  include: true,
                  children: []
                }
              ]
            },
            {
              type: "match",
              name: "Blood glucose (capillary or venous)",
              include: true,
              children: []
            },
            {
              type: "match",
              name: "Heart rate measurement recorded within 1 hour of blood glucose measurement",
              include: true,
              children: []
            }
          ]
        }
      ]
    };
  }
});
</script>
<style scoped>
.profile {
  height: 300px;
}
</style>
