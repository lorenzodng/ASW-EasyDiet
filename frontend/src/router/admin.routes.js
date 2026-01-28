import AdminLogin from "../admin/pages/AdminLogin.vue"
import AdminHome from "../admin/pages/AdminHome.vue"
import GestioneUtenti from "../admin/pages/GestioneUtenti.vue"
import GestioneDiete from "../admin/pages/GestioneDiete.vue"
import GestioneRicette from "../admin/pages/GestioneRicette.vue"

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
