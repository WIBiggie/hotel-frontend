<template>
  <div class="flex flex-col md:flex-row w-screen h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
    
    <!-- Mobile Header -->
    <header class="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-30 shadow-sm">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-full flex justify-center items-center text-white text-md">🏨</div>
        <h2 class="text-sm font-bold text-slate-700">Hotel Guest</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xl cursor-pointer">
        {{ isSidebarOpen ? '✕' : '☰' }}
      </button>
    </header>

    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="md:hidden fixed inset-0 bg-black/40 z-20"></div>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 shadow-sm z-20 transition-transform duration-300 ease-in-out"
      :class="isSidebarOpen ? 'translate-x-0 pt-20 md:pt-5' : '-translate-x-full'"
    >
      <div>
        <div class="hidden md:flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
          <div class="w-10 h-10 bg-indigo-600 rounded-full flex justify-center items-center text-white text-xl shadow-md font-bold">H</div>
          <div>
            <h2 class="text-sm font-bold text-slate-700">Guest Dashboard</h2>
            <p class="text-xs text-emerald-500 font-semibold">● Connected</p>
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
            @click="switchToHistory"
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

    <!-- Main Content -->
    <main class="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50/50">
      
      <div v-if="isLoading" class="text-center py-12 text-slate-400 font-medium italic">
        Menghubungkan & memuat data dari server...
      </div>

      <div v-else>
        <!-- BOOKING TAB -->
        <div v-if="currentMenu === 'booking'" class="space-y-6">
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">Find Your Perfect Room</h1>
            <p class="text-sm text-slate-500">Pilih tipe kamar ternyaman untuk masa menginap Anda.</p>
          </div>

          <!-- Filter Bar -->
          <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap gap-4 items-end">
            <div class="flex-1 min-w-[150px]">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Capacity</label>
              <select v-model="filter.capacity" class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-500">
                <option value="All">All Capacities</option>
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="4">4 Persons</option>
              </select>
            </div>
            <div class="flex-1 min-w-[150px]">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Check In</label>
              <input v-model="filter.checkIn" type="date" :min="today" class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div class="flex-1 min-w-[150px]">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Check Out</label>
              <input v-model="filter.checkOut" type="date" :min="filter.checkIn || today" class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <!-- Room Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="room in filteredRooms" :key="room.id"
              class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <img
                  :src="room.img_url || room.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'"
                  alt="Room Image"
                  class="w-full h-48 object-cover bg-slate-100"
                />
                <div class="p-5 space-y-2">
                  <div class="flex justify-between items-start">
                    <h3 class="text-lg font-bold text-slate-900">{{ room.name }}</h3>
                    <span class="text-xl">🏨</span>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed line-clamp-3">{{ room.facilities || room.description }}</p>
                  <div class="bg-indigo-500 w-fit px-2 rounded-xl">
                    <p class="text-base text-slate-500 leading-relaxed line-clamp-3 text-white">{{ room.status}}</p>
                  </div>
                  <div class="flex items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
                    <span>👥 Max {{ room.capacity }} Pax</span>
                  </div>
                </div>
              </div>
              <div class="p-5 pt-0 border-t border-slate-50 mt-1 flex justify-between items-center bg-slate-50/50">
                <div>
                  <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price / Night</p>
                  <p class="text-md font-black text-indigo-600">Rp {{ room.price?.toLocaleString('id-ID') }}</p>
                </div>
                <button
                  @click="openBookingModal(room)"
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>

            <div v-if="filteredRooms.length === 0" class="col-span-full py-12 text-center text-slate-400 italic bg-white rounded-2xl border border-dashed border-slate-300">
              Maaf, tipe kamar dengan kriteria tersebut saat ini tidak tersedia.
            </div>
          </div>
        </div>

        <!-- HISTORY TAB -->
        <div v-if="currentMenu === 'history'" class="space-y-4">
          <div class="flex justify-between items-center">
            <div class="flex flex-col gap-1">
              <h1 class="text-2xl font-black text-slate-900 tracking-tight">Your Reservations</h1>
              <p class="text-sm text-slate-500">Pantau seluruh riwayat transaksi pemesanan kamar Anda.</p>
            </div>
            <button @click="fetchUserDashboardData" class="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">
              🔄 Refresh
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm min-w-[700px]">
                <thead class="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                  <tr>
                    <th class="p-4 w-12 text-center">No</th>
                    <th class="p-4">Room Type</th>
                    <th class="p-4">Check In</th>
                    <th class="p-4">Check Out</th>
                    <th class="p-4">Total Pay</th>
                    <th class="p-4 text-center">Status</th>
                    <th class="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr v-for="(res, idx) in historyReservations" :key="res.id || idx" class="hover:bg-slate-50/30">
                    <td class="p-4 text-center font-medium text-slate-400">{{ idx + 1 }}</td>
                    <td class="p-4 font-bold text-slate-900">{{ res.room_type?.name || res.room_type || res.room?.room_type?.name || res.type || '-' }}</td>
                    <td class="p-4 text-slate-500">{{ res.check_in || res.checkIn }}</td>
                    <td class="p-4 text-slate-500">{{ res.check_out || res.checkOut }}</td>
                    <td class="p-4 font-bold text-emerald-600">Rp {{ (res.total_price || res.totalPrice || res.price || 0).toLocaleString('id-ID') }}</td>
                    <td class="p-4 text-center">
                      <span :class="statusClass(res.status)" class="px-2.5 py-1 text-[11px] font-bold rounded-full uppercase border">
                        {{ res.status }}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <!-- Tombol bayar ulang jika masih pending dan ada snap_token / payment_url -->
                      <button
                        v-if="isPending(res.status) && (res.snap_token || res.token || res.payment_url || res.redirect_url)"
                        @click="reopenPayment(res)"
                        class="px-3 py-1.5 text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg cursor-pointer transition-colors"
                      >
                        💳 Bayar
                      </button>
                      <button
                        v-else-if="isPending(res.status)"
                        @click="retryPayment(res)"
                        class="px-3 py-1.5 text-[11px] font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg cursor-pointer transition-colors"
                      >
                        🔄 Bayar
                      </button>
                      <span v-else-if="res.status?.toLowerCase() === 'settlement' || res.status?.toLowerCase() === 'paid'" class="text-xs text-emerald-500 font-bold">✓ Lunas</span>
                      <span v-else class="text-xs text-slate-300">—</span>
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

    <!-- ===== BOOKING CONFIRMATION MODAL ===== -->
    <div v-if="isBookingModalOpen" class="fixed inset-0 bg-slate-900/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div class="bg-indigo-600 text-white p-5 font-black text-base flex justify-between items-center">
          <span>🏨 Konfirmasi Pemesanan</span>
          <button @click="isBookingModalOpen = false" :disabled="isProcessingPayment" class="text-white/80 hover:text-white text-lg cursor-pointer disabled:opacity-50">✕</button>
        </div>
        
        <div class="p-5 space-y-4">
          <!-- Room Info -->
          <div class="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100">
            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Kamar Pilihan</p>
            <h4 class="font-black text-lg text-slate-900">{{ selectedRoom?.name }}</h4>
            <p class="text-sm text-slate-500">{{ selectedRoom?.facilities || selectedRoom?.description }}</p>
          </div>

          <!-- Date Summary -->
          <div class="grid grid-cols-2 gap-4 text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Check In</p>
              <p class="font-bold text-slate-800">{{ filter.checkIn || '-' }}</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Check Out</p>
              <p class="font-bold text-slate-800">{{ filter.checkOut || '-' }}</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Durasi</p>
              <p class="font-bold text-slate-800">{{ nightCount }} Malam</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Kapasitas</p>
              <p class="font-bold text-slate-800">{{ selectedRoom?.capacity }} Pax</p>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p class="text-xs text-indigo-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
              <p class="text-2xl font-black text-indigo-700">Rp {{ totalPrice.toLocaleString('id-ID') }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ nightCount }} malam × Rp {{ selectedRoom?.price?.toLocaleString('id-ID') }}</p>
            </div>
            <div class="text-4xl">💳</div>
          </div>

          <!-- Payment Notice -->
          <div class="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 font-medium flex gap-2 items-start">
            <span class="text-base">⚡</span>
            <span>Setelah mengklik <strong>Bayar Sekarang</strong>, Anda akan diarahkan ke halaman pembayaran Midtrans yang aman. Jangan tutup tab selama proses berlangsung.</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              @click="isBookingModalOpen = false"
              :disabled="isProcessingPayment"
              class="px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
            >
              Batal
            </button>
            <button
              @click="confirmBooking"
              :disabled="isProcessingPayment || !filter.checkIn || !filter.checkOut"
              class="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="isProcessingPayment" class="animate-spin">⏳</span>
              <span>{{ isProcessingPayment ? 'Memproses...' : '💳 Bayar Sekarang' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== PAYMENT PROCESSING OVERLAY ===== -->
    <div v-if="isProcessingPayment && !isBookingModalOpen" class="fixed inset-0 bg-slate-900/70 flex justify-center items-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full mx-4">
        <div class="text-5xl mb-4 animate-bounce">💳</div>
        <h3 class="text-lg font-black text-slate-900 mb-2">Menghubungkan ke Midtrans...</h3>
        <p class="text-sm text-slate-500">Mohon tunggu, sistem sedang memproses pesanan Anda.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const isSidebarOpen = ref(false)
const currentMenu = ref('booking')
const isLoading = ref(false)
const isProcessingPayment = ref(false)

// State data
const roomsDatabase = ref([])
const historyReservations = ref([])

// Filter
const today = new Date().toISOString().split('T')[0]
const filter = ref({
  capacity: 'All',
  checkIn: today,
  checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
})

// Booking modal
const isBookingModalOpen = ref(false)
const selectedRoom = ref(null)

// ===== HELPERS =====

const extractArray = (res) => {
  if (!res) return []
  const dataObj = res.data
  if (!dataObj) return []
  if (dataObj.data && Array.isArray(dataObj.data.data)) return dataObj.data.data
  if (Array.isArray(dataObj.data)) return dataObj.data
  if (Array.isArray(dataObj)) return dataObj
  return []
}

const nightCount = computed(() => {
  if (!filter.value.checkIn || !filter.value.checkOut) return 1
  const msPerDay = 86400000
  const diff = new Date(filter.value.checkOut) - new Date(filter.value.checkIn)
  return Math.max(1, Math.round(diff / msPerDay))
})

const totalPrice = computed(() => {
  return (selectedRoom.value?.price || 0) * nightCount.value
})

const statusClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'settlement' || s === 'success' || s === 'paid') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
  if (s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100'
  if (s === 'cancel' || s === 'expire' || s === 'failure' || s === 'failed') return 'bg-red-50 text-red-500 border-red-100'
  return 'bg-slate-50 text-slate-500 border-slate-100'
}

const isPending = (status) => {
  const s = (status || '').toLowerCase()
  return s === 'pending'
}

// ===== DATA FETCHING =====

// const fetchUserDashboardData = async () => {
//   try {
//     isLoading.value = true

//     // Fetch individual rooms (bukan room-types) agar room_id yang dikirim ke backend benar
//     const roomsRes = await api.get('/rooms')
//     const rawRooms = extractArray(roomsRes)
//     roomsDatabase.value = rawRooms
//       .filter(r => (r.status || '').toLowerCase() === 'available')
//       .map(r => ({
//         id: r.id,                                        // room_id asli
//         name: r.room_type?.name || r.name || `Room ${r.room_number}`,
//         capacity: r.room_type?.capacity || r.capacity,
//         facilities: r.room_type?.facilities || r.facilities || r.description,
//         price: parseFloat(r.price || r.room_type?.price_per_night || 0),
//         img_url: r.img_url || r.room_type?.img_url,
//         room_number: r.room_number,
//         description: r.description
//       }))

//     const historyRes = await api.get('/bookings')
//     historyReservations.value = extractArray(historyRes)

//   } catch (error) {
//     console.error('Error fetching user dashboard data:', error)
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       alert('Sesi masuk berakhir. Silakan login kembali.')
//       handleLogout()
//     }
//   } finally {
//     isLoading.value = false
//   }
// }

// ===== DATA FETCHING (DENGAN QUERY PARAMETER TANGGAL) =====

const fetchUserDashboardData = async () => {
  try {
    isLoading.value = true

    // Tambahkan parameter query check_in dan check_out sesuai inputan filter user
    const roomsRes = await api.get('/rooms', {
      params: {
        check_in: filter.value.checkIn,
        check_out: filter.value.checkOut
      }
    })
    
    const rawRooms = extractArray(roomsRes)
    roomsDatabase.value = rawRooms
      // Hanya memunculkan kamar yang statusnya 'available' ke sisi user
      .filter(r => (r.status || '').toLowerCase() === 'available')
      .map(r => ({
        id: r.id,                                        
        name: r.room_type?.name || r.name || `Room ${r.room_number}`,
        capacity: r.room_type?.capacity || r.capacity,
        facilities: r.room_type?.facilities || r.facilities || r.description,
        price: parseFloat(r.price || r.room_type?.price_per_night || 0),
        img_url: r.img_url || r.room_type?.img_url,
        room_number: r.room_number,
        description: r.description,
        status: r.status || 'Available'
      }))

    const historyRes = await api.get('/bookings')
    historyReservations.value = extractArray(historyRes)

  } catch (error) {
    console.error('Error fetching user dashboard data:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('Sesi masuk berakhir. Silakan login kembali.')
      handleLogout()
    }
  } finally {
    isLoading.value = false
  }
}

// ===== WATCHER UNTUK FILTER TANGGAL =====
// Fitur ini otomatis memanggil API baru setiap kali user mengubah tanggal check-in atau check-out
watch(
  () => [filter.value.checkIn, filter.value.checkOut],
  ([newCheckIn, newCheckOut]) => {
    // Pastikan kedua tanggal sudah terisi sebelum menembak API
    if (newCheckIn && newCheckOut) {
      fetchUserDashboardData()
    }
  }
)

onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const cleanRole = role ? String(role).trim().toLowerCase().replace(/-/g, '') : ''

  if (!token || (cleanRole !== 'customer' && cleanRole !== 'user')) {
    alert('Akses ditolak! Silakan login terlebih dahulu untuk memesan kamar.')
    router.push('/')
    return
  }

  fetchUserDashboardData()
})

