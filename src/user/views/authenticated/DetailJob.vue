<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';

// Sample job data (would normally be fetched based on job ID)
const job = ref({
    job_url: "https://glints.com/id/opportunities/jobs/data-analyst-and-market-research/342cc96b-cf61-4e91-b810-76561b9a7fb1?utm_referrer=explore&traceInfo=2991bcf2-e842-45f5-aa9b-1afbad2692be",
    image_url: "https://images.glints.com/unsafe/1920x0/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/3746f775d7d2342985e93ed625c2d2af.png",
    job_title: "Data Analyst & Market Research",
    company_name: "Waschen Alora Indonesia",
    subdistrict: "Cimanggis",
    city: "Depok",
    province: "Jawa Barat",
    salary_min: 4000000,
    salary_max: 7000000,
    salary_unit: "Month",
    salary_type: "Base",
    job_type: "Penuh Waktu",
    work_arrangement: "Kerja di kantor",
    education_level: "Diploma (D1 - D4)",
    experience: "1-3 years",
    required_skills: [
        "Statistical Data Analysis",
        "Data Analytics",
        "Microsoft Excel",
        "SQL",
        "Power BI"
    ],
    job_description: "<p><strong>Tugas dan Tanggung Jawab</strong> <em>(Job Description)</em>:</p><ul><li>Menyediakan laporan berbasis data (<em>data-driven reports</em>) untuk mendukung pengambilan keputusan bisnis. </li><li>Mengumpulkan, menganalisis, dan melaporkan data kinerja aktivitas digital marketing. </li><li>Mengidentifikasi tren dan wawasan dari data untuk mengoptimalkan strategi marketing. </li><li>Membuat laporan dan visualisasi data yang mudah dipahami. </li><li>Menggunakan alat analisis data (misalnya, Google Analytics, Excel, SQL) untuk mengolah data.</li><li>Memantau dan menganalisis KPI (<em>Key Performance Indicators</em>) untuk mengukur efektivitas marketing. </li><li>Menyajikan hasil analisis data kepada tim marketing dan manajemen.</li><li>Mengembangkan dan memelihara dasbor data.</li><li>Melakukan analisis kompetitif dan riset pasar. </li><li>Mengolah dan menganalisis data untuk memberikan insight bisnis.</li><li>Melakukan riset pasar untuk mengidentifikasi tren industri dan peluang bisnis.</li><li>Menyusun dan menyajikan laporan analisis kepada tim terkait.</li><li>Berkolaborasi dengan divisi marketing, sales dan operasional Perusahaan.</li><li>Mengelola akses dan keamanan data (<em>data access and security</em>) untuk laporan. </li></ul><p></p><p><strong>Keahlian</strong> (<em>Skill</em>):</p><ul><li>SQL dan data Visualization tools  </li><li>Power BI</li><li>Microsoft Excell</li><li>Google Sheet</li><li>Google Apps Script, Python</li><li>Data Analytics dan Statistical Data Analysis</li></ul><p></p><p><strong>Kualifikasi</strong> (<em>Requirements</em>):</p><ul><li>Pendidikan minimal Diploma/Sarjana di bidang terkait (relevan).</li><li>Memiliki pengalaman bekerja minimal 1 s.d. 3 tahun dibidang pengolahan dan analis data (lebih diutamakan di bidang <em>digital marketing</em> dan <em>market research</em>).</li><li>Lancar berbahasa Inggris.</li><li>Memiliki integritas, loyalitas, pekerja keras, dan <em>fast response.</em></li><li>Pengalaman dalam menggunakan alat analisis data (Google Analytics, Excel, SQL, Python).</li><li>Kemampuan untuk membuat laporan dan visualisasi data yang jelas dan ringkas, dengan  Power BI atau Tableau.</li><li>Memahami statistik, analisis tren, dan <em>machine learning</em> dasar.</li><li>Kemampuan untuk bekerja dengan data besar dan kompleks. </li><li>Berpikir analitis, <em>detail-oriented</em>, serta mampu menyajikan data secara logis.</li><li>Komunikatif &amp; kolaboratif, bisa bekerja sama dengan tim marketing, sales, dan operasional.</li><li>Kemampuan dalam mengidentifikasi pola dan tren dari data.</li></ul><p></p><p><strong>Kompensani dan Benefit:</strong></p><ul><li>Gaji yang kompetitif dengan insentif kinerja.</li><li>BPJS (Asuransi kesehatan)</li><li>Kesempatan untuk bertumbuh dan berkembang di perusahaan yang bereputasi baik.</li></ul><p></p>",
    similarity_score: 0.4,
    match_type: "mid"
});

// State for bookmark
const isBookmarked = ref(false);

// Toggle bookmark state
const toggleBookmark = () => {
    isBookmarked.value = !isBookmarked.value;
};

// Format salary from number to display format
const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';

    const formatNumber = (num) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    if (min && max) {
        return `Rp ${formatNumber(min)} - ${formatNumber(max)}`;
    } else if (min) {
        return `Rp ${formatNumber(min)}+`;
    } else if (max) {
        return `Up to Rp ${formatNumber(max)}`;
    }
};

