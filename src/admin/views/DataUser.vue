<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-[#2F27CE] font-['Be_Vietnam_Pro']">Data User</h1>
      <div class="flex items-center gap-4">
        <button @click="showAddModal = true"
          class="bg-[#2F27CE] text-white px-4 py-3 w-36 rounded font-semibold hover:bg-[#2735b3] transition-colors">
          Tambah User
        </button>
        <div class="w-72 md:w-96 relative">
          <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <input type="text" v-model="DataUser"
            class="pl-10 pr-3 py-3 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F27CE] focus:border-[#2F27CE]"
            placeholder="Cari Data...." />
        </div>
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
                Nama User, Email
                <ChevronUpDownIcon class="w-6 h-6 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Provinsi
                <ChevronUpDownIcon class="w-6 h-6 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Gender
                <ChevronUpDownIcon class="w-6 h-6 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">
              <div class="flex items-center gap-1">
                Tanggal Daftar
                <ChevronUpDownIcon class="w-6 h-6 text-white" />
              </div>
            </th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="even:bg-gray-100">
            <td class="px-4 py-2">{{ user.id }}</td>
            <td class="px-4 py-2">
              <div class="font-semibold">{{ user.name }}</div>
              <div class="text-sm text-gray-500">{{ user.email }}</div>
            </td>
            <td class="px-4 py-2">{{ user.province }}</td>
            <td class="px-4 py-2">{{ user.gender }}</td>
            <td class="px-4 py-2">{{ user.date }}</td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <!-- Lihat Detail -->
                <div class="relative group flex flex-col items-center">
                  <button @click="openDetailModal(user)" class="bg-indigo-100 text-indigo-600 p-3 rounded-md">
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <div class="absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50">
                    <div
                      class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-600">
                    </div>
                    <div class="bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap">
                      Lihat Detail
                    </div>
                  </div>
                </div>
                <!-- Hapus -->
                <div class="relative group flex flex-col items-center">
                  <button class="bg-red-100 text-red-600 p-3 rounded-md">
                    <TrashIcon class="w-5 h-5" />
                  </button>
                  <div class="absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50">
                    <div
                      class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-600">
                    </div>
                    <div class="bg-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap">
                      Hapus Data
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
    <Pagination :page="page" :perPage="perPage" :lastPage="lastPage" :total="total" :pages="pages"
      @update:page="val => page = val" @update:perPage="val => perPage = val" @change="handlePaginationChange" />
  </div>

  <!-- Modal Tambah User -->
  <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-1/2">
      <div class="flex items-start justify-between mb-4">
        <h2 class="text-xl font-bold text-blue-800">Tambah User</h2>
        <button @click="showAddModal = false" class="text-gray-600 hover:text-black">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      <!-- Form Tambah -->
      <form class="space-y-6 p-4">
  <!-- Full Name -->
  <div>
    <label class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
    <div class="relative">
      <input type="text" placeholder="Masukkan nama lengkap"
        class="w-full border border-gray-300 rounded-md p-3 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition" />
    </div>
  </div>

  <!-- Email & Provinsi -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
      <div class="relative">
        <input type="email" placeholder="Masukkan email"
          class="w-full border border-gray-300 rounded-md p-3 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1">Provinsi</label>
      <div class="relative">
        <input type="text" placeholder="Masukkan provinsi"
          class="w-full border border-gray-300 rounded-md p-3 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition" />
      </div>
    </div>

    <!-- Date of Birth -->
            <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="dateOfBirth"
                  v-model="dateOfBirth"
                  type="date"
                  max="9999-12-31"
                  placeholder="MM/DD/YYYY"
                  @change="validateDateOfBirth"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                  required
                />
              </div>
            </div>

    <!-- Gender -->
    <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">
                Gender <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  id="gender"
                  v-model="gender"
                  class="appearance-none w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4745F6] focus:border-[#4745F6]"
                  required
                >
                  <option  value="" disabled selected>Pilih Gender</option>
                  <option v-for="option in genderOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
  </div>
</form>

      
      <!-- Footer -->
      <div class="flex justify-end gap-2 mt-8">
        <button @click="deleteUser(selectedUser)"
          class="bg-[#FF6550] hover:bg-[#E85C49] text-white text-sm px-4 py-2 rounded">
          Hapus
        </button>
        <button @click="showAddModal = false"
          class="bg-[#2F27CE] hover:bg-[#2735b3] text-white text-sm px-4 py-2 rounded">
          Tutup
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Detail User -->
  <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[700px] max-w-full p-6 relative">

      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <h2 class="text-xl font-bold text-blue-800">Detail User</h2>
        <button @click="showDetailModal = false" class="text-gray-600 hover:text-black">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Body -->
      <div class="flex gap-6 items-start">
        <!-- Foto -->
        <img :src="selectedUser?.photo || 'https://ui-avatars.com/api/?name=' + selectedUser?.name" alt="User Photo"
          class="w-24 h-24 rounded-full object-cover border" />

        <!-- Info User -->
        <div class="flex-1">
          <p class="text-sm text-gray-500 mb-2">Tanggal Daftar: {{ selectedUser?.date }}</p>
          <div class="border-t border-gray-200 my-4"></div>
          <!-- Profil -->
          <div class="grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
            <div>
              <p class="font-semibold">Full Name</p>
              <p>{{ selectedUser?.name }}</p>
            </div>
            <div>
              <p class="font-semibold">Provinsi</p>
              <p>{{ selectedUser?.province }}</p>
            </div>
            <div>
              <p class="font-semibold">Email</p>
              <p>{{ selectedUser?.email }}</p>
            </div>
            <div>
              <p class="font-semibold">Gender</p>
              <p>{{ selectedUser?.gender }}</p>
            </div>
            <div>
              <p class="font-semibold">Tanggal Lahir</p>
              <p>{{ selectedUser?.birthdate }}</p>
            </div>
          </div>

          <!-- Skill -->
          <div class="mt-6">
            <h4 class="font-semibold text-sm mb-2">Skill</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="(skill, index) in selectedUser?.skills" :key="index"
                class="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600 font-medium">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2 mt-8">
        <button @click="deleteUser(selectedUser)"
          class="bg-[#FF6550] hover:bg-[#E85C49] text-white text-sm px-4 py-2 rounded">
          Hapus
        </button>
        <button @click="showDetailModal = false"
          class="bg-[#2F27CE] hover:bg-[#2735b3] text-white text-sm px-4 py-2 rounded">
          Tutup
        </button>
      </div>
    </div>
  </div>

</template>

<script>
import Pagination from '../components/Pagination.vue'
import { EyeIcon, TrashIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/vue/24/outline'


export default {
  name: 'DataUser',
  components: {
    Pagination,
    EyeIcon,
    TrashIcon,
    ChevronUpDownIcon,
    XMarkIcon
  },
  data() {
    return {
      page: 1,
      perPage: 10,
      total: 100,
      lastPage: 10,
      pages: Array.from({ length: 10 }, (_, i) => i + 1),
      users: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: 'Afyar Siti',
        email: 'afyar@gmail.com',
        province: 'Jawa Barat',
        gender: 'Perempuan',
        date: '31/12/2024',
        birthdate: "08/12/2003",
        photo: "/images/users/afyar.png",
        skills: ["Javascript", "CSS", "Ajax"]
      })),
      showAddModal: false,
      showDetailModal: false,
      selectedUser: null,
      gender: '',
      genderOptions: ['Laki-laki', 'Perempuan'],
      isGenderOpen: false,
    };
  },
  methods: {
    handlePaginationChange({ page, perPages }) {
      this.page = page;
      this.perPage = perPages;
    },
    openDetailModal(user) {
      this.selectedUser = user
      this.showDetailModal = true
    }

  }
}
</script>