// ===== FILTERING =====

const filteredRooms = computed(() => {
  if (filter.value.capacity === 'All') return roomsDatabase.value
  return roomsDatabase.value.filter(r => r.capacity === parseInt(filter.value.capacity))
})

// ===== BOOKING & PAYMENT =====

const openBookingModal = (room) => {
  selectedRoom.value = room
  isBookingModalOpen.value = true
}

const switchToHistory = () => {
  currentMenu.value = 'history'
  isSidebarOpen.value = false
  fetchUserDashboardData()
}

// Fungsi utama: kirim checkout, lalu jalankan Midtrans Snap
const confirmBooking = async () => {
  if (!filter.value.checkIn || !filter.value.checkOut) {
    alert('Harap pilih tanggal check-in dan check-out terlebih dahulu.')
    return
  }

  try {
    isProcessingPayment.value = true
    isBookingModalOpen.value = false

    // 1. Kirim booking ke backend (hanya 4 field yang dibutuhkan)
    const response = await api.post('/bookings/checkout', {
      room_id: selectedRoom.value.id,
      check_in: filter.value.checkIn,
      check_out: filter.value.checkOut,
      payment_method: 'midtrans'
    })

    // snap_token ada di root response: { message, booking, snap_token }
    const snapToken = response.data?.snap_token || response.data?.data?.snap_token
    const redirectUrl = response.data?.booking?.payment?.redirect_url || response.data?.redirect_url

    // 2a. Pakai Midtrans Snap popup (jika snap_token tersedia dan Snap.js sudah dimuat)
    if (snapToken && typeof window.snap !== 'undefined') {
      isProcessingPayment.value = false

      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          console.log('Payment success:', result)
          alert('✅ Pembayaran berhasil! Terima kasih telah memesan.')
          switchToHistory()
        },
        onPending: (result) => {
          console.log('Payment pending:', result)
          alert('⏳ Pembayaran sedang menunggu konfirmasi. Cek riwayat reservasi Anda.')
          switchToHistory()
        },
        onError: (result) => {
          console.error('Payment error:', result)
          alert('❌ Pembayaran gagal. Silakan coba lagi.')
          fetchUserDashboardData()
        },
        onClose: () => {
          console.log('Snap closed by user')
          alert('💡 Anda menutup halaman pembayaran. Pesanan masih tersimpan dengan status "pending". Anda dapat membayar dari tab My Reservations.')
          switchToHistory()
        }
      })

    // 2b. Fallback: redirect ke Midtrans payment page jika tidak ada snap.js
    } else if (redirectUrl) {
      isProcessingPayment.value = false
      window.location.href = redirectUrl

    // 2c. Fallback akhir: tidak ada token/url, tapi booking sudah terbuat
    } else {
      isProcessingPayment.value = false
      alert('✅ Pesanan berhasil dibuat! Silakan cek riwayat reservasi Anda.')
      switchToHistory()
    }

  } catch (error) {
    isProcessingPayment.value = false
    console.error('Booking/Payment error:', error)
    const msg = error.response?.data?.message || 'Gagal memproses pemesanan. Silakan coba lagi.'
    alert('❌ ' + msg)
  }
}

