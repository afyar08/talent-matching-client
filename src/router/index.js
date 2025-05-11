import { createRouter, createWebHistory } from 'vue-router'

// Import your views
import LandingPage from '../user/views/guest/LandingPage.vue'

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
    component: {
      template: `
        <div class="min-h-screen flex flex-col">
          <Navbar navbarState="register" />
          <main class="flex-grow flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
              <p class="text-center text-gray-600 mt-4">
                Login page will be implemented soon
              </p>
            </div>
          </main>
          <Footer />
        </div>
      `,
      components: {
        Navbar: () => import('../user/components/Navbar.vue'),
        Footer: () => import('../user/components/Footer.vue')
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    // Create placeholder component for now
    component: {
      template: `
        <div class="min-h-screen flex flex-col">
          <Navbar navbarState="register" />
          <main class="flex-grow flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <h1 class="text-2xl font-bold text-center mb-6">Register</h1>
              <p class="text-center text-gray-600 mt-4">
                Registration page will be implemented soon
              </p>
            </div>
          </main>
          <Footer />
        </div>
      `,
      components: {
        Navbar: () => import('../user/components/Navbar.vue'),
        Footer: () => import('../user/components/Footer.vue')
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    // Create placeholder component for now
    component: {
      template: `
        <div class="min-h-screen flex flex-col">
          <Navbar navbarState="auth" />
          <main class="flex-grow flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <h1 class="text-2xl font-bold text-center mb-6">User Profile</h1>
              <p class="text-center text-gray-600 mt-4">
                Profile page will be implemented soon
              </p>
            </div>
          </main>
          <Footer />
        </div>
      `,
      components: {
        Navbar: () => import('../user/components/Navbar.vue'),
        Footer: () => import('../user/components/Footer.vue')
      }
    },
    meta: { requiresAuth: true }
  },
  // 404 Not Found route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: {
      template: `
        <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p class="text-xl text-gray-600 mb-8">Page not found</p>
          <router-link to="/" class="px-6 py-3 bg-[#2F27CE] text-white rounded-md hover:bg-[#261fb3] transition-colors">
            Back to Home
          </router-link>
        </div>
      `
    }
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
