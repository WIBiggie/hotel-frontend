<template>
  <div class="flex flex-col md:flex-row w-screen h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
    
    <header class="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30 shadow-sm print:hidden">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-[#2e3a50] rounded-full flex justify-center items-center text-white text-md"><HomeWorkIcon height="1em" /></div>
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
          <div class="w-10 h-10 bg-[#2e3a50] rounded-full flex justify-center items-center text-white text-xl shadow-sm"><HomeWorkIcon height="1em" /></div>
          <div class="flex-1">
            <h2 class="text-sm font-bold text-gray-700">Hotel Admin</h2>
            <p class="text-xs text-green-500 font-medium">● Connected to Server</p>
          </div>
          <button @click="handleLogout" class="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-lg cursor-pointer transition-colors" title="Logout"><ArrowBackRoundedIcon height="1em" /></button>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Menu Admin</p>
          <button @click="currentTab = 'overview'" :class="currentTab === 'overview' ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100' : 'text-gray-600 hover:bg-gray-50'" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer"><WidgetMenuIcon height="1em" /> Overview & Reports</button>
          <button @click="currentTab = 'rooms'" :class="currentTab === 'rooms' ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100' : 'text-gray-600 hover:bg-gray-50'" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer"><BedroomChildIcon height="1em" /> Manage Rooms</button>
          <button @click="currentTab = 'roomTypes'" :class="currentTab === 'roomTypes' ? 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100' : 'text-gray-600 hover:bg-gray-50'" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors cursor-pointer"><NestMultiRoomRoundedIcon height="1em" /> Room Types</button>
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
                    <td class="p-3 font-semibold text-gray-900">{{ tx.guest_name || tx.user?.name || tx.customer_name || '-' }}</td>
                    <td class="p-3">Room {{ tx.room_number || tx.room?.number || tx.room?.room_number || '-' }}</td>
                    <td class="p-3 text-indigo-600">{{ tx.room_type || tx.room?.room_type?.name || tx.room_type_name || '-' }}</td>
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
                    <td class="p-3 font-bold text-gray-900">Room {{ room.number || room.room_number }}</td>
                    <td class="p-3 text-indigo-600 font-semibold">{{ room.type_name || room.room_type?.name || getRoomTypeName(room.room_type_id) || '-' }}</td>
                    <td class="p-3 text-center">
                      <span :class="room.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {{ room.status }}
                      </span>
                    </td>
                    <td class="p-3 text-center">
                      <div class="flex justify-center gap-2">
                        <button @click="deleteRoom(room.id)" class="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer shadow-sm"><RestoreFromTrashOutlineIcon height="1em" /></button>
                        <button @click="openEditRoomModal(room)" class="bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer shadow-sm"><EditIcon height="1em" /></button>
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
                        <button @click="deleteRoomType(type.id)" class="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer shadow-sm"><RestoreFromTrashOutlineIcon height="1em" /></button>
                        <button @click="openEditRoomTypeModal(type)" class="bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer shadow-sm"><EditIcon height="1em" /></button>
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

    <!-- <div v-if="isRoomModalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div class="bg-white w-full max-w-sm rounded-xl shadow-xl overflow-hidden">
        <div class="bg-[#2e3a50] text-white p-4 font-bold text-sm">{{ isEditRoomMode ? 'Edit Room' : 'Add New Room' }}</div>
        <form @submit.prevent="submitRoom" class="p-4 space-y-3">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Room Number</label>
            <input v-model="formRoom.number" type="text" required placeholder="e.g. 101" class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Room Type</label>
            <select v-model="formRoom.room_type_id" required class="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500">
              <option v-for="t in roomTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
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
    </div> -->

    <div v-if="isRoomModalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity">
  <div class="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all">
    <div class="bg-[#2a3447] text-white p-4 flex justify-between items-center">
      <h3 class="font-bold text-md flex items-center gap-2"><EditIcon height="1em" /> {{ isEditRoomMode ? 'Edit Room Details' : 'Add New Room' }}</h3>
      <button @click="closeRoomModal" class="text-white hover:text-gray-300 text-lg cursor-pointer">✕</button>
    </div>

    <form @submit.prevent="submitRoom" class="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Room Type</label>
        <select v-model="formRoom.room_type_id" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white">
          <option value="" disabled selected>-- Select Type --</option>
          <option v-for="type in roomTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Room Number</label>
          <input v-model="formRoom.room_number" type="text" required placeholder="e.g. 101" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" />
        </div>
        
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
          <select v-model="formRoom.status" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white">
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price per Night</label>
        <input v-model="formRoom.price" type="number" required placeholder="e.g. 500000" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" />
      </div>

      <!-- <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
        <input v-model="formRoom.img_url" type="text" placeholder="https://example.com/room.jpg" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" />
      </div> -->

    <div>
  <label class="block text-[10px] uppercase font-bold text-gray-400 mb-1">Room Image File</label>
  <input 
    type="file" 
    id="input-room-image"
    accept="image/*" 
    @change="handleRoomImageChange" 
    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-500" 
  />
  
  <div v-if="roomImagePreviewUrl" class="mt-2 flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
    <img :src="roomImagePreviewUrl" class="w-16 h-12 object-cover rounded border border-gray-200" alt="Preview Kamar" />
    <span class="text-[10px] text-gray-400 truncate max-w-[200px]">Selected image preview</span>
  </div>
</div>

      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
        <textarea v-model="formRoom.description" rows="3" placeholder="Describe specific room facilities or views..." class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 resize-none bg-white"></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <button type="button" @click="closeRoomModal" class="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">Cancel</button>
        <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-sm">
          {{ isEditRoomMode ? 'Update Room' : 'Save Room' }}
        </button>
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
// --- STATE FILE GAMBAR KAMAR ---
const selectedRoomImageFile = ref(null)
const roomImagePreviewUrl = ref(null)

// Modals Control Rooms
const isRoomModalOpen = ref(false)
const isEditRoomMode = ref(false)
// const formRoom = ref({ number: '', type_name: '', room_type_id: null, status: 'available' })
const formRoom = ref({ 
  room_type_id: '', 
  room_number: '', 
  status: 'available', 
  description: '',
  price: '',       
  img_url: ''      
})

// Modals Control Room Types
const isRoomTypeModalOpen = ref(false)
const isEditRoomTypeMode = ref(false)
const formRoomType = ref({ name: '', facilities: '', price: null, capacity: 2 })

// Helper to robustly extract arrays from Axios responses (handling direct arrays, Laravel data wrappers, and pagination wrappers)
const extractArray = (res) => {
  if (!res) return []
  const dataObj = res.data
  if (!dataObj) return []
  if (dataObj.data && Array.isArray(dataObj.data.data)) return dataObj.data.data
  if (Array.isArray(dataObj.data)) return dataObj.data
  if (Array.isArray(dataObj)) return dataObj
  return []
}

const fetchDashboardData = async () => {
  try {
    isLoading.value = true
    
    // 1. Ambil ID hotel milik admin yang sedang login dari localStorage
    const savedHotelId = localStorage.getItem('hotel_id') ? parseInt(localStorage.getItem('hotel_id'), 10) : null

    if (!savedHotelId) {
      alert('Gagal mendeteksi ID Hotel Anda. Silakan login kembali.')
      handleLogout()
      return
    }

    // 2. Ambil data TIPE KAMAR & saring berdasarkan hotel_id admin ini
    const typesRes = await api.get('/room-types')
    const allTypes = extractArray(typesRes)
    roomTypes.value = allTypes.filter(type => parseInt(type.hotel_id, 10) === savedHotelId)

    // 3. OPTIMASI UTAMA: Panggil endpoint /rooms langsung menggunakan query parameter ?hotel_id=
    // Dengan cara ini, backend hanya mengembalikan kamar yang SAH milik hotel admin ini saja.
    const roomsRes = await api.get(`/rooms?hotel_id=${savedHotelId}`)
    rooms.value = extractArray(roomsRes) // Data kamar baru dipastikan langsung masuk ke sini!

    // 4. Ambil data TRANSAKSI/RESERVASI & saring berdasarkan hotel_id admin ini
    const bookingsRes = await api.get('/bookings')
    const allBookings = extractArray(bookingsRes)
    transactions.value = allBookings.filter(tx => {
      return parseInt(tx.hotel_id, 10) === savedHotelId || 
             parseInt(tx.room?.hotel_id, 10) === savedHotelId ||
             parseInt(tx.room?.room_type?.hotel_id, 10) === savedHotelId
    })

    // 5. Hitung statistik secara otomatis & akurat dari data terfilter
    const totalRoomsCount = rooms.value.length
    // Menghitung yang berstatus 'available' atau nilai 1 (jika berupa boolean/integer di database)
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

const getRoomTypeName = (typeId) => {
  const t = roomTypes.value.find(item => item.id === typeId)
  return t ? t.name : ''
}

// ROUTE PROTECTION GUARD ON MOUNT
onMounted(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Mencegah akses masuk ilegal jika bukan admin hotel
  const cleanRole = role ? String(role).trim().toLowerCase().replace(/-/g, '') : ''
  if (!token || cleanRole !== 'admin') {
    alert('Akses ditolak! Halaman ini memerlukan hak akses Admin Hotel.')
    router.push('/')
    return
  }

  fetchDashboardData()
})

const handleRoomImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedRoomImageFile.value = file
    roomImagePreviewUrl.value = URL.createObjectURL(file) // Tampilkan preview lokal di UI
  }
}

