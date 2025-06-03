<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { jobService } from '../../services/jobService';

// Get router and route instances
const router = useRouter();
const route = useRoute();

// Define emit - TAMBAH force-reload
const emit = defineEmits(['filter-change', 'force-reload']);

// Loading state for filter options
const isLoadingFilterOptions = ref(false);

// Add props to detect recommendation page
const props = defineProps({
  isRecommendationPage: {
    type: Boolean,
    default: false
  }
})

// Define collapsible sections - akan di-populate dari backend
const sections = ref([
  {
    id: 'sort',
    title: 'Urutkan',
    isOpen: true,
    type: 'radio',
    options: [] // Will be populated based on page type
  },
  {
    id: 'salary-range',
    title: 'Range Gaji',
    isOpen: true,
    type: 'range'
  },
  {
    id: 'job-type',
    title: 'Tipe Pekerjaan',
    isOpen: true,
    type: 'checkbox',
    options: [] // Akan di-load dari backend
  },
  {
    id: 'work-arrangement',
    title: 'Jenis Pekerjaan',
    isOpen: true,
    type: 'checkbox',
    options: [] // Akan di-load dari backend
  },
  {
    id: 'experience',
    title: 'Pengalaman',
    isOpen: true,
    type: 'checkbox',
    options: [] // Akan di-load dari backend
  },
  {
    id: 'education',
    title: 'Tingkat Pendidikan',
    isOpen: true,
    type: 'checkbox',
    options: [] // Akan di-load dari backend
  }
]);

// Filter state - UPDATE default untuk recommendation
const selectedFilters = ref({
  sortOrder: props.isRecommendationPage ? 'similarity-desc' : 'descending',
  salaryMin: '',
  salaryMax: '',
  jobTypes: [],
  workArrangements: [],
  experiences: [],
  educationLevels: []
});

// Error handling
const showSalaryError = ref(false);
let errorDebounceTimer = null;
const isFirstInput = ref(true);

// Load filter options from backend
const loadFilterOptions = async () => {
  try {
    isLoadingFilterOptions.value = true;
    const response = await jobService.getFilterOptions();
    
    if (response.success) {
      const data = response.data;
      
      // Update sections with data from backend
      const jobTypeSection = sections.value.find(s => s.id === 'job-type');
      if (jobTypeSection) {
        jobTypeSection.options = data.jobTypes || [];
      }
      
      const workArrangementSection = sections.value.find(s => s.id === 'work-arrangement');
      if (workArrangementSection) {
        workArrangementSection.options = data.workArrangements || [];
      }
      
      const experienceSection = sections.value.find(s => s.id === 'experience');
      if (experienceSection) {
        experienceSection.options = data.experiences || [];
      }
      
      const educationSection = sections.value.find(s => s.id === 'education');
      if (educationSection) {
        educationSection.options = data.educationLevels || [];
      }
      
      console.log('Filter options loaded from backend:', data);
    }
  } catch (error) {
    console.error('Error loading filter options:', error);
    // Fallback ke default options jika API gagal
    useDefaultFilterOptions();
  } finally {
    isLoadingFilterOptions.value = false;
  }
};

// Fallback default options jika backend gagal
const useDefaultFilterOptions = () => {
  const jobTypeSection = sections.value.find(s => s.id === 'job-type');
  if (jobTypeSection) {
    jobTypeSection.options = [
      { id: 'full-time', label: 'Full-time' },
      { id: 'part-time', label: 'Part-Time' },
      { id: 'internship', label: 'Internship' },
      { id: 'contract', label: 'Contract' }
    ];
  }
  
  const workArrangementSection = sections.value.find(s => s.id === 'work-arrangement');
  if (workArrangementSection) {
    workArrangementSection.options = [
      { id: 'remote', label: 'Remote' },
      { id: 'hybrid', label: 'Hybrid' },
      { id: 'on-site', label: 'On-site' }
    ];
  }
  
  const experienceSection = sections.value.find(s => s.id === 'experience');
  if (experienceSection) {
    experienceSection.options = [
      { id: 'no-experience', label: 'Tidak Berpengalaman' },
      { id: 'fresh-graduate', label: 'Fresh Graduate' },
      { id: 'less-than-year', label: 'Kurang dari setahun' },
      { id: '1-3-years', label: '1 - 3 tahun' },
      { id: '3-5-years', label: '3 - 5 tahun' },
      { id: '5-10-years', label: '5 - 10 tahun' },
      { id: 'more-than-10', label: 'Lebih dari 10 tahun' }
    ];
  }
  
  const educationSection = sections.value.find(s => s.id === 'education');
  if (educationSection) {
    educationSection.options = [
      { id: 'doctorate', label: 'Doktor (S3)' },
      { id: 'masters', label: 'Magister (S2)' },
      { id: 'bachelors', label: 'Sarjana (S1)' },
      { id: 'diploma3', label: 'Diploma 3' },
      { id: 'diploma12', label: 'Diploma 1-2' },
      { id: 'high-school', label: 'SMA/SMK' },
      { id: 'junior-high', label: 'SMP' },
      { id: 'elementary', label: 'SD' }
    ];
  }
};

