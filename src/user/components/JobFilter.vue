<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Get router and route instances
const router = useRouter();
const route = useRoute();

// Define collapsible sections - Add new sort section at the beginning
const sections = ref([
  {
    id: 'sort-order',
    title: 'Sort by',
    isOpen: true,
    type: 'sort',
    options: [
      { id: 'ascending', label: 'Ascending' },
      { id: 'descending', label: 'Descending' }
    ]
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
    options: [
      { id: 'full-time', label: 'Full-time' },
      { id: 'part-time', label: 'Part-Time' },
      { id: 'internship', label: 'Internship' },
      { id: 'contract', label: 'Contract' }
    ]
  },
  {
    id: 'work-arrangement',
    title: 'Jenis Pekerjaan',
    isOpen: true,
    type: 'checkbox',
    options: [
      { id: 'remote', label: 'Remote' },
      { id: 'hybrid', label: 'Hybrid' },
      { id: 'on-site', label: 'On-site' }
    ]
  },
  {
    id: 'experience',
    title: 'Pengalaman',
    isOpen: true,
    type: 'checkbox',
    options: [
      { id: 'no-experience', label: 'Tidak Berpengalaman' },
      { id: 'fresh-graduate', label: 'Fresh Graduate' },
      { id: 'less-than-year', label: 'Kurang dari setahun' },
      { id: '1-3-years', label: '1 - 3 tahun' },
      { id: '3-5-years', label: '3 - 5 tahun' },
      { id: '5-10-years', label: '5 - 10 tahun' },
      { id: 'more-than-10', label: 'Lebih dari 10 tahun' }
    ]
  },
  {
    id: 'education',
    title: 'Tingkat Pendidikan',
    isOpen: true,
    type: 'checkbox',
    options: [
      { id: 'doctorate', label: 'Doktor (S3)' },
      { id: 'masters', label: 'Magister (S2)' },
      { id: 'bachelors', label: 'Sarjana (S1)' },
      { id: 'diploma3', label: 'Diploma 3' },
      { id: 'diploma12', label: 'Diploma 1-2' },
      { id: 'high-school', label: 'SMA/SMK' },
      { id: 'junior-high', label: 'SMP' },
      { id: 'elementary', label: 'SD' }
    ]
  }
]);

// Filter state - Add sortOrder property with descending as default
const selectedFilters = ref({
  sortOrder: 'descending', // Default to descending
  salaryMin: '',
  salaryMax: '',
  jobTypes: [],
  workArrangements: [],
  experiences: [],
  educationLevels: []
});

// Add a ref to track when to show the error message
const showSalaryError = ref(false);
// Add debounce timer for error message
let errorDebounceTimer = null;
const isFirstInput = ref(true);

// Check validity of salary range and show error with debounce
const checkSalaryValidity = () => {
  // Use Number() explicitly to convert strings to numbers
  const minValue = selectedFilters.value.salaryMin === '' ? null : Number(selectedFilters.value.salaryMin);
  const maxValue = selectedFilters.value.salaryMax === '' ? null : Number(selectedFilters.value.salaryMax);
  
  console.log('Checking validity:', { minValue, maxValue });
  
  // Only validate if both values are present (non-null)
  if (minValue !== null && maxValue !== null) {
    // This is the correct condition: min > max is invalid
    const isInvalid = minValue > maxValue;
    
    // Handle error state with proper logic
    if (isInvalid) {
      // Show error with debounce for first input
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
      // Clear error when valid
      showSalaryError.value = false;
      clearTimeout(errorDebounceTimer);
    }
    
    return !isInvalid; // Return true if valid (min <= max)
  }
  
  // If one or both values are not set, it's valid
  showSalaryError.value = false;
  clearTimeout(errorDebounceTimer);
  return true;
};

// Watch for changes in salary values
watch(() => [selectedFilters.value.salaryMin, selectedFilters.value.salaryMax], () => {
  checkSalaryValidity();
}, { deep: true });

// Reset first input state when either field is emptied
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

