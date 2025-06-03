<script setup>
// filepath: d:\Tugas Akhir\Code\Project\talent-matching-client\src\user\components\SearchJob.vue
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFromStorage } from '../../utils/localStorage';
import { jobService } from '../../services/jobService';

// Get route and router instances
const route = useRoute();
const router = useRouter();

const jobQuery = ref('');
const location = ref('');
const searchProvince = ref('');
const isDropdownOpen = ref(false);

// UBAH: Province list akan di-load dari database
const provinces = ref([]);
const isLoadingProvinces = ref(false);

// Load provinces from database
const loadProvinces = async () => {
  try {
    isLoadingProvinces.value = true;
    const response = await jobService.getProvinces();
    
    if (response.success && response.data.provinces) {
      // Mapping dari database response ke format yang dibutuhkan
      provinces.value = response.data.provinces.map(province => province.label);
      console.log('✅ Provinces loaded from database:', provinces.value);
    } else {
      console.error('❌ Invalid provinces response:', response);
      // Fallback ke default provinces jika API gagal
      useDefaultProvinces();
    }
  } catch (error) {
    console.error('❌ Error loading provinces:', error);
    // Fallback ke default provinces jika API gagal
    useDefaultProvinces();
  } finally {
    isLoadingProvinces.value = false;
  }
};

// Fallback default provinces jika database tidak bisa diakses
const useDefaultProvinces = () => {
  provinces.value = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Timur',
    'Jawa Tengah',
    'Sumatera Utara',
    'Bali',
    'Sulawesi Selatan',
    'Banten',
    'DI Yogyakarta',
    'Kalimantan Timur',
    'Sumatera Barat',
    'Sulawesi Utara',
    'Kalimantan Selatan',
    'Lampung',
    'Riau'
  ];
  console.log('⚠️ Using default provinces as fallback');
};

// Filtered provinces based on search
const filteredProvinces = computed(() => {
    if (!searchProvince.value) return provinces.value;
    return provinces.value.filter(province => 
        province.toLowerCase().includes(searchProvince.value.toLowerCase())
    );
});

const selectProvince = (province) => {
    location.value = province;
    searchProvince.value = province;
    isDropdownOpen.value = false;
};

// TAMBAH: Watcher untuk sinkronisasi searchProvince dengan location
watch(searchProvince, (newValue) => {
    // Jika input kosong atau hanya whitespace
    if (!newValue || newValue.trim() === '') {
        location.value = '';
        return;
    }
    
    // Jika input sesuai dengan salah satu provinsi yang valid
    if (provinces.value.includes(newValue)) {
        location.value = newValue;
    }
    // Jika sedang mengetik dan belum sesuai provinsi valid, jangan update location
    // location tetap mempertahankan nilai terakhir yang valid
});

// Initialize search inputs from URL query parameters
onMounted(async () => {
    // Load provinces from database first
    await loadProvinces();
    
    // Get query parameters
    const queryParams = route.query;
    
    // Initialize jobQuery from URL if present and not 'all'
    if (queryParams.job && queryParams.job !== 'all') {
        jobQuery.value = queryParams.job;
    }
    
    // Initialize location from URL if present and not 'all'
    if (queryParams.location && queryParams.location !== 'all') {
        location.value = queryParams.location;
        searchProvince.value = queryParams.location;
    }
});

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return !!getFromStorage('user-id');
});

// MODIFIKASI: Search handler dengan validasi provinsi
const handleSearch = async () => {
  // Validasi provinsi sebelum search
  if (searchProvince.value && !provinces.value.includes(searchProvince.value)) {
    // Jika input provinsi tidak valid atau tidak sesuai, kosongkan
    location.value = '';
    searchProvince.value = '';
  }
  
  console.log('🔍 Search triggered with:', {
    job: jobQuery.value || 'all',
    location: location.value || 'all'
  });
  
  // Navigate to job search page with raw query parameters
  const query = {};
  
  // Only add parameters if they have values
  if (jobQuery.value) {
    query.job = jobQuery.value;
  } else {
    query.job = 'all';
  }
  
  if (location.value) {
    query.location = location.value;
  } else {
    query.location = 'all';
  }
  
  // Set the path based on authentication status
  const searchPath = isAuthenticated.value ? '/home/job-search' : '/job-search';
  
  try {
    // Check if we're already on the search page
    const currentPath = route.path;
    const targetPath = searchPath;
    
    if (currentPath === targetPath) {
      // If we're already on the search page, just update query and reload
      console.log('🔄 Already on search page, updating query and reloading...');
      
      await router.push({
        path: searchPath,
        query: query
      });
      
      // Wait a moment for the route to update
      setTimeout(() => {
        console.log('🔄 Reloading window...');
        window.location.reload();
      }, 100);
      
    } else {
      // If we're on a different page, navigate first then reload
      console.log('🚀 Navigating to search page...');
      
      await router.push({
        path: searchPath,
        query: query
      });
      
      // Wait a moment for navigation to complete
      setTimeout(() => {
        console.log('🔄 Reloading window after navigation...');
        window.location.reload();
      }, 200);
    }
    
  } catch (error) {
    console.error('❌ Error during search navigation:', error);
  }
};

