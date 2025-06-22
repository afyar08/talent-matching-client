<script setup>
import { ref, computed, onMounted, defineProps, watch } from 'vue';
import { getFromStorage } from '../../utils/localStorage';
import { useRoute, useRouter } from 'vue-router';
import { jobService } from '../../services/jobService';
import { bookmarkService } from '../../services/bookmarkService';

// Get current route to check if we're on recommendation page
const route = useRoute();
const router = useRouter();

// Check if we're on the recommendation page
const isRecommendationPage = computed(() => {
  return route.path.includes('/recommendation');
});

// Props
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
      location: '',
      sortOrder: 'descending'
    })
  },
  bookmarkedOnly: {
    type: Boolean,
    default: false
  }
});

// State
const jobs = ref([]);
const filteredJobs = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// Bookmarked jobs - now using job_url as key instead of job.id
const bookmarkedJobs = ref({});

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return !!getFromStorage('user-id');
});

// Get current user UID
const getCurrentUserUid = () => {
  return getFromStorage('user-id');
};

// Load bookmarked jobs from server
const loadBookmarkedJobs = async () => {
  try {
    if (props.bookmarkedOnly) {
      // Load bookmarked jobs from server
      const response = await bookmarkService.getBookmarkedJobs();
      if (response) {
        jobs.value = response.data.jobs.map((job, index) => transformJobData(job, index));
        filteredJobs.value = [...jobs.value];
        
        // Mark all as bookmarked
        jobs.value.forEach(job => {
          bookmarkedJobs.value[job.job_url] = true;
        });
      }
    } else {
      // For regular job list, check bookmark status
      if (jobs.value.length > 0) {
        const jobUrls = jobs.value.map(job => job.job_url);
        const statusResponse = await bookmarkService.checkBookmarkStatus(jobUrls);
        
        if (statusResponse.data) {
          bookmarkedJobs.value = statusResponse.data;
        }
      }
    }
  } catch (error) {
    console.error('Error loading bookmarked jobs:', error);
  }
};

