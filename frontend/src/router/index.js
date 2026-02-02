import { createRouter, createWebHistory } from "vue-router";
import { userRoutes } from "./userRoutes";
import { adminRoutes } from "./adminRoutes";

const routes = [
  {
    path: "/",
    redirect: "/welcome"
  },
  ...userRoutes,
  ...adminRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
