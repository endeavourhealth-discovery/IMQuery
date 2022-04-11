import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
<<<<<<< HEAD:front-end-vue/src/router/index.ts
=======
<<<<<<< HEAD:client/src/router/index.ts
// import Home from "../views/temp/oldHome.vue";
// import Dashboard from "../views/Dashboard.vue";
// import Datamodel from "../views/Concept.vue";
// import Workflow from "../views/Workflow.vue";
// import UPRN from "../views/Uprn.vue";
// import Editor from "../views/Editor.vue";
// import Datasets from "../views/temp/Datasets.vue";
// import DatasetBrowser from "../views/temp/DatasetBrowser.vue";
// import DatasetWizard from "../views/temp/DatasetWizard.vue";
>>>>>>> 2492fc015081bf4eba388ad72a212169c81fb97d:client/src/router/index.ts
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import Datamodel from "../views/Concept.vue";
import Workflow from "../views/Workflow.vue";
import UPRN from "../views/Uprn.vue";
import User from "../views/User.vue";
<<<<<<< HEAD:front-end-vue/src/router/index.ts
import Editor from "../views/Editor.vue";
import Search from "../views/Search.vue";
import Datasets from "../views/Datasets.vue";
import DatasetBrowser from "../views/DatasetBrowser.vue";
import DatasetWizard from "../views/DatasetWizard.vue";
=======
=======
import Home from "../views/oldHome.vue";
import Dashboard from "../views/Dashboard.vue";
import Datamodel from "../views/Concept.vue";
import Workflow from "../views/Workflow.vue";
// import UPRN from "../views/Uprn.vue";
import User from "../views/User.vue";
import Editor from "../views/Editor.vue";
import Home from "../views/Home.vue";
import Datasets from "../views/Datasets.vue";
import DatasetBrowser from "../views/DatasetBrowser.vue";
import DatasetWizard from "../views/DatasetWizard.vue";
>>>>>>> dc3adcaf52759614e93f1196c443ca55c9d0af26:front-end-vue/src/router/index.ts
>>>>>>> 2492fc015081bf4eba388ad72a212169c81fb97d:client/src/router/index.ts
import Login from "../components/user/Login.vue";
import Register from "../components/user/Register.vue";
import UserDetails from "../components/user/UserDetails.vue";
import UserEdit from "../components/user/UserEdit.vue";
import PasswordEdit from "../components/user/PasswordEdit.vue";
import ConfirmCode from "../components/user/ConfirmCode.vue";
import Logout from "../components/user/Logout.vue";
import ForgotPassword from "../components/user/ForgotPassword.vue";
import ForgotPasswordSubmit from "../components/user/ForgotPasswordSubmit.vue";
import SnomedLicense from "../views/SnomedLicense.vue";
import store from "@/store/index";
import { nextTick } from "vue";

