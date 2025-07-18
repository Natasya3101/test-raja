import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// src/main.js atau src/main.ts
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'


createApp(App).use(router).mount('#app')
