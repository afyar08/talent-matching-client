<template>
  <div>
    <!-- Header & Search -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-[#2F27CE] font-['Be_Vietnam_Pro']">
        Data Lowongan Pekerjaan
      </h1>
      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-2 bg-[#FF6550] text-white px-5 py-3 min-w-[180px] whitespace-nowrap rounded font-semibold hover:bg-[#E85C49] transition-colors"
          @click="handleDeleteSelected"
        >
          <TrashIcon class="w-5 h-5" />
          Hapus yang dipilih
        </button>
        <div class="w-72 md:w-96 relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            v-model="search"
            class="pl-10 pr-3 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F27CE] focus:border-[#2F27CE]"
            placeholder="Cari Data ..."
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full text-sm">
        <thead class="bg-[#2F27CE] text-white font-semibold">
          <tr>
            <th class="px-4 py-3 text-left">
              <input
                type="checkbox"
                :checked="
                  pageJobs.length > 0 && pageJobs.every(job => selectedIds.includes(job.id))
                "
                @change="toggleSelectAll"
              />
            </th>
            <th class="px-4 py-3 text-left">No.</th>
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
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, idx) in pageJobs" :key="job.id" class="even:bg-gray-100">
            <td class="px-4 py-2">
              <input type="checkbox" v-model="selectedIds" :value="job.id" />
            </td>
            <td class="px-4 py-2">{{ (page - 1) * perPage + idx + 1 }}</td>
            <td class="px-4 py-2">
              <div class="font-semibold">{{ job.title }}</div>
              <div class="text-sm text-gray-500">{{ job.company }}</div>
            </td>
            <td class="px-4 py-2">{{ job.province }}</td>
            <td class="px-4 py-2">{{ job.skills }}</td>
            <td class="px-4 py-2">{{ job.date }}</td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <div class="relative group flex flex-col items-center">
                  <button
                    class="bg-indigo-100 text-indigo-600 p-3 rounded-md"
                    @click="goToDetail(job.jobUrl)"
                  >
                    >
                    <EyeIcon class="w-5 h-5" />
                  </button>

                  <div
                    class="absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50"
                  >
                    <div
                      class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-600"
                    ></div>
                    <div
                      class="bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
                    >
                      Lihat Detail
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
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
  import { toastService } from '/src/utils/toastService.js';
  import Pagination from '../components/Pagination.vue';
  import axios from 'axios';
  import { EyeIcon, TrashIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline';

  export default {
    name: 'DataPekerjaan',
    components: {
      Pagination,
      EyeIcon,
      TrashIcon,
      ChevronUpDownIcon,
    },
    data() {
      return {
        search: '',
        page: 1,
        perPage: 10,
        total: 0,
        lastPage: 1,
        jobs: [],
        pageJobs: [],
        selectedIds: [],
        selectAll: false,
        pages: [],
      };
    },
    methods: {
      goToDetail(jobUrl) {
        const encoded = encodeURIComponent(jobUrl);
        this.$router.push(`/admin/lowongan/detail/${encoded}`);
      },
      handlePaginationChange({ page, perPages }) {
        this.page = page;
        this.perPage = perPages;
        this.updatePageData(); // <-- tambahkan baris ini!
      },
      toggleSelectAll() {
        const pageJobIds = this.pageJobs.map(job => job.id);
        const allSelected = pageJobIds.every(id => this.selectedIds.includes(id));
        if (allSelected) {
          // Unselect all on this page
          this.selectedIds = this.selectedIds.filter(id => !pageJobIds.includes(id));
        } else {
          // Select all on this page
          this.selectedIds = Array.from(new Set([...this.selectedIds, ...pageJobIds]));
        }
      },
      updatePageData() {
        const start = (this.page - 1) * this.perPage;
        const end = start + this.perPage;
        this.pageJobs = this.jobs.slice(start, end);
      },
      async fetchJobs() {
        try {
          const res = await axios.get('http://localhost:8000/api/jobs/admin/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('user-token')}`,
            },
          });
          // Mapping data dari backend ke struktur yang diinginkan tabel
          this.jobs = res.data.data.map((item, idx) => ({
            id: item.id, // Gunakan ID unik dari backend
            title: item.jobTitle,
            company: item.companyName,
            province: item.province,
            skills: Array.isArray(item.requiredSkills)
              ? item.requiredSkills.join(', ')
              : item.requiredSkills,
            date: this.formatDate(item.scrapedAt),
            jobUrl: item.jobUrl, // Simpan URL lengkap jika diperlukan
            slug: item.slug, // Tambahkan slug jika tersedia
            raw: item, // Simpan data asli jika diperlukan
          }));
          this.total = this.jobs.length;
          this.lastPage = Math.ceil(this.total / this.perPage);
          this.pages = Array.from({ length: this.lastPage }, (_, i) => i + 1);
          this.updatePageData();
        } catch (e) {
          console.error(e);
        }
      },
      formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta',
        });
      },
      async handleDeleteSelected() {
        if (this.selectedIds.length === 0) {
          toastService.show({
            type: 'error',
            message: 'Pilih minimal satu lowongan untuk dihapus',
            duration: 2000,
          });
          return;
        }

        // Ambil job_url dari jobs yang terpilih
        const selectedJobs = this.jobs.filter(job => this.selectedIds.includes(job.id));
        try {
          for (const job of selectedJobs) {
            await axios.post(
              'http://localhost:8000/api/jobs/delete/',
              { job_url: job.jobUrl },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('user-token')}`,
                },
              }
            );
          }
          toastService.show({
            type: 'success',
            message: 'Lowongan berhasil dihapus',
            duration: 2000,
          });
          this.selectedIds = [];
          this.selectAll = false;
          this.fetchJobs();
        } catch (e) {
          toastService.show({
            type: 'error',
            message: 'Gagal menghapus lowongan',
            duration: 3000,
          });
          console.error(e);
        }
      },
    },
    mounted() {
      this.fetchJobs();
    },
  };
</script>
