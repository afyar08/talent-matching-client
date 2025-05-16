<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-[#2F27CE] font-['Be_Vietnam_Pro']">Scraping Data Lowongan Pekerjaan</h1>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 bg-[#FF6550] text-white px-4 py-3 rounded font-semibold hover:bg-[#E85C49] transition-colors">
          <XCircleIcon class="w-6 h-6" />
          Batalkan
        </button>
        <button
          class="flex items-center gap-2 bg-[#2F27CE] text-white px-4 py-3 rounded font-semibold hover:bg-[#2735b3] transition-colors">
          <ArrowPathIcon class="w-6 h-6" />
        </button>
        <button
          class="flex items-center gap-2 bg-[#2F27CE] text-white px-4 py-3 rounded font-semibold hover:bg-[#2735b3] transition-colors">
          <PlayIcon class="w-5 h-5" />
          Mulai Scrapping
        </button>
      </div>
    </div>
    <div class="border-t border-gray-200 my-4"></div>
    <!-- Statistik -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div class="bg-white rounded-lg p-4 shadow relative h-32 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xl font-semibold text-gray-800">-</span>
          <div class="bg-indigo-100 text-indigo-600 rounded-full p-2">
            <CheckCircleIcon class="w-5 h-5" />
          </div>
        </div>
        <p class="text-sm text-gray-500">Task Status</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow relative h-32 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xl font-semibold text-gray-800">-</span>
          <div class="bg-indigo-100 text-indigo-600 rounded-full p-2">
            <ChartBarIcon class="w-5 h-5" />
          </div>
        </div>
        <p class="text-sm text-gray-500">Data Count</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow relative h-32 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xl font-semibold text-gray-800">-</span>
          <div class="bg-indigo-100 text-indigo-600 rounded-full p-2">
            <CalendarDaysIcon class="w-5 h-5" />
          </div>
        </div>
        <p class="text-sm text-gray-500">Start Time</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow relative h-32 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xl font-semibold text-gray-800">-</span>
          <div class="bg-indigo-100 text-indigo-600 rounded-full p-2">
            <ClockIcon class="w-5 h-5" />
          </div>
        </div>
        <p class="text-sm text-gray-500">Time Spent</p>
      </div>
    </div>
    <div class="border-t border-gray-200 my-4"></div>
    <!-- Tombol Aksi -->
    <div class="flex justify-between items-center mb-4">
      <button
        class="flex items-center gap-2 bg-[#FFCFC9] text-[#FF6550] hover:bg-[#FFB8AF] font-semibold px-4 py-2 rounded">
        <TrashIcon class="w-4 h-4" />
        Hapus Data
      </button>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 bg-[#B1E8D9] text-[#3D927B] hover:bg-[#8EDEC8] font-semibold px-4 py-2 rounded">
          <ArrowDownTrayIcon class="w-4 h-4" />
          Import Data
        </button>
        <button
          class="flex items-center gap-2 bg-[#DEDCFF] text-[#2F27CE] hover:bg-[#CAC8E8] font-semibold px-4 py-2 rounded">
          <CloudArrowUpIcon class="w-4 h-4" />
          Upload model ontology
        </button>
        <button
          class="flex items-center gap-2 bg-[#DEDCFF] text-[#2F27CE] hover:bg-[#CAC8E8] font-semibold px-4 py-2 rounded">
          <ArrowUpTrayIcon class="w-4 h-4" />
          Ekspor Json
        </button>
      </div>
    </div>
    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full text-sm">
        <thead class="bg-[#2F27CE] text-white font-semibold">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Judul Pekerjaan, Nama Perusahaan
                <ChevronUpDownIcon class="w-5 h-5 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Provinsi
                <ChevronUpDownIcon class="w-5 h-5 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Skill
                <ChevronUpDownIcon class="w-5 h-5 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Tanggal Import
                <ChevronUpDownIcon class="w-5 h-5 text-white" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataList" :key="item.id" class="even:bg-[#F7F6FE]">
            <td class="px-4 py-2">{{ item.id }}</td>
            <td class="px-4 py-2">
              <div class="font-semibold">{{ item.title }}</div>
              <div class="text-sm text-gray-500">{{ item.company }}</div>
            </td>
            <td class="px-4 py-2">{{ item.province }}</td>
            <td class="px-4 py-2">{{ item.skills }}</td>
            <td class="px-4 py-2">{{ item.importDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination class="mt-4" :page="page" :perPage="perPage" :lastPage="lastPage" :total="total" :pages="pages"
      @update:page="val => page = val" @update:perPage="val => perPage = val" @change="handlePaginationChange" />
  </div>
</template>

<script>
import Pagination from '../components/Pagination.vue'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  MinusIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CloudArrowUpIcon,
  ChevronUpDownIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'ScrapingData',
  components: {
    Pagination,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    PlayIcon,
    MinusIcon,
    ChartBarIcon,
    CalendarDaysIcon,
    ClockIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    CloudArrowUpIcon,
    ChevronUpDownIcon
  },
  data() {
    return {
      page: 1,
      perPage: 10,
      total: 100,
      lastPage: 10,
      pages: Array.from({ length: 10 }, (_, i) => i + 1),
      dataList: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: 'Frontend Developer',
        company: 'PT Gojek Indonesia',
        province: 'Jawa Barat',
        skills: 'Javascript, CSS, Ajax, HTML, React.js',
        importDate: '31/12/2024'
      }))
    }
  },
  methods: {
    handlePaginationChange({ page, perPages }) {
      this.page = page
      this.perPage = perPages
    }
  }
}
</script>
