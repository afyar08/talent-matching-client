<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { useRouter } from 'vue-router';
import { setInStorage } from '../../../utils/localStorage';
import { registrationStore } from '../../../stores/registrationStore';
import { toastService } from '../../../utils/toastService';
import { authService } from '../../../services/authService';
import { skillService } from '../../../services/skillService';

const router = useRouter();

// Get registration data from store
const registrationData = computed(() => registrationStore.getRegistrationData());

// Profile detail fields - populated from store
const fullName = ref('');
const email = ref('');
const imageFile = ref(null);
const imagePreview = ref(null);

// Skills management
const searchQuery = ref('');
const selectedSkills = ref([]);
const MAX_SKILLS = 100;
const showDropdown = ref(false);
const isLoadingSkills = ref(false);

// Available skills list - loaded from database
const availableSkills = ref([]);

// Loading state for form submission
const isSubmitting = ref(false);

// Modal states
const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const registrationSuccess = ref(false);
const countdown = ref(3);
let countdownTimer = null;

// Computed property to check if no skills are selected
const isSkillEmpty = computed(() => selectedSkills.value.length === 0);

// Filtered skills based on search query
const filteredSkills = computed(() => {
  if (!searchQuery.value) return [];

  return availableSkills.value.filter(skill =>
    skill && typeof skill === 'string' &&
    skill.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    !selectedSkills.value.includes(skill)
  );
});

// Displayed skills - consolidated logic to show all available skills when dropdown opened or filtered skills
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

// Load skills from database
const loadSkills = async () => {
  try {
    isLoadingSkills.value = true;
    const response = await skillService.getAllSkills();
    availableSkills.value = (response.skills || [])
      .filter(skill => skill && typeof skill === 'string');
    console.log('Loaded skills from database:', availableSkills.value);
  } catch (error) {
    console.error('Error loading skills:', error);
    toastService.show({
      type: 'error',
      message: 'Failed to load skills from database'
    });

    // Fallback to default skills if API fails
    availableSkills.value = [
      'JavaScript', 'HTML', 'CSS', 'Vue.js', 'React', 'Angular',
      'Node.js', 'Python', 'Java', 'PHP', 'C#', 'Ruby',
      'Swift', 'Kotlin', 'TypeScript', 'SQL', 'NoSQL', 'MongoDB',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git',
      'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator'
    ];
  } finally {
    isLoadingSkills.value = false;
  }
};

// Initialize form with data from store
onMounted(async () => {
  // Check if registration data exists
  if (!registrationData.value.email) {
    // If no registration data, redirect back to register
    toastService.show({
      type: 'error',
      message: 'Please complete the registration form first'
    });
    router.push('/register');
    return;
  }

  // Populate form with registration data
  fullName.value = registrationData.value.fullName;
  email.value = registrationData.value.email;

  console.log('Loaded registration data:', registrationData.value);

  // Load skills from database
  await loadSkills();
});

// Handle image upload with preview
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toastService.show({
        type: 'error',
        message: 'Please select a valid image file (JPG, JPEG, or PNG)'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastService.show({
        type: 'error',
        message: 'File size must be less than 5MB'
      });
      return;
    }

    imageFile.value = file;

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);

    console.log('Image uploaded:', file.name);
  }
};

// Add a skill to the selected list
const addSkill = (skill) => {
  if (selectedSkills.value.length < MAX_SKILLS && !selectedSkills.value.includes(skill)) {
    selectedSkills.value.push(skill);
    searchQuery.value = '';
    showDropdown.value = false;
    console.log('Added skill:', skill);
  }
};

// Remove a skill from the selected list
const removeSkill = (skill) => {
  selectedSkills.value = selectedSkills.value.filter(s => s !== skill);
  console.log('Removed skill:', skill);
};

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;

  // If showing the dropdown, focus the input
  if (showDropdown.value) {
    setTimeout(() => {
      document.getElementById('skill')?.focus();
    }, 100);
  }
};

// Navigation handling
const goBack = () => {
  router.push('/register');
};