// State for report modal
const showReportModal = ref(false);
const reportReason = ref('');
const reportComment = ref('');

// Function to open report modal
const reportJob = () => {
    showReportModal.value = true;
};

// Function to close report modal
const closeReportModal = () => {
    showReportModal.value = false;
    reportReason.value = '';
    reportComment.value = '';
};

// Function to submit report
const submitReport = () => {
    // Here you would normally send this data to an API
    console.log('Report submitted:', {
        reason: reportReason.value,
        comment: reportComment.value
    });
    // Show success message or handle response
    closeReportModal();
};

// Watch for modal state changes to control body scrolling
watch(() => showReportModal.value, (isShowing) => {
  if (isShowing) {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  } else {
    // Restore scrolling when modal is closed
    document.body.style.overflow = '';
  }
});

// Make sure to restore scrolling if component is unmounted while modal is open
onUnmounted(() => {
  document.body.style.overflow = '';
});

// Computed property to format similarity score as percentage
const matchPercentage = computed(() => {
  return Math.round(job.value.similarity_score * 100) + '%';
});

// Computed property to get match text based on match_type
const matchText = computed(() => {
  switch(job.value.match_type) {
    case 'weak':
      return 'Kurang Match';
    case 'mid':
      return 'Cukup Match';
    case 'strong':
      return 'Sangat Match';
    default:
      return 'Cukup Match';
  }
});

// Computed property to determine bar colors based on match_type
const matchBars = computed(() => {
  // Default to all gray bars
  let bars = ['bg-gray-200', 'bg-gray-200', 'bg-gray-200'];
  
  switch(job.value.match_type) {
    case 'weak':
      // Only first bar is active (reddish)
      bars[0] = 'bg-[#FF8A8A]';
      break;
    case 'mid':
      // First two bars are active (orange)
      bars[0] = 'bg-[#FF9A6C]';
      bars[1] = 'bg-[#FF9A6C]';
      break;
    case 'strong':
      // All three bars are active (green)
      bars[0] = 'bg-[#5BEAA2]';
      bars[1] = 'bg-[#5BEAA2]';
      bars[2] = 'bg-[#5BEAA2]';
      break;
  }
  
  return bars;
});
</script>

