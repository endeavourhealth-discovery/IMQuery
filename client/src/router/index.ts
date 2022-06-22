import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
// import Home from "../views/temp/oldHome.vue";
// import Dashboard from "../views/Dashboard.vue";
// import Datamodel from "../views/Concept.vue";
// import Workflow from "../views/Workflow.vue";
// import UPRN from "../views/Uprn.vue";
// import Editor from "../views/Editor.vue";
// import Datasets from "../views/temp/Datasets.vue";
// import DatasetBrowser from "../views/temp/DatasetBrowser.vue";
// import DatasetWizard from "../views/temp/DatasetWizard.vue";
import Home from "../views/Home.vue";
import SnomedLicense from "../views/SnomedLicense.vue";
import store from "@/store/index";
import { nextTick } from "vue";

const APP_TITLE = "IM Query";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresLicense: true
    },
    children: [
      {
        path: "/:fileIri",
        name: "Query",
        component: Home,
        meta: {
          requiresLicense: true
        }
      }
    ]
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