// Check salary validity
const checkSalaryValidity = () => {
  const minValue = selectedFilters.value.salaryMin === '' ? null : Number(selectedFilters.value.salaryMin);
  const maxValue = selectedFilters.value.salaryMax === '' ? null : Number(selectedFilters.value.salaryMax);
  
  if (minValue !== null && maxValue !== null) {
    const isInvalid = minValue > maxValue;
    
    if (isInvalid) {
      if (isFirstInput.value) {
        clearTimeout(errorDebounceTimer);
        errorDebounceTimer = setTimeout(() => {
          showSalaryError.value = true;
          isFirstInput.value = false;
        }, 2000);
      } else {
        showSalaryError.value = true;
      }
    } else {
      showSalaryError.value = false;
      clearTimeout(errorDebounceTimer);
    }
    
    return !isInvalid;
  }
  
  showSalaryError.value = false;
  clearTimeout(errorDebounceTimer);
  return true;
};

// Input handlers
const onMinSalaryInput = () => {
  if (!isFirstInput.value) {
    isFirstInput.value = true;
    clearTimeout(errorDebounceTimer);
  }
  checkSalaryValidity();
};

const onMaxSalaryInput = () => {
  if (!isFirstInput.value) {
    isFirstInput.value = true;
    clearTimeout(errorDebounceTimer);
  }
  checkSalaryValidity();
};

// Parse URL parameters - UPDATE untuk handle recommendation default
const updateFiltersFromQuery = (query) => {
  // Set default sort order berdasarkan page type jika tidak ada di query
  if (query.sortOrder) {
    selectedFilters.value.sortOrder = query.sortOrder;
  } else {
    // Default berdasarkan page type
    selectedFilters.value.sortOrder = props.isRecommendationPage ? 'similarity-desc' : 'descending';
  }
  
  selectedFilters.value.salaryMin = query.salaryMin || '';
  selectedFilters.value.salaryMax = query.salaryMax || '';
  
  const parseArrayParam = (param) => {
    if (!param) return [];
    return param.split(',').filter(Boolean);
  };
  
  selectedFilters.value.jobTypes = parseArrayParam(query.jobTypes);
  selectedFilters.value.workArrangements = parseArrayParam(query.workArrangements);
  selectedFilters.value.experiences = parseArrayParam(query.experiences);
  selectedFilters.value.educationLevels = parseArrayParam(query.educationLevels);
};

// Update sections based on page type
const updateSortOptions = () => {
  const sortSection = sections.value.find(s => s.id === 'sort');
  if (sortSection) {
    if (props.isRecommendationPage) {
      // For recommendation page - similarity-based sorting dengan Descending default
      sortSection.options = [
        { id: 'similarity-asc', label: 'Ascending' },
        { id: 'similarity-desc', label: 'Descending' },
      ];
      // Set default ke similarity-desc jika belum ada
      if (!selectedFilters.value.sortOrder || selectedFilters.value.sortOrder === 'descending') {
        selectedFilters.value.sortOrder = 'similarity-desc';
      }
    } else {
      // For job search page - regular sorting
      sortSection.options = [
        { id: 'ascending', label: 'Ascending' },
        { id: 'descending', label: 'Descending' },
      ];
      // Set default ke descending jika belum ada
      if (!selectedFilters.value.sortOrder || selectedFilters.value.sortOrder.startsWith('similarity-')) {
        selectedFilters.value.sortOrder = 'descending';
      }
    }
  }
};

