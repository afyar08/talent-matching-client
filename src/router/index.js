import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import LandingPage from '../user/views/guest/LandingPage.vue'
import JobSearch from '../user/views/guest/JobSearch.vue'
import DetailJob from '../user/views/guest/DetailJob.vue'
import Login from '../user/views/auth/Login.vue'
import Register from '../user/views/auth/Register.vue'
import DetailProfil from '../user/views/auth/DetailProfil.vue'
import SkillRegister from '../user/views/auth/SkillRegister.vue'

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    // Create placeholder component for now
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    // Create placeholder component for now
    component: Register
  },
  {
    path: '/register/detail',
    name: 'detail-register',
    // Create placeholder component for now
    component: DetailProfil
  },
  {
    path: '/register/skill',
    name: 'skill-register',
    // Create placeholder component for now
    component: SkillRegister
  },
  {
    path: '/job-search',
    name: 'job-search',
    // Create placeholder component for now
    component: JobSearch
  },
  {
    path: '/detail-job',
    name: 'detail-job',
    // Create placeholder component for now
    component: DetailJob
  },
  {
    path: '/profile',
    name: 'Profile',
    // Create placeholder component for now
    component: {},
    meta: { requiresAuth: true }
  },
  // 404 Not Found route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: {}
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guards (optional)
router.beforeEach((to, from, next) => {
  // Example: Check if route requires auth
  if (to.meta.requiresAuth) {
    // Add your auth logic here
    const isAuthenticated = false // Replace with actual auth check
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
