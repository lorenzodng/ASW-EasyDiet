import "./assets/style/style.scss";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";

// Create and initialize the Vue application
createApp(App)
    .use(createPinia()) // Global state management
    .use(router) // Client-side routing
    .mount('#app') // Mount Vue app to the DOM

