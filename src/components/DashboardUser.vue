<template>
  <div class="flex flex-col md:flex-row w-screen h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
    
    <header class="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-30 shadow-sm print:hidden">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-indigo-600 rounded-full flex justify-center items-center text-white text-md">🏨</div>
        <h2 class="text-sm font-bold text-slate-700">Hotel Guest</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xl cursor-pointer">
        {{ isSidebarOpen ? '✕' : '☰' }}
      </button>
    </header>

    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="md:hidden fixed inset-0 bg-black/40 z-20 print:hidden"></div>

    <aside
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 shadow-sm z-20 transition-transform duration-300 ease-in-out print:hidden"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="space-y-6">
        <div class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex justify-center items-center text-white text-xl shadow-md shadow-indigo-200">
            <FamilyHomeIcon height="1em" />
          </div>
          <div>
            <h1 class="font-black text-sm tracking-wide text-slate-800 uppercase">One Hotel</h1>
            <p class="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">Guest Dashboard</p>
          </div>
        </div>

        <nav class="space-y-1">
          <button
            @click="currentStep = 'search-hotel'; isSidebarOpen = false"
            :class="currentStep === 'search-hotel' || currentStep === 'view-rooms' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs transition-all text-left cursor-pointer"
          >
            <span><FamilyHomeIcon height="1em" /></span> Find & Book Hotels
          </button>
          <button
            @click="currentStep = 'my-bookings'; fetchUserDashboardData(); isSidebarOpen = false"
            :class="currentStep === 'my-bookings' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs transition-all text-left cursor-pointer"
          >
            <span><ContractEditIcon height="1em" /></span> My Bookings History
          </button>
        </nav>
      </div>

      <div class="pt-4 border-t border-slate-100">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all text-left cursor-pointer"
        >
          <span><LogoutIcon height="1em" /></span> Logout Account
        </button>
      </div>
    </aside>

    <main class="flex-1 p-6 overflow-y-auto">
      
      <div class="flex gap-4 mb-6 border-b border-slate-200 pb-3 print:hidden">
        <button 
          @click="currentStep = 'search-hotel'" 
          :class="currentStep === 'search-hotel' || currentStep === 'view-rooms' ? 'text-indigo-600 font-bold border-b-2 border-indigo-600' : 'text-slate-500'"
          class="pb-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          <HomeWorkIcon height="1em" /> Find Hotels
        </button>
        <button 
          @click="currentStep = 'my-bookings'; fetchUserDashboardData()" 
          :class="currentStep === 'my-bookings' ? 'text-indigo-600 font-bold border-b-2 border-indigo-600' : 'text-slate-500'"
          class="pb-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          📜 My Bookings
        </button>
      </div>

      <div v-if="isLoading" class="flex flex-col justify-center items-center py-24 space-y-3">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p class="text-xs text-slate-400 font-medium animate-pulse">Loading data from server...</p>
      </div>

      <div v-else>
        
        <!-- STEP 1: CARI HOTEL -->
        <div v-if="currentStep === 'search-hotel'" class="space-y-6 animate-fadeIn">
          <div class="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-3 items-center">
            <div class="relative flex-1 w-full">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">📍</span>
              <input 
                v-model="searchCity" 
                type="text" 
                placeholder="Where do you want to stay? (e.g. Bandung, Jakarta, Bali)" 
                class="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" 
                @keyup.enter="searchHotelsByCity"
              />
            </div>
            <button @click="searchHotelsByCity" class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap">
              Search Hotels
            </button>
          </div>

          <div v-if="hotelsInCity.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="hotel in hotelsInCity" :key="hotel.id" class="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <!-- FIX 5: Pakai getImageUrl() agar konsisten dengan BASE_URL -->
                <img :src="getImageUrl(hotel.img_url)" class="w-full h-44 object-cover rounded-lg mb-3 bg-slate-100" :alt="hotel.name" />
                <h4 class="font-bold text-lg text-slate-800">{{ hotel.name }}</h4>
                <p class="text-xs text-indigo-600 font-bold mb-1">📍 {{ hotel.city }}</p>
                <p class="text-xs text-slate-400 mb-2">{{ hotel.address }}</p>
                <p class="text-xs text-slate-500 font-bold mb-2" v-if="hotel.rating">⭐️ {{ hotel.rating }} / 5.0 Rating</p>
                <p class="text-sm text-slate-600 line-clamp-3 mb-4">{{ hotel.description || 'No specific description available for this hotel.' }}</p>
              </div>
              <button @click="selectHotel(hotel)" class="w-full bg-slate-900 hover:bg-indigo-600 text-white py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                Select Hotel & View Rooms
              </button>
            </div>
          </div>
          
          <div v-else class="text-center py-16 bg-white border border-dashed rounded-xl text-slate-400 italic">
            No hotels available in this city right now. Try looking for another city location.
          </div>
        </div>

        <!-- STEP 2: LIHAT KAMAR -->
        <div v-if="currentStep === 'view-rooms'" class="space-y-6 animate-fadeIn">
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <button @click="currentStep = 'search-hotel'" class="text-xs text-indigo-600 font-bold mb-1 hover:underline block cursor-pointer">← Back to Hotels List</button>
              <h3 class="font-bold text-xl text-slate-800">{{ selectedHotel?.name }}</h3>
              <p class="text-xs text-slate-400">📍 {{ selectedHotel?.address }}, {{ selectedHotel?.city }}</p>
            </div>
            
            <div class="flex gap-3 items-end bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Check In</label>
                <input v-model="filterDates.checkIn" type="date" @change="fetchAvailableRooms" class="px-2 py-1 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none" />
              </div>
              <div>
                <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Check Out</label>
                <input v-model="filterDates.checkOut" type="date" @change="fetchAvailableRooms" class="px-2 py-1 border border-slate-300 rounded text-xs bg-white text-slate-700 focus:outline-none" />
              </div>
            </div>
          </div>

          <!-- FIX 1: Ganti availableRooms → rooms -->
          <div v-if="rooms.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- FIX 1: v-for menggunakan 'rooms' bukan 'availableRooms' -->
            <div v-for="room in rooms" :key="room.id" class="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs p-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <!-- FIX 5: Pakai getImageUrl() agar konsisten -->
                <img 
                  :src="getImageUrl(room.img_url)"
                  class="w-full h-36 object-cover rounded-lg mb-3 bg-slate-50 border border-slate-100"
                  :alt="`Room ${room.room_number}`"
                />

                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-slate-800 text-sm">Room {{ room.room_number }}</h4>
                  <span :class="room.status === 'available' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {{ room.status }}
                  </span>
                </div>
                
                <p class="text-xs text-slate-400 capitalize mb-2">
                  Type: {{ room.room_type?.name || 'Standard' }}
                </p>
              </div>

              <div class="pt-3 border-t border-slate-50 mt-2 flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-slate-400 block leading-tight">Price / Night</span>
                  <span class="text-xs font-black text-indigo-600">
                    Rp {{ Number(room.price || room.room_type?.price || 0).toLocaleString('id-ID') }}
                  </span>
                </div>
                
                <!-- FIX 2: Ganti selectRoom → handleBookRoom -->
                <button 
                  @click="handleBookRoom(room)"
                  :disabled="room.status !== 'available'"
                  class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Choose
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-16 bg-white border border-slate-200 rounded-xl text-slate-400 italic">
            There are no rooms listed or available for the specified stay range at this hotel.
          </div>
        </div>

        <!-- STEP 3: RIWAYAT BOOKING -->
        <div v-if="currentStep === 'my-bookings'" class="space-y-6 animate-fadeIn">
          <div class="flex justify-between items-center print:hidden">
            <h3 class="font-bold text-lg text-slate-800">Your Reservation History</h3>
            <span class="text-xs text-slate-400 font-medium">Total Bookings: {{ bookings.length }}</span>
          </div>

          <div v-if="bookings.length > 0" class="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden print:border-none print:shadow-none">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <!-- FIX 3: Tambahkan <tr> di dalam <thead> -->
                <thead>
                  <tr>
                    <th class="p-4 bg-slate-50 font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">Booking Info</th>
                    <th class="p-4 bg-slate-50 font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">Hotel & Room</th>
                    <th class="p-4 bg-slate-50 font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">Stay Dates</th>
                    <th class="p-4 bg-slate-50 font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">Total Bill</th>
                    <th class="p-4 bg-slate-50 font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">Payment Status</th>
                    <th class="p-4 bg-slate-50 font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="tx in bookings" :key="tx.id" class="hover:bg-slate-50/50 transition-colors">
                    <td class="p-4 font-medium text-slate-900">
                      <div class="font-bold">ID: #{{ tx.id }}</div>
                      <div class="text-[10px] text-slate-400 mt-0.5">Created: {{ new Date(tx.created_at).toLocaleDateString() }}</div>
                    </td>
                    <td class="p-4">
                      <div class="font-bold text-slate-700">{{ tx.hotel?.name || tx.room?.room_type?.hotel?.name || 'N/A' }}</div>
                      <div class="text-slate-400 text-[11px] mt-0.5">Room {{ tx.room?.room_number || 'N/A' }} ({{ tx.room?.room_type?.name || 'Standard' }})</div>
                    </td>
                    <td class="p-4 text-slate-600 font-medium">
                      <div>In: {{ tx.check_in }}</div>
                      <div class="mt-0.5">Out: {{ tx.check_out }}</div>
                    </td>
                    <td class="p-4 font-bold text-slate-800">
                      Rp {{ parseFloat(tx.total_price || tx.price || 0).toLocaleString() }}
                    </td>
                    <td class="p-4">
                      <span 
                        :class="{
                          'bg-emerald-50 text-emerald-700 border-emerald-200': tx.payment_status === 'paid' || tx.status === 'paid',
                          'bg-amber-50 text-amber-700 border-amber-200': tx.payment_status === 'unpaid' || tx.status === 'unpaid' || tx.status === 'pending',
                          'bg-rose-50 text-rose-700 border-rose-200': tx.payment_status === 'cancelled' || tx.status === 'cancelled'
                        }"
                        class="px-2.5 py-1 border text-[10px] font-bold rounded-full uppercase tracking-wider"
                      >
                        {{ tx.payment_status || tx.status }}
                      </span>
                    </td>
                    <td class="p-4 print:hidden">
                      <div class="flex items-center gap-2">
                        <button 
                          v-if="tx.payment_status === 'unpaid' || tx.status === 'unpaid' || tx.status === 'pending'"
                          @click="retryPayment(tx)"
                          :disabled="isProcessingPayment"
                          class="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors shadow-xs cursor-pointer"
                        >
                          <PaymentsIcon height="1em" /> Pay Now
                        </button>
                        <span v-else class="text-slate-400 text-[11px] italic">No actions needed</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div v-else class="text-center py-16 bg-white border border-slate-200 rounded-xl text-slate-400 italic">
            You don't have any booking transaction records yet. Let's make your first booking!
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api.js'

