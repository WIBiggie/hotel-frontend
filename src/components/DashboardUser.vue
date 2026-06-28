<template>
  <div class="flex flex-col md:flex-row w-screen h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
    
    <header class="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-30 shadow-sm">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-full flex justify-center items-center text-white text-md">🏨</div>
        <h2 class="text-sm font-bold text-slate-700">One Hotel Guest</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xl cursor-pointer">
        {{ isSidebarOpen ? '✕' : '☰' }}
      </button>
    </header>

    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="md:hidden fixed inset-0 bg-black/40 z-20"></div>

    <aside 
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 shadow-sm z-20 transition-transform duration-300 ease-in-out"
      :class="isSidebarOpen ? 'translate-x-0 pt-20 md:pt-5' : '-translate-x-full'"
    >
      <div>
        <div class="hidden md:flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
          <div class="w-10 h-10 bg-indigo-600 rounded-full flex justify-center items-center text-white text-xl shadow-md font-bold">H</div>
          <div>
            <h2 class="text-sm font-bold text-slate-700">Guest Dashboard</h2>
            <p class="text-xs text-emerald-500 font-semibold">● Client Connected</p>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Main Menu</p>
          <button 
            @click="currentMenu = 'booking'; isSidebarOpen = false"
            :class="currentMenu === 'booking' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all cursor-pointer"
          >
            🛎️ Book a Room
          </button>
          <button 
            @click="currentMenu = 'history'; isSidebarOpen = false"
            :class="currentMenu === 'history' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all cursor-pointer"
          >
            📜 My Reservations
          </button>
        </div>
      </div>

      <button @click="handleLogout" class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-sm rounded-xl transition-colors cursor-pointer">
        Sign Out 🚪
      </button>
    </aside>

    <main class="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50/50">
      
      <div v-if="isLoading" class="text-center py-12 text-slate-400 font-medium italic">
        Menghubungkan & memuat data dari server...
      </div>

      <div v-else>
        <div v-if="currentMenu === 'booking'" class="space-y-6">
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Find Your Perfect Room</h1>
            <p class="text-sm text-slate-500">Pilih tipe kamar ternyaman untuk masa menginap Anda.</p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap gap-4 items-end">
            <div class="flex-1 min-w-[150px]">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Capacity Filter</label>
              <select v-model="filter.capacity" class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-500">
                <option value="All">All Capacities</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="4">4 Persons</option>
              </select>
            </div>
            <div class="flex-1 min-w-[150px]">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Check In</label>
              <input v-model="filter.checkIn" type="date" class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div class="flex-1 min-w-[150px]">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Check Out</label>
              <input v-model="filter.checkOut" type="date" class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="room in filteredRooms" :key="room.id" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <img :src="room.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'" alt="Room Image" class="w-full h-48 object-cover bg-slate-100" />
                <div class="p-5 space-y-2">
                  <div class="flex justify-between items-start">
                    <h3 class="text-lg font-bold text-slate-900">{{ room.name }}</h3>
                    <span class="text-xl">{{ room.icon || '🏨' }}</span>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed line-clamp-3">{{ room.facilities || room.description }}</p>
                  <div class="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
                    <span>👥 Max {{ room.capacity }} Pax</span>
                  </div>
                </div>
              </div>

              <div class="p-5 pt-0 border-t border-slate-50 mt-4 flex justify-between items-center bg-slate-50/50">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price / Night</p>
                  <p class="text-md font-black text-indigo-600">Rp {{ room.price?.toLocaleString('id-ID') }}</p>
                </div>
                <button @click="openBookingModal(room)" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer">
                  Book Now
                </button>
              </div>
            </div>

            <div v-if="filteredRooms.length === 0" class="col-span-full py-12 text-center text-slate-400 italic bg-white rounded-2xl border border-dashed border-slate-300">
              Maaf, tipe kamar dengan kriteria tersebut saat ini tidak tersedia.
            </div>
          </div>
        </div>

        <div v-if="currentMenu === 'history'" class="space-y-4">
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Your Reservations</h1>
            <p class="text-sm text-slate-500">Pantau seluruh riwayat transaksi pemesanan kamar hotel Anda.</p>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm min-w-[600px]">
                <thead class="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                  <tr>
                    <th class="p-4 w-16 text-center">No</th>
                    <th class="p-4">Room Type</th>
                    <th class="p-4">Check In</th>
                    <th class="p-4">Check Out</th>
                    <th class="p-4 text-center">Guests</th>
                    <th class="p-4">Total Pay</th>
                    <th class="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr v-for="(res, idx) in historyReservations" :key="res.id || idx" class="hover:bg-slate-50/30">
                    <td class="p-4 text-center font-medium text-slate-400">{{ idx + 1 }}</td>
                    <td class="p-4 font-bold text-slate-900">{{ res.room_type || res.type }}</td>
                    <td class="p-4 text-slate-500">{{ res.check_in || res.checkIn }}</td>
                    <td class="p-4 text-slate-500">{{ res.check_out || res.checkOut }}</td>
                    <td class="p-4 text-center font-semibold">{{ res.capacity }} Pax</td>
                    <td class="p-4 font-bold text-emerald-600">Rp {{ (res.total_price || res.totalPrice)?.toLocaleString('id-ID') }}</td>
                    <td class="p-4 text-center">
                      <span :class="res.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'" class="px-2.5 py-1 text-[11px] font-bold rounded-full uppercase border">
                        {{ res.status || 'Pending' }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="historyReservations.length === 0">
                    <td colspan="7" class="p-8 text-center text-slate-400 italic">Anda belum memiliki riwayat reservasi kamar.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="isBookingModalOpen" class="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div class="bg-indigo-600 text-white p-5 font-black text-base flex justify-between items-center">
          <span>Confirm Your Reservation</span>
          <button @click="isBookingModalOpen = false" class="text-white/80 hover:text-white text-lg cursor-pointer">✕</button>
        </div>
        
        <div class="p-5 space-y-4">
          <div class="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Kamar Pilihan</p>
            <h4 class="font-black text-lg text-slate-900">{{ selectedRoom?.name }}</h4>
            <p class="text-sm text-slate-500">{{ selectedRoom?.facilities || selectedRoom?.description }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Check In Date</p>
              <p class="font-bold text-slate-800">{{ filter.checkIn || '-' }}</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Check Out Date</p>
              <p class="font-bold text-slate-800">{{ filter.checkOut || '-' }}</p>
            </div>
          </div>

          <div class="flex justify-between items-center p-3 border-t pt-4">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Estimasi Bayar</p>
              <p class="text-lg font-black text-indigo-600">Rp {{ selectedRoom?.price?.toLocaleString('id-ID') }}</p>
            </div>
            <div class="flex gap-2">
              <button @click="isBookingModalOpen = false" class="px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
              <button @click="confirmBooking" class="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer">Confirm Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api' // <-- Pastikan path impor file Axios/api.js ini sudah benar

const router = useRouter()
const isSidebarOpen = ref(false)
const currentMenu = ref('booking')
const isLoading = ref(false)

// State Inti Terhubung ke DB Backend
const roomsDatabase = ref([])
const historyReservations = ref([])

// State Filter Input User
const filter = ref({
  capacity: 'All',
  checkIn: new Date().toISOString().split('T')[0],
  checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0] // Besok
})

const isBookingModalOpen = ref(false)
const selectedRoom = ref(null)

// ================= AMBIL DATA DARI BACKEND =================
const fetchUserDashboardData = async () => {
  try {
    isLoading.value = true
    
    // 1. Ambil Katalog Semua Tipe Kamar Aktif / Tersedia
    const roomsRes = await api.get('/rooms')
roomsDatabase.value = roomsRes.data.data || roomsRes.data

    // 2. Ambil Riwayat Transaksi Reservasi Akun Terkait
    const historyRes = await api.get('/bookings')
historyReservations.value = historyRes.data.data || historyRes.data

  } catch (error) {
    console.error('Error fetching user dashboard data:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('Sesi masuk berakhir atau Anda tidak diizinkan mengakses halaman ini.')
      handleLogout()
    }
  } finally {
    isLoading.value = false
  }
}

// ROUTE PROTECTION GUARD (ON MOUNT)
onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Melindungi halaman dari pengunjung gelap yang belum masuk/login
  if (!token || role !== 'customer') {
    alert('Akses ditolak! Silakan login terlebih dahulu untuk memesan kamar.')
    router.push('/')
    return
  }

  fetchUserDashboardData()
})

