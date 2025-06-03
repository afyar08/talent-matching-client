<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { jobService } from '../../../services/jobService.js';
import { bookmarkService } from '../../../services/bookmarkService.js';
import { getFromStorage } from '../../../utils/localStorage.js';
import { reportService } from '../../../services/reportService.js';
import { toastService } from '../../../utils/toastService.js'; // Add import for toast service
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';

// Get route to access query parameters
const route = useRoute();

// State for job data
const job = ref({
    similarity_score: 0.4,
    match_type: "mid"
});

// Loading state
const isLoading = ref(true);
const error = ref('');

// Check if coming from recommendation page
const isFromRecommendation = computed(() => {
  return route.query.from === 'recommendation';
});

// Get current user UID
const getCurrentUserUid = () => {
  return getFromStorage('user-id');
};

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return !!getCurrentUserUid();
});

// Fetch job data on mount
const fetchJobData = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    
    // Get job ID from route params
    const jobIdSuffix = route.query.id;
    
    if (!jobIdSuffix) {
      throw new Error('Job ID not provided in URL');
    }
    
    console.log('🔍 Fetching job with ID suffix:', jobIdSuffix);
    
    // Fetch job data from API
    const jobData = await jobService.getJobById(jobIdSuffix);
    
    // Update job state with fetched data
    job.value = {
      ...jobData,
      // UBAH: Gunakan data dari URL langsung
      similarity_score: route.query.similarity ? parseFloat(route.query.similarity) : 0.4,
      match_type: route.query.matchType || 'mid'
    };
    
    console.log('✅ Job data loaded:', job.value);
    console.log('🔗 URL similarity:', route.query.similarity);
    console.log('🔗 URL matchType:', route.query.matchType);
    
    // Check bookmark status if user is authenticated
    if (isAuthenticated.value && job.value.job_url) {
      await checkBookmarkStatus();
    }
    
  } catch (err) {
    console.error('❌ Error loading job:', err);
    error.value = err.message || 'Failed to load job details';
  } finally {
    isLoading.value = false;
  }
};

// State for bookmark
const isBookmarked = ref(false);

// Check bookmark status
const checkBookmarkStatus = async () => {
  try {
    if (!isAuthenticated.value || !job.value.job_url) return;
    
    const userUid = getCurrentUserUid();
    const response = await bookmarkService.checkBookmarkStatus(userUid, [job.value.job_url]);
    
    if (response.success) {
      isBookmarked.value = response.data[job.value.job_url] || false;
      console.log('📋 Bookmark status checked:', isBookmarked.value);
    }
  } catch (error) {
    console.error('Error checking bookmark status:', error);
  }
};

// Toggle bookmark state
const toggleBookmark = async () => {
  try {
    if (!isAuthenticated.value) {
      console.error('User not authenticated');
      return;
    }

    const userUid = getCurrentUserUid();
    const result = await bookmarkService.toggleBookmark(userUid, job.value.job_url);
    
    if (result.success) {
      isBookmarked.value = result.is_bookmarked;
      console.log(`Bookmark ${result.action}:`, job.value.job_url);
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
  }
};

// Fetch data when component mounts
onMounted(() => {
  fetchJobData();
});

// Watch for route changes to refetch data
watch(() => route.query.id, (newId) => {
  if (newId) {
    fetchJobData();
  }
});

// TAMBAH: Watch untuk perubahan similarity dan matchType di URL
watch(() => [route.query.similarity, route.query.matchType], ([newSimilarity, newMatchType]) => {
  if (job.value && !isLoading.value) {
    job.value.similarity_score = newSimilarity ? parseFloat(newSimilarity) : 0.4;
    job.value.match_type = newMatchType || 'mid';
    console.log('🔄 Updated similarity_score:', job.value.similarity_score);
    console.log('🔄 Updated match_type:', job.value.match_type);
  }
}, { immediate: true });

// Format salary from number to display format
const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';

    const formatNumber = (num) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    if (min && max) {
        return `Rp ${formatNumber(min)} - ${formatNumber(max)}`;
    } else if (min) {
        return `Rp ${formatNumber(min)}+`;
    } else if (max) {
        return `Up to Rp ${formatNumber(max)}`;
    }
};

