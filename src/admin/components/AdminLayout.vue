<template>
  <div class="flex">
    <!-- Sidebar -->
    <Sidebar :mobileMenuOpen="mobileMenuOpen" @close="closeMenu" />

    <!-- Right Side (Navbar + Content) -->
    <div class="flex-1 min-h-screen flex flex-col" :style="{ marginLeft: '260px' }">
      <!-- Navbar -->
      <Navbar />

      <!-- Page Content -->
      <main class="p-6 bg-gray-50 flex-1">
        <router-view /> <!-- ini penting -->
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'

export default {
  components: {
    Sidebar,
    Navbar
  },
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  methods: {
    closeMenu() {
      this.mobileMenuOpen = false
    }
  }
}
</script>

<style scoped>
/* Pastikan Sidebar tetap fixed */
.sidebar-left {
  z-index: 40;
}

/* Navbar tetap di atas konten */
.navbar {
  z-index: 30;
}
</style>
