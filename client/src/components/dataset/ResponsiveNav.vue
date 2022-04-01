<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="min-h-full bg-gradient-to-r from-sky-400 to-indigo-500 ">
    <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center grow ">
            <div class="flex-shrink-0">
              <!-- <img class="h-8 w-8" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" /> -->
              <img class="app-logo" src="app-icon.png" alt="" />
            </div>

            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <a
                  v-wave="{
                    color: 'currentColor',
                    easing: 'ease-out',
                    duration: 0.3,
                    initialOpacity: 0.2,
                    finalOpacity: 0.1,
                    cancellationPeriod: 75
                  }"
                  v-for="item in navigation"
                  :key="item.name"
                  :href="item.href"
                  :class="[
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'px-3 py-2 rounded-md text-sm font-medium'
                  ]"
                  :aria-current="item.current ? 'page' : undefined"
                  >{{ item.name }}</a
                >
              </div>
            </div>
            <div class="absolute left-2/4  -translate-x-2/4 items-center  text-white">
              <div class="">
                Searchbox
              </div>
            </div>
          </div>

          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <Popover />

              <button
                type="button"
                class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span class="sr-only">View notifications</span>
                <SearchIcon class="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span class="sr-only">View notifications</span>
                <BellIcon class="h-6 w-6" aria-hidden="true" />
              </button>

              <!-- Profile dropdown -->
              <Menu as="div" class="ml-3 relative">
                <div>
                  <MenuButton
                    class="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span class="sr-only">Open user menu</span>
                    <img class="h-8 w-8  rounded-full" :src="user.imageUrl" alt="" />
                  </MenuButton>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                      <a
                        v-wave="{
                          color: 'currentColor',
                          easing: 'ease-out',
                          duration: 0.3,
                          initialOpacity: 0.2,
                          finalOpacity: 0.1,
                          cancellationPeriod: 75
                        }"
                        :href="item.href"
                        :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                        >{{ item.name }}</a
                      >
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span class="sr-only">Open main menu</span>
              <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <DisclosureButton
            v-wave="{
              color: 'currentColor',
              easing: 'ease-out',
              duration: 0.3,
              initialOpacity: 0.2,
              finalOpacity: 0.1,
              cancellationPeriod: 75
            }"
            v-for="item in navigation"
            :key="item.name"
            as="a"
            :href="item.href"
            :class="[
              item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block px-3 py-2 rounded-md text-base font-medium'
            ]"
            :aria-current="item.current ? 'page' : undefined"
            >{{ item.name }}</DisclosureButton
          >
        </div>
        <div class="pt-4 pb-3 border-t border-gray-700">
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <img class="h-10 w-10 rounded-full" :src="user.imageUrl" alt="" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium leading-none text-white">{{ user.name }}</div>
              <div class="text-sm font-medium leading-none text-gray-400">{{ user.email }}</div>
            </div>
            <button
              type="button"
              class="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span class="sr-only">View notifications</span>

              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-3 px-2 space-y-1">
            <DisclosureButton
              v-wave="{
                color: 'currentColor',
                easing: 'ease-out',
                duration: 0.3,
                initialOpacity: 0.2,
                finalOpacity: 0.1,
                cancellationPeriod: 75
              }"
              v-for="item in userNavigation"
              :key="item.name"
              as="a"
              :href="item.href"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >{{ item.name }}</DisclosureButton
            >
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">SMI Population</h1>
      </div>
    </header>
    <main>
      <div class=" max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ">
        <TransitionRoot
        :show="isShowing"
          appear
          as="div"
          enter="transform transition duration-[400ms]"
          enter-from="opacity-0 rotate-[-270deg] scale-50"
          enter-to="opacity-100 rotate-0 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leave-from="opacity-100 rotate-0 scale-100 "
          leave-to="opacity-0 scale-95 "
        >
          <!-- Replace with your content -->
          <div class="px-4 py-6 sm:px-0 w-full h-full">
            <button
              type="button"
              class="profile px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <nestedDraggable class="profile-content mx-5" :data="profile1" :children="profile1" />
            </button>

            <button
              v-wave="{
                color: 'currentColor',
                easing: 'ease-out',
                duration: 0.3,
                initialOpacity: 0.2,
                finalOpacity: 0.1,
                cancellationPeriod: 75
              }"
              class="flex items-center px-3 py-2 mt-8 text-sm font-medium text-white transition transform bg-black rounded-full active:bg-opacity-40 hover:scale-105 hover:bg-opacity-30 focus:outline-none bg-opacity-20"
            >
              <svg viewBox="0 0 20 20" fill="none" class="w-5 h-5 opacity-70">
                <path
                  d="M14.9497 14.9498C12.2161 17.6835 7.78392 17.6835 5.05025 14.9498C2.31658 12.2162 2.31658 7.784 5.05025 5.05033C7.78392 2.31666 12.2161 2.31666 14.9497 5.05033C15.5333 5.63385 15.9922 6.29475 16.3266 7M16.9497 2L17 7H16.3266M12 7L16.3266 7"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>

              <!-- <span class="ml-3">Click to transition</span> -->
            </button>
          </div>
        </TransitionRoot>
        <!-- /End replace -->
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, TransitionRoot} from "@headlessui/vue";
import { BellIcon, MenuIcon, XIcon, SearchIcon } from "@heroicons/vue/outline";
import Popover from "@/components/dataset/Popover.vue";
import nestedDraggable from "@/components/dataset/draggable/nested.vue";
import { defineComponent, ref} from "vue";


export default defineComponent({
  name: "ResponsiveNav",
  components: {
    Popover,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    BellIcon,
    MenuIcon,
    XIcon,
    SearchIcon,
    nestedDraggable,
    TransitionRoot
    // nestedExample
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
      user: {
        name: "Tom Cook",
        email: "tom@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      navigation: [
        { name: "Dashboard", href: "#", current: true },
        { name: "Team", href: "#", current: false },
        { name: "Projects", href: "#", current: false },
        { name: "Calendar", href: "#", current: false },
        { name: "Reports", href: "#", current: false }
      ],
      userNavigation: [
        { name: "Your Profile", href: "#" },
        { name: "Settings", href: "#" },
        { name: "Sign out", href: "#" }
      ]
    };
  }
});
</script>

<style scoped>
.app-logo {
  margin-right: 3px;
  width: 25px;
  height: auto;
  /* min-width: 31px;
  min-height: 24px; */
  display: inline;
}
.profile,
.profile-content {
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 500px;
}
</style>