// Create a more robust function to update filters from query parameters
const updateFiltersFromQuery = (query) => {
  // Set sort order from URL or use default
  selectedFilters.value.sortOrder = query.sortOrder || 'descending';
  
  // Set salary filters if present in URL
  selectedFilters.value.salaryMin = query.salaryMin || '';
  selectedFilters.value.salaryMax = query.salaryMax || '';
  
  // Function to properly parse array parameters ensuring correct comma handling
  const parseArrayParam = (param) => {
    if (!param) return [];
    
    try {
      // First properly decode the parameter
      const decodedParam = decodeURIComponent(param);
      
      // Split by comma and remove duplicates using Set
      return [...new Set(decodedParam.split(',').filter(Boolean))];
    } catch (e) {
      // Fallback if decoding fails
      console.error('Error decoding parameter:', e);
      return param.split(',').filter(Boolean);
    }
  };
  
  // Set array-based filters if present in URL, ensuring no duplicates
  selectedFilters.value.jobTypes = parseArrayParam(query.jobTypes);
  selectedFilters.value.workArrangements = parseArrayParam(query.workArrangements);
  selectedFilters.value.experiences = parseArrayParam(query.experiences);
  selectedFilters.value.educationLevels = parseArrayParam(query.educationLevels);
};

// Replace the onMounted hook with a watcher that includes immediate: true
// This ensures it runs both at initial load and whenever the URL changes
watch(() => route.query, (newQuery) => {
  updateFiltersFromQuery(newQuery);
}, { immediate: true, deep: true });

// Remove the old onMounted code since the watcher with immediate: true replaces it

// Remove the input blocking logic
// We'll replace these functions with simple input handlers
const onMinSalaryInput = () => {
  // Reset first input state when changing values
  if (!isFirstInput.value) {
    isFirstInput.value = true;
    clearTimeout(errorDebounceTimer);
  }
  // Check validity immediately
  checkSalaryValidity();
};

const onMaxSalaryInput = () => {
  // Reset first input state when changing values
  if (!isFirstInput.value) {
    isFirstInput.value = true;
    clearTimeout(errorDebounceTimer);
  }
  // Check validity immediately
  checkSalaryValidity();
};

// Clean up the debounce timer when component is unmounted
onUnmounted(() => {
  if (errorDebounceTimer) {
    clearTimeout(errorDebounceTimer);
  }
});

// Toggle section collapse
const toggleSection = (sectionId) => {
  const section = sections.value.find(s => s.id === sectionId);
  if (section) {
    section.isOpen = !section.isOpen;
  }
};

// Define emit for filter changes
const emit = defineEmits(['filter-change']);

// Completely rewritten encode function to avoid double encoding
const cleanEncode = (value) => {
  if (!value) return value;
  
  // Make sure we're working with a string
  const strValue = String(value);
  
  // First try to decode in case it's already encoded
  let decodedValue = strValue;
  try {
    // Try to decode until it can't be decoded anymore
    while (true) {
      const prevValue = decodedValue;
      const newValue = decodeURIComponent(prevValue);
      if (newValue === prevValue) break;
      decodedValue = newValue;
    }
  } catch (e) {
    // If decoding fails, use what we have so far
  }
  
  // Now do a single encode pass
  return encodeURIComponent(decodedValue);
};

// Apply filters with improved handling
const applyFilters = () => {
  // Check salary validity first
  const isSalaryRangeValid = checkSalaryValidity();
  
  // If salary range is invalid, show error but don't apply filters
  if (!isSalaryRangeValid) {
    showSalaryError.value = true;
    return;
  }
  
  // Get existing job and location values from route query
  const { job, location } = route.query;
  
  // Create an ordered query object
  const orderedQuery = {};
  
  // First: Add sort order
  if (selectedFilters.value.sortOrder) {
    orderedQuery.sortOrder = selectedFilters.value.sortOrder;
  }
  
  // Then: Add job and location if they exist
  if (job) orderedQuery.job = job;
  if (location) orderedQuery.location = location;
  
  // Second: Add salary filters if they exist
  if (selectedFilters.value.salaryMin) {
    orderedQuery.salaryMin = selectedFilters.value.salaryMin;
  }
  if (selectedFilters.value.salaryMax) {
    orderedQuery.salaryMax = selectedFilters.value.salaryMax;
  }
  
  // Process array values - with proper encoding
  if (selectedFilters.value.jobTypes.length > 0) {
    const uniqueValues = [...new Set(selectedFilters.value.jobTypes)];
    // Encode the comma in the URL to ensure it's treated as one parameter
    orderedQuery.jobTypes = encodeURIComponent(uniqueValues.join(','));
  }
  
  if (selectedFilters.value.workArrangements.length > 0) {
    const uniqueValues = [...new Set(selectedFilters.value.workArrangements)];
    orderedQuery.workArrangements = encodeURIComponent(uniqueValues.join(','));
  }
  
  if (selectedFilters.value.experiences.length > 0) {
    const uniqueValues = [...new Set(selectedFilters.value.experiences)];
    orderedQuery.experiences = encodeURIComponent(uniqueValues.join(','));
  }
  
  if (selectedFilters.value.educationLevels.length > 0) {
    const uniqueValues = [...new Set(selectedFilters.value.educationLevels)];
    orderedQuery.educationLevels = encodeURIComponent(uniqueValues.join(','));
  }
  
  console.log('Applying filters with query:', orderedQuery);
  
  // Update the URL with the ordered query parameters
  router.replace({
    path: route.path,
    query: orderedQuery
  });
  
  // NOTE: This emit is kept for UI continuity but parent components should 
  // not implement actual filtering yet - this is just a placeholder
  // for future implementation
  // emit('filter-change', selectedFilters.value);
};

