<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-[#2F27CE] font-['Be_Vietnam_Pro']">
        Data Report Lowongan
      </h1>
      <div class="flex items-center gap-4">
        <div class="w-72 md:w-96 relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
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
            v-model="DataUser"
            class="pl-10 pr-3 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F27CE] focus:border-[#2F27CE]"
            placeholder="Cari Data...."
          />
        </div>
      </div>
    </div>
    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full text-sm">
        <thead class="bg-[#2F27CE] text-white font-semibold">
          <tr>
            <th class="px-4 py-3 text-left">No.</th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Judul Pekerjaan, Nama Perusahaan
                <ChevronUpDownIcon class="w-6 h-6 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Tipe Report
                <ChevronUpDownIcon class="w-6 h-6 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Nama User
                <ChevronUpDownIcon class="w-6 h-6 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Tanggal Daftar
                <ChevronUpDownIcon class="w-6 h-6 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(report, index) in pageReports" :key="index" class="even:bg-gray-100">
            <td class="px-4 py-2">{{ (page - 1) * perPage + index + 1 }}</td>
            <td class="px-4 py-2">
              <div class="font-semibold">{{ report.jobTitle }}</div>
              <div class="text-sm text-gray-500">{{ report.company }}</div>
            </td>
            <td class="px-4 py-2">{{ report.reportType }}</td>
            <td class="px-4 py-2">{{ report.user }}</td>
            <td class="px-4 py-2">{{ report.date }}</td>
            <td class="px-4 py-2">
              <span
                :class="[
                  report.status === 'Sudah Ditinjau'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-orange-100 text-orange-500',
                  'px-2 py-1 rounded-md text-xs font-semibold',
                ]"
              >
                {{ report.status }}
              </span>
            </td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <!-- Lihat Detail -->
                <div class="relative group flex flex-col items-center">
                  <button
                    class="bg-indigo-100 text-indigo-600 p-3 rounded-md"
                    @click="goToDetail(report)"
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
                <!-- Tombol lainnya bisa ditambahkan di sini -->
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
  import Pagination from '../components/Pagination.vue';
  import axios from 'axios';
  import { EyeIcon, TrashIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline';

  export default {
    name: 'DataReport',
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
        reports: [],
        pageReports: [],
        pages: [],
      };
    },
    methods: {
      goToDetail(report) {
        const uid = report.uid;
        const encodedJobUrl = encodeURIComponent(report.jobUrl);
        this.$router.push(`/admin/report/detail/${uid}/${encodedJobUrl}`);
      },
      handlePaginationChange({ page, perPages }) {
        this.page = page;
        this.perPage = perPages;
        this.updatePageData();
      },
      updatePageData() {
        const start = (this.page - 1) * this.perPage;
        const end = start + this.perPage;
        this.pageReports = this.reports.slice(start, end);
      },
      async fetchReports() {
        try {
          const res = await axios.post(
            'http://localhost:8000/api/report/admin/',
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('user-token')}`,
              },
            }
          );
          // Mapping data dari backend ke struktur yang diinginkan tabel
          this.reports = res.data.data.map((item, idx) => ({
            id: idx + 1, // Atau gunakan id unik jika ada
            jobTitle: item.job?.jobTitle || '-',
            company: item.job?.companyName || '-',
            reportType: item.report?.reportType || '-',
            user: item.user?.name || '-',
            date: this.formatDate(item.job?.scrapedAt),
            status: item.report?.reportStatus || '-',
            uid: item.user?.uid,
            jobUrl: item.job?.jobUrl,
          }));
          this.total = this.reports.length;
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
        return date.toLocaleDateString('id-ID');
      },
    },
    mounted() {
      this.fetchReports();
    },
  };
</script>