<template>
    <div class="min-h-screen flex flex-col font-be-vietnam-pro">
        <Navbar />

        <main class="flex-grow bg-[FCFCFF]">
            <!-- Job Header Section - Updated with margins to create floating effect -->
            <div class="max-w-[1200px] mx-auto px-4 md:px-8 2xl:px-0 pt-8">
                <div
                    class="bg-[#4745F6] text-white py-10 px-6 md:px-10 rounded-xl shadow-md w-[1196px] h-[439px] flex flex-col justify-center">
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                        <!-- Left side with job details -->
                        <div class="mb-6 md:mb-0 px-8 w-full">
                            <!-- Job title and company name -->
                            <h1 class="text-3xl font-bold mb-2">{{ job.job_title }}</h1>
                            <h2 class="text-xl mb-6">{{ job.company_name }}</h2>

                            <!-- Horizontal line - UPDATED: Made longer and thicker -->
                            <div class="w-[85%] h-[2px] bg-white/60 mb-8"></div>

                            <!-- Job info icons in a clean vertical layout -->
                            <div class="flex flex-col space-y-3">
                                <!-- Location - Updated to show City, Province format -->
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {{ job.city }}, {{ job.province }}
                                </div>

                                <!-- Salary Range -->
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ formatSalary(job.salary_min, job.salary_max) }} per month
                                </div>

                                <!-- Education Level -->
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                    {{ job.education_level }}
                                </div>

                                <!-- Full Time -->
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ job.job_type }}
                                </div>
                            </div>
                        </div>

                        <!-- Right side with company logo - INCREASED SIZE -->
                        <div
                            class="w-100 h-60 bg-white mr-10 mt-4 rounded-lg flex items-center justify-center shadow-md">
                            <img :src="job.image_url || 'https://via.placeholder.com/96'" :alt="job.company_name"
                                class="max-w-full max-h-full object-contain p-5"
                                onerror="this.src='https://via.placeholder.com/96?text=Logo'" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- New section - Header with Description title and action buttons -->
            <div class="max-w-[1200px] mx-auto px-4 md:px-8 2xl:px-0 my-8 flex justify-between items-center">
                <!-- Left side: Description title -->
                <h2 class="text-3xl font-bold text-[#1E1E1E]">Deskripsi</h2>

                <!-- Right side: Action buttons -->
                <div class="flex gap-3">
                    <!-- Link Sumber Button with Icon -->
                    <button
                        class="flex items-center gap-2 bg-[#5BEAA2] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#4cd391] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Link Sumber
                    </button>

                    <!-- Bookmark Button with Icon -->
                    <button @click="toggleBookmark"
                        class="flex items-center gap-2 bg-[#3042DF] text-white font-semibold py-2 px-6 rounded-md hover:bg-[#2735b3] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                :fill="isBookmarked ? 'white' : 'none'" />
                        </svg>
                        Bookmark
                    </button>
                </div>
            </div>

            <!-- Content Section -->
            <div class="max-w-[1200px] mx-auto px-4 md:px-8 2xl:px-0">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Left Column: Job Description -->
                    <div class="md:col-span-2">
                        <!-- Job Description Content - Removed the heading since we moved it above -->
                        <div class="prose max-w-none" v-html="job.job_description"></div>
                        
                        <!-- Report Job Button -->
                        <div class="mt-4 text-left">
                            <button 
                                @click="reportJob" 
                                class="text-[#FF6161] font-medium rounded-md transition-colors hover:text-[#E04040] cursor-pointer"
                            >
                                <div class="flex items-center gap-2 justify-center">
                                    <img src="../../../../src/assets/icons/svg-megaphone.svg" alt="Report icon" class="h-5 w-5" />
                                    Laporkan Lowongan Ini
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Right Column: Skills and Info -->
                    <div class="md:col-span-1">
                        <!-- Talent Match Card -->
                        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                          <h3 class="text-xl font-bold text-[#1E1E1E] mb-4">Talent Match</h3>
                          
                          <!-- Skill Match Percentage with Progress Bar -->
                          <div class="mb-4">
                            <div class="flex items-center justify-between mb-1">
                              <p class="font-bold text-md text-[#5952D8]">{{ matchPercentage }} Skill Match</p>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                              <div class="bg-[#5952D8] h-2.5 rounded-full" :style="{ width: matchPercentage }"></div>
                            </div>
                          </div>
                          
                          <!-- Match Type with 3 Bars -->
                          <div>
                            <p class="font-bold text-[#FF8473] text-md mb-1">{{ matchText }}</p>
                            <div class="flex gap-2">
                              <div :class="[matchBars[0], 'h-2.5 rounded-full flex-1']"></div>
                              <div :class="[matchBars[1], 'h-2.5 rounded-full flex-1']"></div>
                              <div :class="[matchBars[2], 'h-2.5 rounded-full flex-1']"></div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Skills Tags - Moved from left column to right column -->
                        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 class="text-xl font-bold mb-6">Skills</h3>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="skill in job.required_skills" :key="skill"
                                    class="bg-[#EEF0FF] text-[#2F27CE] text-sm py-2 px-4 rounded-md inline-flex items-center">
                                    {{ skill }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <Footer />
    </div>

    <!-- Report Job Modal -->
    <div v-if="showReportModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-invert backdrop-opacity-10">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-xl">
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-xl font-semibold text-[#2F27CE]">Laporkan Lowongan</h3>
                <button @click="closeReportModal" class="text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <!-- Modal Body -->
            <div class="p-6">
                <div class="mb-4">
                    <p class="mb-3">Pilih 1 alasan untuk melaporkan lowongan ini <span class="text-red-500">*</span></p>
                    
                    <div class="space-y-2">
                        <div class="flex items-center">
                            <input type="radio" id="reason-1" v-model="reportReason" value="link-unavailable" class="mr-2 h-4 w-4">
                            <label for="reason-1">Link sumber tidak tersedia</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-2" v-model="reportReason" value="inappropriate-job" class="mr-2 h-4 w-4">
                            <label for="reason-2">Pekerjaan tidak layak</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-3" v-model="reportReason" value="unclear-description" class="mr-2 h-4 w-4">
                            <label for="reason-3">Deskripsi lowongan tidak jelas atau tidak sesuai</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-4" v-model="reportReason" value="scam" class="mr-2 h-4 w-4">
                            <label for="reason-4">Lowongan terindikasi penipuan</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-5" v-model="reportReason" value="not-it-job" class="mr-2 h-4 w-4">
                            <label for="reason-5">Bukan termasuk lowongan pekerjaan IT</label>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="radio" id="reason-6" v-model="reportReason" value="other" class="mr-2 h-4 w-4">
                            <label for="reason-6">Lainnya</label>
                        </div>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label for="report-comment" class="block mb-2">Keterangan</label>
                    <textarea 
                        id="report-comment" 
                        v-model="reportComment" 
                        class="w-full border border-gray-300 rounded p-2 h-30"
                        placeholder="Ketik keterangan laporan..."
                    ></textarea>
                </div>
            </div>
            
            <!-- Modal Footer -->
            <div class="flex justify-end p-4 border-t">
                <button 
                    @click="submitReport" 
                    class="bg-[#2F27CE] text-white px-4 py-2 rounded font-semibold hover:bg-[#261fb3]"
                    :disabled="!reportReason"
                >
                    Simpan
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.font-be-vietnam-pro {
    font-family: 'Be Vietnam Pro', sans-serif;
}

/* Style for rich text content */
.prose {
    max-width: 65ch;
    color: #374151;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
    font-weight: 600;
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose p {
    margin-bottom: 1em;
    line-height: 1.6;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose ul {
    margin-left: 1.5em;
    margin-bottom: 1em;
    list-style-type: disc;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose li {
    margin-bottom: 0.5em;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose strong {
    font-weight: 600;
    font-family: 'Be Vietnam Pro', sans-serif;
}

.prose em {
    font-style: italic;
    font-family: 'Be Vietnam Pro', sans-serif;
}
</style>
