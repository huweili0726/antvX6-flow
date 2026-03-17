import { createRouter, createWebHistory } from 'vue-router'
import FlowPage from '@/views/flow/index.vue'
import AboutPage from '@/views/AboutPage.vue'

const routes = [
  {
    path: '/flow',
    name: 'home',
    component: FlowPage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router