// Apply filters with improved synchronization and special handling for recommendation pages
const applyFilters = async () => {
  const isSalaryRangeValid = checkSalaryValidity();
  
  if (!isSalaryRangeValid) {
    showSalaryError.value = true;
    return;
  }
  
  // Create a consistent filter state object to use for both URL and events
  const filterState = {
    ...JSON.parse(JSON.stringify(selectedFilters.value)) // Deep clone to prevent reference issues
  };
  
  const { job, location } = route.query;
  const orderedQuery = {};
  
  if (filterState.sortOrder) {
    orderedQuery.sortOrder = filterState.sortOrder;
  }
  
  if (job) orderedQuery.job = job;
  if (location) orderedQuery.location = location;
  
  if (filterState.salaryMin) {
    orderedQuery.salaryMin = filterState.salaryMin;
  }
  if (filterState.salaryMax) {
    orderedQuery.salaryMax = filterState.salaryMax;
  }
  
  // Process array values consistently
  if (filterState.jobTypes.length > 0) {
    orderedQuery.jobTypes = filterState.jobTypes.join(',');
  }
  
  if (filterState.workArrangements.length > 0) {
    orderedQuery.workArrangements = filterState.workArrangements.join(',');
  }
  
  if (filterState.experiences.length > 0) {
    orderedQuery.experiences = filterState.experiences.join(',');
  }
  
  if (filterState.educationLevels.length > 0) {
    orderedQuery.educationLevels = filterState.educationLevels.join(',');
  }
  
  console.log(`🔄 Applying filters on ${props.isRecommendationPage ? 'RECOMMENDATION' : 'REGULAR'} page:`, orderedQuery);
  
  try {
    // First emit the change event so parent components can prepare
    emit('filter-change', filterState);
    
    // Then update URL - use await to ensure it completes
    await router.replace({
      path: route.path,
      query: orderedQuery
    });
    
    // Use longer timeout for recommendation page to ensure data is loaded properly
    const timeoutMs = props.isRecommendationPage ? 100 : 50;
    
    // Finally force reload after URL is updated
    setTimeout(() => {
      // Double-check that filter state matches URL query before forcing reload
      const currentQuery = route.query;
      let filtersMatch = true;
      
      // Check if current URL matches our expected filters
      if (currentQuery.sortOrder !== orderedQuery.sortOrder) {
        console.warn('Sort order mismatch between expected and actual URL');
        filtersMatch = false;
      }
      
      // If on recommendation page and filters don't match, try once more
      if (props.isRecommendationPage && !filtersMatch) {
        console.warn('Filter mismatch detected on recommendation page, retrying...');
        setTimeout(() => {
          emit('force-reload');
          console.log('🔄 Retry: Filter reload triggered for recommendation page');
        }, 150);
      } else {
        emit('force-reload');
        console.log(`✅ Filter applied and ${props.isRecommendationPage ? 'RECOMMENDATION' : 'REGULAR'} JobList reload triggered`);
      }
    }, timeoutMs);
  } catch (error) {
    console.error('Error applying filters:', error);
    // Force reload even on error to ensure consistency
    setTimeout(() => emit('force-reload'), 200);
  }
};

// Clear filters with improved synchronization
const clearFilters = async () => {
  // Define default filter state based on current page type
  const defaultFilters = {
    sortOrder: props.isRecommendationPage ? 'similarity-desc' : 'descending',
    salaryMin: '',
    salaryMax: '',
    jobTypes: [],
    workArrangements: [],
    experiences: [],
    educationLevels: []
  };
  
  // Apply defaults to selected filters
  selectedFilters.value = { ...defaultFilters };
  
  const { job, location } = route.query;
  const orderedQuery = {};
  if (job) orderedQuery.job = job;
  if (location) orderedQuery.location = location;
  
  // Add the default sort order to query
  orderedQuery.sortOrder = defaultFilters.sortOrder;
  
  console.log('🗑️ Clearing filters to defaults:', defaultFilters);
  
  try {
    // First emit the change event
    emit('filter-change', defaultFilters);
    
    // Then update URL - use await to ensure it completes
    await router.push({
      path: route.path,
      query: orderedQuery
    });
    
    // Finally force reload after URL is updated
    setTimeout(() => {
      emit('force-reload');
      console.log('✅ Filters cleared and JobList reload triggered');
    }, 50);
  } catch (error) {
    console.error('Error clearing filters:', error);
  }
};