const router = useRouter()

// FIX 5: Definisikan BASE_URL backend secara terpusat
// Ambil langsung dari baseURL yang sudah ada di api.js
const BASE_URL = api.defaults.baseURL.replace(/\/$/, '')
// Helper: gabungkan BASE_URL + img_url, dengan fallback placeholder
const getImageUrl = (imgUrl) => {
  if (!imgUrl) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600'
  if (imgUrl.startsWith('http')) return imgUrl
  return BASE_URL + imgUrl
}

// --- KONTROL STATE UTAMA ---
const currentStep = ref('search-hotel')
const isLoading = ref(false)
const isSidebarOpen = ref(false)
const isProcessingPayment = ref(false)

// --- DATA BINDING STATE ---
const hotelsInCity = ref([])
const rooms = ref([])          // FIX 1: Hanya gunakan 'rooms', hapus 'availableRooms'
const bookings = ref([])
const selectedHotel = ref(null)
const searchCity = ref('')

const filterDates = ref({
  checkIn: new Date().toISOString().split('T')[0],
  checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
})

// --- HELPER UNTUK EKSTRAK ARRAY DARI RESPONSE ---
const extractArray = (res) => {
  if (!res) return []
  const dataObj = res.data
  if (!dataObj) return []
  if (dataObj.data && Array.isArray(dataObj.data.data)) return dataObj.data.data
  if (Array.isArray(dataObj.data)) return dataObj.data
  if (Array.isArray(dataObj)) return dataObj
  return []
}

