<template>
  <div class="card-profile px-6 py-6 flex flex-col  mb-12 rounded-xl overflow-hidden bg-gradient-to-r ">
    <div class="flex items-center mb-5">
      <!-- Left  -->

      <!-- Icon -->
      <div class=" bg-black flex justify-center items-center rounded-full bg-opacity-40 w-12 h-12 ml-5">
        <UserIcon class="h-7 w-7 text-white" aria-hidden="true" />
      </div>
      <!-- Icon -->

      <!-- Main Entity  -->
      <div class="select-none text-white font-semibold text-3xl ml-4">
        {{ profile.mainEntity.name }}
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

    <button
      type="button"
      class="profile transition duration-500 ease-in-out py-2 px-3 text-sm font-medium text-white bg-black rounded-lg bg-opacity-20 hover:bg-opacity-40 outline-none"
    >
      <DraggableClause
        class="profile-content mx-5"
        @siblingCount="profile.definitionTree.length"
        :data="profile.definitionTree"
        :children="profile.definitionTree"
      />
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
  props: ["iri", "profile", "definition"],
  components: {
    // nestedDraggable,
    DraggableClause,
    UserIcon

    // HeroIcon
  },
  computed: {
    queryBuilder: {
      get(): any {
        return this.$store.state.queryBuilder;
      },
      set({ action, payload }: any): void {
        this.$store.commit("queryBuilder", {
          action: action,
          payload: payload
        });
      }
    }
  },
  data() {
    return {
      isShowing: true
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
