<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import SearchJob from '../../components/SearchJob.vue';
import JobList from '../../components/JobList.vue';
import JobFilter from '../../components/JobFilter.vue';

// Get route to access query parameters
const route = useRoute();

// State to hold current filters
const currentFilters = ref({
  salaryMin: '',
  salaryMax: '',
  jobTypes: [],
  workArrangements: [],
  experiences: [],
  educationLevels: [],
  job: '',
  location: ''
});

// State to track if mobile filter is shown
const showMobileFilter = ref(false);

// Handle filter changes from JobFilter component
const handleFilterChange = (filters) => {
  // Preserve search terms when applying other filters
  filters.job = currentFilters.value.job;
  filters.location = currentFilters.value.location;
  currentFilters.value = filters;
};

// Toggle mobile filter visibility
const toggleMobileFilter = () => {
  showMobileFilter.value = !showMobileFilter.value;
};

// Initialize filters from URL query parameters
const initializeFilters = (query) => {
  // Set search terms (job and location) - Vue Router already decodes them
  if (query.job && query.job !== 'all') {
    currentFilters.value.job = query.job;
  } else {
    currentFilters.value.job = '';
  }
  
  if (query.location && query.location !== 'all') {
    currentFilters.value.location = query.location;
  } else {
    currentFilters.value.location = '';
  }
  
  // Set salary filters if present in URL
  if (query.salaryMin) {
    currentFilters.value.salaryMin = query.salaryMin;
  }
  if (query.salaryMax) {
    currentFilters.value.salaryMax = query.salaryMax;
  }
  
  // Set array-based filters if present in URL
  if (query.jobTypes) {
    currentFilters.value.jobTypes = query.jobTypes.split(',');
  }
  if (query.workArrangements) {
    currentFilters.value.workArrangements = query.workArrangements.split(',');
  }
  if (query.experiences) {
    currentFilters.value.experiences = query.experiences.split(',');
  }
  if (query.educationLevels) {
    currentFilters.value.educationLevels = query.educationLevels.split(',');
  }
};

// Watch for route query changes - MOVED AFTER function definition
watch(() => route.query, (newQuery) => {
  initializeFilters(newQuery);
}, { immediate: true, deep: true });

// Initialize on component mount
onMounted(() => {
  initializeFilters(route.query);
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar navbarState="auth" />
    <main class="flex-grow">
      <SearchJob />
      
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 2xl:px-0 my-8 flex flex-col md:flex-row gap-6 items-start">
        <!-- Mobile filter toggle -->
        <div class="md:hidden mb-4">
          <button 
            @click="toggleMobileFilter"
            class="flex items-center justify-center w-full border border-gray-300 py-2 px-4 rounded text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            Filter
          </button>
        </div>
        
        <!-- Mobile filter (overlay) -->
        <div v-if="showMobileFilter" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex md:hidden">
          <div class="bg-white w-full max-w-sm h-full overflow-y-auto ml-auto p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold">Filters</h2>
              <button @click="toggleMobileFilter" class="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <JobFilter @filter-change="handleFilterChange" />
          </div>
        </div>
        
        <!-- Left column: Filters (hidden on mobile) -->
        <aside class="hidden md:block md:sticky md:top-4">
          <JobFilter @filter-change="handleFilterChange" />
        </aside>
        
        <!-- Right column: Job List -->
        <div class="flex-1">
          <JobList :filters="currentFilters" />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>