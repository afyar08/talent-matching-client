<script setup>
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import SearchJob from '../../components/SearchJob.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow bg-[#FCFCFF]">
      <SearchJob />
    </main>
    <Footer />
  </div>
</template>