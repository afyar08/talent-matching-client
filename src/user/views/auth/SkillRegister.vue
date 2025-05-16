<script setup>
import { ref, computed } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form step tracker
const currentStep = ref('skill'); // 'detail' or 'skill'

// Skills management
const searchQuery = ref('');
const selectedSkills = ref([]);
const MAX_SKILLS = 5;
const showDropdown = ref(false);

// Demo list of available skills
const availableSkills = ref([
  'JavaScript', 'HTML', 'CSS', 'Vue.js', 'React', 'Angular', 
  'Node.js', 'Python', 'Java', 'PHP', 'C#', 'Ruby', 
  'Swift', 'Kotlin', 'TypeScript', 'SQL', 'NoSQL', 'MongoDB',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator'
]);

// Filtered skills based on search query
const filteredSkills = computed(() => {
  if (!searchQuery.value) return [];
  
  return availableSkills.value.filter(skill => 
    skill.toLowerCase().includes(searchQuery.value.toLowerCase()) && 
    !selectedSkills.value.includes(skill)
  );
});

// Add a skill to the selected list
const addSkill = (skill) => {
  if (selectedSkills.value.length < MAX_SKILLS && !selectedSkills.value.includes(skill)) {
    selectedSkills.value.push(skill);
    searchQuery.value = '';
    showDropdown.value = false;
  }
};

// Remove a skill from the selected list
const removeSkill = (skill) => {
  selectedSkills.value = selectedSkills.value.filter(s => s !== skill);
};

// Handle form submission
const submitForm = () => {
  if (selectedSkills.value.length === 0) {
    alert('Please select at least one skill');
    return;
  }
  
  // Would typically send the data to the server here
  console.log('Selected skills:', selectedSkills.value);
  
  // Navigate to the next step (e.g., dashboard)
  router.push('/');
};

// Go back to profile details
const goBack = () => {
  router.push('/register/detail');
};

// Toggle dropdown visibility
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  
  // If showing the dropdown, focus the input
  if (showDropdown.value) {
    setTimeout(() => {
      document.getElementById('skill').focus();
    }, 100);
  }
};

// Show all available skills when dropdown opened with empty search
const displayedSkills = computed(() => {
  if (!searchQuery.value && showDropdown.value) {
    // Show all available skills not already selected
    return availableSkills.value.filter(skill => 
      !selectedSkills.value.includes(skill)
    );
  }
  
  return filteredSkills.value;
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-be-vietnam-pro bg-white">
    <!-- Navbar with auth state -->
    <Navbar navbarState="register" />
    
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
        <div class="h-0.5 bg-[#4745F6] flex-grow mx-4"></div>
        <div class="flex flex-col items-center">
          <div class="w-5 h-5 rounded-full bg-[#4745F6] text-white flex items-center justify-center">
          </div>
          <span class="mt-3 text-sm">Skill</span>
        </div>
      </div>
      
      <!-- Form Section -->
      <div class="w-full bg-white rounded-lg border border-gray-100 p-8 pt-5">
        <div class="mb-6">
          <h2 class="text-lg font-bold text-[#2D3648]">Skill</h2>
          <p class="text-gray-500 text-sm">Data skill perlu diisi untuk membantu mendapatkan rekomendasi lowongan yang paling cocok untukmu.</p>
        </div>
        
        <div class="border-t border-gray-200 my-6"></div>
        
        <form @submit.prevent="submitForm">
          <!-- Skill Search -->
          <div class="mb-6">
            <label for="skill" class="block text-sm font-medium text-gray-700 mb-1">
              Cari Skill <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="flex">
                <input
                  id="skill"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Ketik untuk mencari Skill..."
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                  @focus="showDropdown = true"
                  @keydown.escape="showDropdown = false"
                />
                <button
                  type="button"
                  class="px-3 bg-white border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                  @click="toggleDropdown"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <div 
                v-if="showDropdown && displayedSkills.length > 0" 
                class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                <ul>
                  <li 
                    v-for="skill in displayedSkills" 
                    :key="skill" 
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    @mousedown="addSkill(skill)"
                  >
                    {{ skill }}
                  </li>
                </ul>
              </div>
              
              <div v-else-if="showDropdown && searchQuery && !displayedSkills.length" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
                No skills found matching "{{ searchQuery }}"
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-2 flex justify-end">
              <span class="text-red-500 text-sm">{{ selectedSkills.length }} Skill dipilih</span>
            </div>
          </div>
          
          <!-- Selected Skills -->
          <div class="flex flex-wrap gap-2 mb-8">
            <div 
              v-for="skill in selectedSkills" 
              :key="skill"
              class="bg-[#F8F8FF] border border-[#E6E6FF] text-[#4745F6] px-3 py-1 rounded-md flex items-center"
            >
              {{ skill }}
              <button 
                type="button" 
                @click="removeSkill(skill)" 
                class="ml-2 text-[#4745F6] hover:text-[#3d3bd4]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Navigation Buttons - Both aligned to the right -->
          <div class="flex justify-end mt-8 space-x-4">
            <button
              type="button"
              class="border border-[#4745F6] text-[#4745F6] font-medium py-2.5 px-8 rounded-md hover:bg-[#F8F8FF] transition-colors"
              @click="goBack"
            >
              Sebelumnya
            </button>
            
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
