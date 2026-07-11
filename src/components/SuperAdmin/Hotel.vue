<template>
  <div class="flex flex-col md:flex-row w-screen h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
    
    <header class="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-30 shadow-sm">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-cyan-500 rounded-full flex justify-center items-center text-white text-md">🌐</div>
        <h2 class="text-sm font-bold text-gray-700">Super Admin</h2>
      </div>
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg text-xl cursor-pointer">
        {{ isSidebarOpen ? '✕' : '☰' }}
      </button>
    </header>

    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="md:hidden fixed inset-0 bg-black/40 z-20 transition-opacity"></div>

    <aside class="fixed inset-y-0 left-0 transform md:relative md:translate-x-0 w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-5 shadow-sm z-20 transition-transform duration-300 ease-in-out" :class="isSidebarOpen ? 'translate-x-0 pt-20 md:pt-5' : '-translate-x-full'">
      <div>
        <div class="hidden md:flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <div class="w-10 h-10 bg-cyan-500 rounded-full flex justify-center items-center text-white text-xl shadow-sm">🌐</div>
          <div class="flex-1">
            <h2 class="text-sm font-bold text-gray-700">Super Admin</h2>
          </div>
          <button @click="handleLogout" class="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-lg cursor-pointer transition-colors" title="Logout">
            <span class="bg-red-500 text-white rounded px-1.5 py-0.5 text-xs font-bold"><LogoutIcon height="1em" /></span>
          </button>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">navigation</p>
          <button @click="router.push('/dashboardsuperadmin')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer"><WidgetMenuIcon height="1em" /> Overview</button>
          <button class="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium rounded-lg text-sm text-left transition-colors"><FamilyHomeIcon height="1em" /> Hotel</button>
          <button @click="router.push('/account')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer"><AccountBoxIcon height="1em" /> Account Management</button>
        </div>
      </div>
      <div class="md:hidden block mb-4">
        <button @click="handleLogout" class="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-bold text-sm transition-colors cursor-pointer text-center">Logout</button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-slate-50/50">
      
      <div class="flex flex-row justify-between items-center gap-4 mb-6">
        <div class="flex w-full max-w-sm border border-gray-300 rounded overflow-hidden bg-white shadow-none h-9">
          <input 
            v-model="searchQuery" 
            type="text" 
            class="flex-1 px-3 py-1 outline-none text-sm bg-white text-gray-700" 
          />
          <button class="bg-[#007bff] hover:bg-blue-600 px-3.5 flex items-center justify-center text-white cursor-pointer transition-colors border-none h-full text-sm">
            <SearchIcon height="1em" />
          </button>
        </div>
        <button @click="openCreateModal" class="bg-[#1e233b] hover:bg-slate-800 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer">
          Create +
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-8 text-gray-500">Loading data dari server...</div>

      <section v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden w-full min-w-0">
        <div class="overflow-x-auto w-full block">
          <table class="w-full text-left border-collapse text-sm min-w-[750px]">
            <thead>
              <tr class="bg-[#2a3447] text-white font-semibold border-b border-gray-300">
                <th class="p-3 border-r border-gray-600 w-16 text-center">No</th>
                <th class="p-3 border-r border-gray-600 w-1/5">Hotel</th>
                <th class="p-3 border-r border-gray-600 w-2/5">Address</th>
                <th class="p-3 border-r border-gray-600 w-24 text-center">Rooms</th>
                <th class="p-3 border-r border-gray-600 w-36">Administrator</th>
                <th class="p-3 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-gray-700 bg-white">
  <tr v-for="(hotel, index) in filteredHotels" :key="hotel.id || index" class="hover:bg-slate-50 transition-colors">
    <td class="p-3 text-center text-gray-600 border-r border-gray-200">{{ index + 1 }}</td>
    <td class="p-3 text-gray-800 border-r border-gray-200">{{ hotel.name }}</td>
    <td class="p-3 text-gray-600 border-r border-gray-200 leading-relaxed">{{ hotel.address }}</td>
    
    <td class="p-3 text-center text-gray-600 border-r border-gray-200">
      {{ hotel.rooms_count || 0 }}
    </td>
    
    <td class="p-3 text-gray-600 border-r border-gray-200">
      {{ hotel.admins && hotel.admins.length > 0 ? hotel.admins[0].name : '-' }}
    </td>
    
    <td class="p-3 text-center">
      <div class="flex justify-center items-center gap-3">
        <button @click="deleteHotel(hotel.id)" class="bg-[#dc3545] hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer transition-colors" title="Delete">
          <RestoreFromTrashIcon height="1em" />
        </button>
        <button @click="openEditModal(hotel)" class="bg-[#4f46e5] hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer transition-colors" title="Edit">
          <EditIcon height="1em" />
        </button>
      </div>
    </td>
  </tr>
  <tr v-if="filteredHotels.length === 0">
    <td colspan="6" class="p-8 text-center text-gray-400 italic bg-gray-50/50">No hotels found matching "{{ searchQuery }}"</td>
  </tr>
