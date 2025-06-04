<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-[#2F27CE]">Detail Lowongan Pekerjaan</h1>

    <div class=" overflow-hidden">
      <!-- Header: Logo dan Judul -->
      <div class="flex items-center gap-6 p-6 border-b border-gray-200">
        <img :src="job.image_url" alt="Company Logo" class="w-20 h-20 object-contain rounded-md bg-gray-100" />
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ job.job_title }}</h2>
          <p class="text-sm text-gray-600">{{ job.company_name }}</p>
          <a :href="job.job_url" target="_blank" class="text-sm text-indigo-600 hover:underline">Lihat Link Sumber</a>
        </div>
      </div>

      <!-- Info Ringkas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div>
          <p class="text-gray-500 text-sm">Lokasi</p>
          <p class="text-gray-800 font-medium">
            {{ job.subdistrict }}, {{ job.city }}, {{ job.province }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Tipe Pekerjaan</p>
          <p class="text-gray-800 font-medium">{{ job.job_type }} ({{ job.work_arrangement }})</p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Gaji</p>
          <p class="text-gray-800 font-medium">
            Rp {{ formatRupiah(job.salary_min) }} - Rp {{ formatRupiah(job.salary_max) }} / {{ job.salary_unit }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Pendidikan & Pengalaman</p>
          <p class="text-gray-800 font-medium">
            {{ job.education_level }}, {{ job.experience }}
          </p>
        </div>
      </div>

      <!-- Keahlian -->
      <div class="p-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Keahlian yang Dibutuhkan</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="(skill, index) in job.required_skills" :key="index"
                class="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Deskripsi Pekerjaan -->
      <div class="p-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Deskripsi Pekerjaan</h3>
        <div class="prose max-w-none" v-html="job.job_description"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const jobId = route.params.id;

// Dummy data (contoh)
const job = ref({
  job_url: "https://glints.com/id/opportunities/jobs/data-analyst-and-market-research/342cc96b-cf61-4e91-b810-76561b9a7fb1",
  image_url: "https://images.glints.com/unsafe/1920x0/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/3746f775d7d2342985e93ed625c2d2af.png",
  job_title: "Frontend Developer",
  company_name: "PT Gojek Indonesia",
  subdistrict: "Kebayoran Baru",
  city: "Jakarta Selatan",
  province: "DKI Jakarta",
  salary_min: 4000000,
  salary_max: 7000000,
  salary_unit: "Month",
  salary_type: "Base",
  job_type: "Penuh Waktu",
  work_arrangement: "Kerja di kantor",
  education_level: "Diploma (D1 - D4)",
  experience: "1-3 years",
  required_skills: [
    "Javascript",
    "CSS",
    "Ajax",
    "HTML",
    "React.js"
  ],
  job_description: "<p><strong>Tugas dan Tanggung Jawab</strong>:<ul><li>Mengembangkan dan memelihara antarmuka pengguna menggunakan React.js dan teknologi frontend lainnya.</li><li>Mengintegrasikan data dari API menggunakan Ajax atau fetch API.</li></ul></p><p><strong>Kualifikasi:</strong><ul><li>Menguasai JavaScript (ES6+), HTML5, dan CSS3 dengan baik.</li><li>Berpengalaman menggunakan React.js untuk membangun aplikasi skala menengah hingga besar.</li></ul></p>"
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
