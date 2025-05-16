<script setup>
import { ref, defineProps, computed, watchEffect, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { clearDummyUser } from '../../utils/setupDummyUser';
import { getFromStorage, removeFromStorage } from '../../utils/localStorage';

const router = useRouter();
const route = useRoute();

// Define props for navbar state (now optional as we'll compute it dynamically)
const props = defineProps({
  navbarState: {
    type: String,
    default: null, // Will be computed if not provided
  },
  userName: {
    type: String,
    default: ''
  },
  userAvatar: {
    type: String,
    default: ''
  }
});

// Check authentication status from localStorage safely
const isAuthenticated = computed(() => {
  return !!getFromStorage('user-id');
});

// Determine navbar state based on authentication, props, and current route
const effectiveNavbarState = computed(() => {
  // Always prioritize explicit navbarState prop if provided
  if (props.navbarState) return props.navbarState;
  
  // Alternatively, check if we're on a register-related route
  if (route.path.includes('/register')) return 'register';
  
  // Otherwise determine based on authentication status
  return isAuthenticated.value ? 'auth' : 'guest';
});

// For profile dropdown
const isDropdownOpen = ref(false);

// Track the current active navigation item - initialize as empty, will be set by computed
const activeNavItem = ref('');

const isMobileMenuOpen = ref(false);

const navItems = {
  guest: [
    { id: 'jobs', label: 'Cari Pekerjaan', route: '/' },
    // Add more items as needed
  ],
  register: [], // No nav items in register state
  auth: [
    { id: 'jobs', label: 'Cari Pekerjaan', route: '/home' },
    { id: 'rekomendasi', label: 'Rekomendasi untuk Anda', route: '/recommendation' },
    // Add more items as needed
  ]
};

// Use computed property for navigation items based on effective state
const currentNavItems = computed(() => navItems[effectiveNavbarState.value] || []);

// Computed property to determine the active item based on current route
const determineActiveItem = computed(() => {
  if (route.path.includes('/recommendation')) {
    return 'rekomendasi';
  }
  if (route.path === '/home' || route.path === '/home/job-search') {
    return 'jobs';
  }
  // Return null to indicate no active item when on other pages
  return null;
});

// Watch for route changes and update active item
watch(() => route.path, () => {
  activeNavItem.value = determineActiveItem.value;
}, { immediate: true });

// Update active item on mounted
onMounted(() => {
  activeNavItem.value = determineActiveItem.value;
});

// Logout function
const handleLogout = () => {
  removeFromStorage('user-id');
  removeFromStorage('user-name');
  removeFromStorage('user-token');
  removeFromStorage('token-expired-date');
  
  closeDropdown();
  router.push('/');
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// Handle nav item click with routing
const handleNavItemClick = (item) => {
  activeNavItem.value = item.id;
  if (item.route) {
    router.push(item.route);
  }
};

// User name with safer localStorage access
const userName = computed(() => {
  return props.userName || getFromStorage('user-name') || 'Afyar Siti Ababil';
});
</script>

<template>
  <nav class="w-full h-[70px] flex justify-center shadow-sm bg-white">
    <div class="w-full max-w-[1440px] h-full flex items-center justify-between px-4 md:px-8 2xl:px-0">
      <div class="flex items-center h-full">
        <!-- Logo - Updated to use image asset -->
        <div class="flex items-center mr-8">
          <img 
            src="../../assets/LogoTalentMatching.png" 
            alt="TalentMatch Logo" 
            class="w-auto h-8 mr-2"
          />
        </div>
        
        <!-- Desktop Navigation Items - Only for guest and auth states -->
        <ul v-if="effectiveNavbarState !== 'register'" class="hidden md:flex h-full">
          <li 
            v-for="item in currentNavItems" 
            :key="item.id" 
            @click="handleNavItemClick(item)"
            class="cursor-pointer font-epilogue text-base font-medium pr-6 h-full relative flex items-center justify-center"
            :class="activeNavItem === item.id ? 'text-[#2F27CE]' : 'text-gray-500'"
          >
            <span class="relative">
              {{ item.label }}
              <div 
                v-if="activeNavItem === item.id"
                class="absolute -bottom-6 left-0 w-full h-[3px] bg-[#2F27CE]"
              ></div>
            </span>
          </li>
        </ul>
      </div>
      
      <!-- Auth Buttons - Guest State -->
      <div v-if="effectiveNavbarState === 'guest'" class="hidden md:flex gap-4">
        <router-link to="/login" class="font-be-vietnam-pro bg-[#2F27CE] text-white font-bold px-6 py-2 rounded-md hover:bg-[#261fb3] transition-colors border border-[#2F27CE]">
          Login
        </router-link>
        <div class="h-10 w-px bg-gray-300 self-center"></div>
        <router-link to="/register" class="font-be-vietnam-pro text-[#2F27CE] font-bold px-6 py-2 rounded-md hover:bg-[#2F27CE]/5 transition-colors border border-[#2F27CE]">
          Register
        </router-link>
      </div>
      
      <!-- Authenticated User View -->
      <div v-else-if="effectiveNavbarState === 'auth'" class="hidden md:flex items-center gap-3 cursor-pointer relative">
        <div class="flex items-center gap-3" @click="toggleDropdown">
          <div class="flex flex-col">
            <span class="font-epilogue font-semibold text-black text-lg">{{ userName }}</span>
            <span class="font-epilogue font-semibold text-right text-sm text-[#5D5FEF]">Selamat Datang!</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-12 h-12 rounded-full overflow-hidden">
              <img v-if="userAvatar" :src="userAvatar" alt="User Profile" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                <img src="https://i.pravatar.cc/100" alt="Default profile" class="w-full h-full object-cover">
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <!-- Profile Dropdown -->
        <div v-if="isDropdownOpen" class="absolute right-0 top-full mt-3 w-auto min-w-[120px] rounded-lg shadow-lg bg-white z-50 overflow-hidden">
          <div class="flex flex-col m-2">
            <router-link to="/edit-profil" class="px-4 py-1 font-bold text-base font-epilogue text-left text-gray-800 hover:bg-[#EEF0FF] transition-colors rounded-md mb-2">
              Profil
            </router-link>
            <router-link to="/bookmark" class="px-4 py-1 font-bold text-base font-epilogue text-left text-gray-800 hover:bg-[#EEF0FF] transition-colors rounded-md mb-2">
              Bookmark
            </router-link>
            <router-link to="/ubah-password" class="px-4 py-1 font-bold text-base font-epilogue text-left text-gray-800 hover:bg-[#EEF0FF] transition-colors rounded-md mb-2">
              Ubah Password
            </router-link>
            <button 
              @click="handleLogout"
              class="px-4 py-1 text-left font-bold text-base font-epilogue text-[#FF6161] hover:bg-[#EEF0FF] transition-colors rounded-md"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Menu Button - Only for guest and auth states -->
      <button 
        v-if="effectiveNavbarState !== 'register'"
        @click="toggleMobileMenu" 
        class="md:hidden text-[#2F27CE] p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  </nav>
  
  <!-- Mobile Menu -->
  <div 
    v-if="isMobileMenuOpen && effectiveNavbarState !== 'register'" 
    class="md:hidden fixed inset-0 z-50 bg-white"
  >
    <div class="flex flex-col p-4">
      <!-- Mobile Menu Header - Also update logo here -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <img 
            src="../../assets/LogoTalentMatching.png" 
            alt="TalentMatch Logo" 
            class="w-auto h-8 mr-2"
          />
          <div class="font-bold text-2xl text-[#2F27CE]">TalentMatch</div>
        </div>
        <button @click="toggleMobileMenu" class="text-[#2F27CE] p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Navigation Items -->
      <ul class="flex flex-col space-y-4 mb-6">
        <li 
          v-for="item in currentNavItems" 
          :key="item.id" 
          @click="handleNavItemClick(item); toggleMobileMenu();"
          class="cursor-pointer font-epilogue text-lg font-medium p-2"
          :class="activeNavItem === item.id ? 'text-[#2F27CE] bg-[#2F27CE]/5 rounded-md' : 'text-gray-500'"
        >
          {{ item.label }}
        </li>
      </ul>
      
      <!-- Mobile Auth Buttons - Guest State -->
      <div v-if="effectiveNavbarState === 'guest'" class="flex flex-col space-y-3">
        <router-link to="/login" class="font-be-vietnam-pro bg-[#2F27CE] text-white font-bold px-6 py-3 rounded-md hover:bg-[#261fb3] transition-colors border border-[#2F27CE] text-center">
          Login
        </router-link>
        <router-link to="/register" class="font-be-vietnam-pro text-[#2F27CE] font-bold px-6 py-3 rounded-md hover:bg-[#2F27CE]/5 transition-colors border border-[#2F27CE] text-center">
          Register
        </router-link>
      </div>
      
      <!-- Mobile Auth User View -->
      <div v-else-if="effectiveNavbarState === 'auth'" class="flex flex-col w-full">
        <div class="flex items-center p-2 mb-4" @click="toggleDropdown">
          <div class="flex flex-col">
            <span class="font-epilogue font-semibold text-black text-lg">{{ userName }}</span>
            <span class="font-epilogue text-sm text-[#5D5FEF]">Selamat Datang!</span>
          </div>
          <div class="ml-auto flex items-center gap-2">
            <div class="w-12 h-12 rounded-full overflow-hidden">
              <img v-if="userAvatar" :src="userAvatar" alt="User Profile" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                <img src="https://i.pravatar.cc/100" alt="Default profile" class="w-full h-full object-cover">
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <!-- Mobile Profile Options -->
        <div v-if="isDropdownOpen" class="w-full rounded-lg bg-white shadow-md overflow-hidden">
          <div class="flex flex-col m-2">
            <a href="#" class="px-4 py-3 text-base font-epilogue text-left text-gray-800 bg-[#EEF0FF] hover:bg-[#E1E3FF] transition-colors rounded-md mb-2">
              Profil
            </a>
            <a href="#" class="px-4 py-3 text-base font-epilogue text-left text-gray-800 hover:bg-gray-100 transition-colors rounded-md mb-2">
              Bookmark
            </a>
            <button
              @click="handleLogout" 
              class="px-4 py-3 text-left text-base font-epilogue text-[#FF6161] hover:bg-red-50 transition-colors rounded-md"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Add custom font classes to extend Tailwind */
.font-epilogue {
  font-family: 'Epilogue', sans-serif;
}

.font-be-vietnam-pro {
  font-family: 'Be Vietnam Pro', sans-serif;
}
</style>