// Buka ulang pembayaran untuk booking yang masih pending
const reopenPayment = (booking) => {
  const snapToken = booking.snap_token || booking.token
  const redirectUrl = booking.redirect_url || booking.payment_url

  if (snapToken && typeof window.snap !== 'undefined') {
    window.snap.pay(snapToken, {
      onSuccess: () => {
        alert('✅ Pembayaran berhasil!')
        fetchUserDashboardData()
      },
      onPending: () => {
        alert('⏳ Pembayaran masih dalam proses.')
        fetchUserDashboardData()
      },
      onError: () => {
        alert('❌ Pembayaran gagal.')
        fetchUserDashboardData()
      },
      onClose: () => {
        alert('💡 Halaman pembayaran ditutup.')
        fetchUserDashboardData()
      }
    })
  } else if (redirectUrl) {
    window.location.href = redirectUrl
  } else {
    alert('Link pembayaran tidak ditemukan. Silakan hubungi pihak hotel.')
  }
}

// Retry: buat ulang transaksi Midtrans untuk booking pending yang tokennya tidak tersimpan
const retryPayment = async (booking) => {
  try {
    isProcessingPayment.value = true
    const response = await api.post('/bookings/checkout', {
      room_id: booking.room_id || booking.room?.id,
      check_in: booking.check_in || booking.checkIn,
      check_out: booking.check_out || booking.checkOut,
      payment_method: 'midtrans'
    })

    const snapToken = response.data?.snap_token || response.data?.data?.snap_token
    const redirectUrl = response.data?.booking?.payment?.redirect_url || response.data?.redirect_url

    isProcessingPayment.value = false

    if (snapToken && typeof window.snap !== 'undefined') {
      window.snap.pay(snapToken, {
        onSuccess: () => { alert('✅ Pembayaran berhasil!'); fetchUserDashboardData() },
        onPending: () => { alert('⏳ Pembayaran masih dalam proses.'); fetchUserDashboardData() },
        onError: () => { alert('❌ Pembayaran gagal.') },
        onClose: () => { fetchUserDashboardData() }
      })
    } else if (redirectUrl) {
      window.location.href = redirectUrl
    } else {
      alert('✅ Pesanan ditemukan. Silakan cek riwayat reservasi Anda.')
      fetchUserDashboardData()
    }
  } catch (error) {
    isProcessingPayment.value = false
    console.error('Retry payment error:', error)
    alert('❌ Gagal memuat ulang pembayaran. Silakan coba lagi.')
  }
}

// ===== LOGOUT =====
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('hotel_id')
  router.push('/')
}
</script>