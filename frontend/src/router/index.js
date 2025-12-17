//rotte vue router

import { createRouter, createWebHistory } from "vue-router"
import Login from "../components/Login.vue"
import Form from "../components/Form.vue"
import Home from "../components/Home.vue"
import ComponiDieta from "../components/ComponiDieta.vue"

const routes = [
  {
    path: '/', //percorso (url di default)
    name: 'Login',  //nome assegnato alla rotta
    component: Login //componente mostrato
  },
  {
    path: "/form",
    name: "Form",
    component: Form
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: "/componi-dieta",
    name: "ComponiDieta",
    component: ComponiDieta
  }
]

const router = createRouter({
  history: createWebHistory(), //serve per mostrare l'url senza il carattere "#"
  routes
})

export default router


//sarebbero da dividere le pagine dai componenti e modificare i path 