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
      <div class="flex flex-col md:flex-row items-center justify-center mt-10 gap-4 px-4 text-center md:text-left">
        <div class="flex gap-3 justify-center w-full md:w-auto">
            <button
                class="font-be-vietnam-pro bg-[#2F27CE] text-white font-bold px-6 py-2 rounded-md hover:bg-[#261fb3] transition-colors border border-[#2F27CE]">
                Login
            </button>
            <button
                class="font-be-vietnam-pro text-[#2F27CE] font-bold px-6 py-2 rounded-md hover:bg-[#2F27CE]/5 transition-colors border border-[#2F27CE]">
                Register
            </button>
        </div>
        <p class="text-gray-600 font-['Be_Vietnam_Pro'] mt-2 md:mt-0 px-4 md:px-0">
            Masuk untuk melihat lowongan pekerjaan yang disarankan berdasarkan kecocokan profil
        </p>
      </div>
    </main>
    <Footer />
  </div>
</template>