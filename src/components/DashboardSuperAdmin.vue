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
            <span class="bg-red-500 text-white rounded px-1.5 py-0.5 text-xs font-bold"><ArrowBackRoundedIcon height="1em" /></span>
          </button>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">navigation</p>
          
          <button @click="isSidebarOpen = false" class="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium rounded-lg text-sm text-left transition-colors">
            <AccountBalanceIcon height="1em" /> Overview
          </button>
          
          <button 
            @click="router.push('/hotel')" 
            class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer"
          >
            <HomeWorkIcon height="1em" /> Hotel
          </button>
          
          <button 
            @click="router.push('/account')" 
            class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer"
          >
            <AccountBoxIcon height="1em" /> Account Management
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

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-slate-50/50 min-w-0">
      
      <div v-if="isLoading" class="text-center py-6 text-gray-500 font-medium">Loading server statistics...</div>

      <div v-else class="w-full">
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 max-w-4xl">
          <div class="bg-[#1e253b] text-white p-5 rounded-lg shadow-sm border border-slate-700">
            <p class="text-sm font-bold tracking-wider">Registered Hotel</p>
            <p class="text-3xl font-extrabold mt-1">{{ stats.totalHotels }}</p>
          </div>
          <div class="bg-[#1e253b] text-white p-5 rounded-lg shadow-sm border border-slate-700">
            <p class="text-sm font-bold tracking-wider">Number of Rooms</p>
            <p class="text-3xl font-extrabold mt-1">{{ stats.totalRooms }}</p>
          </div>
          <div class="bg-[#1e253b] text-white p-5 rounded-lg shadow-sm border border-slate-700">
            <p class="text-sm font-bold tracking-wider">Total Transactions</p>
            <p class="text-3xl font-extrabold mt-1">{{ stats.totalTransactions }}</p>
          </div>
        </section>

        <section class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full min-w-0">
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left border-collapse text-sm min-w-[800px]">
              <thead>
                <tr class="bg-[#2a3447] text-white font-semibold border-b border-gray-300">
                  <th class="p-3 border-r border-gray-600 w-16 text-center">No</th>
                  <th class="p-3 border-r border-gray-600 w-1/4">Hotel</th>
                  <th class="p-3 border-r border-gray-600 w-2/5">Address</th>
                  <th class="p-3 border-r border-gray-600 w-28 text-center">Rooms</th>
                  <th class="p-3">Administrator</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 text-gray-700 bg-white">
  <tr v-for="(hotel, index) in hotels" :key="hotel.id || index" class="hover:bg-slate-50 transition-colors">
    <td class="p-3 text-center text-gray-600 border-r border-gray-200">{{ index + 1 }}</td>
    <td class="p-3 text-gray-800 border-r border-gray-200 font-medium">{{ hotel.name }}</td>
    <td class="p-3 text-gray-600 border-r border-gray-200">{{ hotel.address }}</td>
    <td class="p-3 text-center text-gray-600 border-r border-gray-200">{{ hotel.rooms_count || 0 }}</td>
    <td class="p-3 text-gray-600">
      {{ hotel.admins && hotel.admins.length > 0 ? hotel.admins[0].name : '-' }}
    </td>
  </tr>
  <tr v-if="hotels.length === 0">
    <td colspan="5" class="p-8 text-center text-gray-400 italic bg-gray-50/50">No hotels found.</td>
  </tr>
</tbody>
            </table>
          </div>
        </section>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api' 

const router = useRouter()
const isLoading = ref(false) 
const isSidebarOpen = ref(false)
const hotels = ref([])
const stats = ref({ totalHotels: 0, totalRooms: 0, totalTransactions: 0 })

// Fungsi ekstrak array bawaan Anda
const extractArray = (res) => {
  if (!res) return []
  const dataObj = res.data
  if (!dataObj) return []
  if (dataObj.data && Array.isArray(dataObj.data.data)) return dataObj.data.data
  if (Array.isArray(dataObj.data)) return dataObj.data
  if (Array.isArray(dataObj)) return dataObj
  return []
}

const fetchSuperAdminData = async () => {
  try {
    isLoading.value = true
    
    // 1. Ambil data dari endpoint overview yang baru
    const hotelsRes = await api.get('/hotels/overview')
    hotels.value = extractArray(hotelsRes) // Berisi list hotel beserta rooms_count dan admins

    // 2. Hitung total seluruh kamar secara dinamis dari akumulasi properti rooms_count setiap hotel
    let totalRoomsCount = 0
    hotels.value.forEach(hotel => {
      totalRoomsCount += parseInt(hotel.rooms_count || 0, 10)
    })

    // 3. Ambil data bookings untuk total transaksi
    let totalTxCount = 0
    try {
      const bookingsRes = await api.get('/bookings')
      const bookings = extractArray(bookingsRes)
      totalTxCount = bookings.length
    } catch (err) {
      console.warn('Gagal memuat detail transaksi untuk statistik:', err)
    }

    // 4. Masukkan hasil kalkulasi yang bersih ke dalam state stats
    stats.value = {
      totalHotels: hotels.value.length, // Total jumlah hotel terdaftar
      totalRooms: totalRoomsCount,     // Total akumulasi seluruh kamar hotel
      totalTransactions: totalTxCount
    }

  } catch (error) {
    console.error('Error fetching Super Admin data:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('Sesi masuk berakhir atau Anda tidak diizinkan mengakses panel ini.')
      handleLogout()
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const cleanRole = role ? String(role).trim().toLowerCase().replace(/-/g, '') : ''
  if (!token || cleanRole !== 'superadmin') {
    alert('Akses ditolak! Halaman ini memerlukan hak akses Super Admin.')
    router.push('/')
    return
  }

  fetchSuperAdminData()
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}
</script>