// Handle Enter key press in input fields
const handleEnterKey = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch();
  }
};

// MODIFIKASI: Handle clicking outside the dropdown to close it dan validasi input
const closeDropdownOnOutsideClick = (event) => {
  const dropdown = document.getElementById('provinceDropdown');
  const input = document.getElementById('provinceInput');
  if (dropdown && !dropdown.contains(event.target) && input && !input.contains(event.target)) {
    isDropdownOpen.value = false;
    
    // Validasi input saat dropdown ditutup
    if (searchProvince.value && !provinces.value.includes(searchProvince.value)) {
      // Jika input tidak valid, reset ke kosong
      searchProvince.value = '';
      location.value = '';
    }
  }
};

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener('click', closeDropdownOnOutsideClick);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick);
});
</script>

<template>
    <section class="bg-[#F0EFFF] pt-9 pb-6">
        <div class="max-w-[1440px] mx-auto px-4 md:px-8 2xl:px-0">
            <div class="flex flex-col items-center mb-10 mt-12 text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-3 font-['Be_Vietnam_Pro']">
                    Find your <span class="text-[#2F27CE]">IT jobs</span>
                </h1>
                <p class="text-gray-600 text-base md:text-lg font-['Be_Vietnam_Pro'] max-w-[90%] md:max-w-none">
                    Temukan pekerjaan IT yang paling cocok dengan diri Anda
                </p>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 mb-12 max-w-7xl mx-auto">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1 relative">
                        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            v-model="jobQuery"
                            @keyup.enter="handleEnterKey"
                            class="pl-10 pr-3 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F27CE] focus:border-[#2F27CE]"
                            placeholder="Masukkan Judul Pekerjaan, Skill, Perusahaan ....." 
                        />
                    </div>

                    <div class="flex-1 relative">
                        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        
                        <!-- UBAH: Tambah loading state untuk input -->
                        <input 
                            id="provinceInput"
                            type="text" 
                            v-model="searchProvince"
                            @keyup.enter="handleEnterKey"
                            :disabled="isLoadingProvinces"
                            class="pl-10 pr-10 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F27CE] focus:border-[#2F27CE] disabled:bg-gray-100 disabled:cursor-not-allowed"
                            :placeholder="isLoadingProvinces ? 'Loading provinces...' : 'Masukkan Provinsi .....'"
                            @focus="!isLoadingProvinces && (isDropdownOpen = true)"
                            @click="!isLoadingProvinces && (isDropdownOpen = true)"
                        />
                        
                        <!-- Loading spinner -->
                        <div v-if="isLoadingProvinces" class="absolute inset-y-0 right-3 flex items-center">
                            <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        
                        <!-- Dropdown arrow -->
                        <div v-else
                            class="absolute inset-y-0 right-3 flex items-center cursor-pointer" 
                            @click.stop="isDropdownOpen = !isDropdownOpen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                class="h-6 w-6 text-gray-400 transition-transform" 
                                :class="{ 'rotate-180': isDropdownOpen }"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        
                        <!-- Dropdown for provinces -->
                        <div id="provinceDropdown" v-if="isDropdownOpen && !isLoadingProvinces" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <div v-if="filteredProvinces.length === 0" class="p-3 text-center text-gray-500">
                                Provinsi tidak ditemukan
                            </div>
                            <ul v-else>
                                <li v-for="province in filteredProvinces" :key="province" 
                                    @click="selectProvince(province)"
                                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    {{ province }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button 
                        @click="handleSearch"
                        :disabled="isLoadingProvinces"
                        class="bg-[#2F27CE] text-white px-8 py-3 rounded-md font-bold hover:bg-[#261fb3] transition-colors inline-block text-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

body {
    font-family: 'Be Vietnam Pro', sans-serif;
}
</style>
