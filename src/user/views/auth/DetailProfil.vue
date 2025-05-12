<script setup>
import { ref } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form fields
const fullName = ref('');
const email = ref('');
const dateOfBirth = ref('');
const gender = ref('');
const province = ref('');
const imageFile = ref(null);
const imagePreview = ref('');

// Province options (would typically come from an API)
const provinceOptions = ref([
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 'Sumatera Selatan',
  'Bengkulu', 'Lampung', 'Kepulauan Bangka Belitung', 'Kepulauan Riau', 'DKI Jakarta',
  'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten', 'Bali',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah',
  'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
  'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Gorontalo',
  'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat'
]);

// Gender options
const genderOptions = ref(['Pria', 'Wanita', 'Lainnya']);

// Form step tracker
const currentStep = ref('detail'); // 'detail' or 'skill'

// Handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

// Continue to next step
const continueToNext = () => {
  if (currentStep.value === 'detail') {
    // Would have validation here
    currentStep.value = 'skill';
  } else {
    // Submit form and redirect
    router.push('/register/skill');
  }
};

// Improve dateOfBirth handling
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const validateDateOfBirth = () => {
  if (!dateOfBirth.value) return;
  
  // Check if the selected date is valid (not in the future)
  const selectedDate = new Date(dateOfBirth.value);
  const today = new Date();
  
  if (selectedDate > today) {
    alert("Date of birth cannot be in the future");
    dateOfBirth.value = '';
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-be-vietnam-pro bg-white">
    <!-- Navbar with auth state -->
    <Navbar navbarState="auth" />
    
    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center px-6 py-8 mt-15 max-w-screen-xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-4 w-full">
        <h1 class="text-5xl font-bold text-[#2D3648]">
          Complete your <span class="text-[#4745F6]">Profile</span>
        </h1>
        <p class="text-gray-600 mt-4 text-lg">
          Lengkapi profil agar bisa melihat lowongan pekerjaan yang disarankan berdasarkan profilmu
        </p>
      </div>
      
      <!-- Progress Steps -->
    <div class="flex justify-between items-center w-full mb-10 px-9">
      <div class="flex flex-col items-center">
        <div class="w-5 h-5 rounded-full bg-[#4745F6] text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        </div>
        <span class="mt-3 text-sm">Detail Profil</span>
      </div>
      <div class="h-0.5 bg-gray-300 flex-grow mx-4"></div>
      <div class="flex flex-col items-center">
        <div class="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center">
        </div>
        <span class="mt-3 text-sm text-gray-500">Skill</span>
      </div>
    </div>
      
      <!-- Form Section -->
      <div class="w-full bg-white rounded-lg border border-gray-100 p-8 pt-5">
        <div class="mb-6">
          <h2 class="text-lg font-bold text-[#2D3648]">Detail Profil</h2>
          <p class="text-gray-500 text-sm">Informasi pribadi wajib diisi dan dapat diubah kapan saja</p>
        </div>
        
        <div class="border-t border-gray-200 my-6"></div>
        
        <form @submit.prevent="continueToNext">
          <!-- Profile Picture Section -->
          <div class="flex flex-row items-center justify-center gap-8 mb-7">
            <!-- Profile picture -->
            <div>
              <img 
                :src="imagePreview || 'https://randomuser.me/api/portraits/men/36.jpg'" 
                alt="Profile Picture" 
                class="w-24 h-24 rounded-full object-cover border border-gray-200"
              />
            </div>
            
            <!-- Upload container -->
            <div class="w-full max-w-md">
              <div class="border border-dashed border-[#4745F6] p-6 rounded bg-[#F8F8FF] flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#4745F6] mb-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <label class="cursor-pointer">
                  <span class="text-[#4745F6] hover:underline">Click to replace</span>
                  <span class="text-gray-600"> or drag and drop</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    class="hidden"
                    @change="handleImageUpload"
                  />
                </label>
                <p class="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 400 x 400px)</p>
              </div>
            </div>
          </div>
          
          <!-- Form Fields -->
          <div class="grid grid-cols-1 gap-6 mb-6">
            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                v-model="fullName"
                type="text"
                placeholder="Enter your full name"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                required
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
            
            <!-- Gender -->
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">
                Gender <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="gender"
                  v-model="gender"
                  class="appearance-none w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                  required
                >
                  <option value="" disabled selected>Pilih Gender</option>
                  <option v-for="option in genderOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Date of Birth -->
            <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="dateOfBirth"
                  v-model="dateOfBirth"
                  type="date"
                  max="9999-12-31"
                  placeholder="MM/DD/YYYY"
                  @change="validateDateOfBirth"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                  required
                />
              </div>
            </div>
            
            <!-- Provinsi -->
            <div>
              <label for="province" class="block text-sm font-medium text-gray-700 mb-1">
                Provinsi <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="province"
                  v-model="province"
                  class="appearance-none w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                  required
                >
                  <option value="" disabled selected>Pilih Provinsi</option>
                  <option v-for="option in provinceOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="flex justify-end mt-8">
            <button
              type="submit"
              class="bg-[#4745F6] text-white font-medium py-2.5 px-8 rounded-md hover:bg-[#3d3bd4] transition-colors"
            >
              Lanjutkan
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