</tbody>
          </table>
        </div>
      </section>
    </main>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity">
      <div class="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all">
        <div class="bg-[#2a3447] text-white p-4 flex justify-between items-center">
          <h3 class="font-bold text-md flex items-center gap-2">🏨 {{ isEditMode ? 'Edit Hotel Details' : 'Add New Hotel' }}</h3>
          <button @click="closeModal" class="text-white hover:text-gray-300 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitHotel" class="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Hotel Name</label>
            <input v-model="formHotel.name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
              <input v-model="formHotel.city" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rating</label>
              <input v-model="formHotel.rating" type="number" step="0.1" min="0" max="5" placeholder="e.g. 4.5" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" />
            </div>
          </div>

          <!-- <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
            <input v-model="formHotel.img_url" type="text" placeholder="https://example.com/image.jpg" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white" />
          </div> -->

          <div class="mb-4">
  <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Hotel Image / Photo</label>
  <input 
    type="file" 
    accept="image/*" 
    @change="handleImageUpload" 
    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-500"
  />
  <div v-if="imagePreview" class="mt-2">
    <img :src="imagePreview" class="w-32 h-20 object-cover rounded-lg border" />
  </div>
</div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label>
            <textarea v-model="formHotel.address" required rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 resize-none bg-white"></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea v-model="formHotel.description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 resize-none bg-white"></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">Cancel</button>
            <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-sm">{{ isEditMode ? 'Update Changes' : 'Save Hotel' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api' 

const router = useRouter()
const isSidebarOpen = ref(false)
const isModalOpen = ref(false)
const isEditMode = ref(false)
const isLoading = ref(false)
const currentSelectedId = ref(null)
const searchQuery = ref('')

const selectedFile = ref(null)
const imagePreview = ref(null)
const formHotel = ref({
  name: '',
  address: '',
  description: '',
  city: '',
  rating: ''
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    // Membuat URL blob instan untuk preview gambar di frontend sebelum diupload
    imagePreview.value = URL.createObjectURL(file)
  }
}



// const formHotel = ref({ 
//   name: '', 
//   city: '', 
//   address: '', 
//   description: '', 
//   rating: '', 
//   img_url: '' 
// })

const hotels = ref([])

// 1. Sederhanakan fungsi ekstraksi data karena struktur API /hotels/overview sudah berbentuk daftar hotel
const extractArray = (res) => {
  if (!res) return []
  const dataObj = res.data
  if (!dataObj) return []
  if (dataObj.data && Array.isArray(dataObj.data)) return dataObj.data
  if (Array.isArray(dataObj)) return dataObj
  return []
}

// 2. Memanggil endpoint overview
const fetchHotels = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/hotels/overview') 
    hotels.value = extractArray(response)
  } catch (error) {
    console.error('Gagal mengambil data hotel:', error)
    alert('Gagal mengambil data dari server.')
  } finally {
    isLoading.value = false
  }
}

// 3. Sesuaikan pemetaan modal edit agar membaca properti rooms_count dan array admins
// const openEditModal = (hotel) => {
//   isEditMode.value = true
//   currentSelectedId.value = hotel.id
  
//   formHotel.value = {
//     name: hotel.name || '',
//     city: hotel.city || '',
//     address: hotel.address || '',
//     description: hotel.description || '',
//     rating: hotel.rating || '',
//     img_url: hotel.img_url || ''
//   }
//   isModalOpen.value = true
// }

const openEditModal = (hotel) => {
  isEditMode.value = true
  currentSelectedId.value = hotel.id
  formHotel.value = {
    name: hotel.name,
    address: hotel.address,
    description: hotel.description || '',
    city: hotel.city || '',
    rating: hotel.rating || ''
  }
  // Tampilkan preview gambar lama jika backend mengembalikan properti img_url
  imagePreview.value = hotel.img_url || null 
  isModalOpen.value = true
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
  fetchHotels()
})

