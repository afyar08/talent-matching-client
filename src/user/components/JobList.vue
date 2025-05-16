<script setup>
import { ref, computed, onMounted, defineProps, watch } from 'vue';
import { getFromStorage } from '../../utils/localStorage';
import { useRoute } from 'vue-router';

// Get current route to check if we're on recommendation page
const route = useRoute();

// Check if we're on the recommendation page
const isRecommendationPage = computed(() => {
  return route.path.includes('/recommendation');
});

// Format similarity score as percentage
const formatMatchPercentage = (score) => {
  // Convert decimal to percentage and round to nearest integer
  return Math.round(score * 100) + '%';
};

// Accept filter props from parent component
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      salaryMin: '',
      salaryMax: '',
      jobTypes: [],
      workArrangements: [],
      experiences: [],
      educationLevels: [],
      job: '',
      location: ''
    })
  },
  bookmarkedOnly: {
    type: Boolean,
    default: false
  }
});

// State for jobs and pagination
const jobs = ref([]);
const filteredJobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const isLoading = ref(true);
const error = ref(null);

// Add state to track bookmarked jobs
const bookmarkedJobs = ref({});

// Toggle bookmark status for a job
const toggleBookmark = (jobId) => {
  // If on bookmarked page, removing a bookmark should remove the job from the list
  if (props.bookmarkedOnly && bookmarkedJobs.value[jobId]) {
    // Remove job from the list
    filteredJobs.value = filteredJobs.value.filter(job => job.id !== jobId);
    jobs.value = jobs.value.filter(job => job.id !== jobId);
    bookmarkedJobs.value[jobId] = false;
  } else {
    // Regular toggle behavior
    bookmarkedJobs.value[jobId] = !bookmarkedJobs.value[jobId];
  }
};

// Add check for user authentication status
const isAuthenticated = computed(() => {
  return !!getFromStorage('user-id');
});

// Computed property for the detail page route
const getDetailRoute = computed(() => {
  return isAuthenticated.value ? '/home/detail-job' : '/detail-job';
});

// // Watch for filter changes and apply filtering
// watch(() => props.filters, (newFilters) => {
//   applyFilters(newFilters);
// }, { deep: true });

// Apply filters to the jobs list - remove job and location filtering
const applyFilters = (filters) => {
  if (!jobs.value.length) return;
  
  filteredJobs.value = jobs.value.filter(job => {
    // REMOVED: No longer filter by job search term
    // REMOVED: No longer filter by location
    
    // Filter by salary range if provided
    if (filters.salaryMin && job.salary_min) {
      if (parseFloat(job.salary_min) < parseFloat(filters.salaryMin)) {
        return false;
      }
    }
    
    if (filters.salaryMax && job.salary_max) {
      if (parseFloat(job.salary_max) > parseFloat(filters.salaryMax)) {
        return false;
      }
    }
    
    // Additional filters can be implemented here for other criteria
    
    return true;
  });
  
  // Reset to first page when filters change
  currentPage.value = 1;
};

// Computed properties for pagination - now based on filtered jobs
const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage));
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredJobs.value.slice(start, end);
});

// Format salary from number to display format
const formatSalary = (min, max) => {
  if (!min && !max) return 'Salary not disclosed';
  
  const formatNumber = (num) => {
    if (!num) return '';
    // Convert to millions (divide by 1,000,000)
    const inMillions = num / 1000000;
    return `${inMillions}`;
  };

  if (min && max) {
    return `Rp ${formatNumber(min)}-${formatNumber(max)} Jt`;
  } else if (min) {
    return `Rp ${formatNumber(min)} Jt+`;
  } else if (max) {
    return `Up to Rp ${formatNumber(max)} Jt`;
  }
};

