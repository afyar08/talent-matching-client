<script setup>
import { ref } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import SearchJob from '../../components/SearchJob.vue';
import JobList from '../../components/JobList.vue';
import JobFilter from '../../components/JobFilter.vue';

// State to hold current filters
const currentFilters = ref({
  salaryMin: '',
  salaryMax: '',
  jobTypes: [],
  workArrangements: [],
  experiences: [],
  educationLevels: []
});

// Handle filter changes from JobFilter component
const handleFilterChange = (filters) => {
  currentFilters.value = filters;
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar navbarState="guest" />
    <main class="flex-grow">
      <SearchJob />
      
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 2xl:px-0 my-8 flex flex-col md:flex-row gap-6 items-start">
        <!-- Mobile filter toggle -->
        <div class="md:hidden mb-4">
          <button class="flex items-center justify-center w-full border border-gray-300 py-2 px-4 rounded text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            Filter
          </button>
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