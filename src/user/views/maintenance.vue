<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { useRouter } from 'vue-router'

// Import gambar maintenance dari assets
import maintenanceImg from '../../assets/icons/maintenance.svg'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white font-be-vietnam-pro">
    <Navbar navbarState="register" />
    <main class="flex-grow flex flex-col items-center justify-center px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl bg-transparent rounded-lg shadow-none md:shadow-none p-6 md:p-12">
        <img
          :src="maintenanceImg"
          alt="Maintenance Illustration"
          class="w-80 max-w-full mb-8 md:mb-0 md:mr-12"
          style="object-fit:contain"
        />
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-3xl md:text-4xl font-bold mb-2">
            Under <span class="text-[#2F27CE]">Maintenance</span>
          </h1>
          <p class="text-gray-600 mb-6">
            Maaf, saat ini fitur belum bisa digunakan karena sedang ada pembaruan data pada sistem. Mohon coba lagi, beberapa saat lagi.
          </p>
          <button
            @click="goHome"
            class="bg-[#2F27CE] text-white font-medium py-2.5 px-8 rounded-md hover:bg-[#3d3bd4] transition-colors"
          >
            Kembali ke halaman utama
          </button>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.font-be-vietnam-pro {
  font-family: 'Be Vietnam Pro', sans-serif;
}
</style>