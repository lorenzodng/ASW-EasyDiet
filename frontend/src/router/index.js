//rotte vue router

import { createRouter, createWebHistory } from "vue-router"
import Login from "../components/Login.vue"
import Form from "../components/Form.vue"
import Home from "../components/Home.vue"
import ComponiDieta from "../components/ComponiDieta.vue"
import InformazioniPersonali from "../components/InformazioniPersonali.vue"
import Welcome from "../components/Welcome.vue"
import TrackingPeso from "../components/TrackingPeso.vue"
import AdminLogin from "../admin/components/AdminLogin.vue"
import AdminHome from "../admin/components/AdminHome.vue"

const routes = [
  {
    path: "/", //all'apertura della web app 
    redirect: "/welcome" //reindirizza automaticamente a /login
  },
  {
    path: "/login", //percorso (url di default)
    name: "Login",  //nome assegnato alla rotta
    component: Login //componente mostrato
  },
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
  { path: "/admin/login", 
    name: "AdminLogin", 
    component: AdminLogin 
  },
  {
    path: "/admin/home", 
    name: "AdminHome", 
    component: AdminHome 
  }

]

const router = createRouter({
  history: createWebHistory(), //serve per mostrare l'url senza il carattere "#"
  routes
})

export default router


//sarebbero da dividere le pagine dai componenti e modificare i path 