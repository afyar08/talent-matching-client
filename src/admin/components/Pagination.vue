<template>
  <div
    class="flex flex-col md:flex-row gap-3 items-center justify-between bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg py-2 px-4 mt-4 w-full"
  >
    <!-- Per Page -->
    <div class="flex items-center gap-x-2">
      <span>Tampilkan</span>
      <select
        class="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        v-model="perPagePagination"
      >
        <option v-for="opt in listPerPage" :key="opt" :value="opt">
          {{ opt }}
        </option>
      </select>
      <span>Item</span>
      <p class="whitespace-nowrap">
        dari total <span class="font-bold">{{ total }}</span>
      </p>
    </div>

    <!-- Page Selector -->
    <div class="flex items-center gap-x-2">
      <span>Halaman</span>
      <select
        class="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        v-model.number="page"
      >
        <option v-for="p in pages" :key="p" :value="p">
          {{ p }}
        </option>
      </select>
      <span>dari {{ lastPage }}</span>

      <!-- Prev button -->
      <button
        class="p-1 rounded hover:bg-gray-200"
        :disabled="page === 1"
        @click="previousPage"
      >
        <svg
          class="w-4 h-4 text-blue-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Next button -->
      <button
        class="p-1 rounded hover:bg-gray-200"
        :disabled="page === lastPage"
        @click="nextPage"
      >
        <svg
          class="w-4 h-4 text-blue-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  page: number
  perPage: number
  lastPage: number
  total: number
  pages: number[]
}>()

const emits = defineEmits([
  'update:perPage',
  'update:page',
  'change',
])

const listPerPage = ['10', '20', '50', '100']
const perPagePagination = ref(props.perPage.toString())
const page = ref(props.page)

// Emit on perPage change
watch(perPagePagination, (value) => {
  const perPageInt = parseInt(value)
  emits('update:perPage', perPageInt)
  emits('update:page', 1)
  emits('change', { page: 1, perPages: perPageInt })
})

// Emit on page change
watch(page, (value) => {
  emits('update:page', value)
  emits('change', { page: value, perPages: props.perPage })
})

// Sync external page prop
watch(() => props.page, (newVal) => {
  page.value = newVal
})

const previousPage = () => {
  if (page.value > 1) {
    page.value--
  }
}

const nextPage = () => {
  if (page.value < props.lastPage) {
    page.value++
  }
}
</script>

<style scoped>
select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg viewBox='0 0 20 20' fill='blue' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.66a.75.75 0 01-1.08 0l-4.25-4.66a.75.75 0 01.02-1.06z' clip-rule='evenodd' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  appearance: none;
  padding-right: 1.5rem;
}
</style>
