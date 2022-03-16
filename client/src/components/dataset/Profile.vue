<template>
  <div class="card-profile px-6 py-6 flex flex-col  mb-12 rounded-xl overflow-hidden bg-gradient-to-r ">
    <div class="flex items-center mb-5">
      <!-- Left  -->

      <!-- Icon -->
      <div class=" bg-black flex justify-center items-center rounded-full bg-opacity-40 w-12 h-12 ml-1">
        <UserIcon class="h-7 w-7 text-white" aria-hidden="true" />
      </div>
      <!-- Icon -->

      <!-- Main Entity  -->
      <div class="select-none text-white font-semibold text-3xl ml-4">
        Person
      </div>
      <!-- Main Entity  -->
      <!-- Left  -->

      <div class="flex-grow"></div>

      <!-- Right  -->
      <!-- <div class="">
        Definition
      </div> -->
      <!-- Right  -->
    </div>
    <!-- Definition  -->

    <button type="button" class="profile py-2 text-sm font-medium text-white bg-black rounded-lg bg-opacity-20 hover:bg-opacity-30 outline-none">
      <DraggableClause class="profile-content mx-5" :data="definition" :children="definition" />
    </button>

    <!-- Definition  -->
  </div>
</template>

<script lang="ts">
import nestedDraggable from "@/components/dataset/draggable/nested.vue";
// import rawDisplayer from "@/components/dataset/draggable/rawDisplayer.vue";
import { ref, onMounted, defineComponent } from "vue";
import DraggableClause from "./DraggableClause.vue";
// import HeroIcon from "@/components/search/HeroIcon.vue";
import { UserIcon } from "@heroicons/vue/solid";

export default defineComponent({
  name: "Profile",
  props: ["definition"],
  components: {
    // nestedDraggable,
    DraggableClause,
    UserIcon,
    
    // HeroIcon
  },
  data() {
    return {
      isShowing: true,
      profile1: [
        {
          uuid: "d55338e0-16c2-4f83-ad17-d4db64197b86",
          type: "operator",
          include: true,
          operator: "and",
          children: [
            {
              uuid: "fe7f7980-e6ba-4560-bd80-02f8be9a0f69",
              type: "match",
              name: "GP Register",
              include: true,
              children: []
            },
            {
              uuid: "d0d3dcc1-9157-4557-a593-bf3eb8fbf936",
              type: "operator",
              include: true,
              operator: "and",
              children: [
                {
                  uuid: "b198eef5-3037-4460-b86e-20c2b0e8881e",
                  type: "match",
                  name: "Regular Patient",
                  include: true,
                  children: []
                },
                {
                  uuid: "156f87f3-a7c2-4d03-9b8a-6d2d2ff7521e",
                  type: "match",
                  name: "Age over 18",
                  include: true,
                  children: []
                }
              ]
            },
            {
              uuid: "daffba38-05dd-4f77-b7bd-e55119c64968",
              type: "match",
              name: "Unresolved SMI",
              include: true,
              children: []
            }
          ]
        }
      ],
      profile12: [
        {
          uuid: "d55338e0-16c2-4f83-ad17-d4db64197b86",
          type: "operator",
          include: true,
          operator: "and",
          children: [
            {
              uuid: "fe7f7980-e6ba-4560-bd80-02f8be9a0f69",
              type: "match",
              name: "Person",
              include: true,
              children: []
            },
            {
              uuid: "d55338e0-16c2-4f83-ad17-d4db64197b86",
              type: "operator",
              include: true,
              operator: "and",
              children: [
                {
                  uuid: "fe7f7980-e6ba-4560-bd80-02f8be9a0f69",
                  type: "match",
                  name: "GP Register",
                  include: true,
                  children: []
                },
                {
                  uuid: "d0d3dcc1-9157-4557-a593-bf3eb8fbf936",
                  type: "operator",
                  include: true,
                  operator: "and",
                  children: [
                    {
                      uuid: "b198eef5-3037-4460-b86e-20c2b0e8881e",
                      type: "match",
                      name: "Regular Patient",
                      include: true,
                      children: []
                    },
                    {
                      uuid: "156f87f3-a7c2-4d03-9b8a-6d2d2ff7521e",
                      type: "match",
                      name: "Age over 18",
                      include: true,
                      children: []
                    }
                  ]
                },
                {
                  uuid: "daffba38-05dd-4f77-b7bd-e55119c64968",
                  type: "match",
                  name: "Unresolved SMI",
                  include: true,
                  children: []
                }
              ]
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
                      name: "Diabetes (unresolved)",
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
.card-profile {
  width: 100%;
  max-width: 400px;
}

.profile {
  /* height: 300px; */
  width: 100%;
  /* max-width: 350px; */
}
</style>
