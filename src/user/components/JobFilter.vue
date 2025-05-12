<script setup>
import { ref, watch } from 'vue';

// Define collapsible sections
const sections = ref([
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

// Filter state
const selectedFilters = ref({
  salaryMin: '',
  salaryMax: '',
  jobTypes: [],
  workArrangements: [],
  experiences: [],
  educationLevels: []
});

// Watch for changes to salaryMin and enforce validation rules
watch(() => selectedFilters.value.salaryMin, (newMinValue) => {
  // Just emit changes when min value changes
  emit('filter-change', selectedFilters.value);
});

// Watch for changes to salaryMax
watch(() => selectedFilters.value.salaryMax, (newMaxValue) => {
  // Just emit the change
  emit('filter-change', selectedFilters.value);
});

// Input event for the min salary field that prevents adding digits that would make min > max
const onMinSalaryInput = (e) => {
  // Only apply this logic for additions, not deletions
  if (e.inputType === "deleteContentBackward" || e.inputType === "deleteContentForward") {
    return true;
  }
  
  // Get the value that would result after this input
  const currentValue = e.target.value || '';
  const newValue = currentValue + e.data;
  
  // Parse values for comparison
  const newMinValue = parseFloat(newValue);
  const maxValue = parseFloat(selectedFilters.value.salaryMax);
  
  // If max is set and the new min would exceed max, prevent the input
  if (!isNaN(maxValue) && !isNaN(newMinValue) && newMinValue > maxValue) {
    // Set error message flag instead of alert
    showSalaryError.value = true;
    // Don't update the value
    e.preventDefault();
    return false;
  }
  
  // Clear error message when valid input
  showSalaryError.value = false;
  return true;
};

// Add input event for the max salary field
const onMaxSalaryInput = (e) => {
  // Only apply this logic for additions, not deletions
  if (e.inputType === "deleteContentBackward" || e.inputType === "deleteContentForward") {
    return true;
  }
  
  // Get the value that would result after this input
  const currentValue = e.target.value || '';
  const newValue = currentValue + e.data;
  
  // Parse values for comparison
  const newMaxValue = parseFloat(newValue);
  const minValue = parseFloat(selectedFilters.value.salaryMin);
  
  // If min is set and the new max would be less than min, prevent the input
  if (!isNaN(minValue) && !isNaN(newMaxValue) && newMaxValue < minValue) {
    // Set error message flag
    showSalaryError.value = true;
    // Don't update the value
    e.preventDefault();
    return false;
  }
  
  // Clear error message when valid input
  showSalaryError.value = false;
  return true;
};

// Add a ref to track when to show the error message
const showSalaryError = ref(false);

// Toggle section collapse
const toggleSection = (sectionId) => {
  const section = sections.value.find(s => s.id === sectionId);
  if (section) {
    section.isOpen = !section.isOpen;
  }
};

// Define emit for filter changes
const emit = defineEmits(['filter-change']);

// Apply filters (for mobile view)
const applyFilters = () => {
  emit('filter-change', selectedFilters.value);
};

// Clear all filters
const clearFilters = () => {
  selectedFilters.value = {
    salaryMin: '',
    salaryMax: '',
    jobTypes: [],
    workArrangements: [],
    experiences: [],
    educationLevels: []
  };
  // Emit empty filters
  emit('filter-change', selectedFilters.value);
};
</script>

<template>
  <div class="filter-container font-epilogue w-[288px]">
    
    <!-- Filter sections -->
    <div class="filter-sections space-y-4">
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
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2F27CE]"
                min="0"
                @beforeinput="onMinSalaryInput"
              />
            </div>
            <div class="w-1/2">
              <label for="salary-max" class="block text-sm text-gray-500 mb-1">Rp</label>
              <input 
                type="number"
                id="salary-max"
                v-model="selectedFilters.salaryMax"
                placeholder="Maksimal"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2F27CE]"
                :min="selectedFilters.salaryMin || 0"
                @beforeinput="onMaxSalaryInput"
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
      <template v-for="section in sections.filter(s => s.type === 'checkbox')" :key="section.id">
        <div class="filter-section border-b border-gray-200 pb-4">
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
                class="form-checkbox h-4 w-4 text-[#2F27CE] rounded border-gray-300 focus:ring-[#2F27CE]"
              />
              <label :for="option.id" class="ml-2 text-sm">{{ option.label }}</label>
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
</template>

<style scoped>
.filter-container {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
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

/* Force the right width */
.w-\[288px\] {
  width: 288px;
}
</style>
