import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import OtherView from "../views/OtherView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/other",
    name: "other",
    component: OtherView,
  },
];

const router = createRouter({
  history: createWebHistory("vue"),
  routes,
});

export default router;
