<script setup>
import { ref, computed } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Profile detail fields with default values
const fullName = ref('John Doe');
const email = ref('johndoe@gmail.com');
const dateOfBirth = ref('1995-08-15');
const gender = ref('Pria');
const province = ref('DKI Jakarta');
const imageFile = ref(null);
const imagePreview = ref('https://randomuser.me/api/portraits/men/36.jpg');

// Province options
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

// Skills management with default values
const searchQuery = ref('');
const selectedSkills = ref(['JavaScript', 'React', 'Node.js']);
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

// Handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

// Validate date of birth
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

// Store initial values to detect changes
const initialValues = {
  fullName: 'John Doe',
  dateOfBirth: '1995-08-15',
  gender: 'Pria',
  province: 'DKI Jakarta',
  skills: ['JavaScript', 'React', 'Node.js'],
  imageUrl: 'https://randomuser.me/api/portraits/men/36.jpg'
};

// Check if any changes were made to the form
const hasChanges = computed(() => {
  // Check basic fields
  if (fullName.value !== initialValues.fullName) return true;
  if (dateOfBirth.value !== initialValues.dateOfBirth) return true;
  if (gender.value !== initialValues.gender) return true;
  if (province.value !== initialValues.province) return true;
  if (imagePreview.value !== initialValues.imageUrl && imageFile.value !== null) return true;
  
  // Check if skills were added or removed
  if (selectedSkills.value.length !== initialValues.skills.length) return true;
  
  // Check if skill content changed
  for (const skill of selectedSkills.value) {
    if (!initialValues.skills.includes(skill)) return true;
  }
  
  return false;
});

// Function to handle "Kembali" button click
const goBack = () => {
  router.push('/home');
};

// Final submission - update to reload page instead of redirecting
const submitForm = () => {
  if (selectedSkills.value.length === 0) {
    alert('Please select at least one skill');
    return;
  }
  
  // Would typically send the combined data to the server here
  console.log('Profile details:', {
    fullName: fullName.value,
    email: email.value,
    dateOfBirth: dateOfBirth.value,
    gender: gender.value,
    province: province.value,
    profileImage: imageFile.value,
    skills: selectedSkills.value
  });
  
  // If changes were made, reload the page to show updated data
  if (hasChanges.value) {
    // Reload current page instead of redirecting
    window.location.reload();
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col font-be-vietnam-pro bg-white">
    <Navbar />
    
    <main class="flex-grow flex flex-col items-center px-6 py-8 mt-8 max-w-screen-xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-6 w-full">
        <h1 class="text-4xl font-bold">
          <span class="text-[#4745F6]">Profile</span> Information
        </h1>
      </div>
      
      <!-- Combined Form Section -->
      <div class="w-full bg-white rounded-lg p-8 pt-5 max-w-4xl mx-auto">
        <form @submit.prevent="submitForm">
          <!-- Detail Profile Section -->
          <div>
            <div class="mb-6">
              <h2 class="text-lg font-bold text-[#2D3648]">Detail Profil</h2>
              <p class="text-gray-500 text-sm">Informasi pribadi wajib diisi dan dapat diubah kapan saja</p>
            </div>
            
            <div class="border-t border-gray-200 my-6"></div>
            
            <!-- Profile Picture Section -->
            <div class="flex flex-row items-center justify-center gap-8 mb-7">
              <!-- Profile picture -->
              <div>
                <img 
                  :src="imagePreview" 
                  alt="Profile Picture" 
                  class="w-24 h-24 rounded-full object-cover border border-gray-200"
                />
              </div>
              
              <!-- Upload container -->
              <div class="w-full max-w-md">
                <!-- Hide the file input but keep it in the DOM -->
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  class="hidden"
                  @change="handleImageUpload"
                />
                
                <!-- Make the entire container a label for the hidden input -->
                <label for="profilePicture" class="cursor-pointer">
                  <div class="border border-dashed border-[#4745F6] p-6 rounded bg-[#F8F8FF] flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#4745F6] mb-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <span class="text-[#4745F6] hover:underline">Click to replace</span> or drag and drop
                    </div>
                    <p class="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 400 x 400px)</p>
                  </div>
                </label>
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
                    <option value="" disabled>Pilih Gender</option>
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
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    <option value="" disabled>Pilih Provinsi</option>
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
          </div>
          
          <!-- Skills Section -->
          <div class="mt-10">
            <div class="mb-6">
              <h2 class="text-lg font-bold text-[#2D3648]">Skill</h2>
              <p class="text-gray-500 text-sm">Data skill perlu diisi untuk membantu mendapatkan rekomendasi lowongan yang paling cocok untukmu.</p>
            </div>
            
            <div class="border-t border-gray-200 my-6"></div>
            
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
          </div>
          
          <!-- Submit Buttons -->
          <div class="flex justify-end mt-8 space-x-4">
            <button
              type="button"
              @click="goBack"
              class="border border-[#4745F6] text-[#4745F6] font-medium py-2.5 px-8 rounded-md hover:bg-[#F8F8FF] transition-colors"
            >
              Kembali
            </button>
            
            <button
              type="submit"
              class="bg-[#4745F6] text-white font-medium py-2.5 px-8 rounded-md hover:bg-[#3d3bd4] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="!hasChanges"
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