// Toggle bookmark status
const toggleBookmark = async (jobUrl) => {
  try {
    const result = await bookmarkService.toggleBookmark(jobUrl);
    console.log('Toggle bookmark result:', result.data.is_bookmarked);
    
    if (result) {
      // Update local state
      if (result.data.is_bookmarked) {
        bookmarkedJobs.value[jobUrl] = true;
      } else {
        delete bookmarkedJobs.value[jobUrl];
      }
      
      // If on bookmarked page and item was unbookmarked, remove from list
      if (props.bookmarkedOnly && !result.is_bookmarked) {
        filteredJobs.value = filteredJobs.value.filter(job => job.job_url !== jobUrl);
        jobs.value = jobs.value.filter(job => job.job_url !== jobUrl);
      }
      
      console.log(`Bookmark ${result.message}:`, jobUrl);
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
  }
};

// Computed property for the detail page route
const getDetailRoute = computed(() => {
  return isAuthenticated.value ? '/home/detail-job' : '/detail-job';
});

// Format match percentage
const formatMatchPercentage = (score) => {
  if (!score) return '0%';
  return Math.round(score * 100) + '%';
};

// Load jobs from backend API
const loadJobs = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    console.log('Loading jobs with filters:', props.filters);
    
    // If bookmarkedOnly, load from server
    if (props.bookmarkedOnly) {
      // Load bookmarked jobs from server
      await loadBookmarkedJobs();
    } else {
      // Prepare API filters
      const apiFilters = {
        job: props.filters.job || '',
        location: props.filters.location || '',
        sortOrder: props.filters.sortOrder || 'descending',
        salaryMin: props.filters.salaryMin || '',
        salaryMax: props.filters.salaryMax || '',
        jobTypes: props.filters.jobTypes || [],
        workArrangements: props.filters.workArrangements || [],
        experiences: props.filters.experiences || [],
        educationLevels: props.filters.educationLevels || []
      };
      
      console.log('API Filters being sent:', apiFilters);
      
      let response;
      // Use recommendation API if on recommendation page
      if (isRecommendationPage.value && isAuthenticated.value) {
        response = await jobService.getRecommendedJobs(apiFilters);
      } else {
        // Regular job search for non-recommendation pages
        response = await jobService.searchJobs(apiFilters);
        console.log('Response from job search API:', response);
      }
      
      if (response.data && response.data.jobs) {
        const transformedJobs = response.data.jobs.map((job, index) => transformJobData(job, index));
        jobs.value = transformedJobs;
        filteredJobs.value = [...transformedJobs];
        
        // Check bookmark status for loaded jobs
        if (isAuthenticated.value) {
          await loadBookmarkedJobs();
        }
        
        console.log(`Loaded ${transformedJobs.length} jobs from backend with filters applied`);
        console.log('Sample job data:', transformedJobs[0]);
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response structure from backend');
      }
    }
    
  } catch (err) {
    error.value = err.response?.data?.error || err.message;
    console.error('Error loading jobs:', err);
    jobs.value = [];
    filteredJobs.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Transform backend job data to frontend format
const transformJobData = (job, index) => {
  // Extract job ID from URI or use fallback
  let jobId = `job-${index + 1}`;
  if (job.uid) {
    const uriParts = job.uid.split('/');
    const lastPart = uriParts[uriParts.length - 1];
    if (lastPart.includes('Job_')) {
      jobId = lastPart.replace('Job_', '');
    }
  }
  console.log(`Transforming job data for ID: ${job.match_type}`);
  return {
    id: jobId,
    uid: job.uid,
    job_url: job.job_url,
    job_title: job.job_title || 'Job Title Not Available',
    company_name: job.company_name || 'Company Name Not Available',
    city: job.city || '',
    province: job.province || '',
    subdistrict: job.subdistrict || '',
    image_url: job.image_url || 'https://via.placeholder.com/64?text=Logo',
    salary_min: job.minimum_salary,
    salary_max: job.maximum_salary,
    salary_unit: job.salary_unit,
    salary_type: job.salary_type,
    employment_type: job.employment_type,
    work_setup: job.work_setup,
    minimum_education: job.minimum_education,
    minimum_experience: job.minimum_experience,
    maximum_experience: job.maximum_experience,
    required_skills: Array.isArray(job.required_skills) ? job.required_skills : [],
    job_description: job.job_description,
    similarity_score: job.similarity_score || 0,
    match_type: job.match_type || 'mid' // Default to mid if not specified
  };
};

// Watch for filter changes and reload jobs
watch(() => props.filters, (newFilters, oldFilters) => {
  // Only reload if filters actually changed
  const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(oldFilters);
  if (filtersChanged) {
    console.log('Filters changed, reloading jobs...', newFilters);
    currentPage.value = 1; // Reset to first page
    loadJobs();
  }
}, { deep: true });

// Computed properties for pagination
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
  
  const MAX_CHARS = 20;
  const sortedSkills = [...skills].sort((a, b) => a.length - b.length);
  
  let displayedSkills = [];
  let currentLength = 0;
  let skillIndex = 0;
  
  while (skillIndex < sortedSkills.length) {
    const skill = sortedSkills[skillIndex];
    if (currentLength + skill.length + 1 <= MAX_CHARS || displayedSkills.length === 0) {
      displayedSkills.push(skill);
      currentLength += skill.length + 1;
      skillIndex++;
    } else {
      break;
    }
    
    if (displayedSkills.length >= 2) {
      break;
    }
  }
  
  const moreCount = skills.length - displayedSkills.length;
  return { displayed: displayedSkills, more: moreCount };
};

// Go to specific page
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Add match color determination
const getMatchColor = (match_type) => {
  switch(match_type) {
    case 'Weak': return 'bg-red-500';
    case 'Mid': return 'bg-orange-500';
    case 'Strong': return 'bg-green-500';
    default: return 'bg-blue-500';
  }
};

// Function to extract 36 characters from the end of job_url
const extractJobUrlSuffix = (jobUrl) => {
  if (!jobUrl) return '';
  
  // Get the last 36 characters from the job_url
  const suffix = jobUrl.slice(-36);
  return suffix;
};