// Toggle section
const toggleSection = (sectionId) => {
  const section = sections.value.find(s => s.id === sectionId);
  if (section) {
    section.isOpen = !section.isOpen;
  }
};

// Watchers
watch(() => [selectedFilters.value.salaryMin, selectedFilters.value.salaryMax], () => {
  checkSalaryValidity();
}, { deep: true });

watch(() => selectedFilters.value.salaryMin, (newVal) => {
  if (newVal === '') {
    isFirstInput.value = true;
    showSalaryError.value = false;
    clearTimeout(errorDebounceTimer);
  }
});

watch(() => selectedFilters.value.salaryMax, (newVal) => {
  if (newVal === '') {
    isFirstInput.value = true;
    showSalaryError.value = false;
    clearTimeout(errorDebounceTimer);
  }
});

watch(() => route.query, (newQuery) => {
  console.log('📌 Route query changed:', newQuery);
  updateFiltersFromQuery(newQuery);
  
  // Force radio buttons to update by reassigning sortOrder
  // This fixes potential sync issues with the radio buttons not reflecting URL state
  if (newQuery.sortOrder) {
    setTimeout(() => {
      selectedFilters.value.sortOrder = newQuery.sortOrder;
    }, 0);
  }
}, { immediate: true, deep: true });

// Watch untuk props change - UPDATE untuk respek URL parameter
watch(() => props.isRecommendationPage, (newValue) => {
  updateSortOptions();
  
  // Only set default if no URL parameter exists
  if (!route.query.sortOrder) {
    // Reset sort order when page type changes only if no URL parameter
    if (newValue) {
      selectedFilters.value.sortOrder = 'similarity-desc'; // Default Descending untuk recommendation
    } else {
      selectedFilters.value.sortOrder = 'descending'; // Default Descending untuk job search
    }
  }
}, { immediate: true });

// Lifecycle - UPDATE untuk prioritas URL parameter
onMounted(async () => {
  updateSortOptions();
  await loadFilterOptions();
  
  // Ensure URL parameter takes precedence
  if (route.query.sortOrder) {
    selectedFilters.value.sortOrder = route.query.sortOrder;
    console.log('Setting sort order from URL:', route.query.sortOrder);
  } else if (props.isRecommendationPage) {
    // Only set default if no URL parameter
    selectedFilters.value.sortOrder = 'similarity-desc';
  }
});

onUnmounted(() => {
  if (errorDebounceTimer) {
    clearTimeout(errorDebounceTimer);
  }
});
</script>