// Format required skills based on total character length
const formatSkills = (skills) => {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return { displayed: [], more: 0 };
  }
  
  const MAX_CHARS = 20; // Maximum total character length for displayed skills
  
  // Sort skills by length (optional, to prioritize shorter skills)
  const sortedSkills = [...skills].sort((a, b) => a.length - b.length);
  
  let displayedSkills = [];
  let currentLength = 0;
  let skillIndex = 0;
  
  // Add skills until we reach the max character limit
  while (skillIndex < sortedSkills.length) {
    const skill = sortedSkills[skillIndex];
    // Add 1 for some buffer space between skills
    if (currentLength + skill.length + 1 <= MAX_CHARS || displayedSkills.length === 0) {
      displayedSkills.push(skill);
      currentLength += skill.length + 1;
      skillIndex++;
    } else {
      break;
    }
    
    // Stop after adding max 2 skills, even if we have character space left
    if (displayedSkills.length >= 2) {
      break;
    }
  }
  
  const moreCount = skills.length - displayedSkills.length;
  
  return { displayed: displayedSkills, more: moreCount };
};

// Load jobs data from JSON file or use bookmark data if bookmarkedOnly is true
const loadJobs = async () => {
  try {
    isLoading.value = true;
    
    let data;
    
    if (props.bookmarkedOnly) {
      // Mock bookmark data (in a real app, this would come from an API or localStorage)
      const response = await fetch('../../../bookmark.json');
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarked jobs data');
      }
      data = await response.json();
    } else {
      // Regular jobs data
      const response = await fetch('../../../jobs.json');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs data');
      }
      data = await response.json();
    }
    
    // Transform data to match our component needs
    jobs.value = data.result.map(job => ({
      id: job.id || Math.random().toString(36).substr(2, 9),
      job_title: job.job_title || 'Frontend Developer', // Default value if not provided
      image_url: job.image_url || '/logos/default-company-logo.png',
      company_name: job.company_name || 'PT Gojek Indonesia', // Default value
      city: job.city || 'Bandung', // Default value
      salary_min: job.minimum_salary,
      salary_max: job.maximum_salary,
      required_skills: job.required_skills || ['JavaScript', 'CSS', 'HTML'], // Default skills
      job_description: job.job_description,
      similarity_score: 0.4,
    }));
    
    // If bookmarkedOnly, mark all jobs as bookmarked
    if (props.bookmarkedOnly) {
      jobs.value.forEach(job => {
        bookmarkedJobs.value[job.id] = true;
      });
    }
    
    // Initialize filteredJobs with all jobs initially
    filteredJobs.value = [...jobs.value];
    
    // Apply any existing filters
    applyFilters(props.filters);
    
    isLoading.value = false;
  } catch (err) {
    error.value = err.message;
    isLoading.value = false;
    console.error('Error loading jobs:', err);
  }
};

onMounted(() => {
  loadJobs();
});

