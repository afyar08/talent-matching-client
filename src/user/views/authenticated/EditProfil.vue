<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { authService } from '../../../services/authService';
import { skillService } from '../../../services/skillService';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';
import { setInStorage } from '../../../utils/localStorage';

const router = useRouter();

const fullName = ref('');
const email = ref('');
const imageFile = ref(null);
const imagePreview = ref('');
const searchQuery = ref('');
const selectedSkills = ref([]);
const MAX_SKILLS = 100;
const showDropdown = ref(false);
const isLoadingSkills = ref(false);
const availableSkills = ref([]);
const originalProfile = ref(null); // <-- simpan data asli

const isSkillEmpty = computed(() => selectedSkills.value.length === 0);

// Fungsi membandingkan array skill
function isSameSkills(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  // Bandingkan isi array tanpa urutan
  return [...a].sort().join(',') === [...b].sort().join(',');
}

// Cek perubahan
const hasChanges = computed(() => {
  if (!originalProfile.value) return false;
  if (isSkillEmpty.value) return false;
  if (fullName.value !== originalProfile.value.name) return true;
  if (!isSameSkills(selectedSkills.value, originalProfile.value.skills)) return true;
  // Jika user upload gambar baru
  if (imageFile.value) return true;
  return false;
});

// Check if skills have been modified
const skillsChanged = computed(() => {
  if (!originalProfile.value || !originalProfile.value.skills) return false;
  return !isSameSkills(selectedSkills.value, originalProfile.value.skills);
});

// Handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
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
    // Show all available skills not already selected when dropdown is open with empty search
    return availableSkills.value.filter(skill =>
      skill && typeof skill === 'string' &&
      !selectedSkills.value.includes(skill)
    );
  }

  // Show filtered skills when user is typing
  return filteredSkills.value;
});

// Filtered skills based on search query
const filteredSkills = computed(() => {
  if (!searchQuery.value) return [];

  return availableSkills.value.filter(skill =>
    skill && typeof skill === 'string' &&
    skill.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    !selectedSkills.value.includes(skill)
  );
});

// Store initial values to detect changes
const initialValues = {
  fullName: 'John Doe',
  email: 'johndoe@gmail.com',
  skills: ['JavaScript', 'React', 'Node.js'],
  imageUrl: 'https://randomuser.me/api/portraits/men/36.jpg'
};

// Modal states
const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const isSubmitting = ref(false);

// Toggle body scroll function
const toggleBodyScroll = (disable) => {
  if (disable) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
};

// Watch both modals and disable scrolling when either is shown
watch(
  [showConfirmModal, showSuccessModal],
  ([confirmVisible, successVisible]) => {
    toggleBodyScroll(confirmVisible || successVisible);
  }
);

// Close the confirmation modal
const closeConfirmModal = () => {
  showConfirmModal.value = false;
};

// Navigation handling - this function is missing in original code
const goBack = () => {
  router.go(-1);
};

// Update form submission to show confirmation modal first
const submitForm = () => {
  if (!email.value) {
    return;
  }
  
  // Show confirmation modal
  showConfirmModal.value = true;
};

