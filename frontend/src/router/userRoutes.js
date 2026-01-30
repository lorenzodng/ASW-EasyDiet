import Welcome from "../user/pages/Welcome.vue"
import Form from "../user/pages/Form.vue"
import Login from "../user/pages/Login.vue"
import Home from "../user/pages/Home.vue"
import ComponiDieta from "../user/pages/ComponiDieta.vue"
import InformazioniPersonali from "../user/pages/InformazioniPersonali.vue"
import TrackingPeso from "../user/pages/TrackingPeso.vue"

export const userRoutes = [
  {
    path: "/welcome",
    name: "Welcome",
    component: Welcome
  },
  {
    path: "/form",
    name: "Form",
    component: Form
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/componi-dieta",
    name: "ComponiDieta",
    component: ComponiDieta
  },
  {
    path: "/informazioni-personali",
    name: "InformazioniPersonali",
    component: InformazioniPersonali
  },
  {
    path: "/tracking-peso",
    name: "TrackingPeso",
    component: TrackingPeso
  },
]
