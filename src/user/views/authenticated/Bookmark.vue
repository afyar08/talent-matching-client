<script setup>
import { ref } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import JobList from '../../components/JobList.vue';

// Dummy bookmark filters (can be empty since we're only showing bookmarked jobs)
const bookmarkFilters = ref({
  salaryMin: '',
  salaryMax: '',
  jobTypes: [],
  workArrangements: [],
  experiences: [],
  educationLevels: [],
  job: '',
  location: ''
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow">
      <!-- Bookmark header section -->
      <section class="bg-[#FCFCFF] pt-9 pb-6">
        <div class="max-w-[1440px] mx-auto px-4 md:px-8 2xl:px-0">
          <div class="flex flex-col items-center mb-10 mt-12 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-3 font-['Be_Vietnam_Pro']">
               Lowongan yang kamu <span class="text-[#2F27CE]">simpan</span>
            </h1>
            <p class="text-gray-600 text-base md:text-lg font-['Be_Vietnam_Pro'] max-w-[90%] md:max-w-none">
              Kamu pernah menyimpan lowongan ini. Lamar lebih awal dan tingkatkan peluangmu untuk direkrut!
            </p>
          </div>
        </div>
      </section>
      
      <!-- Center the job list with a narrower max-width -->
      <div class="max-w-7xl mx-auto px-4 md:px-8 2xl:px-0 my-0">
        <!-- JobList with bookmarkedOnly flag -->
        <JobList :filters="bookmarkFilters" :bookmarked-only="true" />
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>