// State for report modal
const showReportModal = ref(false);
const reportReason = ref('');
const reportComment = ref('');
const reportReasonError = ref(false); // Add error state tracking

// Function to open report modal
const reportJob = () => {
    showReportModal.value = true;
    reportReasonError.value = false; // Reset error state when opening modal
};

// Function to close report modal
const closeReportModal = () => {
    showReportModal.value = false;
    reportReason.value = '';
    reportComment.value = '';
    reportReasonError.value = false; // Reset error state when closing modal
};

// Watch for reason selection to clear error
watch(() => reportReason.value, (newValue) => {
    if (newValue) {
        reportReasonError.value = false;
    }
});

// Function to submit report
const submitReport = async () => {
    // Validate if reason is selected
    if (!reportReason.value) {
        reportReasonError.value = true;
        return;
    }

    try {
        await reportService.sendReport({
            job_url: job.value.job_url,
            reportType: reportReason.value,
            reportDescriptions: reportComment.value
        });
        
        // Show success toast notification instead of alert
        toastService.show({
            type: 'success',
            message: 'Terima Kasih Sudah Melaporkan'
        });
        
        closeReportModal();
    } catch (error) {
        // Use toast for error message as well
        toastService.show({
            type: 'error',
            message: 'Gagal mengirim laporan'
        });
        console.error(error);
    }
};

// Watch for modal state changes to control body scrolling
watch(() => showReportModal.value, (isShowing) => {
  if (isShowing) {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  } else {
    // Restore scrolling when modal is closed
    document.body.style.overflow = '';
  }
});

// Make sure to restore scrolling if component is unmounted while modal is open
onUnmounted(() => {
  document.body.style.overflow = '';
});

// Computed property to format similarity score as percentage
const matchPercentage = computed(() => {
  return Math.round(job.value.similarity_score * 100) + '%';
});

// Computed property to get match text based on match_type
const matchText = computed(() => {
  switch(job.value.match_type) {
    case 'Weak':
      return 'Kurang Match';
    case 'Mid':
      return 'Cukup Match';
    case 'Strong':
      return 'Sangat Match';
    default:
      return 'Cukup Match';
  }
});

// Computed property to determine bar colors based on match_type
const matchBars = computed(() => {
  // Default to all gray bars
  let bars = ['bg-gray-200', 'bg-gray-200', 'bg-gray-200'];
  
  switch(job.value.match_type) {
    case 'Weak':
      // Only first bar is active (red)
      bars[0] = 'bg-red-400';
      break;
    case 'Mid':
      // First two bars are active (orange)
      bars[0] = 'bg-orange-400';
      bars[1] = 'bg-orange-400';
      break;
    case 'Strong':
      // All three bars are active (green)
      bars[0] = 'bg-green-400';
      bars[1] = 'bg-green-400';
      bars[2] = 'bg-green-400';
      break;
  }
  
  return bars;
});

// TAMBAH: Computed property untuk warna text yang sesuai dengan bar
const matchTextColor = computed(() => {
  switch(job.value.match_type) {
    case 'Weak':
      return 'text-red-400'; // Red text untuk weak
    case 'Mid':
      return 'text-orange-400'; // Orange text untuk mid
    case 'Strong':
      return 'text-green-400'; // Green text untuk strong
    default:
      return 'text-orange-400'; // Default orange
  }
});
</script>

