<template>
  <nav class="w-full flex justify-end items-center px-6 h-20 border-b border-gray-200 bg-white">
    <router-link
      to="/"
      class="flex items-center gap-2 border border-[#CCCCF5] text-[#2F27CE] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#EAE9FA] transition"
    >
      <ArrowTopRightOnSquareIcon class="w-6 h-8" />
      Talent Match App
    </router-link>
  </nav>
</template>

<script>
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

export default {
  components: {
    ArrowTopRightOnSquareIcon
  }
}
</script>

<style scoped>
nav {
  z-index: 10;
}
</style>
