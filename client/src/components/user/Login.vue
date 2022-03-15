<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
    <div class="max-w-md w-full space-y-24">
      <div class="mb-10">
          <img class="app-logo h-10 w-10 mx-auto h-12 w-auto" src="app-icon.png" alt="" />

        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          <div @click="$router.push({ name: 'Register' })" class="select-none text-xl font-medium text-blue-600 dark:text-white hover:underline"> I don't have an account yet</div>
        </p>
      </div>
      <div class="mt-10 space-y-20">
        <!-- <input type="hidden" name="remember" value="true" /> -->
        <div class="rounded-md shadow-sm -space-y-px ">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <!-- <InputText id="fieldUsername" type="text" v-model="username" :placeholder="username" /> -->
            <input
              id="fieldUsername"
              v-model="username"
              name="username"
              type="text"
              autocomplete="username"
              required="true"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-3xl"
              placeholder="Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <!-- <InputText id="fieldPassword" type="password" v-model="password" @keyup="checkKey" /> -->
            <input
              id="fieldPassword"
              v-model="password"
              @keyup="checkKey"
              name="password"
              type="password"
              autocomplete="current-password"
              required="true"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-3xl"
              placeholder="Password"
            />
          </div>
        </div>


    <Button type="submit" class=" group relative transition easy-in-out duration-500 w-full flex justify-center py-2 px-4 border border-transparent text-2xl font-medium rounded-md back-button p-button-lg p-button-rounded " label="      Sign In" icon="pi pi-unlock" iconPos="left"      v-on:click.prevent="handleSubmit" 
 />




      </div>


      
        <div class="flex items-center justify-between">
          <div class="flex items-center">
                       <div @click="$router.push({ name: 'ConfirmCode' })" class="text-lg hover:underline select-none font-medium text-blue-600 dark:text-white ">Enter Password Reset Code </div>

          </div>

          <div class="text-sm">
            <div @click="$router.push({ name: 'ForgotPassword' })"  class="text-lg font-medium text-blue-600 dark:text-white hover:underline select-none ">Forgot your password? </div>
          </div>
        </div>

     
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import { avatars } from "@/models/user/Avatars";
import LoggerService from "@/services/LoggerService";

export default defineComponent({
  name: "Login",
  computed: mapState(["registeredUsername"]),
  data() {
    return {
      username: "",
      password: ""
    };
  },
  mounted() {
    if (this.registeredUsername && this.registeredUsername !== "") {
      this.username = this.registeredUsername;
    }
  },
  methods: {
    handleSubmit(): void {
      AuthService.signIn(this.username, this.password)
        .then(res => {
          if (res.status === 200 && res.user) {
            const loggedInUser = res.user;
            // check if avatar exists and replace lagacy images with default avatar on signin
            const result = avatars.find(avatar => avatar.value === loggedInUser.avatar.value);
            if (!result) {
              loggedInUser.avatar = avatars[0];
            }
            this.$store.commit("updateCurrentUser", loggedInUser);
            this.$store.commit("updateRegisteredUsername", null);
            this.$store.commit("updateIsLoggedIn", true);
            this.$router.push({ name: "Home" });
            // Swal.fire({
            //   icon: "success",
            //   title: "Success",
            //   text: "Login successful"
            // }).then(() => {
            //   this.$router.push({ name: "Home" });
            // });
          } else if (res.status === 401) {
            this.$toast.add(LoggerService.error("Incorrect username or password. Try again or reset your password."));

            // Swal.fire({
            //   icon: "warning",
            //   title: "User Unconfirmed",
            //   text: "Account has not been confirmed. Please confirm account to continue.",
            //   showCloseButton: true,
            //   showCancelButton: true,
            //   confirmButtonText: "Confirm Account"
            // }).then(result => {
            //   if (result.isConfirmed) {
            //     this.$store.commit("updateRegisteredUsername", this.username);
            //     this.$router.push({ name: "ConfirmCode" });
            //   }
            // });
          } else {
            this.$toast.add(LoggerService.error("Incorrect username or password. Try again or reset your password."));

            // this.$toast.add(LoggerService.error("An error has occurred, please try again later."));
            // Swal.fire({
            //   icon: "error",
            //   title: "Error",
            //   text: res.message,
            //   confirmButtonText: "Close"
            // });
          }
        })
        .catch(err => {
          this.$toast.add(LoggerService.error("Incorrect username or password. Try again or reset your password."));

          // this.$toast.add(LoggerService.error("An error has occurred, please try again later."));
          // console.error(err);
          // Swal.fire({
          //   icon: "error",
          //   title: "Error",
          //   text: "Authentication error",
          //   confirmButtonText: "Close"
          // });
        });
    },

    checkKey(event: any): void {
      if (event.keyCode === 13) {
        this.handleSubmit();
      }
    }
  }
});
</script>

<style scoped>
.login-card {
  padding: 0 2em;
}

.user-submit {
  width: fit-content !important;
}

.login-form {
  max-width: 25em;
}

.footer-link:hover {
  cursor: pointer;
}

.icon-header {
  font-size: 5rem;
  margin-top: 1em;
}
</style>
