import { createRouter, createWebHistory } from "vue-router"
import { userRoutes } from "./user.routes"
import { adminRoutes } from "./admin.routes"

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
})

export default router