<template>
    <div class="min-h-screen flex flex-col font-be-vietnam-pro">
        <Navbar />

        <main class="flex-grow bg-[#FCFCFF]">
            <!-- Loading State -->
            <div v-if="isLoading" class="max-w-[1200px] mx-auto px-4 md:px-8 2xl:px-0 pt-8">
                <div class="flex justify-center items-center h-64">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4745F6]"></div>
                    <span class="ml-3 text-gray-600">Loading job details...</span>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="max-w-[1200px] mx-auto px-4 md:px-8 2xl:px-0 pt-8">
                <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 class="text-xl font-bold text-red-800 mb-2">Error Loading Job Details</h2>
                    <p class="text-red-600">{{ error }}</p>
                    <button 
                        @click="fetchJobData" 
                        class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>

            <!-- Job Content - Show only when data is loaded -->
            <template v-else>
                <!-- Job Header Section -->
                <div class="max-w-[1200px] mx-auto px-4 md:px-8 2xl:px-0 pt-8">
                    <div class="bg-[#4745F6] text-white py-10 px-6 md:px-10 rounded-xl shadow-md w-[1196px] h-[439px] flex flex-col justify-center">
                        <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                            <!-- Left side with job details -->
                            <div class="mb-6 md:mb-0 px-8 w-full">
                                <!-- Job title and company name -->
                                <h1 class="text-3xl font-bold mb-2">{{ job.job_title || 'Job Title' }}</h1>
                                <h2 class="text-xl mb-6">{{ job.company_name || 'Company Name' }}</h2>

                                <!-- Horizontal line -->
                                <div class="w-[85%] h-[2px] bg-white/60 mb-8"></div>

                                <!-- Job info icons -->
                                <div class="flex flex-col space-y-3">
                                    <!-- Location -->
                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {{ job.city || 'City' }}, {{ job.province || 'Province' }}
                                    </div>

                                    <!-- Salary Range -->
                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {{ formatSalary(job.minimum_salary, job.maximum_salary) }} per month
                                    </div>

                                    <!-- Education Level -->
                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                        </svg>
                                        {{ job.minimum_education || 'Education Level' }}
                                    </div>

                                    <!-- Employment Type -->
                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {{ job.employment_type || 'Employment Type' }}
                                    </div>
                                </div>
                            </div>

                            <!-- Right side with company logo -->
                            <div class="w-100 h-60 bg-white mr-10 mt-4 rounded-lg flex items-center justify-center shadow-md">
                                <img 
                                    :src="job.image_url || 'https://via.placeholder.com/96'" 
                                    :alt="job.company_name || 'Company Logo'"
                                    class="max-w-full max-h-full object-contain p-5"
                                    onerror="this.src='https://via.placeholder.com/96?text=Logo'" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Description Header and Action Buttons -->
                <div class="max-w-[1200px] mx-auto px-4 md:px-8 2xl:px-0 my-8 flex justify-between items-center">
                    <!-- Left side: Description title -->
                    <h2 class="text-3xl font-bold text-[#1E1E1E]">Deskripsi</h2>

                    <!-- Right side: Action buttons -->
                    <div class="flex gap-3">
                        <!-- Link Sumber Button -->
                        <a 
                            :href="job.job_url" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="flex items-center gap-2 bg-[#5BEAA2] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#4cd391] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Link Sumber
                        </a>

                        <!-- Bookmark Button - Only show if authenticated -->
                        <button 
                            v-if="isAuthenticated"
                            @click="toggleBookmark" 
                            class="flex items-center gap-2 bg-[#3042DF] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#2735b3] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    stroke-width="2" 
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                                    :fill="isBookmarked ? 'white' : 'none'" 
                                />
                            </svg>
                            {{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}
                        </button>
                    </div>
                </div>

                <!-- Content Section -->
                <div class="max-w-[1200px] mx-auto px-4 md:px-8 2xl:px-0">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <!-- Left Column: Job Description -->
                        <div class="md:col-span-2">
                            <div class="prose max-w-none" v-html="job.job_description || '<p>No description available.</p>'"></div>
                            
                            <!-- Report Job Button -->
                            <div class="mt-4 text-left">
                                <button @click="reportJob" class="text-[#FF6161] font-medium rounded-md transition-colors hover:text-[#E04040] cursor-pointer">
                                    <div class="flex items-center gap-2 justify-center">
                                        <img src="../../../../src/assets/icons/svg-megaphone.svg" alt="Report icon" class="h-5 w-5" />
                                        Laporkan Lowongan Ini
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Right Column: Skills and Match Info -->
                        <div class="md:col-span-1">
                            <!-- Talent Match Card - Only show if from recommendation -->
                            <div v-if="isFromRecommendation" class="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 class="text-xl font-bold text-[#1E1E1E] mb-4">Talent Match</h3>
                                
                                <!-- Skill Match Percentage with Progress Bar -->
                                <div class="mb-4">
                                    <div class="flex items-center justify-between mb-1">
                                        <p class="font-bold text-md text-[#5952D8]">{{ matchPercentage }} Skill Match</p>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="bg-[#5952D8] h-2.5 rounded-full" :style="{ width: matchPercentage }"></div>
                                    </div>
                                </div>
                                
                                <!-- Match Type with 3 Bars -->
                                <div>
                                    <!-- UPDATE: Gunakan dynamic color class -->
                                    <p :class="['font-bold text-md mb-1', matchTextColor]">{{ matchText }}</p>
                                    <div class="flex gap-2">
                                        <div :class="[matchBars[0], 'h-2.5 rounded-full flex-1']"></div>
                                        <div :class="[matchBars[1], 'h-2.5 rounded-full flex-1']"></div>
                                        <div :class="[matchBars[2], 'h-2.5 rounded-full flex-1']"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Skills Tags -->
                            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 class="text-xl font-bold mb-6">Skills</h3>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="skill in (job.required_skills || [])" :key="skill" class="bg-[#EEF0FF] text-[#2F27CE] text-sm py-2 px-4 rounded-md inline-flex items-center">
                                        {{ skill }}
                                    </span>
                                    <span v-if="!job.required_skills || job.required_skills.length === 0" class="text-gray-500 italic">
                                        No skills specified
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </main>

        <Footer />
    </div>

    <!-- Report Job Modal -->
    <div v-if="showReportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-invert backdrop-opacity-10">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-xl">
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-xl font-semibold text-[#2F27CE]">Laporkan Lowongan</h3>
                <button @click="closeReportModal" class="text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <!-- Modal Body -->
            <div class="p-6">
                <div class="mb-4">
                    <p class="mb-3">Pilih 1 alasan untuk melaporkan lowongan ini <span class="text-red-500">*</span></p>
                    
                    <div class="space-y-2">
                        <div class="flex items-center">
                            <input type="radio" id="reason-1" v-model="reportReason" value="link-unavailable" class="mr-2 h-4 w-4">
                            <label for="reason-1">Link sumber tidak tersedia</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-2" v-model="reportReason" value="inappropriate-job" class="mr-2 h-4 w-4">
                            <label for="reason-2">Pekerjaan tidak layak</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-3" v-model="reportReason" value="unclear-description" class="mr-2 h-4 w-4">
                            <label for="reason-3">Deskripsi lowongan tidak jelas atau tidak sesuai</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-4" v-model="reportReason" value="scam" class="mr-2 h-4 w-4">
                            <label for="reason-4">Lowongan terindikasi penipuan</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-5" v-model="reportReason" value="not-it-job" class="mr-2 h-4 w-4">
                            <label for="reason-5">Bukan termasuk lowongan pekerjaan IT</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-6" v-model="reportReason" value="other" class="mr-2 h-4 w-4">
                            <label for="reason-6">Lainnya</label>
                        </div>
                        
                        <!-- Add error message -->
                        <div v-if="reportReasonError" class="text-red-500 text-sm font-medium mt-1">
                            *Alasan Wajib di Isi
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label for="report-comment" class="block mb-2">Keterangan</label>
                    <textarea 
                        id="report-comment" 
                        v-model="reportComment" 
                        class="w-full border border-gray-300 rounded p-2 h-30"
                        placeholder="Ketik keterangan laporan..."
                    ></textarea>
                </div>
            </div>
            
            <!-- Modal Footer -->
            <div class="flex justify-end p-4 border-t">
                <button 
                    @click="submitReport" 
                    class="bg-[#2F27CE] text-white px-4 py-2 rounded font-semibold hover:bg-[#261fb3]"
                >
                    Simpan
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.font-be-vietnam-pro {
    font-family: 'Be Vietnam Pro', sans-serif;
}

/* Style for rich text content */
.prose {
    max-width: 65ch;
    color: #374151;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose p {
    margin-bottom: 1em;
    line-height: 1.6;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose ul {
    margin-left: 1.5em;
    margin-bottom: 1em;
    list-style-type: disc;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose li {
    margin-bottom: 0.5em;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose strong {
    font-weight: 600;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose em {
    font-style: italic;
    font-family: 'Be Vietnam Pro', sans-serif;
}
</style>