// Actual form submission after confirmation
const confirmSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    const response = await authService.updateProfile({
      name: fullName.value,
      skills: selectedSkills.value,
      profile_image: imageFile.value
    });

    // Update localStorage jika response sukses
    console.log('Response from updateProfile:', response);
    if (response) {
      setInStorage('user-email', response.email || email.value);
      setInStorage('user-name', response.name || fullName.value);
      console.log('Profile updated successfully:', response);
      // Always update profile picture URL if it's in the response
      if (response.profile_image_url) {
        console.log('Saving profile picture URL to localStorage:', response.profile_image_url);
        setInStorage('user-profile-picture', response.profile_image_url);
      }
    }

    // Close confirmation modal and show success modal
    showConfirmModal.value = false;
    showSuccessModal.value = true;
    
    // Auto reload after 1 second
    setTimeout(() => {
      window.location.reload();
    }, 5000);
    
  } catch (error) {
    console.error(error);
    showConfirmModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

// Clean up on unmount
onUnmounted(() => {
  toggleBodyScroll(false);
});

// Load default profile data
const loadSkills = async () => {
  try {
    isLoadingSkills.value = true;
    const response = await skillService.getAllSkills();
    availableSkills.value = (response.data.skills || []).map(skill => skill.name);
  } catch (error) {
    availableSkills.value = [];
    console.error('Failed to load skills:', error);
    // Optional: tampilkan error toast
  } finally {
    isLoadingSkills.value = false;
  }
};

onMounted(async () => {
  try {
    const data = await authService.getDefaultProfile();
    console.log('Default profile data loaded:', data.data);
    fullName.value = data.name || '';
    email.value = data.email || '';
    selectedSkills.value = data.skills || [];
    imagePreview.value = data.profile_image_url
      ? (data.profile_image_url.startsWith('http') 
         ? data.profile_image_url 
         : `http://localhost:8000${data.profile_image_url}`)
      : 'https://randomuser.me/api/portraits/men/36.jpg';
    originalProfile.value = {
      name: data.name || '',
      skills: [...(data.skills || [])],
      imageUrl: 'https://randomuser.me/api/portraits/men/36.jpg'
    };
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
  await loadSkills();
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-be-vietnam-pro bg-white">
    <Navbar />

    <main class="flex-grow flex flex-col items-center px-6 py-8 mt-8 max-w-screen-xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-6 w-full">
        <h1 class="text-5xl font-bold">
          <span class="text-[#2F27CE]">Profile</span> Information
        </h1>
      </div>

      <!-- Combined Form Section - Increased width -->
      <div class="w-full bg-white rounded-lg p-6 md:p-8 pt-5 max-w-6xl mx-auto">
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
                <img :src="imagePreview || 'https://randomuser.me/api/portraits/men/36.jpg'" alt="Profile Picture"
                  class="w-24 h-24 rounded-full object-cover border border-gray-200" />
              </div>

              <!-- Upload container -->
              <div class="w-full max-w-md">
                <!-- Hide the file input but keep it in the DOM -->
                <input id="profilePicture" type="file" accept="image/png, image/jpeg, image/jpg, image/gif"
                  class="hidden" @change="handleImageUpload" />

                <!-- Make the entire container a label for the hidden input -->
                <label for="profilePicture" class="cursor-pointer">
                  <div
                    class="border border-dashed border-[#4745F6] p-6 rounded bg-[#F8F8FF] flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#4745F6] mb-2" viewBox="0 0 20 20"
                      fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                    <div>
                      <span class="text-[#4745F6] hover:underline">Click to replace</span>
                    </div>
                    <p class="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 400 x 400px)</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Full Name -->
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input id="fullName" v-model="fullName" type="text" placeholder="Enter your full name"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                  required />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="blocktext-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input id="email" v-model="email" type="email" placeholder="Enter your email"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled />
              </div>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="mt-10">
            <div class="mb-6">
              <h2 class="text-lg font-bold text-[#2D3648]">Skill</h2>
              <p class="text-gray-500 text-sm">Data skill perlu diisi untuk membantu mendapatkan rekomendasi lowongan
                yang paling cocok untukmu.</p>
            </div>

            <div class="border-t border-gray-200 my-6"></div>

            <!-- Skill Search -->
            <div class="mb-6">
              <label for="skill" class="block text-sm font-medium text-gray-700 mb-1">
                Cari Skill <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="flex">
                  <input id="skill" v-model="searchQuery" type="text" placeholder="Ketik untuk mencari Skill..."
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                    @focus="showDropdown = true" @keydown.escape="showDropdown = false" />
                  <button type="button"
                    class="px-3 bg-white border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                    @click="toggleDropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div v-if="showDropdown && displayedSkills.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <ul>
                    <li v-for="skill in displayedSkills" :key="skill" class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      @mousedown="addSkill(skill)">
                      {{ skill }}
                    </li>
                  </ul>
                </div>

                <div v-else-if="showDropdown && searchQuery && !displayedSkills.length"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
                  No skills found matching "{{ searchQuery }}"
                </div>
              </div>
              <div class="text-xs text-gray-500 mt-2 flex justify-end">
                <span :class="selectedSkills.length >= 1 ? 'text-green-600' : 'text-red-500'" class="text-sm font-medium">
                  {{ selectedSkills.length }} Skill dipilih
                </span>
              </div>

              <!-- Skill kosong warning -->
              <div v-if="isSkillEmpty" class="w-full mt-2">
                <div class="border border-red-500 bg-red-50 text-red-600 rounded-md px-4 py-2 text-sm text-center">
                  Skill Tidak Boleh Kosong
                </div>
              </div>
            </div>

            <!-- Selected Skills -->
            <div class="flex flex-wrap gap-2 mb-8">
              <div v-for="skill in selectedSkills" :key="skill"
                class="bg-[#F8F8FF] border border-[#E6E6FF] text-[#4745F6] px-3 py-1 rounded-md flex items-center">
                {{ skill }}
                <button type="button" @click="removeSkill(skill)" class="ml-2 text-[#4745F6] hover:text-[#3d3bd4]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex justify-end mt-8 space-x-4">
            <button type="button" @click="goBack"
              class="border border-[#2F27CE] text-[#2F27CE] font-medium py-2.5 px-8 rounded-md hover:bg-[#F8F8FF] transition-colors">
              Kembali
            </button>

            <button type="button" @click="submitForm"
              class="bg-[#2F27CE] text-white font-medium py-2.5 px-8 rounded-md hover:bg-[#3d3bd4] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="!hasChanges">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </main>
    <Footer />

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Konfirmasi Perubahan</h3>
        <p class="text-gray-700 mb-6" v-if="skillsChanged">
          Proses update skill memakan waktu estimasi 5-10 menit. Apakah anda yakin ingin menyimpan perubahan profil?
        </p>
        <p class="text-gray-700 mb-6" v-else>
          Apakah anda yakin ingin menyimpan perubahan profil?
        </p>
        
        <div class="flex justify-end gap-4">
          <button 
            @click="closeConfirmModal" 
            type="button"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            :disabled="isSubmitting"
          >
            Batal
          </button>
          <button 
            @click="confirmSubmit" 
            type="button"
            class="px-4 py-2 bg-[#2F27CE] text-white rounded-md hover:bg-[#3d3bd4] disabled:bg-gray-400"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Ya, Simpan</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl text-center">
        <!-- Green checkmark -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h3 class="text-lg font-bold text-gray-900 mb-2">Perubahan Berhasil!</h3>
        <p class="text-gray-700">Profil anda telah berhasil diperbarui.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-be-vietnam-pro {
  font-family: 'Be Vietnam Pro', sans-serif;
}

/* Add global styles using :global for body when modals are open */
:global(.overflow-hidden) {
  overflow: hidden;
  padding-right: 15px; /* Prevent layout shift when scrollbar disappears */
}
</style>