<template>
  <!-- TEMPLATE TETAP SAMA PERSIS SEPERTI SEBELUMNYA -->
  <div class="filter-container font-epilogue w-[288px]">
    <!-- Loading state -->
    <div v-if="isLoadingFilterOptions" class="text-center py-4">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading filter options...
      </div>
    </div>

    <!-- Filter content -->
    <div v-else>
      <!-- Apply Filter Button at top -->
      <div class="mb-4 flex gap-2">
        <button 
          @click="applyFilters" 
          class="flex-1 bg-[#E5E1FF] text-[#2F27CE] font-semibold py-2 rounded-md hover:bg-[#d6d0ff] transition-colors flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-1 transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          Terapkan
        </button>
        
        <button 
          @click="clearFilters" 
          class="flex-1 bg-[#FFE5E5] text-[#FF3A3A] font-bold py-2 rounded-md hover:bg-[#ffd6d6] transition-colors flex items-center justify-center"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reset
        </button>
      </div>
      
      <!-- Filter sections -->
      <div class="filter-sections space-y-4">
        <!-- Sort order section -->
        <div class="filter-section border-b border-t border-gray-200 pb-4 pt-4">
          <div 
            class="section-header flex justify-between items-center cursor-pointer mb-3"
            @click="toggleSection('sort')"
          >
            <h4 class="font-semibold">Urutkan</h4>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 transform transition-transform"
              :class="{'rotate-180': !sections.find(s => s.id === 'sort').isOpen}"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div v-if="sections.find(s => s.id === 'sort').isOpen" class="section-content">
            <div class="space-y-2">
              <div v-for="option in sections.find(s => s.id === 'sort').options" :key="option.id" class="flex items-center">
                <input 
                  type="radio"
                  :id="option.id"
                  v-model="selectedFilters.sortOrder"
                  :value="option.id"
                  class="form-radio h-4 w-4 text-[#2F27CE] border-gray-300 focus:ring-[#2F27CE]"
                />
                <label :for="option.id" class="ml-2 text-md">{{ option.label }}</label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Salary range section -->
        <div class="filter-section border-b border-gray-200 pb-4">
          <div 
            class="section-header flex justify-between items-center cursor-pointer mb-3"
            @click="toggleSection('salary-range')"
          >
            <h4 class="font-semibold">Range Gaji</h4>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 transform transition-transform"
              :class="{'rotate-180': !sections.find(s => s.id === 'salary-range').isOpen}"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div v-if="sections.find(s => s.id === 'salary-range').isOpen" class="section-content">
            <div class="flex gap-2 items-center">
              <div class="w-1/2">
                <label for="salary-min" class="block text-sm text-gray-500 mb-1">Rp</label>
                <input 
                  type="number"
                  id="salary-min"
                  v-model="selectedFilters.salaryMin"
                  placeholder="Minimal"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  :class="{'focus:ring-red-500 border-red-300': showSalaryError, 'focus:ring-[#2F27CE]': !showSalaryError}"
                  min="0"
                  @input="onMinSalaryInput"
                />
              </div>
              <div class="w-1/2">
                <label for="salary-max" class="block text-sm text-gray-500 mb-1">Rp</label>
                <input 
                  type="number"
                  id="salary-max"
                  v-model="selectedFilters.salaryMax"
                  placeholder="Maksimal"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1" 
                  :class="{'focus:ring-red-500 border-red-300': showSalaryError, 'focus:ring-[#2F27CE]': !showSalaryError}"
                  min="0"
                  @input="onMaxSalaryInput"
                />
              </div>
            </div>
            <div v-if="showSalaryError" class="text-red-500 text-sm mt-1">
              Gaji maksimal tidak boleh lebih kecil dari minimal!
            </div>
          </div>
        </div>
        
        <!-- Other filter sections (checkbox-based) -->
        <template v-for="(section, index) in sections.filter(s => s.type === 'checkbox')" :key="section.id">
          <div 
            class="filter-section pb-4" 
            :class="{'border-b border-gray-200': index < sections.filter(s => s.type === 'checkbox').length - 1}"
          >
            <div 
              class="section-header flex justify-between items-center cursor-pointer mb-3"
              @click="toggleSection(section.id)"
            >
              <h4 class="font-semibold">{{ section.title }}</h4>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 transform transition-transform"
                :class="{'rotate-180': !section.isOpen}"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div v-if="section.isOpen" class="section-content space-y-2">
              <div v-for="option in section.options" :key="option.id" class="flex items-center">
                <input 
                  type="checkbox"
                  :id="option.id"
                  v-model="selectedFilters[section.id === 'job-type' ? 'jobTypes' : 
                            section.id === 'work-arrangement' ? 'workArrangements' : 
                            section.id === 'experience' ? 'experiences' : 'educationLevels']"
                  :value="option.value || option.id"
                  class="form-checkbox h-4 w-4 text-[#2F27CE] rounded border-gray-300 focus:ring-[#2F27CE]"
                />
                <label :for="option.id" class="ml-2 text-md">{{ option.label }}</label>
              </div>
            </div>
          </div>
        </template>
      </div>
      
      <!-- Apply filters button (mobile only) -->
      <div class="mt-6 md:hidden">
        <button 
          @click="applyFilters" 
          class="w-full bg-[#2F27CE] text-white font-semibold py-2 rounded-md hover:bg-[#261fb3] transition-colors"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  background-color: transparent;
  padding: 16px;
}

.font-epilogue {
  font-family: 'Epilogue', sans-serif;
}

.form-checkbox:checked {
  background-color: #2F27CE;
  border-color: #2F27CE;
}

.form-radio:checked {
  background-color: #2F27CE;
  border-color: #2F27CE;
}

.w-\[288px\] {
  width: 288px;
}
</style>
