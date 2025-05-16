<script setup>
import { ref, computed } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form fields
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

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

// Handle form submission
const submitForm = () => {
  validatePasswords();
  
  // If form is valid, send password change request
  if (isFormValid.value) {
    // In a real app, you would send this to your API
    console.log('Changing password:', { 
      currentPassword: currentPassword.value,
      newPassword: newPassword.value 
    });
    
    // Show success message
    alert('Password berhasil diubah');
    
    // Reset form
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
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
    
    <main class="flex-grow flex flex-col items-center px-6 pb-8 pt-10 mt-15 max-w-screen-xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-6 w-full">
        <h1 class="text-4xl font-bold">
          Ubah <span class="text-[#4745F6]">Password</span>
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
            <input
              id="currentPassword"
              v-model="currentPassword"
              type="password"
              placeholder="Ketik Password Lama..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
              @blur="validatePasswords"
              required
            />
            <p v-if="errors.currentPassword" class="mt-1 text-sm text-red-600">{{ errors.currentPassword }}</p>
          </div>
          
          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Password Baru <span class="text-red-500">*</span>
            </label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              placeholder="Ketik Password Baru..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
              @blur="validatePasswords"
              required
            />
            <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600">{{ errors.newPassword }}</p>
          </div>
          
          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Verifikasi Password <span class="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Ketik Verifikasi Password..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
              @blur="validatePasswords"
              required
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>
          
          <!-- Buttons -->
          <div class="flex justify-end mt-8 space-x-4">
            <button
              type="button"
              @click="goBack"
              class="border border-[#4745F6] text-[#4745F6] font-medium py-2.5 px-6 rounded-md hover:bg-[#F8F8FF] transition-colors"
            >
              Kembali
            </button>
            
            <button
              type="submit"
              class="bg-[#4745F6] text-white font-medium py-2.5 px-6 rounded-md hover:bg-[#3d3bd4] transition-colors"
            >
              Simpan Perubahan
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
