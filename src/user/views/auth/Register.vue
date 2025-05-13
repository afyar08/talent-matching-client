<script setup>
import { ref } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const fullName = ref('');
const email = ref('');
const password = ref('');
const verifyPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const register = async () => {
  if (!fullName.value || !email.value || !password.value || !verifyPassword.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  if (password.value !== verifyPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }
  
  try {
    isLoading.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes - would be replaced with actual registration API call
    console.log('Registration data:', { fullName: fullName.value, email: email.value });
    
    // Redirect to login after successful registration
    router.push('/login');
  } catch (error) {
    errorMessage.value = 'An error occurred during registration';
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-be-vietnam-pro bg-white">
    <!-- Navbar with login state -->
    <Navbar navbarState="register" />
    
    <!-- Main Content -->
    <main class="flex-grow flex">
      <!-- Left Side - Registration Form -->
      <div class="w-full md:w-1/2 flex items-center justify-center p-8">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2">Welcome to</h1>
            <h2 class="text-3xl font-bold text-[#4745F6]">Talent Match !</h2>
          </div>
          
          <form @submit.prevent="register" class="space-y-6">
            <!-- Full Name Field -->
            <div>
              <label for="fullName" class="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                v-model="fullName"
                type="text"
                placeholder="Enter your full name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4745F6] focus:border-transparent"
                required
              />
            </div>
            
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
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Enter password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4745F6] focus:border-transparent"
                required
              />
            </div>
            
            <!-- Verify Password Field -->
            <div>
              <label for="verifyPassword" class="block text-sm font-semibold text-gray-700 mb-2">
                Verifikasi Password
              </label>
              <input
                id="verifyPassword"
                v-model="verifyPassword"
                type="password"
                placeholder="Enter password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4745F6] focus:border-transparent"
                required
              />
            </div>
            
            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4">
              <div class="text-red-700">{{ errorMessage }}</div>
            </div>
            
            <!-- Register Button -->
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
              <span v-else>Register</span>
            </button>
            
            <!-- Login Link -->
            <div class="text-center">
              <span class="text-gray-600">Already have an account? </span>
              <router-link to="/login" class="text-[#4745F6] font-bold hover:underline">
                Login
              </router-link>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Right Side - Image (Updated to use asset) -->
      <div class="hidden md:flex md:w-1/2 items-center justify-center">
        <div class="max-w-xl p-8 mr-40">
          <img 
            src="../../../assets/RegisterPicture.png" 
            alt="Registration Illustration"
            class="w-full h-auto"
          />
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
