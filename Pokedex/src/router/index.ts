/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import homeRoutes from './home.routes'
import HomeView from '@/views/HomeView.vue';


const routes =[
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