// === CARI HOTEL BERDASARKAN KOTA ===
const searchHotelsByCity = async () => {
  try {
    isLoading.value = true
    const keyword = searchCity.value.trim()

    // FIX 4: Jika kota kosong, panggil /hotels biasa (bukan /hotels/overview yang butuh super-admin)
    const url = keyword !== '' ? `/hotels?city=${encodeURIComponent(keyword)}` : '/hotels'
    
    const res = await api.get(url)
    hotelsInCity.value = extractArray(res)
    currentStep.value = 'search-hotel'
  } catch (error) {
    console.error('Gagal memuat hotel berdasarkan kota:', error)
    alert('Gagal memuat daftar hotel.')
  } finally {
    isLoading.value = false
  }
}

// === PILIH HOTEL & TAMPILKAN KAMAR ===
const selectHotel = async (hotel) => {
  selectedHotel.value = hotel
  await fetchAvailableRooms()
  currentStep.value = 'view-rooms'
}

const fetchAvailableRooms = async () => {
  if (!selectedHotel.value) return
  try {
    isLoading.value = true
    const url = `/rooms?hotel_id=${selectedHotel.value.id}&check_in=${filterDates.value.checkIn}&check_out=${filterDates.value.checkOut}`
    const res = await api.get(url)
    rooms.value = extractArray(res)  // FIX 1: Simpan ke 'rooms'
  } catch (error) {
    console.error('Gagal memuat data kamar:', error)
    alert('Gagal memeriksa ketersediaan kamar pada tanggal tersebut.')
  } finally {
    isLoading.value = false
  }
}