// FILTERING LOGIC KAMAR (COMPUTED PROPERTY)
const filteredRooms = computed(() => {
  if (filter.value.capacity === 'All') return roomsDatabase.value
  return roomsDatabase.value.filter(r => r.capacity === parseInt(filter.value.capacity))
})

// ================= LOGIKA RESERVASI (POST DATA KE BACKEND) =================
const openBookingModal = (room) => {
  selectedRoom.value = room
  isBookingModalOpen.value = true
}

const confirmBooking = async () => {
  try {
    // Kirim data pesanan baru ke server backend kamu
    await api.post('/bookings/checkout', {
  room_id: selectedRoom.value.id, // ID tipe kamar
      check_in: filter.value.checkIn,
      check_out: filter.value.checkOut,
      capacity: selectedRoom.value.capacity,
      total_price: selectedRoom.value.price
    })

    alert('Pemesanan berhasil dikirim! Silakan tunggu konfirmasi persetujuan pihak hotel.')
    isBookingModalOpen.value = false
    currentMenu.value = 'history' // Pindah otomatis ke tab riwayat
    
    fetchUserDashboardData() // Segarkan isi tabel terbaru dari server

  } catch (error) {
    console.error('Booking Gagal:', error)
    alert(error.response?.data?.message || 'Gagal memproses transaksi pemesanan.')
  }
}

// LOGOUT CLEAR ACCESS
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}
</script>