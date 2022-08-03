<template>
  <!--  (logged in ) -->

  <div
    v-if="modelValue && isLoggedIn"
    class="userwidget relative inline-block text-left"
    @click="expanded = !expanded"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <!-- Circle  -->
    <button
      @click="handleToggle"
      class="select-none text-blue-700 font-bold dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 text-3xl border border-2 border-blue-600 dark:border-white rounded-full p-3"
      v-wave="{
        color: 'currentColor',
        easing: 'ease-out',
        duration: 0.7,
        initialOpacity: 0.6,
        finalOpacity: 0.1,
        cancellationPeriod: 75
      }"
    >
      {{ modelValue.firstName.substring(0, 1) + modelValue.lastName.substring(0, 1) }}
    </button>
    <!-- /Circle  -->

    <!-- Popover  -->
    <OverlayPanel ref="overlay-userwidget" class="overlay-userwidget">
      <div class="options">
        <!-- Personal Details  -->
        <div class="non-selectable block px-4 py-2 text-2xl border-b dark:border-0">
          <div class="text-black dark:text-white font-bold">{{ modelValue.firstName + " " + modelValue.lastName }}</div>
          <div class="text-gray-700 dark:text-gray-400 font-semibold">
            {{ modelValue.email }}
          </div>
        </div>
        <!-- Personal Details  -->

        <!-- Actions  -->
        <div
          class="non-selectable flex  justify-between rounded-md text-gray-500 dark:text-white  mt-2 px-4 py-2 text-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
          role="menuitem"
          @click="toggleTheme()"
        >
          Theme

          <div class="text-Black-700">{{ Theme }}</div>
          <div class="flex">
            <button class="theme-toggler  pt-1 mx-5 text-gray-700 dark:text-white text-xl transition duration-500 ease-in-out">
              <div class=" dark:text-white  inline dark:hidden ">
                <NodeIcon class="w-7 h-7" icon="sun" strokewidth="1" width="16" height="16"></NodeIcon>
              </div>
              <div class=" dark:text-white hidden dark:inline text-blue-800">
                <NodeIcon class="w-7 h-7" icon="moon" strokewidth="1" width="16" height="16"></NodeIcon>
              </div>

              <!-- <i class="fa-solid fa-sun h-9 w-auto dark:text-white  inline dark:hidden"></i>
                <i class="fa-solid fa-moon h-9 w-auto dark:text-white hidden dark:inline text-gray-800"></i> -->
            </button>
            <div class="text-black dark:text-white">{{ currentTheme }}</div>
          </div>
        </div>
        <div
          v-if="isLoggedIn && false"
          class="non-selectable rounded-md text-gray-800 dark:text-white block mt-2 px-4 py-2 text-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
          role="menuitem"
          @click="$router.push({ name: 'UserEdit' })"
        >
          View Account
        </div>
        <div
          v-if="isLoggedIn"
          class="non-selectable rounded-md text-red-600 block px-4 py-2 text-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
          role="menuitem"
          @click="onLogOut()"
        >
          Log Out
        </div>
      </div>
      <!-- Actions  -->
    </OverlayPanel>
    <!-- /Popover  -->
  </div>
  <!--  (logged in ) -->

  <!--  (logged out ) -->
  <div v-else class="non-selectable mt-2 flex text-3xl font-semibold">
    <div class="hover:underline  text-blue-600 dark:text-yellow-400  " @click="$router.push({ name: 'Register' })">
      Sign Up
    </div>
    <div class="hover:underline  text-purple-600 dark:text-blue-400 ml-7" @click="$router.push({ name: 'Login' })">
      Log In
    </div>
  </div>
  <!--  (logged out ) -->
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { mapState } from "vuex";
import NodeIcon from "@/components/query/NodeIcon.vue";

// import HeroIcon from "@/components/general/HeroIcon.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import Swal from "sweetalert2";
import { CustomAlert } from "@/models/user/CustomAlert";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "UserWidget",
  props: ["modelValue"],
  components: {
    NodeIcon
    // HeroIcon,
    // RoundButton
  },
  data() {
    return {
      expanded: false
    };
  },
  computed: {
    ...mapState(["currentUser", "isLoggedIn"]),
    currentTheme: {
      get(): string {
        return this.$store.state.theme;
      },
      set(value: any): void {
        this.$store.commit("updateTheme", value);
      }
    }
  },
  methods: {
    toggleTheme(): void {
      if (this.currentTheme == "dark") {
        this.currentTheme = "light";
      } else {
        this.currentTheme = "dark";
      }
    },
    handleToggle(event: any): void {
      (this.$refs["overlay-userwidget"] as any).toggle(event);
    },
    onLogOut(): void {
      this.$store.dispatch("logoutCurrentUser");
      this.$toast.add(LoggerService.success("Logged Out Successfully."));

      // Swal.fire({
      //   icon: "warning",
      //   title: "Are you sure?",
      //   text: "Confirm logout request",
      //   showCancelButton: true,
      //   confirmButtonText: "Logout",
      //   reverseButtons: true
      // }).then(result => {
      //   if (result.isConfirmed) {
      //     this.$store.dispatch("logoutCurrentUser").then((res: CustomAlert) => {
      //       if (res.status === 200) {
      //         Swal.fire({
      //           icon: "success",
      //           title: "Success",
      //           text: res.message
      //         }).then(() => {
      //           this.$router.push({ name: "Home" });
      //         });
      //       } else {
      //         Swal.fire({
      //           icon: "error",
      //           title: "Error",
      //           text: res.message
      //         });
      //       }
      //     });
      //   }
      // });
    }
  }
});
</script>

<style scoped>
.non-selectable {
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.userwidget:hover {
  /* background-color: #eeeeee;*/ /* light beige */
  /* border: 1px solid #ced4da; */
}

.userwidget .title {
  height: 40px;
  width: 40px;
  font-weight: 500;
  font-size: 20px;
}
</style>

<style></style>
