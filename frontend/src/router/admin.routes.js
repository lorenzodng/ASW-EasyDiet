import AdminLogin from "../admin/AdminLogin.vue"
import AdminHome from "../admin/AdminHome.vue"
import GestioneUtenti from "../admin/GestioneUtenti.vue"
import GestioneDiete from "../admin/GestioneDiete.vue"
import GestioneRicette from "../admin/GestioneRicette.vue"

export const adminRoutes = [
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin
  },
  {
    path: "/admin/home",
    name: "AdminHome",
    component: AdminHome,
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/users",
    name: "GestioneUtenti",
    component: GestioneUtenti,
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/diete",
    name: "GestioneDiete",
    component: GestioneDiete
  },
  {
    path: "/admin/ricette",
    name: "GestioneRicette",
    component: GestioneRicette
  }
]