// Pagination helper function
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2F27CE]"></div>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>
    </div>
    
    <!-- Job Listings -->
    <div v-else class="font-epilogue font-semibold">
      <!-- No bookmarks message -->
      <div v-if="props.bookmarkedOnly && filteredJobs.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
        </svg>
        <h3 class="text-xl font-bold text-gray-700 mb-2">Belum ada lowongan tersimpan</h3>
        <p class="text-gray-500">Tandai lowongan favorit dengan bookmark untuk melihatnya nanti</p>
      </div>
      
      <!-- Job Cards -->
      <div v-else class="space-y-6">
        <div v-for="job in paginatedJobs" :key="job.id" 
          class="bg-white p-4 pr-10 rounded-[5px] border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-between w-full h-[149px]">
          
          <!-- Job Info Section -->
          <div class="flex gap-4 items-center">
            <!-- Company Logo -->
            <div class="w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <img 
                :src="job.image_url || 'https://via.placeholder.com/64'" 
                :alt="job.company_name"
                class="w-full h-full object-contain" 
                onerror="this.src='https://via.placeholder.com/64?text=Logo'"
              />
            </div>
            
            <!-- Job Details -->
            <div>
              <!-- Remove match percentage from here -->
              <h3 class="font-bold text-lg">{{ job.job_title }}</h3>
              <p class="text-gray-700 font-normal">{{ job.company_name }}</p>
              
              <!-- Location, Salary and Skills -->
              <div class="flex items-center flex-wrap gap-2 mt-1">
                <!-- Location -->
                <div class="flex items-center text-gray-600 gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ job.city }}
                </div>
                
                <!-- Salary -->
                <div class="text-[#2F27CE] px-3">
                  {{ formatSalary(job.salary_min, job.salary_max) }}
                </div>
                
                <!-- Skills (moved from below to here) -->
                <template v-if="job.required_skills && job.required_skills.length">
                  <span class="text-gray-400">|</span>
                  
                  <span 
                    v-for="skill in formatSkills(job.required_skills).displayed" 
                    :key="skill"
                    class="bg-[#EEF0FF] text-[#2F27CE] text-sm py-1 px-3 rounded inline-flex items-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                  >
                    {{ skill }}
                  </span>
                  <span 
                    v-if="formatSkills(job.required_skills).more > 0" 
                    class="bg-[#EEF0FF] text-[#2F27CE] text-sm py-1 px-3 rounded inline-flex items-center"
                  >
                    +{{ formatSkills(job.required_skills).more }}
                  </span>
                </template>
              </div>
            </div>
          </div>
          
          <!-- Action Button and Bookmark -->
          <div class="flex items-center self-center space-x-6">
            <!-- Bookmark Icon - Only show if authenticated -->
            <button 
              v-if="isAuthenticated"
              @click="toggleBookmark(job.id)"
              class="focus:outline-none transition-colors"
              aria-label="Bookmark job"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" :stroke-width="1.5">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                  :fill="bookmarkedJobs[job.id] ? '#2F27CE' : 'none'" 
                  :stroke="bookmarkedJobs[job.id] ? '#2F27CE' : 'currentColor'"
                />
              </svg>
            </button>
            
            <!-- Separator Line - Only show if authenticated -->
            <div v-if="isAuthenticated" class="h-13 w-px bg-gray-200"></div>
            
            <!-- Detail Button & Match Percentage in a vertical column -->
            <div class="flex flex-col items-center gap-2">
              <router-link 
                :to="getDetailRoute" 
                class="bg-[#2F27CE] text-white font-bold px-6 py-2 rounded-md hover:bg-[#261fb3] transition-colors w-full text-center"
              >
                Lihat Detail
              </router-link>
              
              <!-- Match Percentage (Only on recommendation page) - Directly under button -->
                <div v-if="isRecommendationPage" class="flex flex-col w-full items-center">
                <div class="w-full bg-gray-200 rounded-full h-1">
                  <div class="bg-green-500 h-1 rounded-full" :style="{ width: formatMatchPercentage(job.similarity_score) }"></div>
                </div>
                <span class="text-sm text-gray-600 font-bold mt-1">{{ formatMatchPercentage(job.similarity_score) }} skill match</span>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
        <div class="flex items-center gap-2">
          <!-- Previous Page Button -->
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{'hover:bg-gray-100': currentPage > 1}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <!-- Page Numbers -->
          <template v-for="page in totalPages" :key="page">
            <!-- Show first page, current page, last page, and nearby pages -->
            <template v-if="page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1">
              <button 
                @click="goToPage(page)" 
                class="px-3 py-1 rounded"
                :class="currentPage === page ? 'bg-[#2F27CE] text-white' : 'border border-gray-300 hover:bg-gray-100'"
              >
                {{ page }}
              </button>
            </template>
            
            <!-- Ellipsis for skipped pages -->
            <span 
              v-else-if="
                (page === 2 && currentPage > 3) || 
                (page === totalPages - 1 && currentPage < totalPages - 2)
              " 
              class="px-2"
            >
              ...
            </span>
          </template>
          
          <!-- Next Page Button -->
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{'hover:bg-gray-100': currentPage < totalPages}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-epilogue {
  font-family: 'Epilogue', sans-serif;
}

/* Update custom styles for the match percentage indicator */
.bg-green-500 {
  background-color: #5BEAA2;
}
</style>
