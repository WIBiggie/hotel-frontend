<template>
  <div class="flex flex-col md:flex-row w-screen h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
    
    <header class="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30 shadow-sm">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-cyan-500 rounded-full flex justify-center items-center text-white text-md">
          🌐
        </div>
        <h2 class="text-sm font-bold text-gray-700">Super Admin</h2>
      </div>
      <button 
        @click="isSidebarOpen = !isSidebarOpen" 
        class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xl cursor-pointer"
      >
        {{ isSidebarOpen ? '✕' : '☰' }}
      </button>
    </header>

    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="md:hidden fixed inset-0 bg-black/40 z-20 transition-opacity"
    ></div>

    <aside 
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5 shadow-sm z-20 transition-transform duration-300 ease-in-out"
      :class="isSidebarOpen ? 'translate-x-0 pt-20 md:pt-5' : '-translate-x-full'"
    >
      <div>
        <div class="hidden md:flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <div class="w-10 h-10 bg-cyan-500 rounded-full flex justify-center items-center text-white text-xl shadow-sm">
            🌐
          </div>
          <div class="flex-1">
            <h2 class="text-sm font-bold text-gray-700">Super Admin</h2>
          </div>
          <button @click="handleLogout" class="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-lg cursor-pointer transition-colors" title="Logout">
            🚪
          </button>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Navigation</p>
          
          <button @click="isSidebarOpen = false; router.push('/dashboardsuperadmin')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer">
            📊 Overview
          </button>
          
          <button class="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium rounded-lg text-sm text-left transition-colors">
            🏨 Hotel
          </button>
          
          <button @click="isSidebarOpen = false; router.push('/account')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer">
            👤 Account Management
          </button>
        </div>
      </div>

      <div class="md:hidden block mb-4">
        <button @click="handleLogout" class="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold text-sm transition-colors cursor-pointer text-center">
          Logout
        </button>
      </div>

      <div class="text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
        &copy; 2026 Hotel System v1.0
      </div>
    </aside>

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-slate-50/50">
      
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div class="flex w-full sm:max-w-md bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search hotel name or address..." 
            class="flex-1 px-4 py-2 outline-none text-sm" 
          />
          <div class="bg-blue-500 px-5 flex items-center justify-center text-white">
            🔍
          </div>
        </div>
        <button 
          @click="openCreateModal"
          class="bg-[#1e293b] hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          Create +
        </button>
      </div>

      <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full min-w-0 mb-4 md:mb-0">
        <div class="overflow-x-auto overflow-y-auto max-h-[400px] w-full block">
          <table class="w-full text-left border-collapse text-sm min-w-[700px]">
            <thead class="sticky top-0 z-10">
              <tr class="bg-[#2e3a50] text-white font-semibold">
                <th class="p-3.5 border-b border-gray-200 w-16 text-center">No</th>
                <th class="p-3.5 border-b border-gray-200">Hotel</th>
                <th class="p-3.5 border-b border-gray-200">Address</th>
                <th class="p-3.5 border-b border-gray-200 w-24 text-center">Rooms</th>
                <th class="p-3.5 border-b border-gray-200">Administrator</th>
                <th class="p-3.5 border-b border-gray-200 w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700 font-medium bg-white">
              <tr v-for="(hotel, index) in filteredHotels" :key="index" class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-center text-gray-400">{{ index + 1 }}</td>
                <td class="p-3.5 font-bold text-gray-900">{{ hotel.name }}</td>
                <td class="p-3.5 text-gray-500 leading-relaxed">{{ hotel.address }}</td>
                <td class="p-3.5 text-center font-semibold">{{ hotel.rooms }}</td>
                <td class="p-3.5 text-indigo-600">{{ hotel.admin || '-' }}</td>
                <td class="p-3.5 text-center">
                  <div class="flex justify-center items-center gap-2">
                    <button @click="deleteHotel(index)" class="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer transition-colors shadow-sm" title="Delete">
                      🗑️
                    </button>
                    <button @click="openEditModal(index)" class="bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer transition-colors shadow-sm" title="Edit">
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredHotels.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400 italic bg-gray-50/50">
                  No hotels found matching "{{ searchQuery }}"
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>

    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity"
    >
      <div class="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all">
        <div class="bg-[#2e3a50] text-white p-4 flex justify-between items-center">
          <h3 class="font-bold text-md flex items-center gap-2">
            🏨 {{ isEditMode ? 'Edit Hotel Details' : 'Add New Hotel' }}
          </h3>
          <button @click="closeModal" class="text-white hover:text-gray-300 text-lg cursor-pointer">✕</button>
        </div>
        
        <form @submit.prevent="submitHotel" class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hotel Name</label>
            <input 
              v-model="formHotel.name"
              type="text" 
              required
              placeholder="e.g. Grand Metro"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
            <textarea 
              v-model="formHotel.address"
              required
              rows="3"
              placeholder="e.g. Tasikmalaya, Jln. Khz. Mustofa"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Number of Rooms</label>
              <input 
                v-model.number="formHotel.rooms"
                type="number" 
                required
                min="1"
                placeholder="200"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Administrator</label>
              <input 
                v-model="formHotel.admin"
                type="text" 
                placeholder="e.g. Admin4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              {{ isEditMode ? 'Update Changes' : 'Save Hotel' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// UI State