// === PROSES BOOKING KAMAR ===
// FIX 2: Fungsi ini yang dipanggil dari tombol 'Choose' di template
const handleBookRoom = async (room) => {
  try {
    isLoading.value = true
    const payload = {
      room_id: room.id,
      check_in: filterDates.value.checkIn,
      check_out: filterDates.value.checkOut,
      payment_method: 'midtrans'
    }

    const response = await api.post('/bookings/checkout', payload)
    const createdBooking = response.data?.booking || response.data?.data?.booking || response.data?.data

    if (createdBooking) {
      await retryPayment(createdBooking)
    } else {
      currentStep.value = 'my-bookings'
      await fetchUserDashboardData()
    }
  } catch (error) {
    console.error('Booking error:', error)
    alert(error.response?.data?.message || 'Gagal memproses pemesanan kamar.')
  } finally {
    isLoading.value = false
  }
}

// === BAYAR / LANJUTKAN PEMBAYARAN ===
const retryPayment = async (booking) => {
  try {
    isProcessingPayment.value = true
    const bookingId = booking.id

    if (!bookingId) {
      alert('❌ ID Transaksi tidak valid.')
      return
    }

    const response = await api.post(`/bookings/${bookingId}/pay`, {
      payment_method: 'midtrans'
    })

    const snapToken = response.data?.snap_token || response.data?.data?.snap_token
    const redirectUrl = response.data?.booking?.payment?.redirect_url || response.data?.redirect_url

    isProcessingPayment.value = false

    if (snapToken && typeof window.snap !== 'undefined') {
      window.snap.pay(snapToken, {
        onSuccess: () => { 
          alert('✅ Pembayaran Berhasil!')
          if (currentStep.value === 'my-bookings') fetchUserDashboardData()
        },
        onPending: () => { 
          alert('⏳ Menunggu penyelesaian transfer pembayaran Anda.')
          if (currentStep.value === 'my-bookings') fetchUserDashboardData()
        },
        onError: () => { alert('❌ Pembayaran Anda gagal.') },
        onClose: () => { 
          currentStep.value = 'my-bookings'
          fetchUserDashboardData()
        }
      })
    } else if (redirectUrl) {
      window.location.href = redirectUrl
    } else {
      alert('✅ Permintaan bayar diproses. Silakan muat ulang halaman riwayat.')
      currentStep.value = 'my-bookings'
      fetchUserDashboardData()
    }
  } catch (error) {
    isProcessingPayment.value = false
    console.error('Proses Pembayaran Gagal:', error)
    alert(error.response?.data?.message || '❌ Gagal memuat gerbang pembayaran.')
  }
}

// === AMBIL RIWAYAT BOOKING ===
const fetchUserDashboardData = async () => {
  try {
    isLoading.value = true
    const bookingsResponse = await api.get('/bookings')
    bookings.value = extractArray(bookingsResponse)
  } catch (error) {
    console.error('Gagal mengambil riwayat transaksi:', error)
  } finally {
    isLoading.value = false
  }
}

// === LOGOUT ===
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('hotel_id')
  router.push('/')
}

// === INISIALISASI ===
onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const cleanRole = role ? String(role).trim().toLowerCase().replace(/-/g, '') : ''

  if (!token || (cleanRole !== 'customer' && cleanRole !== 'user' && cleanRole !== 'admin')) {
    alert('Sesi tidak valid. Silakan login kembali.')
    handleLogout()
    return
  }

  searchHotelsByCity()
})
</script>