// Show confirmation modal before submitting
const submitForm = async () => {
  // Validate skills requirement
  if (selectedSkills.value.length === 0) {
    toastService.show({
      type: 'error',
      message: 'Please select at least one skill'
    });
    return;
  }

  // Show confirmation modal instead of submitting immediately
  showConfirmModal.value = true;
};

// Close the confirmation modal
const closeConfirmModal = () => {
  showConfirmModal.value = false;
};

// Start countdown timer for redirect
const startCountdown = () => {
  countdown.value = 3;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      router.push('/home');
    }
  }, 1000);
};

// Handle actual form submission after confirmation
const confirmSubmit = async () => {
  try {
    isSubmitting.value = true;

    // Prepare FormData for multipart/form-data
    const formData = new FormData();
    formData.append('name', fullName.value);
    formData.append('email', registrationData.value.email);
    formData.append('password', registrationData.value.password);
    formData.append('role', 'user');

    // Add skills as JSON array
    selectedSkills.value.forEach(skill => {
      formData.append('skills', skill);
    });

    // Add profile picture if uploaded (optional)
    if (imageFile.value) {
      formData.append('profile_picture', imageFile.value);
      console.log('Including profile picture in registration');
    }

    console.log('Submitting registration with skills:', selectedSkills.value);

    // Call registration API
    const response = await authService.registerWithSkills(formData);

    console.log('Registration successful:', response);

    // Registration was successful
    registrationSuccess.value = true;

    // Close confirmation modal and show success modal
    showConfirmModal.value = false;
    showSuccessModal.value = true;

    // Clear registration data from store
    registrationStore.clearRegistrationData();

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    // Get user data from the correct location in the response
    // Check if response.data exists, otherwise use response directly
    const userData = response.data?.user || response.user;

    if (!userData) {
      console.error('User data not found in response:', response);
      throw new Error('User data not found in response');
    }

    console.log("User data structure:", userData);

    // Get tokens from the correct location
    const accessToken = response.data?.tokens?.access || response.data?.access || 
                        response.tokens?.access || response.access;
    const refreshToken = response.data?.tokens?.refresh || response.data?.refresh || 
                         response.tokens?.refresh || response.refresh;

    console.log("Storing user data:", {
      uid: userData.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      profilePicture: userData.profile_picture_url
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
      console.log("Profile picture URL found:", userData.profile_picture_url);
      setInStorage('user-profile-picture', userData.profile_picture_url);

      // Test if profile picture is accessible
      try {
        const imageResponse = await fetch(userData.profile_picture_url);
        if (imageResponse.ok) {
          console.log("Profile picture is accessible");
        } else {
          console.log("Profile picture URL not accessible:", imageResponse.status);
        }
      } catch (imgError) {
        console.log("Error testing profile picture URL:", imgError);
      }
    } else {
      console.log("No profile picture URL found in response");
      // Clear any existing profile picture
      setInStorage('user-profile-picture', null);
    }

    // Start countdown for redirect
    startCountdown();

  } catch (error) {
    console.error('Registration error:', error);

    let errorMessage = 'Registration failed. Please try again.';

    // Handle different types of errors
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData.skills) {
        errorMessage = 'Skills: ' + errorData.skills[0];
      } else if (errorData.email) {
        errorMessage = 'Email: ' + errorData.email[0];
      } else if (errorData.password) {
        errorMessage = 'Password: ' + errorData.password[0];
      } else if (errorData.name) {
        errorMessage = 'Name: ' + errorData.name[0];
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check if the server is running.';
    }

    // Close confirmation modal
    showConfirmModal.value = false;

    toastService.show({
      type: 'error',
      message: errorMessage
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Watch for modal state changes to toggle body scroll
// Function to toggle body scroll
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

// Initialize body state on mount and clean up on unmount
onMounted(() => {
  if (showConfirmModal.value || showSuccessModal.value) {
    toggleBodyScroll(true);
  }
});

onUnmounted(() => {
  toggleBodyScroll(false);
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-be-vietnam-pro bg-white">
    <Navbar navbarState="register" />
    <main class="flex-grow flex flex-col items-center px-6 py-8 mt-8 max-w-screen-xl mx-auto w-full">
      <!-- Header -->
      <div class="text-center mb-6 w-full">
        <h1 class="text-5xl font-bold">
          <span class="text-[#2F27CE]">Lengkapi</span> Profil
        </h1>
      </div>

      <!-- Combined Form Section -->
      <div class="w-full bg-white rounded-lg p-6 md:p-8 pt-5 max-w-6xl mx-auto">
        <form @submit.prevent="submitForm">
          <!-- Detail Profile Section -->
          <div>
            <div class="mb-6">
              <h2 class="text-lg font-bold text-[#2D3648]">Detail Profil</h2>
              <p class="text-gray-500 text-sm">Informasi pribadi dari proses registrasi</p>
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
                <input id="profilePicture" type="file" accept="image/png, image/jpeg, image/jpg" class="hidden"
                  @change="handleImageUpload" />

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
                      <span class="text-[#4745F6] hover:underline">Click to upload</span>
                    </div>
                    <p class="text-xs text-gray-400 mt-1">PNG or JPG (max. 5MB) - Optional</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Form Fields - Disabled for Full Name and Email -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Full Name - Disabled -->
              <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input id="fullName" v-model="fullName" type="text" placeholder="Enter your full name"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled />
              </div>

              <!-- Email - Disabled -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
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
                    @focus="showDropdown = true" @keydown.escape="showDropdown = false" :disabled="isLoadingSkills" />
                  <button type="button"
                    class="px-3 bg-white border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6] disabled:bg-gray-100"
                    @click="toggleDropdown" :disabled="isLoadingSkills">
                    <svg v-if="isLoadingSkills" class="animate-spin h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none"
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

                <div v-else-if="isLoadingSkills && showDropdown"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
                  Loading skills...
                </div>
              </div>
              <div class="text-xs text-gray-500 mt-2 flex justify-between">
                <span class="text-gray-500">Minimal 1 skill harus dipilih</span>
                <span :class="selectedSkills.length >= 1 ? 'text-green-600' : 'text-red-500'"
                  class="text-sm font-medium">
                  {{ selectedSkills.length }} Skill dipilih
                </span>
              </div>
              <!-- Tambahkan warning jika skill kosong -->
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
              class="border border-[#2F27CE] text-[#2F27CE] font-medium py-2.5 px-8 rounded-md hover:bg-[#F8F8FF] transition-colors"
              :disabled="isSubmitting">
              Kembali
            </button>

            <button type="submit"
              class="bg-[#2F27CE] text-white font-medium py-2.5 px-8 rounded-md hover:bg-[#3d3bd4] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="isSubmitting || isSkillEmpty">
              <span v-if="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Registering...
              </span>
              <span v-else>Register</span>
            </button>
          </div>
        </form>
      </div>
    </main>
    <Footer />

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Konfirmasi Pendaftaran</h3>
        <p class="text-gray-700 mb-6">Proses registrasi memakan waktu estimasi 5-10 menit. Apakah anda yakin ingin
          melanjutkan pendaftaran?</p>

        <div class="flex justify-end gap-4">
          <button @click="closeConfirmModal" type="button"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50" :disabled="isSubmitting">
            Batal
          </button>
          <button @click="confirmSubmit" type="button"
            class="px-4 py-2 bg-[#2F27CE] text-white rounded-md hover:bg-[#3d3bd4] disabled:bg-gray-400"
            :disabled="isSubmitting">
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Processing...
            </span>
            <span v-else>Ya, Daftar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl text-center">
        <!-- Green checkmark -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-2">Registrasi Berhasil!</h3>
        <p class="text-gray-700 mb-6">Akun anda telah berhasil dibuat. Silahkan login dengan email dan password anda.
        </p>

        <p class="text-sm text-gray-500">
          Redirecting to login in {{ countdown }} seconds...
        </p>
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
  padding-right: 15px;
  /* Prevent layout shift when scrollbar disappears */
}
</style>