// ================= LOGIKA MANAGEMENT KAMAR (CRUD ROOMS) =================
const openCreateRoomModal = () => {
  isEditRoomMode.value = false
  isRoomModalOpen.value = true
}
const openEditRoomModal = (room) => {
  isEditRoomMode.value = true
  currentSelectedId.value = room.id
  formRoom.value = {
    room_number: room.room_number,
    room_type_id: room.room_type_id,
    status: room.status || 'available'
  }
  // Muat gambar bawaan database sebagai preview awal jika data img_url tersedia
  roomImagePreviewUrl.value = room.img_url ? `http://localhost:8001${room.img_url}` : null
  isRoomModalOpen.value = true
}

const closeRoomModal = () => {
  isRoomModalOpen.value = false
  isEditRoomMode.value = false
  currentSelectedId.value = null
  formRoom.value = { room_number: '', room_type_id: '', status: 'available' }
  
  // Bersihkan sisa data upload gambar
  selectedRoomImageFile.value = null
  roomImagePreviewUrl.value = null
  const fileInput = document.getElementById('input-room-image')
  if (fileInput) fileInput.value = '' // Reset fisik input HTML
}

const submitRoom = async () => {
  try {
    isLoading.value = true

    // 1. Buat kontainer FormData
    const formData = new FormData()
    
    // 2. Isi data teks string utama
    formData.append('room_number', formRoom.value.room_number || '')
    formData.append('room_type_id', formRoom.value.room_type_id || '')
    formData.append('status', formRoom.value.status || 'available')
    
    // --- SOLUSI: AMBIL DATA PRICE DARI ROOM TYPE YANG DIPILIH ---
    if (roomTypes.value && formRoom.value.room_type_id) {
      const selectedType = roomTypes.value.find(t => t.id === parseInt(formRoom.value.room_type_id))
      if (selectedType) {
        // Ambil nominal 'price' atau 'price_per_night' dari tipe kamar tersebut
        const roomPrice = selectedType.price || selectedType.price_per_night || 0
        formData.append('price', roomPrice)
      }
    }
    
    // Ambil default hotel_id admin jika dibutuhkan relasinya di backend
    const hotelId = localStorage.getItem('hotel_id')
    if (hotelId) {
      formData.append('hotel_id', parseInt(hotelId))
    }

    // 3. Tangkap file gambar dari DOM dengan ID 'input-room-image'
    const imageInput = document.getElementById('input-room-image')
    if (imageInput && imageInput.files && imageInput.files[0]) {
      formData.append('image', imageInput.files[0])
    }

    // 4. Proses Request (Keduanya menggunakan POST)
    if (isEditRoomMode.value) {
      formData.append('_method', 'PUT')
      await api.post(`/rooms/${currentSelectedId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('🎉 Konfigurasi kamar & foto berhasil diperbarui!')
    } else {
      // Mode Store Baru sekarang sudah membawa field 'price' sehingga lolos validasi backend
      await api.post('/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('🎉 Kamar baru sukses didaftarkan!')
    }

    fetchDashboardData() 
    closeRoomModal()     
  } catch (error) {
    console.error('Gagal menyimpan konfigurasi kamar:', error)
    
    // TIPS AGAR TAHU ERROR ASLINYA: Ekstrak pesan dari backend jika ada
    if (error.response?.data?.data) {
      const validationErrors = Object.values(error.response.data.data).flat().join('\n')
      alert(`Validasi Gagal:\n${validationErrors}`)
    } else if (error.response?.data?.message) {
      alert(`Gagal: ${error.response.data.message}`)
    } else {
      alert('Gagal menyimpan konfigurasi kamar.')
    }
  } finally {
    isLoading.value = false
  }
}

const deleteRoom = async (id) => {
  if (confirm('Hapus kamar ini secara permanen dari database hotel?')) {
    try {
      await api.delete(`/rooms/${id}`)
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
  formRoomType.value = { name: type.name, facilities: type.facilities, price: type.price || type.price_per_night, capacity: type.capacity }
  isRoomTypeModalOpen.value = true
}
const closeRoomTypeModal = () => {
  isRoomTypeModalOpen.value = false
  formRoomType.value = { name: '', facilities: '', price: null, capacity: 2 }
}
const submitRoomType = async () => {
  try {
    const payload = {
      name: formRoomType.value.name,
      facilities: formRoomType.value.facilities,
      price: formRoomType.value.price,
      price_per_night: formRoomType.value.price,
      capacity: formRoomType.value.capacity
    }
    const hotelId = localStorage.getItem('hotel_id')
    if (hotelId) {
      payload.hotel_id = parseInt(hotelId)
    }

    if (isEditRoomTypeMode.value) {
      await api.put(`/room-types/${currentSelectedId.value}`, payload)
      alert('Konfigurasi tipe kamar diperbarui!')
    } else {
      await api.post('/room-types', payload)
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
      await api.delete(`/room-types/${id}`)
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