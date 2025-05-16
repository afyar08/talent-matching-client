import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import LandingPage from '../user/views/guest/LandingPage.vue'
import JobSearch from '../user/views/guest/JobSearch.vue'
import DetailJob from '../user/views/guest/DetailJob.vue'
import Login from '../user/views/auth/Login.vue'
import Register from '../user/views/auth/Register.vue'
import DetailProfil from '../user/views/auth/DetailProfil.vue'
import SkillRegister from '../user/views/auth/SkillRegister.vue'

// Admin views
const AdminLayout = () => import('../admin/components/AdminLayout.vue')
const AdminDashboard = () => import('../admin/views/Dashboard.vue')
const DataUser = () => import('../admin/views/DataUser.vue')
const DataPekerjaan = () => import('../admin/views/DataPekerjaan.vue')
const DataReport = () => import('../admin/views/DataReport.vue')
const Scraping = () => import('../admin/views/Scraping.vue')

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
 {
  path: '/admin',
  component: AdminLayout,
  children: [
    {
      path: '',
      name: 'admin-dashboard',
      component: AdminDashboard
    },
    {
      path: 'users',
      name: 'admin-users',
      component: DataUser
    },
    {
      path: 'lowongan',
      name: 'admin-lowongan',
      component: DataPekerjaan
    },
    {
      path: 'lowongan/detail/:id',
      name: 'admin-lowongan-detail',
      component: () => import('../admin/views/DetailPekerjaan.vue')
    },
    {
      path: 'scraping',
      name: 'admin-scraping',
      component: Scraping
    },
    {
      path: 'report',
      name: 'admin-report',
      component: DataReport
    },
    {
      path: 'report/detail/:id',
      name: 'admin-report-detail',
      component: () => import('../admin/views/DetailReport.vue')
    }
  ]
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
