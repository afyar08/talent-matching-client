<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const jobQuery = ref('');
const location = ref('');
const searchProvince = ref('');
const isDropdownOpen = ref(false);

// List of provinces in Indonesia
const provinces = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Timur',
    'Jawa Tengah',
    'Sumatera Utara',
    'Bali',
    'Sulawesi Selatan',
    'Banten',
    'Yogyakarta',
    'Kalimantan Timur'
];

// Filtered provinces based on search
const filteredProvinces = computed(() => {
    if (!searchProvince.value) return provinces;
    return provinces.filter(province => 
        province.toLowerCase().includes(searchProvince.value.toLowerCase())
    );
});

const selectProvince = (province) => {
    location.value = province;
    searchProvince.value = province;
    isDropdownOpen.value = false;
};

const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', jobQuery.value, 'in', location.value);
};

// Additional code to handle clicking outside the dropdown to close it
const closeDropdownOnOutsideClick = (event) => {
  const dropdown = document.getElementById('provinceDropdown');
  const input = document.getElementById('provinceInput');
  if (dropdown && !dropdown.contains(event.target) && input && !input.contains(event.target)) {
    isDropdownOpen.value = false;
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
                        <input type="text" v-model="jobQuery"
                            class="pl-10 pr-3 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F27CE] focus:border-[#2F27CE]"
                            placeholder="Masukkan Judul Pekerjaan, Skill, Perusahaan ....." />
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
                        <input 
                            id="provinceInput"
                            type="text" 
                            v-model="searchProvince"
                            class="pl-10 pr-10 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F27CE] focus:border-[#2F27CE]"
                            placeholder="Masukkan Provinsi ....."
                            @focus="isDropdownOpen = true"
                            @click="isDropdownOpen = true"
                        />
                        <div 
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
                        <div id="provinceDropdown" v-if="isDropdownOpen" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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

                    <button @click="handleSearch"
                        class="bg-[#2F27CE] text-white px-8 py-3 rounded-md font-bold hover:bg-[#261fb3] transition-colors">
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