const isSidebarOpen = ref(false)
const isModalOpen = ref(false)
const isEditMode = ref(false)         // Penanda mode Form (true = edit, false = create)
const currentEditIndex = ref(null)     // Menyimpan indeks array data yang sedang diedit

// Search State
const searchQuery = ref('')

// Form State Object (Menggantikan newHotel agar reusable untuk edit)
const formHotel = ref({
  name: '',
  address: '',
  rooms: null,
  admin: ''
})

// Data Utama Array Hotel
const hotels = ref([
  { name: 'One Hotel', address: 'Tasikmalaya, Tawang Sari, jln.Khz.Mustofa,', rooms: 200, admin: 'Admin1' },
  { name: 'Kehoncewang', address: 'Tasikmalaya, Tawang Sari, jln.Khz.Mustofa,', rooms: 500, admin: 'Admin2' },
  { name: 'Dewi Sartika', address: 'Tasikmalaya, Tawang Sari, jln.Khz.Mustofa,', rooms: 300, admin: 'Admin3' }
])

// 1. FITUR SEARCH
const filteredHotels = computed(() => {
  if (!searchQuery.value) return hotels.value
  
  const query = searchQuery.value.toLowerCase().trim()
  return hotels.value.filter(hotel => {
    return hotel.name.toLowerCase().includes(query) || 
           hotel.address.toLowerCase().includes(query)
  })
})

// 2. KONTROL FORM MODAL MENGGUNAKAN DUA MODE
const openCreateModal = () => {
  isEditMode.value = false
  isModalOpen.value = true
}

const openEditModal = (index) => {
  isEditMode.value = true
  currentEditIndex.value = index
  
  // Ambil data dari baris terpilih berdasarkan indeks aslinya
  const selectedHotel = hotels.value[index]
  
  // Salin datanya ke objek form agar tampil di input isian modal
  formHotel.value = {
    name: selectedHotel.name,
    address: selectedHotel.address,
    rooms: selectedHotel.rooms,
    admin: selectedHotel.admin
  }
  
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  currentEditIndex.value = null
  // Reset isian form
  formHotel.value = { name: '', address: '', rooms: null, admin: '' }
}

// 3. LOGIKA EKSEKUSI DATA (KREATIF/UPDATE)
const submitHotel = () => {
  if (isEditMode.value) {
    // Mode Edit: Timpa data lama pada indeks terpilih dengan isian form baru
    hotels.value[currentEditIndex.value] = {
      name: formHotel.value.name,
      address: formHotel.value.address,
      rooms: formHotel.value.rooms,
      admin: formHotel.value.admin
    }
  } else {
    // Mode Create: Tambahkan objek baru ke dalam array list
    hotels.value.push({
      name: formHotel.value.name,
      address: formHotel.value.address,
      rooms: formHotel.value.rooms,
      admin: formHotel.value.admin
    })
  }
  
  closeModal()
}

// 4. FITUR DELETE
const deleteHotel = (index) => {
  if (confirm('Are you sure you want to delete this hotel?')) {
    hotels.value.splice(index, 1)
  }
}

const handleLogout = () => {
  router.push('/')
}
</script>