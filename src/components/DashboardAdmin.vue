<template>
  <div class="flex flex-col md:flex-row w-screen h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
    
    <header class="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30 shadow-sm print:hidden">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-[#2e3a50] rounded-full flex justify-center items-center text-white text-md">🏨</div>
        <h2 class="text-sm font-bold text-gray-700">One Hotel Admin</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xl cursor-pointer">
        {{ isSidebarOpen ? '✕' : '☰' }}
      </button>
    </header>

    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="md:hidden fixed inset-0 bg-black/40 z-20 transition-opacity print:hidden"></div>

    <aside class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5 shadow-sm z-20 transition-transform duration-300 ease-in-out print:hidden" :class="isSidebarOpen ? 'translate-x-0 pt-20 md:pt-5' : '-translate-x-full'">
      <div>
        <div class="hidden md:flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <div class="w-10 h-10 bg-[#2e3a50] rounded-full flex justify-center items-center text-white text-xl shadow-sm">🏨</div>
          <div class="flex-1">
            <h2 class="text-sm font-bold text-gray-700">Hotel Admin</h2>
            <p class="text-xs text-green-500 font-medium">● Connected to Server</p>
          </div>
          <button @click="handleLogout" class="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-lg cursor-pointer transition-colors" title="Logout">🚪</button>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Menu Admin</p>
          <button @click="currentTab = 'overview'" :class="currentTab === 'overview' ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100' : 'text-gray-600 hover:bg-gray-50'" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer">📊 Overview & Reports</button>
          <button @click="currentTab = 'rooms'" :class="currentTab === 'rooms' ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100' : 'text-gray-600 hover:bg-gray-50'" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer">🛏️ Manage Rooms</button>
          <button @click="currentTab = 'roomTypes'" :class="currentTab === 'roomTypes' ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100' : 'text-gray-600 hover:bg-gray-50'" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer">🏷️ Room Types</button>
        </div>
      </div>
      <div class="md:hidden block mb-4">
        <button @click="handleLogout" class="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold text-sm text-center">Logout</button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-slate-50/50">
      
      <div v-if="isLoading" class="text-center py-12 text-gray-500 font-medium">
        Memuat data dari server backend...
      </div>

      <div v-else>
        <div v-if="currentTab === 'overview'" class="space-y-6">
          <div class="flex justify-between items-center print:hidden">
            <h2 class="text-xl font-bold text-gray-800">Hotel Report Overview</h2>
            <button @click="printReport" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer">🖨️ Print Report</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Rooms</p>
              <h3 class="text-2xl font-bold text-gray-900 mt-1">{{ stats.totalRooms }}</h3>
            </div>
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Rooms</p>
              <h3 class="text-2xl font-bold text-green-600 mt-1">{{ stats.availableRooms }}</h3>
            </div>
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Booked / Transactions</p>
              <h3 class="text-2xl font-bold text-indigo-600 mt-1">{{ stats.totalTransactions }}</h3>
            </div>
          </div>

          <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-gray-700">Recent Transactions History</div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm min-w-[600px]">
                <thead class="bg-slate-100 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th class="p-3 w-16 text-center">No</th>
                    <th class="p-3">Guest Name</th>
                    <th class="p-3">Room</th>
                    <th class="p-3">Type</th>
                    <th class="p-3">Check In</th>
                    <th class="p-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-gray-700">
                  <tr v-for="(tx, index) in transactions" :key="tx.id || index" class="hover:bg-slate-50/50">
                    <td class="p-3 text-center text-gray-400">{{ index + 1 }}</td>
                    <td class="p-3 font-semibold text-gray-900">{{ tx.guest_name }}</td>
                    <td class="p-3">Room {{ tx.room_number }}</td>
                    <td class="p-3 text-indigo-600">{{ tx.room_type }}</td>
                    <td class="p-3 text-gray-500">{{ tx.check_in }}</td>
                    <td class="p-3">
                      <span :class="tx.status === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'" class="px-2 py-0.5 text-xs font-semibold rounded-full uppercase">
                        {{ tx.status }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="transactions.length === 0">
                    <td colspan="6" class="p-6 text-center text-gray-400 italic">Belum ada riwayat transaksi.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div v-if="currentTab === 'rooms'" class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-800">Room Management</h2>
            <button @click="openCreateRoomModal" class="bg-[#1e293b] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm">Add Room +</button>
          </div>

          <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm min-w-[500px]">
                <thead class="bg-[#2e3a50] text-white font-semibold">
                  <tr>
                    <th class="p-3 w-16 text-center">No</th>
                    <th class="p-3">Room Number</th>
                    <th class="p-3">Room Type</th>
                    <th class="p-3 text-center">Status</th>
                    <th class="p-3 w-32 text-center">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-gray-700 bg-white">
                  <tr v-for="(room, index) in rooms" :key="room.id || index" class="hover:bg-slate-50/80">
                    <td class="p-3 text-center text-gray-400">{{ index + 1 }}</td>
                    <td class="p-3 font-bold text-gray-900">Room {{ room.number }}</td>
                    <td class="p-3 text-indigo-600 font-semibold">{{ room.type_name }}</td>
                    <td class="p-3 text-center">
                      <span :class="room.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {{ room.status }}
                      </span>
                    </td>
                    <td class="p-3 text-center">
                      <div class="flex justify-center gap-2">
                        <button @click="deleteRoom(room.id)" class="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer shadow-sm">🗑️</button>
                        <button @click="openEditRoomModal(room)" class="bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer shadow-sm">✏️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div v-if="currentTab === 'roomTypes'" class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-800">Room Types Configurations</h2>
            <button @click="openCreateRoomTypeModal" class="bg-[#1e293b] hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm">Add Type +</button>
          </div>

          <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm min-w-[600px]">
                <thead class="bg-[#2e3a50] text-white font-semibold">
                  <tr>
                    <th class="p-3 w-16 text-center">No</th>
                    <th class="p-3">Type Name</th>
                    <th class="p-3">Facilities</th>
                    <th class="p-3 text-center">Capacity</th>
                    <th class="p-3">Price / Night</th>
                    <th class="p-3 w-32 text-center">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-gray-700 bg-white">
                  <tr v-for="(type, index) in roomTypes" :key="type.id || index" class="hover:bg-slate-50/80">
                    <td class="p-3 text-center text-gray-400">{{ index + 1 }}</td>
                    <td class="p-3 font-bold text-gray-900">{{ type.name }}</td>
                    <td class="p-3 text-gray-500 text-xs max-w-xs truncate">{{ type.facilities }}</td>
                    <td class="p-3 text-center font-bold">{{ type.capacity }} Pax</td>
                    <td class="p-3 text-emerald-600 font-bold">Rp {{ type.price_per_night?.toLocaleString('id-ID') }}</td>
                    <td class="p-3 text-center">
                      <div class="flex justify-center gap-2">
                        <button @click="deleteRoomType(type.id)" class="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer shadow-sm">🗑️</button>
                        <button @click="openEditRoomTypeModal(type)" class="bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer shadow-sm">✏️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>

    <div v-if="isRoomModalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div class="bg-white w-full max-w-sm rounded-xl shadow-xl overflow-hidden">
        <div class="bg-[#2e3a50] text-white p-4 font-bold text-sm">{{ isEditRoomMode ? 'Edit Room' : 'Add New Room' }}</div>
        <form @submit.prevent="submitRoom" class="p-4 space-y-3">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Room Number</label>
            <input v-model="formRoom.number" type="text" required placeholder="e.g. 101" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Room Type</label>
            <select v-model="formRoom.type_name" required class="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500">
              <option v-for="t in roomTypes" :key="t.id" :value="t.name">{{ t.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
            <select v-model="formRoom.status" required class="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500">
              <option value="available">Available</option>
              <option value="booked">Booked</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t">
            <button type="button" @click="closeRoomModal" class="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">Save Room</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isRoomTypeModalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div class="bg-white w-full max-w-sm rounded-xl shadow-xl overflow-hidden">
        <div class="bg-[#2e3a50] text-white p-4 font-bold text-sm">{{ isEditRoomTypeMode ? 'Edit Room Type' : 'Add New Room Type' }}</div>
        <form @submit.prevent="submitRoomType" class="p-4 space-y-3">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Type Name</label>
            <input v-model="formRoomType.name" type="text" required placeholder="e.g. Deluxe Room" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Facilities</label>
            <input v-model="formRoomType.facilities" type="text" required placeholder="AC, Wifi, TV, Mini Bar" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Capacity</label>
              <input v-model.number="formRoomType.capacity" type="number" required min="1" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Price / Night</label>
              <input v-model.number="formRoomType.price" type="number" required min="0" placeholder="500000" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t">
            <button type="button" @click="closeRoomTypeModal" class="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">Save Type</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api' // <-- Pastikan import konfigurasi Axios kamu sudah mengarah ke file yang benar

const router = useRouter()
const isSidebarOpen = ref(false)
const currentTab = ref('overview')
const isLoading = ref(false)
const currentSelectedId = ref(null)

// Core Database States
const rooms = ref([])
const roomTypes = ref([])
const transactions = ref([])
const stats = ref({ totalRooms: 0, availableRooms: 0, totalTransactions: 0 })

// Modals Control Rooms
const isRoomModalOpen = ref(false)
const isEditRoomMode = ref(false)
const formRoom = ref({ number: '', type_name: '', status: 'available' })

// Modals Control Room Types
const isRoomTypeModalOpen = ref(false)
const isEditRoomTypeMode = ref(false)
const formRoomType = ref({ name: '', facilities: '', price: null, capacity: 2 })

// ================= AMBIL DATA NYATA (FETCH BACKEND) =================
const fetchDashboardData = async () => {
  try {
    isLoading.value = true
    
    // 1. Ambil data kamar langsung dari endpoint publik/admin kamu (/rooms)
    const roomsRes = await api.get('/rooms')
    rooms.value = roomsRes.data.data || roomsRes.data

    // 2. Ambil konfigurasi tipe kamar sesuai dokumentasi (/room-types)
    const typesRes = await api.get('/room-types')
    roomTypes.value = typesRes.data.data || typesRes.data

    // 3. Ambil data transaksi/reservasi dari endpoint booking (/bookings)
    const bookingsRes = await api.get('/bookings')
    transactions.value = bookingsRes.data.data || bookingsRes.data

    // 4. Hitung statistik secara mandiri di frontend karena tidak ada endpoint khusus /dashboard-stats
    const totalRoomsCount = rooms.value.length
    // Asumsi di data kamar kamu terdapat kolom 'status' (misal: 'available' atau 'terisi')
    const availableRoomsCount = rooms.value.filter(room => room.status === 'available' || room.status === 1).length 
    const totalTxCount = transactions.value.length

    stats.value = {
      totalRooms: totalRoomsCount,
      availableRooms: availableRoomsCount,
      totalTransactions: totalTxCount
    }

  } catch (error) {
    console.error('Error fetching admin data:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('Sesi masuk berakhir atau Anda tidak diizinkan mengakses panel ini.')
      handleLogout()
    }
  } finally {
    isLoading.value = false
  }
}

// ROUTE PROTECTION GUARD ON MOUNT
onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Mencegah akses masuk ilegal jika bukan admin hotel
  if (!token || role !== 'admin') {
    alert('Akses ditolak! Halaman ini memerlukan hak akses Admin Hotel.')
    router.push('/')
    return
  }

  fetchDashboardData()
})

// ================= LOGIKA MANAGEMENT KAMAR (CRUD ROOMS) =================
const openCreateRoomModal = () => {
  isEditRoomMode.value = false
  isRoomModalOpen.value = true
}
const openEditRoomModal = (room) => {
  isEditRoomMode.value = true
  currentSelectedId.value = room.id
  formRoom.value = { number: room.number, type_name: room.type_name, status: room.status }
  isRoomModalOpen.value = true
}
const closeRoomModal = () => {
  isRoomModalOpen.value = false
  formRoom.value = { number: '', type_name: '', status: 'available' }
}
const submitRoom = async () => {
  try {
    if (isEditRoomMode.value) {
      await api.put(`/admin/rooms/${currentSelectedId.value}`, formRoom.value)
      alert('Kamar berhasil diperbarui!')
    } else {
      await api.post('/admin/rooms', formRoom.value)
      alert('Kamar baru sukses ditambahkan!')
    }
    fetchDashboardData()
    closeRoomModal()
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menyimpan data kamar.')
  }
}
const deleteRoom = async (id) => {
  if (confirm('Hapus kamar ini secara permanen dari database hotel?')) {
    try {
      await api.delete(`/admin/rooms/${id}`)
      fetchDashboardData()
    } catch (error) {
      alert('Gagal menghapus kamar.')
    }
  }
}

// ================= LOGIKA MANAGEMENT TIPE KAMAR (CRUD ROOM TYPES) =================
const openCreateRoomTypeModal = () => {
  isEditRoomTypeMode.value = false
  isRoomTypeModalOpen.value = true
}
const openEditRoomTypeModal = (type) => {
  isEditRoomTypeMode.value = true
  currentSelectedId.value = type.id
  formRoomType.value = { name: type.name, facilities: type.facilities, price: type.price, capacity: type.capacity }
  isRoomTypeModalOpen.value = true
}
const closeRoomTypeModal = () => {
  isRoomTypeModalOpen.value = false
  formRoomType.value = { name: '', facilities: '', price: null, capacity: 2 }
}
const submitRoomType = async () => {
  try {
    if (isEditRoomTypeMode.value) {
      await api.put(`/admin/room-types/${currentSelectedId.value}`, formRoomType.value)
      alert('Konfigurasi tipe kamar diperbarui!')
    } else {
      await api.post('/admin/room-types', formRoomType.value)
      alert('Tipe kamar baru sukses ditambahkan!')
    }
    fetchDashboardData()
    closeRoomTypeModal()
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menyimpan tipe kamar.')
  }
}
const deleteRoomType = async (id) => {
  if (confirm('Menghapus tipe kamar ini dapat berdampak pada data relasi kamar.')) {
    try {
      await api.delete(`/admin/room-types/${id}`)
      fetchDashboardData()
    } catch (error) {
      alert('Gagal menghapus tipe kamar.')
    }
  }
}

// PRINT REPORT FUNCTION
const printReport = () => {
  window.print()
}

// LOGOUT CLEAR ACCESS
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}
</script>

<style scoped>
@media print {
  .print\:hidden {
    display: none !important;
  }
}
</style>