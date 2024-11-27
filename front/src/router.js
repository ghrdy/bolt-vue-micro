import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/register',
    component: () => import('./views/Register.vue')
  },
  {
    path: '/products',
    component: () => import('./views/Products.vue')
  },
  {
    path: '/cart',
    component: () => import('./views/Cart.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    component: () => import('./views/Checkout.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router