const APP_TITLE = "Information Model";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/concept/http%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23Thing",
    redirect: "/"
  },
  {
    path: "/user",
    name: "User",
    component: User,
    children: [
      {
        path: "login",
        name: "Login",
        component: Login
      },
      {
        path: "confirm-code",
        name: "ConfirmCode",
        component: ConfirmCode
      },
      {
        path: "register",
        name: "Register",
        component: Register
      },
      {
        path: "my-account",
        name: "UserDetails",
        component: UserDetails,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "my-account/edit",
        name: "UserEdit",
        component: UserEdit,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "my-account/password-edit",
        name: "PasswordEdit",
        component: PasswordEdit,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "logout",
        name: "Logout",
        component: Logout
      },
      {
        path: "password-recovery",
        name: "ForgotPassword",
        component: ForgotPassword
      },
      {
        path: "password-recovery/submit",
        name: "ForgotPasswordSubmit",
        component: ForgotPasswordSubmit
      }
    ]
  },
  {
    path: "/",
    name: "Home",
<<<<<<< HEAD:front-end-vue/src/router/index.ts
    component: Search,
=======
<<<<<<< HEAD:client/src/router/index.ts
    component: Home,
>>>>>>> 2492fc015081bf4eba388ad72a212169c81fb97d:client/src/router/index.ts
    // redirect: { name: "Dashboard" },
=======
    component: Home,
    // redirect: { name: "Dashboard" },
    meta: {
      requiresLicense: true
    }
  },
  // {
  //   path: "/create",
  //   name: "Create",
  //   component: Home,
  //   meta: {
  //     requiresLicense: true
  //   }
  // },
  // {
  //   path: "/create/:iri",
  //   name: "Create",
  //   component: Home,
  //   meta: {
  //     requiresLicense: true
  //   }
  // },
  // {
  //   path: "/explore",
  //   name: "Explore",
  //   component: Home,
  //   meta: {
  //     requiresLicense: true
  //   }
  // },
  // {
  //   path: "/explore/:iri",
  //   name: "Explore",
  //   component: Home,
  //   meta: {
  //     requiresLicense: true
  //   }
  // },
  {
    path: "/oldhome",
    name: "oldhome",
    component: Home,
    redirect: { name: "Dashboard" },
    meta: {
      requiresLicense: true
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        alias: ["/home", "/dashboard"],
        component: Dashboard,
        meta: {
          requiresLicense: true
        }
      },
      {
        path: "/concept/:selectedIri",
        name: "Concept",
        component: Datamodel,
        meta: {
          requiresLicense: true
        }
      }
    ]
  },
  {
    path: "/editor",
    name: "Editor",
    component: Editor,
    children: [
      {
        path: "/editor",
        name: "Create",
        component: Editor
      },
      {
        path: "/editor/:iri",
        name: "Edit",
        component: Editor
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/datasets",
    name: "Datasets",
    component: Datasets,
    children: [
      {
        path: "browser",
        name: "DatasetBrowser",
        component: DatasetBrowser,
      },
      {
        path: "wizard",
        name: "DatasetWizard",
        component: DatasetWizard,
      }
    ]
  },
  {
    path: "/search",
    name: "Search",
    component: Home,
  },
  {
    path: "/workflow",
    name: "Workflow",
    component: Workflow,
>>>>>>> dc3adcaf52759614e93f1196c443ca55c9d0af26:front-end-vue/src/router/index.ts
    meta: {
      requiresLicense: true
    }
  },
<<<<<<< HEAD:client/src/router/index.ts
=======
  // {
  //   path: "/uprn",
  //   name: "UPRN",
  //   component: UPRN,
  //   meta: {
  //     requiresLicense: true
  //   }
  // },
>>>>>>> dc3adcaf52759614e93f1196c443ca55c9d0af26:front-end-vue/src/router/index.ts
  {
    path: "/oldhome",
    name: "oldhome",
    component: Home,
    redirect: { name: "Dashboard" },
    meta: {
      requiresLicense: true
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        alias: ["/home", "/dashboard"],
        component: Dashboard,
        meta: {
          requiresLicense: true
        }
      },
      {
        path: "/concept/:selectedIri",
        name: "Concept",
        component: Datamodel,
        meta: {
          requiresLicense: true
        }
      }
    ]
  },
  {
    path: "/editor",
    name: "Editor",
    component: Editor,
    children: [
      {
        path: "/editor",
        name: "Create",
        component: Editor
      },
      {
        path: "/editor/:iri",
        name: "Edit",
        component: Editor
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/datasets",
    name: "Datasets",
    component: Datasets,
    children: [
      {
        path: "browser",
        name: "DatasetBrowser",
        component: DatasetBrowser,
      },
      {
        path: "wizard",
        name: "DatasetWizard",
        component: DatasetWizard,
      }
    ]
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/workflow",
    name: "Workflow",
    component: Workflow,
    meta: {
      requiresLicense: true
    }
  },
  {
    path: "/uprn",
    name: "UPRN",
    component: UPRN,
    meta: {
      requiresLicense: true
    }
  },
  {
    path: "/snomedLicense",
    name: "License",
    component: SnomedLicense
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name?.toString() == "Concept") {
    store.commit("updateConceptIri", to.params.selectedIri as string);
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    store.dispatch("authenticateCurrentUser").then(res => {
      console.log("auth guard user authenticated:" + res.authenticated);
      if (!res.authenticated) {
        console.log("redirecting to login");
        next({
          path: "/user/login"
        });
      } else {
        next();
      }
    });
  } else if (to.matched.some(record => record.meta.requiresLicense)) {
    console.log("snomed license accepted:" + store.state.snomedLicenseAccepted);
    if (store.state.snomedLicenseAccepted !== "true") {
      next({
        path: "/snomedLicense"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach(to => {
  nextTick(() => {
    document.title = (to.meta.title as string) || APP_TITLE;
  });
});

export default router;