const filteredHotels = computed(() => {
  if (!searchQuery.value) return hotels.value
  const query = searchQuery.value.toLowerCase().trim()
  return hotels.value.filter(hotel => {
    return hotel.name.toLowerCase().includes(query) || hotel.address.toLowerCase().includes(query)
  })
})

const openCreateModal = () => {
  isEditMode.value = false
  isModalOpen.value = true
}


// const closeModal = () => {
//   isModalOpen.value = false
//   isEditMode.value = false
//   currentSelectedId.value = null
//   formHotel.value = { 
//     name: '', 
//     city: '', 
//     address: '', 
//     description: '', 
//     rating: '', 
//     img_url: '' 
//   }
// }

const closeModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  currentSelectedId.value = null
  
  // Bersihkan data form & gambar
  formHotel.value = { name: '', address: '', description: '', city: '', rating: '' }
  selectedFile.value = null
  imagePreview.value = null
}

// const submitHotel = async () => {
//   try {
//     if (isEditMode.value) {
//       // Endpoint EDIT: PUT /hotels/{id}
//       await api.put(`/hotels/${currentSelectedId.value}`, formHotel.value)
//       alert('Data hotel berhasil diubah!')
//     } else {
//       // Endpoint TAMBAH: POST /hotels
//       await api.post('/hotels', formHotel.value)
//       alert('Hotel baru berhasil ditambahkan!')
//     }
//     fetchHotels() 
//     closeModal()
//   } catch (error) {
//     console.error('Gagal menyimpan data hotel:', error)
//     alert(error.response?.data?.message || 'Terjadi kesalahan sistem saat menyimpan data.')
//   }
// }

// --- PROSES SUBMIT DISESUAIKAN DENGAN REFERENSI (MENGGUNAKAN KEY 'image') ---
// --- PROSES SUBMIT DISESUAIKAN DENGAN ATURAN BACKEND TERBARU ---
const submitHotel = async () => {
  try {
    isLoading.value = true

    // 1. Inisialisasi FormData baru
    const formData = new FormData()
    
    // 2. Masukkan seluruh data string form ke dalam FormData
    formData.append('name', formHotel.value.name || '')
    formData.append('city', formHotel.value.city || '')
    formData.append('address', formHotel.value.address || '')
    formData.append('description', formHotel.value.description || '')
    formData.append('rating', formHotel.value.rating || '')

    // 3. Ambil berkas file dari elemen input file menggunakan ID 'input-image'
    const imageInput = document.getElementById('input-image')
    // if (imageInput && imageInput.files && imageInput.files[0]) {
    //   // Wajib menggunakan key 'image' sesuai instruksi backend Anda
    //   formData.append('image', imageInput.files[0])
    // }
    if (selectedFile.value){
      formData.append('image',selectedFile.value)
    }

    // 4. Eksekusi pengiriman data (Keduanya menggunakan api.post)
    if (isEditMode.value) {
      // KETENTUAN UPDATE: Tambahkan '_method' = 'PUT' ke dalam FormData
      formData.append('_method', 'PUT')
      
      await api.post(`/hotels/${currentSelectedId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('🎉 Data hotel & foto sukses diperbarui!')
    } else {
      // KETENTUAN STORE: Kirim murni via POST biasa
      await api.post('/hotels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('🎉 Hotel baru beserta gambar sukses ditambahkan!')
    }

    console.log('Hotel berhasil disimpan ke database')
    fetchHotels() // Memperbarui daftar hotel di antarmuka (UI)
    closeModal()   // Menutup modal form dan membersihkan sisa data
  } catch (error) {
    console.error('Gagal menyimpan properti hotel:', error)
    
    // Menampilkan detail kesalahan validasi spesifik dari backend Laravel jika ada
    if (error.response?.data?.data) {
      const validationErrors = Object.values(error.response.data.data).flat().join('\n')
      alert(`Validasi Gagal:\n${validationErrors}`)
    } else {
      alert(error.response?.data?.message || 'Terjadi kesalahan sistem saat menyimpan properti.')
    }
  } finally {
    isLoading.value = false
  }
}

const deleteHotel = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus hotel ini?')) {
    try {
      await api.delete(`/hotels/${id}`)
      alert('Hotel berhasil dihapus!')
      fetchHotels()
    } catch (error) {
      console.error('Gagal menghapus hotel:', error)
      alert('Gagal menghapus data dari server.')
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}
</script>