// Clear all filters
const clearFilters = () => {
  selectedFilters.value = {
    sortOrder: 'descending', // Reset to default
    salaryMin: '',
    salaryMax: '',
    jobTypes: [],
    workArrangements: [],
    experiences: [],
    educationLevels: []
  };
  
  // Clear filter-related query parameters but preserve job and location in the same order
  const { job, location } = route.query;
  const orderedQuery = {};
  if (job) orderedQuery.job = job; // Don't re-encode as it's already encoded
  if (location) orderedQuery.location = location; // Don't re-encode as it's already encoded
  
  router.push({
    path: route.path,
    query: orderedQuery
  });
  
  // NOTE: This emit is kept for UI continuity but no filtering should happen
  // emit('filter-change', selectedFilters.value);
  console.log('Filters cleared (UI only)');
};
</script>

<template>
  <div class="filter-container font-epilogue w-[288px]">
    <!-- Apply Filter Button at top -->
    <div class="mb-4 flex gap-2">
      <button 
        @click="applyFilters" 
        class="flex-1 bg-[#E5E1FF] text-[#2F27CE] font-semibold py-2 rounded-md hover:bg-[#d6d0ff] transition-colors flex items-center justify-center"
      >
        <svg class="w-5 h-5 mr-1  transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          @click="toggleSection('sort-order')"
        >
          <h4 class="font-semibold">Sort by</h4>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5 transform transition-transform"
            :class="{'rotate-180': !sections.find(s => s.id === 'sort-order').isOpen}"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div v-if="sections.find(s => s.id === 'sort-order').isOpen" class="section-content">
          <div class="space-y-2">
            <div v-for="option in sections.find(s => s.id === 'sort-order').options" :key="option.id" class="flex items-center">
              <input 
                type="radio"
                :id="option.id"
                v-model="selectedFilters.sortOrder"
                :value="option.id"
                class="form-radio h-4 w-4 text-[#2F27CE] border-gray-300 focus:ring-[#2F27CE]"
              />
              <label :for="option.id" class="ml-2 text-sm">{{ option.label }}</label>
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
          <!-- Display the error message when needed -->
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
                :value="option.id"
                class="form-checkbox h-4 w-4 text-[#2F27CE] rounded border-gray-300 focus:ring-[#2F27CE]"
              />
              <label :for="option.id" class="ml-2 text-sm">{{ option.label }}</label>
            </div>
          </div>
        </div>
      </template>
    </div>
    
    <!-- Apply filters button (mobile only) - Now the same as the top button -->
    <div class="mt-6 md:hidden">
      <button 
        @click="applyFilters" 
        class="w-full bg-[#2F27CE] text-white font-semibold py-2 rounded-md hover:bg-[#261fb3] transition-colors"
      >
        Terapkan Filter
      </button>
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

/* Custom checkbox styling */
.form-checkbox:checked {
  background-color: #2F27CE;
  border-color: #2F27CE;
}

/* Add styling for radio buttons */
.form-radio:checked {
  background-color: #2F27CE;
  border-color: #2F27CE;
}

/* Force the right width */
.w-\[288px\] {
  width: 288px;
}
</style>
