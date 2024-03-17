import { createRouter, createWebHashHistory } from "vue-router";
import bewaard from "./components/pages/BewaardPage.vue";
import account from "./components/pages/AccountPage.vue";
import home from "./components/pages/HomePage.vue";
import login from "./components/pages/LoginPage.vue"; // no navigation
import test from "./components/pages/TestPage.vue"; // no navigation
import sideNav from "./components/shared/SideNav.vue";
import topNav from "./components/shared/TopNav.vue";
import Projects from "./components/pages/ProjectsPage.vue";

const routes = [
  { path: "/", components: { default: home, sidebar: sideNav, topNav: topNav }, meta: { sidebar: true } },
  { path: "/bewaard", components: { default: bewaard, sidebar: sideNav, topNav: topNav }, meta: { sidebar: true } },
  { path: "/account", components: { default: account, sidebar: sideNav, topNav: topNav }, meta: { sidebar: true } },
  { path: "/login", components: { default: login }, meta: { sidebar: false } }, // no sidebar
  { path: "/test", components: { default: test }, meta: { sidebar: false } }, // no sidebar
  { path: "/projects", components: { default: Projects, sidebar: sideNav, topNav: topNav }, meta: { sidebar: true } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
