<script setup>
import { ref } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }
  
  try {
    isLoading.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes - would be replaced with actual authentication
    if (email.value === 'user@example.com' && password.value === 'password') {
      // Successful login, navigate to home
      router.push('/');
    } else {
      errorMessage.value = 'Invalid email or password';
    }
  } catch (error) {
    errorMessage.value = 'An error occurred during login';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-be-vietnam-pro bg-white">
    <!-- Navbar with register state -->
    <Navbar navbarState="register" />
    
    <!-- Main Content -->
    <main class="flex-grow flex">
      <!-- Left Side - Image (Updated to be slightly bigger) -->
      <div class="hidden md:flex md:w-1/2 items-center justify-center">
        <div class="max-w-xl p-8 ml-40">
          <img 
            src="../../../assets/LoginPicture.png" 
            alt="Job Search Illustration"
            class="w-full h-auto"
          />
        </div>
      </div>
      
      <!-- Right Side - Login Form -->
      <div class="w-full md:w-1/2 flex items-center justify-center p-8 mr-30">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2">Welcome back to</h1>
            <h2 class="text-3xl font-bold text-[#4745F6]">Talent Match !</h2>
          </div>
          
          <form @submit.prevent="login" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter email address"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4745F6] focus:border-transparent"
                required
              />
            </div>
            
            <!-- Password Field -->
            <div>
              <div class="flex justify-between mb-2">
                <label for="password" class="block text-sm font-semibold text-gray-700">
                  Password
                </label>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Enter password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4745F6] focus:border-transparent"
                required
              />
              <div class="flex justify-end mt-1">
                <a href="#" class="text-sm text-[#4745F6] font-bold hover:underline">
                  Lupa Password?
                </a>
              </div>
            </div>
            
            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4">
              <div class="text-red-700">{{ errorMessage }}</div>
            </div>
            
            <!-- Login Button -->
            <button
              type="submit"
              class="w-full bg-[#2F27CE] text-white font-bold py-3 px-4 rounded-md hover:bg-[#3d3bd4] transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
              <span v-else>Login</span>
            </button>
            
            <!-- Register Link -->
            <div class="text-center">
              <span class="text-gray-600">Don't have an account? </span>
              <router-link to="/register" class="text-[#4745F6] font-bold hover:underline">
                Register
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<style scoped>
.font-be-vietnam-pro {
  font-family: 'Be Vietnam Pro', sans-serif;
}
</style>
