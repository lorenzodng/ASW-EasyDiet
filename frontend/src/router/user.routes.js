import Welcome from "../Welcome.vue"
import Form from "../user/Form.vue"
import Login from "../user/Login.vue"
import Home from "../user/Home.vue"
import ComponiDieta from "../user/ComponiDieta.vue"
import InformazioniPersonali from "../user/InformazioniPersonali.vue"
import TrackingPeso from "../user/TrackingPeso.vue"

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