// Function to handle detail navigation
const goToDetail = (job) => {
  let routePath;
  
  if (isRecommendationPage.value) {
    // From recommendation page
    routePath = '/home/detail-job';
  } else if (isAuthenticated.value) {
    // From search page and user is authenticated
    routePath = '/home/detail-job-auth';
  } else {
    // From search page and user is not authenticated (guest)
    routePath = '/detail-job';
  }
  
  // Store job data or pass it via route state
  const routeData = {
    path: routePath,
    query: {
      jobId: job.id,
      id: job.job_url // Add the full job_url as 'id' parameter
    }
  };
  
  // If from recommendation, add source parameter
  if (isRecommendationPage.value) {
    routeData.query.from = 'recommendation';
    routeData.query.similarity = job.similarity_score;
    routeData.query.matchType = job.match_type;
  }
  
  console.log('📤 Route data:', routeData);
  
  router.push(routeData);
};

// Initialize component
onMounted(async () => {
  await loadJobs();
});
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
        <button 
          @click="loadJobs()" 
          class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
    
    <!-- Job Listings -->
    <div v-else class="font-epilogue font-semibold">
      <!-- No results message -->
      <div v-if="filteredJobs.length === 0" class="text-center py-12">
        <div v-if="props.bookmarkedOnly">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
          </svg>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Belum ada lowongan tersimpan</h3>
          <p class="text-gray-500">Tandai lowongan favorit dengan bookmark untuk melihatnya nanti</p>
        </div>
        <div v-else>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-xl font-bold text-gray-700 mb-2">Tidak ada lowongan ditemukan</h3>
          <p class="text-gray-500">Coba ubah kriteria pencarian atau filter Anda</p>
        </div>
      </div>
      
      <!-- Results summary
      <div v-else class="mb-6 text-sm text-gray-600">
        Menampilkan {{ paginatedJobs.length }} dari {{ filteredJobs.length }} lowongan
        <span v-if="props.filters.job || props.filters.location">
          untuk "{{ props.filters.job || 'semua posisi' }}"
          <span v-if="props.filters.location">di {{ props.filters.location }}</span>
        </span>
      </div> -->
      
      <!-- Job Cards -->
      <div v-if="filteredJobs.length > 0" class="space-y-6">
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
                
                <!-- Skills -->
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
              @click="toggleBookmark(job.job_url)"
              class="focus:outline-none transition-colors"
              aria-label="Bookmark job"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" :stroke-width="1.5">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                  :fill="bookmarkedJobs[job.job_url] ? '#2F27CE' : 'none'" 
                  :stroke="bookmarkedJobs[job.job_url] ? '#2F27CE' : 'currentColor'"
                />
              </svg>
            </button>
            
            <!-- Separator Line - Only show if authenticated -->
            <div v-if="isAuthenticated" class="h-13 w-px bg-gray-200"></div>
            
            <!-- Detail Button & Match Percentage in a vertical column -->
            <div class="flex flex-col items-center gap-2">
              <!-- Detail Button -->
              <button 
                @click="goToDetail(job)"
                class="bg-[#2F27CE] text-white font-bold px-6 py-2 rounded-md hover:bg-[#261fb3] transition-colors w-full text-center"
              >
                Lihat Detail
              </button>
              
              <!-- Match Percentage (Only on recommendation page) -->
              <div v-if="isRecommendationPage" class="flex flex-col w-full items-center">
                <div class="w-full bg-gray-200 rounded-full h-1">
                  <div :class="getMatchColor(job.match_type)" class="h-1 rounded-full" 
                       :style="{ width: formatMatchPercentage(job.similarity_score) }"></div>
                </div>
                <span class="text-sm text-gray-600 font-bold mt-1">
                  {{ formatMatchPercentage(job.similarity_score) }} skill match
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredJobs.length > 0 && totalPages > 1" class="mt-8 flex justify-center">
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
            <template v-if="page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1">
              <button 
                @click="goToPage(page)" 
                class="px-3 py-1 rounded"
                :class="currentPage === page ? 'bg-[#2F27CE] text-white' : 'border border-gray-300 hover:bg-gray-100'"
              >
                {{ page }}
              </button>
            </template>
            
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

/* Match type colors */
.bg-green-500 {
  background-color: #5BEAA2;
}
.bg-blue-500 {
  background-color: #3B82F6;
}
.bg-yellow-500 {
  background-color: #F59E0B;
}
</style>
