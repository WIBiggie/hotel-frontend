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
          <div class="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex justify-center items-center text-white text-md font-bold shadow-sm">JD</div>
          <div class="flex-1">
            <h2 class="text-sm font-bold text-slate-700">John Doe</h2>
            <p class="text-[11px] text-amber-600 font-semibold flex items-center gap-1">✨ Gold Member</p>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Guest Portal</p>
          <button @click="currentMenu = 'booking'; isSidebarOpen = false;" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left font-semibold" :class="currentMenu === 'booking' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'">
            🔑 Cari &amp; Pesan Kamar
          </button>
          <button @click="currentMenu = 'history'; isSidebarOpen = false;" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left" :class="currentMenu === 'history' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'">
            🧳 Riwayat Pesanan ({{ historyReservations.length }})
          </button>
        </div>
      </div>
      
      <div class="space-y-4 border-t border-slate-100 pt-4">
        <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-xs font-bold transition-colors cursor-pointer">
          🚪 Keluar Akun
        </button>
        <div class="text-center text-xs text-slate-400">&copy; 2026 One Hotel Portal</div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
      
      <div v-if="currentMenu === 'booking'" class="space-y-6 w-full">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Cari &amp; Pesan Kamar Hotel</h1>
          <p class="text-xs text-slate-400 mt-0.5">Pilih tanggal inap Anda untuk mendapatkan rekomendasi tipe kamar terbaik.</p>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Check In</label>
            <input type="date" v-model="filter.checkIn" class="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 outline-none" />
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Check Out</label>
            <input type="date" v-model="filter.checkOut" class="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 outline-none" />
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Kapasitas Tamu</label>
            <select v-model="filter.capacity" class="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 outline-none">
              <option value="All">Semua Kapasitas</option>
              <option value="1">1 Orang</option>
              <option value="2">2 Orang</option>
              <option value="4">4 Orang</option>
            </select>
          </div>
          <div>
            <button @click="applyFilter" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
              Perbarui Pencarian 🔍
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(room, index) in filteredRooms" :key="index" class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all">
            <div class="bg-slate-900 h-40 w-full relative flex items-center justify-center text-white text-3xl font-bold bg-cover bg-center" :style="{ backgroundImage: `url(${room.image})` }">
              <div class="absolute inset-0 bg-black/40"></div>
              <span class="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">👤 Max {{ room.capacity }} Pax</span>
              <span class="relative z-10">{{ room.icon }}</span>
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start gap-2">
                  <h3 class="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{{ room.type }}</h3>
                  <span class="text-[10px] px-2 py-0.5 rounded font-semibold" :class="room.available ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'">
                    {{ room.available ? 'Tersedia' : 'Penuh' }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{{ room.description }}</p>
              </div>

              <div class="flex justify-between items-center mt-5 pt-3 border-t border-slate-100">
                <div>
                  <p class="text-[10px] text-slate-400">Harga/malam</p>
                  <p class="text-sm font-extrabold text-slate-900">Rp {{ room.price.toLocaleString('id-ID') }}</p>
                </div>
                <button 
                  @click="openBookingModal(room)"
                  :disabled="!room.available"
                  class="text-xs font-bold px-4 py-2 rounded-lg shadow-sm"
                  :class="room.available ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
                >
                  Pesan Kamar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentMenu === 'history'" class="space-y-4 w-full">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Pemesanan Anda</h1>
          <p class="text-xs text-slate-400 mt-0.5">Daftar seluruh reservasi kamar hotel aktif maupun yang telah lalu.</p>
        </div>

        <div v-if="historyReservations.length === 0" class="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
          Belum ada riwayat pemesanan terdaftar.
        </div>
        
        <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <th class="p-3">Tipe Kamar</th>
                <th class="p-3">Masa Inap</th>
                <th class="p-3 text-center">Kapasitas</th>
                <th class="p-3 text-right">Total Tagihan</th>
                <th class="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="(item, idx) in historyReservations" :key="idx">
                <td class="p-3 font-bold text-slate-800">{{ item.type }}</td>
                <td class="p-3 text-slate-500">{{ item.checkIn }} s/d {{ item.checkOut }}</td>
                <td class="p-3 text-center">{{ item.capacity }} Orang</td>
                <td class="p-3 text-right font-semibold text-slate-900">Rp {{ item.totalPrice.toLocaleString('id-ID') }}</td>
                <td class="p-3 text-center">
                  <span class="bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-0.5 rounded text-[10px] font-bold">Pending Approval</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="isBookingModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
        <div class="bg-indigo-600 text-white p-4">
          <h3 class="font-bold text-sm">Konfirmasi Formulir Pemesanan</h3>
          <p class="text-[11px] text-indigo-100">Silakan periksa kembali detail masa menginap Anda.</p>
        </div>
        <div class="p-5 space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <p class="text-slate-400 text-[10px] uppercase font-bold">Check-In</p>
              <p class="font-semibold text-slate-800 mt-0.5">{{ filter.checkIn }}</p>
            </div>
            <div>
              <p class="text-slate-400 text-[10px] uppercase font-bold">Check-Out</p>
              <p class="font-semibold text-slate-800 mt-0.5">{{ filter.checkOut }}</p>
            </div>
          </div>
          <div>
            <p class="text-slate-400 text-[10px] uppercase font-bold">Kamar Pilihan</p>
            <p class="font-bold text-sm text-slate-900 mt-0.5">{{ selectedRoom?.type }}</p>
          </div>
          <div class="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center">
            <p class="font-medium text-slate-700">Total Biaya:</p>
            <p class="text-base font-extrabold text-indigo-600">Rp {{ selectedRoom?.price.toLocaleString('id-ID') }}</p>
          </div>
        </div>
        <div class="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button @click="isBookingModalOpen = false" class="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">Batal</button>
          <button @click="confirmBooking" class="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm cursor-pointer">Konfirmasi &amp; Bayar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentMenu = ref('booking')
const isSidebarOpen = ref(false)
const isBookingModalOpen = ref(false)
const selectedRoom = ref(null)

const filter = ref({ checkIn: '2026-06-24', checkOut: '2026-06-27', capacity: 'All' })
const historyReservations = ref([])

const roomsDatabase = ref([
  { type: 'Standard Room', capacity: 1, price: 450000, icon: '🛏️', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80', description: 'Ekonomis dan nyaman untuk pelancong tunggal.', available: true },
  { type: 'Superior Room', capacity: 2, price: 750000, icon: '✨', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80', description: 'Double bed ideal untuk kenyamanan bersama pasangan.', available: true },
  { type: 'Deluxe Room', capacity: 4, price: 1200000, icon: '👑', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80', description: 'Premium balcony view dan area santai yang luas.', available: true }
])

const filteredRooms = computed(() => {
  if (filter.value.capacity === 'All') return roomsDatabase.value
  return roomsDatabase.value.filter(r => r.capacity === parseInt(filter.value.capacity))
})

const openBookingModal = (room) => {
  selectedRoom.value = room
  isBookingModalOpen.value = true
}

const confirmBooking = () => {
  // Masukkan ke array riwayat pesanan user secara langsung
  historyReservations.value.push({
    type: selectedRoom.value.type,
    checkIn: filter.value.checkIn,
    checkOut: filter.value.checkOut,
    capacity: selectedRoom.value.capacity,
    totalPrice: selectedRoom.value.price
  })
  isBookingModalOpen.value = false
  currentMenu.value = 'history' // Alihkan otomatis ke menu riwayat pesanan
  alert("Pemesanan berhasil dikirim! Silakan tunggu konfirmasi persetujuan pihak hotel.")
}

const applyFilter = () => { alert("Kamar disesuaikan berdasarkan filter tanggal baru.") }
const handleLogout = () => {
  // Menampilkan konfirmasi sebelum benar-benar keluar
  if (confirm("Apakah Anda yakin ingin keluar dari akun?")) {
    // Alihkan pengguna ke halaman login utama
    router.push('/') 
  }
}
</script>