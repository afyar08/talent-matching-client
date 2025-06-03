<script setup>
import { ref, computed } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';
import { passwordService } from '../../../services/passwordService.js';
import { toastService } from '../../../utils/toastService.js';  // Fix: gunakan toastService dari utils

const router = useRouter();

// Form fields
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// Loading state
const isSubmitting = ref(false);

// Password visibility toggles
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Error states
const errors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Check if form is valid
const isFormValid = computed(() => {
  return currentPassword.value && 
         newPassword.value && 
         confirmPassword.value && 
         !errors.value.currentPassword &&
         !errors.value.newPassword &&
         !errors.value.confirmPassword;
});

// Validate passwords when they change
const validatePasswords = () => {
  // Reset errors
  errors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // Check current password is filled
  if (!currentPassword.value) {
    errors.value.currentPassword = 'Masukkan password lama Anda';
  }
  
  // Check new password requirements
  if (!newPassword.value) {
    errors.value.newPassword = 'Masukkan password baru';
  } else if (newPassword.value.length < 8) {
    errors.value.newPassword = 'Password minimal 8 karakter';
  }
  
  // Check confirmation matches
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Konfirmasi password baru Anda';
  } else if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Password tidak cocok';
  }
};

// Toggle password visibility
const togglePasswordVisibility = (field) => {
  if (field === 'current') {
    showCurrentPassword.value = !showCurrentPassword.value;
  } else if (field === 'new') {
    showNewPassword.value = !showNewPassword.value;
  } else if (field === 'confirm') {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

// Handle form submission
const submitForm = async () => {
  validatePasswords();
  
  // If form is valid, send password change request
  if (isFormValid.value) {
    try {
      isSubmitting.value = true;
      
      const passwordData = {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value
      };
      
      console.log('Changing password...');
      console.log('Password Data:', passwordData);
      
      // Call API to change password
      const response = await passwordService.changePassword(passwordData);
      
      if (response.success) {
        // Show success message
        toastService.show({
          type: 'success',
          message: 'Password berhasil diubah',
          duration: 4000
        });
        
        // Reset form
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        
        // Redirect to profile page after short delay
        setTimeout(() => {
          router.push('/home/');
        }, 1500);
        
      } else {
        // Handle API error response
        toastService.show({
          type: 'error',
          message: response.message || 'Gagal mengubah password',
          duration: 4000
        });
      }
      
    } catch (error) {
      console.error('Error changing password:', error);
      
      // Handle different types of errors
      let errorMessage = 'Gagal mengubah password. Silakan coba lagi.';
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        
        if (errorData.errors) {
          // Handle validation errors
          if (errorData.errors.current_password) {
            errors.value.currentPassword = errorData.errors.current_password[0];
          }
          if (errorData.errors.new_password) {
            errors.value.newPassword = errorData.errors.new_password[0];
          }
          if (errorData.errors.confirm_password) {
            errors.value.confirmPassword = errorData.errors.confirm_password[0];
          }
          return; // Don't show toast if field-specific errors
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
        // Redirect to login page
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
      
      toastService.show({
        type: 'error',
        message: errorMessage,
        duration: 4000
      });
      
    } finally {
      isSubmitting.value = false;
    }
  }
};

// Go back to previous page
const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-be-vietnam-pro bg-white">
    <Navbar />
    
    <main class="flex-grow flex flex-col bg-[#FCFCFF] items-center px-6 pb-8 pt-10 mt-10 max-w-screen-xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-6 w-full">
        <h1 class="text-4xl font-bold">
          Ubah <span class="text-[#2F27CE]">Password</span>
        </h1>
      </div>
      
      <!-- Form Card -->
      <div class="w-full max-w-5xl bg-white rounded-lg p-8 pb-2 pt-5">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Current Password -->
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Password Lama <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="currentPassword"
                v-model="currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Ketik Password Lama..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                @blur="validatePasswords"
                :disabled="isSubmitting"
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePasswordVisibility('current')"
                :disabled="isSubmitting"
              >
                <!-- Eye icon when password is hidden -->
                <svg v-if="!showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Crossed eye icon when password is visible -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.currentPassword" class="mt-1 text-sm text-red-600">{{ errors.currentPassword }}</p>
          </div>
          
          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Password Baru <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Ketik Password Baru..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                @blur="validatePasswords"
                :disabled="isSubmitting"
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePasswordVisibility('new')"
                :disabled="isSubmitting"
              >
                <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600">{{ errors.newPassword }}</p>
          </div>
          
          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Verifikasi Password <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Ketik Verifikasi Password..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                @blur="validatePasswords"
                :disabled="isSubmitting"
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="togglePasswordVisibility('confirm')"
                :disabled="isSubmitting"
              >
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>
          
          <!-- Buttons -->
          <div class="flex justify-end mt-8 space-x-4">
            <button
              type="button"
              @click="goBack"
              class="border border-[#2F27CE] text-[#2F27CE] font-medium py-2.5 px-6 rounded-md hover:bg-[#F8F8FF] transition-colors"
              :disabled="isSubmitting"
            >
              Kembali
            </button>
            
            <button
              type="submit"
              class="bg-[#2F27CE] text-white font-medium py-2.5 px-6 rounded-md hover:bg-[#3d3bd4] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="isSubmitting || !isFormValid"
            >
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
              <span v-else>Simpan Perubahan</span>
            </button>
          </div>
        </form>
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
