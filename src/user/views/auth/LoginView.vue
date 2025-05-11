<script setup>
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar navbarState="register" />
    <main class="flex-grow flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
        <!-- Login form will go here -->
        <p class="text-center text-gray-600 mt-4">
          This is a placeholder for the login page.
        </p>
      </div>
    </main>
    <Footer />
  </div>
</template>
