<script setup>
  import { ref } from 'vue';
  import Navbar from '../../components/Navbar.vue';
  import Footer from '../../components/Footer.vue';
  import { useRouter } from 'vue-router';
  import { setInStorage } from '../../../utils/localStorage';
  import { toastService } from '../../../utils/toastService';
  import axios from 'axios';

  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const isLoading = ref(false);
  const showPassword = ref(false);

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  const login = async () => {
    if (!email.value || !password.value) {
      errorMessage.value = 'Please fill in all fields';
      toastService.show({
        type: 'error',
        message: 'Please fill in all fields',
      });
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      console.log('Attempting login...');
      const response = await axios.post(
        'http://localhost:8000/api/auth/sign-in/',
        {
          email: email.value,
          password: password.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response data:', response.data);

      // Check for tokens in nested structure OR direct structure
      const hasTokens = response.data.tokens?.access || response.data.access;

      if (hasTokens) {
        console.log('Login successful, extracting tokens...');

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        const userData = response.data.user;

        // Get tokens from correct structure
        const accessToken = response.data.tokens?.access || response.data.access;
        const refreshToken = response.data.tokens?.refresh || response.data.refresh;

        console.log('Storing user data:', {
          uid: userData.uid,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profilePicture: userData.profile_picture_url,
        });

        // Set localStorage items
        setInStorage('user-id', userData.uid);
        setInStorage('user-name', userData.name);
        setInStorage('user-email', userData.email);
        setInStorage('user-role', userData.role);
        setInStorage('user-token', accessToken);
        setInStorage('user-refresh-token', refreshToken);
        setInStorage('token-expired-date', expirationDate.toISOString());

        // Store profile picture URL if available
        if (userData.profile_picture_url) {
          console.log('Profile picture URL found:', userData.profile_picture_url);
          setInStorage('user-profile-picture', userData.profile_picture_url);

          // Test if profile picture is accessible
          try {
            const imageResponse = await fetch(userData.profile_picture_url);
            if (imageResponse.ok) {
              console.log('Profile picture is accessible');
            } else {
              console.log('Profile picture URL not accessible:', imageResponse.status);
            }
          } catch (imgError) {
            console.log('Error testing profile picture URL:', imgError);
          }
        } else {
          console.log('No profile picture URL found in response');
          // Clear any existing profile picture
          setInStorage('user-profile-picture', null);
        }

        toastService.show({
          type: 'success',
          message: 'Login successful! Redirecting...',
          duration: 3000,
        });

        setTimeout(() => {
          if (userData.role == 'admin') {
            router.push('/admin/scraping');
          } else if (userData.role == 'user') {
            router.push('/home');
          } else {
            // fallback jika role tidak dikenali
            router.push('/');
          }
        }, 1500);
      } else {
        console.error('No access token found in response');
        errorMessage.value = 'Login failed. No access token received.';
        toastService.show({
          type: 'error',
          message: errorMessage.value,
        });
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.code === 'ERR_NETWORK') {
        errorMessage.value = 'Network error. Please check if the server is running.';
      } else if (error.response?.status === 400) {
        errorMessage.value =
          error.response.data?.detail ||
          error.response.data?.non_field_errors?.[0] ||
          'Invalid email or password.';
      } else if (error.response?.status === 401) {
        errorMessage.value = 'Invalid email or password.';
      } else if (error.response?.data?.detail) {
        errorMessage.value = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage.value = error.response.data.non_field_errors[0];
      } else {
        errorMessage.value = 'Login failed. Please try again.';
      }

      toastService.show({
        type: 'error',
        message: errorMessage.value,
      });
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
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4745F6] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  @click="togglePasswordVisibility"
                >
                  <!-- Eye icon when password is hidden -->
                  <svg
                    v-if="!showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500 hover:text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <!-- Crossed eye icon when password is visible -->
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500 hover:text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-red-500 text-sm">
              {{ errorMessage }}
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              class="w-full bg-[#2F27CE] text-white font-bold py-3 px-4 rounded-md hover:bg-[#3d3bd4] transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </span>
              <span v-else>Login</span>
            </button>

            <!-- Register Link -->
            <div class="text-center">
              <span class="text-gray-600">Don't have an account?</span>
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
