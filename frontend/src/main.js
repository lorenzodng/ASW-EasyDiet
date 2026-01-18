//client

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.scss'
import App from './App.vue'
import router from "./router/index.js"

createApp(App)
    .use(createPinia()) // gestione stato globale
    .use(router) // gestione navigazione
    .mount('#app') // montaggio sull'elemento root HTML

//punto di ingresso applicazione vue
//Collega App.vue, Pinia e Vue Router