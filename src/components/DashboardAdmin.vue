<template>
  <div class="flex flex-col md:flex-row w-screen h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
    
    <header class="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30 shadow-sm print:hidden">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-[#2e3a50] rounded-full flex justify-center items-center text-white text-md">
          🏨
        </div>
        <h2 class="text-sm font-bold text-gray-700">One Hotel Admin</h2>
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
      class="md:hidden fixed inset-0 bg-black/40 z-20 transition-opacity print:hidden"
    ></div>

    <aside 
      class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5 shadow-sm z-20 transition-transform duration-300 ease-in-out print:hidden"
      :class="isSidebarOpen ? 'translate-x-0 pt-20 md:pt-5' : '-translate-x-full'"
    >
      <div>
        <div class="hidden md:flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <div class="w-10 h-10 bg-[#2e3a50] rounded-full flex justify-center items-center text-white text-md font-bold shadow-sm">
            ADM
          </div>
          <div>
            <h2 class="text-sm font-bold text-gray-700">Admin Utama</h2>
            <p class="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">🟢 Super Admin</p>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Main Menu</p>
          <button 
            @click="currentMenu = 'rooms'; isSidebarOpen = false;" 
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left font-medium transition-colors" 
            :class="currentMenu === 'rooms' ? 'bg-slate-100 text-[#2e3a50] font-semibold' : 'text-gray-600 hover:bg-gray-50'"
          >
            🛏️ Manajemen Kamar
          </button>
          <button 
            @click="currentMenu = 'types'; isSidebarOpen = false;" 
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left font-medium transition-colors" 
            :class="currentMenu === 'types' ? 'bg-slate-100 text-[#2e3a50] font-semibold' : 'text-gray-600 hover:bg-gray-50'"
          >
            ✨ Tipe &amp; Fasilitas
          </button>
          <button 
            @click="currentMenu = 'report'; isSidebarOpen = false;" 
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left font-medium transition-colors" 
            :class="currentMenu === 'report' ? 'bg-slate-100 text-[#2e3a50] font-semibold' : 'text-gray-600 hover:bg-gray-50'"
          >
            📋 Report
          </button>
        </div>
      </div>
      
      <div class="space-y-4 border-t border-gray-100 pt-4">
        <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg text-xs font-bold transition-colors cursor-pointer">
          🚪 Keluar Aplikasi
        </button>
        <div class="text-center text-[11px] text-gray-400">&copy; 2026 One Hotel Admin Panel</div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto print:p-0 print:overflow-visible">
      
      <div v-if="currentMenu === 'rooms'" class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold">Manajemen Data Kamar</h1>
            <p class="text-xs text-gray-500">Kelola nomor kamar, posisi lantai, dan status operasional ketersediaan.</p>
          </div>
          <button @click="openCreateRoomModal" class="bg-[#2e3a50] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 cursor-pointer">
            + Tambah Kamar
          </button>
        </div>

        <div class="flex border-b border-gray-200 gap-2 text-xs">
          <button v-for="tab in ['All', 'Available', 'Occupied', 'Dirty']" :key="tab" @click="activeRoomTab = tab" class="px-4 py-2 font-medium" :class="activeRoomTab === tab ? 'border-b-2 border-[#2e3a50] text-[#2e3a50]' : 'text-gray-400'">
            {{ tab }}
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                <th class="p-3">Nomor Kamar</th>
                <th class="p-3">Tipe Kamar</th>
                <th class="p-3">Lantai</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700">
              <tr v-for="(room, idx) in filteredRooms" :key="idx">
                <td class="p-3 font-bold">{{ room.number }}</td>
                <td class="p-3">{{ room.type }}</td>
                <td class="p-3 text-gray-500">{{ room.floor }}</td>
                <td class="p-3">
                  <span :class="{
                    'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded': room.status === 'Available',
                    'text-blue-600 bg-blue-50 px-2 py-0.5 rounded': room.status === 'Occupied',
                    'text-amber-600 bg-amber-50 px-2 py-0.5 rounded': room.status === 'Dirty'
                  }">{{ room.status }}</span>
                </td>
                <td class="p-3 text-center space-x-2">
                  <button @click="openEditRoomModal(idx)" class="text-indigo-600 hover:underline cursor-pointer">Edit</button>
                  <button @click="deleteRoom(idx)" class="text-rose-600 hover:underline cursor-pointer">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="currentMenu === 'types'" class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold">Kategori &amp; Spesifikasi Tipe Kamar</h1>
            <p class="text-xs text-gray-500">Atur penamaan kelas kamar, kapasitas muatan maksimum tamu, dan harga sewa.</p>
          </div>
          <button @click="openCreateRoomTypeModal" class="bg-[#2e3a50] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 cursor-pointer">
            + Tambah Tipe
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold">
                <th class="p-3">Nama Tipe</th>
                <th class="p-3">Fasilitas Utama</th>
                <th class="p-3 text-center">Kapasitas</th>
                <th class="p-3 text-right">Harga / Malam</th>
                <th class="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700">
              <tr v-for="(t, idx) in roomTypes" :key="idx">
                <td class="p-3 font-bold">{{ t.name }}</td>
                <td class="p-3 text-gray-500">{{ t.facilities }}</td>
                <td class="p-3 text-center">{{ t.capacity }} Pax</td>
                <td class="p-3 text-right font-semibold">Rp {{ t.price.toLocaleString('id-ID') }}</td>
                <td class="p-3 text-center space-x-2">
                  <button @click="openEditRoomTypeModal(idx)" class="text-indigo-600 hover:underline cursor-pointer">Edit</button>
                  <button @click="deleteRoomType(idx)" class="text-rose-600 hover:underline cursor-pointer">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="currentMenu === 'report'" class="space-y-6 w-full">
        
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight print:text-xl">Laporan Riwayat Pesanan Hotel</h1>
            <p class="text-xs text-gray-500 mt-0.5 print:hidden">Rekapitulasi seluruh data reservasi kamar dari pelanggan.</p>
            <p class="hidden print:block text-[10px] text-gray-400 mt-1">Dicetak pada: {{ new Date().toLocaleString('id-ID') }} | Dokumen Resmi Administrasi One Hotel</p>
          </div>
          
          <button 
            @click="printReport" 
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm print:hidden transition-all active:scale-95 cursor-pointer"
          >
            🖨️ Cetak Laporan
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:border-none print:shadow-none">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold print:bg-gray-100">
                <th class="p-3">Nama Tamu</th>
                <th class="p-3">Kamar</th>
                <th class="p-3">Tanggal Check-In</th>
                <th class="p-3">Tanggal Check-Out</th>
                <th class="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700">
              <tr v-for="(item, idx) in historyReservations" :key="idx" class="hover:bg-gray-50/50">
                <td class="p-3 font-bold text-gray-800">{{ item.guest }}</td>
                <td class="p-3 font-medium">{{ item.room }}</td>
                <td class="p-3 text-gray-500">{{ item.checkIn }}</td>
                <td class="p-3 text-gray-500">{{ item.checkOut }}</td>
                <td class="p-3 text-center">
                  <span class="px-2.5 py-0.5 rounded text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <div v-if="isRoomModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 print:hidden">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 class="text-sm font-bold mb-4">{{ isEditRoomMode ? 'Edit Kamar' : 'Tambah Kamar Baru' }}</h3>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium mb-1">Nomor Kamar</label>
            <input type="text" v-model="formRoom.number" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block font-medium mb-1">Tipe Kamar</label>
            <select v-model="formRoom.type" class="w-full border p-2 rounded">
              <option v-for="t in roomTypes" :key="t.name" :value="t.name">{{ t.name }}</option>
            </select>
          </div>
          <div>
            <label class="block font-medium mb-1">Lantai</label>
            <input type="text" v-model="formRoom.floor" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block font-medium mb-1">Status</label>
            <select v-model="formRoom.status" class="w-full border p-2 rounded">
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Dirty">Dirty</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6 text-xs">
          <button @click="closeRoomModal" class="px-4 py-2 border rounded cursor-pointer">Batal</button>
          <button @click="submitRoom" class="px-4 py-2 bg-[#2e3a50] text-white rounded cursor-pointer">Simpan</button>
        </div>
      </div>
    </div>

    <div v-if="isRoomTypeModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 print:hidden">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 class="text-sm font-bold mb-4">{{ isEditRoomTypeMode ? 'Edit Tipe Kamar' : 'Tambah Tipe Kamar' }}</h3>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium mb-1">Nama Tipe</label>
            <input type="text" v-model="formRoomType.name" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block font-medium mb-1">Fasilitas Utama</label>
            <input type="text" v-model="formRoomType.facilities" class="w-full border p-2 rounded" placeholder="AC, Wi-Fi" />
          </div>
          <div>
            <label class="block font-medium mb-1">Kapasitas</label>
            <input type="number" v-model="formRoomType.capacity" class="w-full border p-2 rounded" />
          </div>
          <div>
            <label class="block font-medium mb-1">Harga / Malam</label>
            <input type="number" v-model="formRoomType.price" class="w-full border p-2 rounded" />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6 text-xs">
          <button @click="closeRoomTypeModal" class="px-4 py-2 border rounded cursor-pointer">Batal</button>
          <button @click="submitRoomType" class="px-4 py-2 bg-[#2e3a50] text-white rounded cursor-pointer">Simpan</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentMenu = ref('rooms')
const isSidebarOpen = ref(false)

// STATE UTAMA MANAJEMEN KAMAR BAWAAN ASLI
const isRoomModalOpen = ref(false)
const isEditRoomMode = ref(false)
const currentRoomEditIdx = ref(null)
const activeRoomTab = ref('All')
const searchRoomQuery = ref('')
const formRoom = ref({ number: '', type: 'Deluxe Room', floor: '', status: 'Available' })

const rooms = ref([
  { number: '101', type: 'Deluxe Room', floor: '1st Floor', status: 'Available' },
  { number: '102', type: 'Deluxe Room', floor: '1st Floor', status: 'Occupied' },
  { number: '201', type: 'Suite Room', floor: '2nd Floor', status: 'Dirty' }
])

// STATE UTAMA TIPE KAMAR BAWAAN ASLI
const isRoomTypeModalOpen = ref(false)
const isEditRoomTypeMode = ref(false)
const currentRoomTypeEditIdx = ref(null)
const formRoomType = ref({ name: '', facilities: '', price: 0, capacity: 1 })

const roomTypes = ref([
  { name: 'Standard Room', facilities: 'Single Bed, Free Wi-Fi, AC', price: 450000, capacity: 1 },
  { name: 'Deluxe Room', facilities: 'King Bed, Balcony View, Bathtub', price: 1200000, capacity: 2 },
  { name: 'Suite Room', facilities: 'King Bed, Kitchen, Mini Bar, Jacuzzi', price: 2500000, capacity: 4 }
])

// DATA REKAP UNTUK MENU LAPORAN / REPORT
const historyReservations = ref([
  { guest: 'John Doe', room: 'Room 102 (Deluxe)', checkIn: '24 Juni 2026', checkOut: '27 Juni 2026', status: 'Confirmed' },
  { guest: 'Jane Smith', room: 'Room 101 (Standard)', checkIn: '25 Juni 2026', checkOut: '26 Juni 2026', status: 'Confirmed' }
])

// MANAJEMEN KAMAR LOGIC METHODS
const filteredRooms = computed(() => {
  let res = rooms.value
  if (activeRoomTab.value !== 'All') res = res.filter(r => r.status === activeRoomTab.value)
  if (searchRoomQuery.value) res = res.filter(r => r.number.includes(searchRoomQuery.value))
  return res
})

const openCreateRoomModal = () => { isEditRoomMode.value = false; isRoomModalOpen.value = true }
const openEditRoomModal = (idx) => {
  isEditRoomMode.value = true; currentRoomEditIdx.value = idx
  formRoom.value = { ...rooms.value[idx] }; isRoomModalOpen.value = true
}
const closeRoomModal = () => { isRoomModalOpen.value = false; formRoom.value = { number: '', type: 'Deluxe Room', floor: '', status: 'Available' } }
const submitRoom = () => {
  if (isEditRoomMode.value) rooms.value[currentRoomEditIdx.value] = { ...formRoom.value }
  else rooms.value.push({ ...formRoom.value })
  closeRoomModal()
}
const deleteRoom = (idx) => { if (confirm('Hapus kamar ini?')) rooms.value.splice(idx, 1) }

// TIPE KAMAR LOGIC METHODS
const openCreateRoomTypeModal = () => { isEditRoomTypeMode.value = false; isRoomTypeModalOpen.value = true }
const openEditRoomTypeModal = (idx) => {
  isEditRoomTypeMode.value = true; currentRoomTypeEditIdx.value = idx
  formRoomType.value = { ...roomTypes.value[idx] }; isRoomTypeModalOpen.value = true
}
const closeRoomTypeModal = () => { isRoomTypeModalOpen.value = false; formRoomType.value = { name: '', facilities: '', price: 0, capacity: 1 } }
const submitRoomType = () => {
  if (isEditRoomTypeMode.value) roomTypes.value[currentRoomTypeEditIdx.value] = { ...formRoomType.value }
  else roomTypes.value.push({ ...formRoomType.value })
  closeRoomTypeModal()
}
const deleteRoomType = (idx) => { if (confirm('Hapus tipe kamar?')) roomTypes.value.splice(idx, 1) }

// === FUNGSI UTAMA UNTUK CETAK/PRINT REPORT ===
const printReport = () => {
  window.print()
}

const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
    router.push('/')
  }
}
</script>

<style scoped>
/* CSS KHUSUS PENGATURAN MEDIA CETAK (PRINT) */
@media print {
  .print\:hidden {
    display: none !important;
  }
  body, html, .bg-gray-100 {
    background-color: #ffffff !important;
  }
  table {
    border: 1px solid #e2e8f0 !important;
    width: 100% !important;
  }
  th, td {
    padding: 10px !important;
    border-bottom: 1px solid #e2e8f0 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>