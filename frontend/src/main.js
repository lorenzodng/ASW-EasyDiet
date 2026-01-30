//client

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/style/style.scss'
import App from './App.vue'
import router from "./router/index.js"

createApp(App)
    .use(createPinia()) // Global state management
    .use(router) // Client-side routing
    .mount('#app') // Mount Vue app to the DOM

