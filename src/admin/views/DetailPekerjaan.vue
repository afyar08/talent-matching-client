<template>
  <div class="p-6 max-w-5xl mx-auto" v-if="job">
    <h1 class="text-3xl font-bold mb-6 text-[#2F27CE]">Detail Lowongan Pekerjaan</h1>
    <div class="overflow-hidden">
      <!-- Header: Logo dan Judul -->
      <div class="flex items-center gap-6 p-6 border-b border-gray-200">
        <img
          :src="job.imageUrl"
          alt="Company Logo"
          class="w-20 h-20 object-contain rounded-md bg-gray-100"
        />
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ job.jobTitle }}</h2>
          <p class="text-sm text-gray-600">{{ job.companyName }}</p>
          <a :href="job.jobUrl" target="_blank" class="text-sm text-indigo-600 hover:underline">
            Lihat Link Sumber
          </a>
        </div>
      </div>

      <!-- Info Ringkas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div>
          <p class="text-gray-500 text-sm">Lokasi</p>
          <p class="text-gray-800 font-medium">
            <template v-if="job.subdistrict">
              {{ job.subdistrict }}, {{ job.city }}, {{ job.province }}
            </template>
            <template v-else-if="job.city">{{ job.city }}, {{ job.province }}</template>
            <template v-else>
              {{ job.province }}
            </template>
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Tipe Pekerjaan</p>
          <p class="text-gray-800 font-medium">
            {{ job.employmentType }}
            <template v-if="job.workSetup">({{ job.workSetup }})</template>
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Gaji</p>
          <p class="text-gray-800 font-medium">
            <template v-if="job.salaryMin">
              <template v-if="job.salaryMax">
                Rp {{ formatRupiah(job.salaryMin) }} - Rp {{ formatRupiah(job.salaryMax) }} / bulan
              </template>
              <template v-else>Rp {{ formatRupiah(job.salaryMin) }} / bulan</template>
            </template>
            <template v-else>Lowongan pekerjaan tidak menampilkan gaji</template>
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Pendidikan & Pengalaman</p>
          <p class="text-gray-800 font-medium">
            {{ job.minimumEducation }}
            <template v-if="job.minimumExperience">, {{ job.minimumExperience }} tahun</template>
          </p>
        </div>
      </div>

      <!-- Keahlian -->
      <div class="p-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Keahlian yang Dibutuhkan</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(skill, index) in job.requiredSkills"
            :key="index"
            class="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Deskripsi Pekerjaan -->
      <div class="p-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Deskripsi Pekerjaan</h3>
        <div class="prose max-w-none" v-html="job.jobDescription"></div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-10 text-gray-400">Memuat data...</div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';

  const route = useRoute();
  const jobUrl = route.params.id; // ini hasil encodeURIComponent dari halaman sebelumnya

  const job = ref(null);

  onMounted(async () => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/jobs/admin/detail/',
        { job_url: decodeURIComponent(jobUrl) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user-token')}`,
          },
        }
      );
      job.value = res.data.data ? res.data.data : res.data;
      console.log('Job detail:', job.value);
    } catch (e) {
      console.error(e);
    }
  });

  function formatRupiah(value) {
    return new Intl.NumberFormat('id-ID').format(value);
  }
</script>

<style scoped>
  .prose ul {
    list-style: disc;
    padding-left: 1.5rem;
  }
  .prose li {
    margin-bottom: 0.5rem;
  }
</style>
