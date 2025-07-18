// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from "../components/auth/Login.vue";
import Register from "../components/auth/Register.vue"
import Create from "../components/to-do/Create.vue"
import Checklist from "../components/to-do/Checklist.vue"
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/checklist',
    name: 'Checklist',
    component: Checklist
  },
  // tambahkan route lainnya di sini, misal Dashboard, dll
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
