<template>
  <div
    v-if="modelValue && isLoggedIn"
    class="userwidget relative inline-block text-left"
    @click="expanded = !expanded"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div class="select-none text-blue-700 font-bold dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 text-3xl border border-2 border-blue-600 dark:border-white rounded-full p-3"    v-wave="{
          color: 'currentColor',
          easing: 'ease-out',
          duration: 0.7,
          initialOpacity: 0.6,
          finalOpacity: 0.1,
          cancellationPeriod: 75
        }">
      {{ modelValue.firstName.substring(0, 1) + modelValue.lastName.substring(0, 1) }}
    </div>


    <div v-if="modelValue && expanded" class="options origin-top-right absolute mt-1 rounded-md shadow-lg bg-white  ring-1 focus:outline-none" role="menu">
      <div class="non-selectable block px-4 py-2 text-2xl border-b">
        <div class="text-black font-bold">{{ modelValue.firstName + " " + modelValue.lastName }}</div>
        <div class="text-gray-700 font-regular">
          {{ modelValue.email }}
        </div>
      </div>

      <div
        v-if="isLoggedIn"
        class="non-selectable text-gray-700 block px-4 py-2 text-2xl hover:bg-gray-100"
        role="menuitem"
        @click="$router.push({ name: 'UserEdit' })"
      >
        View Account
      </div>
      <div v-if="isLoggedIn" class="non-selectable text-red-600 block px-4 py-2 text-2xl hover:bg-gray-100" role="menuitem" @click="onLogOut()">
        Log Out
      </div>
    </div>
  </div>
  <div v-else class="non-selectable relative mt-3 flex text-3xl font-semibold">
    <div class="hover:underline text-blue-600 dark:text-yellow-400  " @click="$router.push({ name: 'Register' })">
      Sign Up
    </div>
    <div class="hover:underline text-purple-600 dark:text-blue-400 ml-7" @click="$router.push({ name: 'Login' })">
      Log In
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { mapState } from "vuex";
// import HeroIcon from "@/components/search/HeroIcon.vue";
import RoundButton from "@/components/dataset/RoundButton.vue";
import Swal from "sweetalert2";
import { CustomAlert } from "@/models/user/CustomAlert";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "UserWidget",
  props: ["modelValue"],
  components: {
    // HeroIcon,
    // RoundButton
  },
  data() {
    return {
      expanded: false
    };
  },
  computed: mapState(["currentUser", "isLoggedIn"]),
  methods: {
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

.userwidget .options {
  top: 50px;
  right: -20px;
  font-size: 16px;
  font-weight: 500;
  z-index: 5;
  border-color: rgb(207, 210, 218);
  box-shadow: rgb(207, 210, 218) 0px 2px 6px;
}
</style>
