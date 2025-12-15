//rotte vue router

import { createRouter, createWebHistory } from "vue-router"
import Home from "../components/Home.vue"
import Login from "../components/Login.vue"

const routes = [
  {
    path: '/', //percorso (url di default)
    name: 'Login',  //nome assegnato alla rotta
    component: Login //componente mostrato
  },
  {
    path: '/home', 
    name: 'Home', 
    component: Home 
  }
]

const router = createRouter({
  history: createWebHistory(), //serve per mostrare l'url senza il carattere "#"
  routes
})

export default router