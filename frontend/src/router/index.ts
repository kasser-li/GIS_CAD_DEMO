import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/map'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/LoginView.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/map/MapView.vue')
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('../views/project/ProjectView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminView.vue')
    }
  ]
})

export default router
