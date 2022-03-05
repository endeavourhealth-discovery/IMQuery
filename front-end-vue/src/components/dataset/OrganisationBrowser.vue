<template>
  <div class="relative">
    <div class="gmap relative">
      Clustered Google Map Here
    </div>

    <!-- Sidenav  -->
    <div class="wrapper-sidenav relative flex flex-col align-center px-5 ">
      <div class="editor-nav rounded-xl bg-white w-16 drop-shadow">
        <div class="flex justify-center align-center">
          <RoundButton
            class="w-10 h-10 my-5"
            :rounded="true"
            :showRing="true"
            backgroundColor="blue-500"
            hoverBackgroundColor="blue-600"
            textColor="white"
            ringColor="blue-600"
            v-tooltip.right="'<b>Create New List</b>'"
            @click="addNewListItem()"
          >
            <HeroIcon
              strokewidth="2"
              width="20"
              height="20"
              icon="document_add"
            />
          </RoundButton>
        </div>

        <VerticalButtonGroup :items="sideNavItems" v-model="activeView" />
      </div>
    </div>

    <!-- Sidenav  -->

    <!-- Lists  -->
    <div
      v-if="activeView == 'Search' || activeView == 'Lists'"
      class="wrapper-right absolute"
    >
      <div
        class="rounded-xl bg-white drop-shadow flex flex-col items-center p-4"
      >
        <!-- Lists  -->

        <!-- Header  -->
        <div class="flex justify-center text-gray-500">
          <div class="inline-flex flex-col justify-center items-center">
            <HeroIcon
              strokewidth="2"
              width="20"
              height="20"
              :icon="sideNavItems.filter((item: any) => item.name == activeView)[0].icon      
                "
            />
          </div>
          <div class="ml-2 font-medium text-xl inline-flex">
            {{ activeView }}
          </div>
        </div>
        <!-- /Header  -->

        <!-- Lists Content  -->
        <div v-if="activeView == 'Lists'" class="content mt-4">
          <template v-for="item in listItems" :key="item.id">
            <div class="divider"></div>
            <div class="flex">
              <ListItem
                class="inline-flex"
                v-model="item.title"
                v-model:count="item.count"
              />
            </div>
          </template>
        </div>
        <!-- /Lists Content  -->

        <!-- Search  -->
        <div v-if="activeView == 'Search'" class="content mt-4">
          Search
        </div>
        <!-- /Search  -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "vue";

import VerticalButtonGroup from "@/components/dataset/VerticalButtonGroup.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import HeroIcon from "@/components/search/HeroIcon.vue";
import ListItem from "@/components/dataset/ListItem.vue";
import{ v4 } from "uuid";
// import OrganisationMap from "@/components/dataset/OrganisationMap.vue";

export default defineComponent({
  name: "OrganisationBrowser",
  props: ["prop"],
  components: {
    VerticalButtonGroup,
    RoundButton,
    HeroIcon,
    ListItem,
    // OrganisationMap,
  },
  data() {
    return {
      activeView: "Lists",
      sideNavItems: [
        {
          id: "89919f9a-449c-4c31-a03e-27b804599f87",
          name: "Search",
          title: "Search for Organisations",
          icon: "search",
          visible: true,
        },
        {
          id: "c04ad7ab-b777-4eb5-a1b2-b92da0246dc3",
          name: "Map",
          title: "Browse Organisations",
          icon: "map",
          visible: true,
        },
        {
          id: "89919f9a-449c-4c31-a03e-27b804599f87",
          name: "Lists",
          title: "Lists of Organisations",
          icon: "clipboard_list",
          visible: true,
        },
      ],
      listItems: [
        {
          id: "ff84a704-57f3-4d51-8c9d-f4c724472e44",
          title: "All My Organisations",
          count: 30,
        },
        {
          id: "378bdbf2-46bd-4656-974c-137afc52e499",
          title: "All GP Practices",
          count: 20,
        },
        {
          id: "0136ab25-9457-4103-b9e4-0626fa8734c9",
          title: "All Hospitals",
          count: 3,
        },
      ],
    };
  },
  methods: {
    addNewListItem(): void {
      let result = window.prompt(
        "To save your list of organisations, enter a name to describe it:",
        ""
      ) as string;

      if (result.trim() != "") {
        let newItem = {
          id: v4(),
          title: result,
          count: Math.floor(Math.random() * 100),
        };
        this.listItems.splice(0, 0, newItem);
        this.activeView = "Lists";
      }
      else
      {
        alert("Error, please enter a valid name.");
      }
    },
  },
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.drop-shadow {
  border: 1px solid #d0d7de;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
}

.wrapper-sidenav {
  margin-top: 20vh;
  z-index: 99;
}

.wrapper-right {
  top: 20vh;
  right: 10px;
}
</style>
