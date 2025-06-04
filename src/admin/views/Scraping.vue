<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-[#2F27CE] font-['Be_Vietnam_Pro']">
        Scraping Data Lowongan Pekerjaan
      </h1>
      <div class="flex items-center gap-3">
        <button
          @click="cancelScraping"
          :disabled="!isScraping"
          class="flex items-center gap-2 bg-[#FF6550] text-white px-4 py-3 rounded font-semibold hover:bg-[#E85C49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircleIcon class="w-6 h-6" />
          Batalkan
        </button>
        <button
          @click="refreshScraping"
          class="flex items-center gap-2 bg-[#2F27CE] text-white px-4 py-3 rounded font-semibold hover:bg-[#2735b3] transition-colors"
        >
          <ArrowPathIcon class="w-6 h-6" />
        </button>
        <button
          @click="startScraping"
          :disabled="isScraping || scrapingStatus === 'SUCCESS'"
          class="flex items-center gap-2 bg-[#2F27CE] text-white px-4 py-3 rounded font-semibold hover:bg-[#2735b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
          <span class="text-xl font-semibold text-gray-800">{{ parseStatus(scrapingStatus) }}</span>
          <div class="bg-indigo-100 text-indigo-600 rounded-full p-2">
            <CheckCircleIcon class="w-5 h-5" />
          </div>
        </div>
        <p class="text-sm text-gray-500">Task Status</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow relative h-32 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xl font-semibold text-gray-800">{{ scrapedJobs || '-' }}</span>
          <div class="bg-indigo-100 text-indigo-600 rounded-full p-2">
            <ChartBarIcon class="w-5 h-5" />
          </div>
        </div>
        <p class="text-sm text-gray-500">Data Count</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow relative h-32 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xl font-semibold text-gray-800">
            {{ startedAt ? formatDate(startedAt) : '-' }}
          </span>
          <div class="bg-indigo-100 text-indigo-600 rounded-full p-2">
            <CalendarDaysIcon class="w-5 h-5" />
          </div>
        </div>
        <p class="text-sm text-gray-500">Start Time</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow relative h-32 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span class="text-xl font-semibold text-gray-800">
            {{ timeSpent !== null ? formatTimeSpent(timeSpent) : '-' }}
          </span>
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
      <!-- filepath: c:\Users\ACER\OneDrive\Documents\Kuliah\Semester_6\Tugas_Akhir\Project\talent-matching-client\src\admin\views\Scraping.vue -->
      <button
        @click="cancelScraping"
        :disabled="scrapingStatus !== 'SUCCESS' || isImporting"
        class="flex items-center gap-2 bg-[#FFCFC9] text-[#FF6550] hover:bg-[#FFB8AF] font-semibold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <TrashIcon class="w-4 h-4" />
        Hapus Data
      </button>
      <div class="flex items-center gap-3">
        <button
          @click="importData"
          :disabled="scrapingStatus !== 'SUCCESS' || isImporting || matchingStatus"
          class="flex items-center gap-2 bg-[#B1E8D9] text-[#3D927B] hover:bg-[#8EDEC8] font-semibold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowDownTrayIcon class="w-4 h-4" />
          <span v-if="isImporting || matchingStatus">
            <svg class="animate-spin h-4 w-4 mr-1 inline" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading...
          </span>
          <span v-else>Import Data</span>
        </button>
        <!-- <button
          class="flex items-center gap-2 bg-[#DEDCFF] text-[#2F27CE] hover:bg-[#CAC8E8] font-semibold px-4 py-2 rounded"
        >
          <CloudArrowUpIcon class="w-4 h-4" />
          Upload model ontology
        </button>
        <button
          class="flex items-center gap-2 bg-[#DEDCFF] text-[#2F27CE] hover:bg-[#CAC8E8] font-semibold px-4 py-2 rounded"
        >
          <ArrowUpTrayIcon class="w-4 h-4" />
          Ekspor Json
        </button> -->
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
          <tr v-for="(item, idx) in dataList" :key="item.id" class="even:bg-[#F7F6FE]">
            <td class="px-4 py-2">{{ idx + 1 }}</td>
            <td class="px-4 py-2">
              <div class="font-semibold">{{ item.job_title }}</div>
              <div class="text-sm text-gray-500">{{ item.company_name }}</div>
            </td>
            <td class="px-4 py-2">{{ item.province }}</td>
            <td class="px-4 py-2">
              {{ Array.isArray(item.skills) ? item.skills.join(', ') : item.skills }}
            </td>
            <td class="px-4 py-2">{{ item.scraped_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
      class="mt-4"
      :page="page"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :pages="pages"
      @update:page="val => (page = val)"
      @update:perPage="val => (perPage = val)"
      @change="handlePaginationChange"
    />
  </div>
</template>

<script>
  import axios from 'axios';
  import Pagination from '../components/Pagination.vue';
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
    ChevronUpDownIcon,
  } from '@heroicons/vue/24/outline';

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
      ChevronUpDownIcon,
    },
    data() {
      return {
        page: 1,
        perPage: 10,
        total: 100,
        lastPage: 10,
        pages: Array.from({ length: 10 }, (_, i) => i + 1),
        dataList: [],
        scrapingStatus: null,
        matchingStatus: null,
        scrapedJobs: null,
        startedAt: null,
        timeSpent: null,
        refreshInterval: null,
        refreshInterval: null,
        isScraping: false,
        isImporting: false,
      };
    },
    methods: {
      getAuthHeader() {
        const token = localStorage.getItem('user-token');
        return token;
      },
      formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleString();
      },
      formatTimeSpent(seconds) {
        if (seconds == null) return '-';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
      },
      parseStatus(status) {
        if (!status) return '-';
        // Ubah ke lower, split underscore, kapitalisasi tiap kata, lalu join spasi
        return status
          .toLowerCase()
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      },
      async startScraping() {
        try {
          this.isScraping = true;
          await axios.post('http://localhost:8000/api/jobs/scraping/start/', null, {
            headers: {
              Authorization: `Bearer ${this.getAuthHeader()}`,
            },
          });
          this.refreshScraping(); // langsung refresh setelah mulai
        } catch (e) {
          alert('Gagal mulai scraping');
        }
      },
      async refreshScraping() {
        try {
          const res = await axios.get('http://localhost:8000/api/jobs/scraping/status/', {
            headers: {
              Authorization: `Bearer ${this.getAuthHeader()}`,
            },
          });
          if (res.data['message']) {
            this.isScraping = false;
            this.scrapingStatus = null;
            this.scrapedJobs = null;
            this.startedAt = null;
            this.timeSpent = null;
            this.dataList = [];
          } else {
            this.scrapingStatus = res.data.status;
            this.scrapedJobs = res.data.scraped_jobs;
            this.startedAt = res.data.started_at;
            this.timeSpent = res.data.time_spent;
            this.dataList = res.data.result || [];
            if (res.data.status && !['SUCCESS', 'FAILED'].includes(res.data.status)) {
              this.isScraping = true;
            } else {
              this.isScraping = false;
            }
            // Panggil refreshMatching hanya jika status SUCCESS
            if (this.scrapingStatus === 'SUCCESS') {
              this.refreshMatching();
            } else {
              this.matchingStatus = null;
            }
          }
        } catch (e) {
          this.isScraping = false;
        }
      },
      async cancelScraping() {
        try {
          await axios.post(
            'http://localhost:8000/api/jobs/scraping/cancel/',
            {},
            { headers: { Authorization: `Bearer ${this.getAuthHeader()}` } }
          );
          this.isScraping = false;
          // Kosongkan data
          this.scrapingStatus = null;
          this.scrapedJobs = null;
          this.startedAt = null;
          this.timeSpent = null;
          this.dataList = [];
          this.refreshScraping();
        } catch (e) {
          alert('Gagal membatalkan/hapus data');
        }
      },
      async importData() {
        try {
          this.isImporting = true;
          await axios.post(
            'http://localhost:8000/api/jobs/scraping/matching/start/',
            {},
            { headers: { Authorization: `Bearer ${this.getAuthHeader()}` } }
          );
          // Polling status sampai IMPORTED
          const pollStatus = async () => {
            await this.refreshScraping();
            if (this.scrapingStatus !== 'IMPORTED') {
              setTimeout(pollStatus, 2000);
            } else {
              this.isImporting = false;
              alert('Import & matching berhasil!');
            }
          };
          pollStatus();
        } catch (e) {
          this.isImporting = false;
          alert('Gagal import data');
        }
      },
      async refreshMatching() {
        try {
          const res = await axios.get('http://localhost:8000/api/jobs/scraping/matching/status/', {
            headers: { Authorization: `Bearer ${this.getAuthHeader()}` },
          });
          this.matchingStatus = res.data.status || null;
        } catch (e) {
          this.matchingStatus = null;
          this.isImporting = false;
        }
      },
      handlePaginationChange({ page, perPages }) {
        this.page = page;
        this.perPage = perPages;
        // bisa tambahkan fetch data sesuai page
      },
    },
    mounted() {
      this.refreshScraping();
      // Hanya panggil refreshMatching jika scrapingStatus sudah SUCCESS
      this.refreshInterval = setInterval(() => {
        if (this.isScraping) {
          this.refreshScraping();
        }
        if (this.scrapingStatus === 'SUCCESS') {
          this.refreshMatching();
        }
      }, 5000);
    },
  };
</script>
