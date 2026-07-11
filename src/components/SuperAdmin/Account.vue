<!-- <template>
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
          <button @click="handleLogout" class="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-lg cursor-pointer transition-colors" title="Logout">🚪</button>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Navigation</p>
          <button @click="router.push('/dashboardsuperadmin')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer">📊 Overview</button>
          <button @click="router.push('/hotel')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer">🏨 Hotel</button>
          <button class="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium rounded-lg text-sm text-left transition-colors">👤 Account Management</button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-slate-50/50">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div class="flex w-full sm:max-w-md bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <input v-model="searchQuery" type="text" placeholder="Search username, email, or hotel..." class="flex-1 px-4 py-2 outline-none text-sm" />
          <div class="bg-blue-500 px-5 flex items-center justify-center text-white">🔍</div>
        </div>
        <button @click="openCreateModal" class="bg-[#1e293b] hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md">Create +</button>
      </div>

      <div v-if="isLoading" class="text-center py-8 text-gray-500">Loading data user...</div>

      <section v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full min-w-0 mb-4 md:mb-0">
        <div class="overflow-x-auto overflow-y-auto max-h-[400px] w-full block">
          <table class="w-full text-left border-collapse text-sm min-w-[750px]">
            <thead class="sticky top-0 z-10">
              <tr class="bg-[#2e3a50] text-white font-semibold">
                <th class="p-3.5 border-b border-gray-200 w-16 text-center">No</th>
                <th class="p-3.5 border-b border-gray-200">Username</th>
                <th class="p-3.5 border-b border-gray-200">Email</th>
                <th class="p-3.5 border-b border-gray-200">Role</th>
                <th class="p-3.5 border-b border-gray-200">Hotel</th>
                <th class="p-3.5 border-b border-gray-200 w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700 font-medium bg-white">
              <tr v-for="(account, index) in filteredAccounts" :key="account.id || index" class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-center text-gray-400">{{ index + 1 }}</td>
                <td class="p-3.5 font-bold text-gray-900">{{ account.username }}</td>
                <td class="p-3.5 text-gray-500">{{ account.email }}</td>
                <td class="p-3.5">
                  <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase">{{ account.role }}</span>
                </td>
                <td class="p-3.5 text-indigo-600">{{ account.hotel || '-' }}</td>
                <td class="p-3.5 text-center">
                  <div class="flex justify-center items-center gap-2">
                    <button @click="deleteAccount(account.id)" class="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer transition-colors shadow-sm" title="Delete">🗑️</button>
                    <button @click="openEditModal(account)" class="bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer transition-colors shadow-sm" title="Edit">✏️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAccounts.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400 italic bg-gray-50/50">No accounts found matching "{{ searchQuery }}"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity">
      <div class="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all">
        <div class="bg-[#2e3a50] text-white p-4 flex justify-between items-center">
          <h3 class="font-bold text-md flex items-center gap-2">👤 {{ isEditMode ? 'Edit Admin Account' : 'Add New Admin Account' }}</h3>
          <button @click="closeModal" class="text-white hover:text-gray-300 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitAccount" class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
            <input v-model="formAccount.username" type="text" required placeholder="e.g. Admin4" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <input v-model="formAccount.email" type="email" required placeholder="e.g. admin4@hotel.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password {{ isEditMode ? '(Kosongkan jika tidak diubah)' : '' }}</label>
            <input v-model="formAccount.password" type="password" :required="!isEditMode" placeholder="••••••••" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</label>
            <select v-model="formAccount.role" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500">
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Managing Hotel</label>
            <input v-model="formAccount.hotel" type="text" placeholder="e.g. Grand Metro" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">Cancel</button>
            <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-sm">{{ isEditMode ? 'Update Account' : 'Save Account' }}</button>
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

const formAccount = ref({ username: '', email: '', password: '', role: 'admin', hotel: '' })
const accounts = ref([])

// 1. FETCH ACCOUNTS DARI BACKEND
const fetchAccounts = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/accounts') // Sesuaikan endpoint user/account backend kamu
    accounts.value = response.data.data || response.data
  } catch (error) {
    console.error('Gagal mengambil data akun:', error)
    alert('Gagal memuat data akun dari server.')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/')
    return
  }
  fetchAccounts()
})

// 2. SEARCH FILTER
const filteredAccounts = computed(() => {
  if (!searchQuery.value) return accounts.value
  const query = searchQuery.value.toLowerCase().trim()
  return accounts.value.filter(account => {
    return account.username.toLowerCase().includes(query) || 
           account.email.toLowerCase().includes(query) ||
           (account.hotel && account.hotel.toLowerCase().includes(query))
  })
})

// 3. MODAL KONTROL
const openCreateModal = () => {
  isEditMode.value = false
  isModalOpen.value = true
}

const openEditModal = (account) => {
  isEditMode.value = true
  currentSelectedId.value = account.id
  formAccount.value = {
    username: account.username,
    email: account.email,
    password: '', 
    role: account.role,
    hotel: account.hotel
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  currentSelectedId.value = null
  formAccount.value = { username: '', email: '', password: '', role: 'admin', hotel: '' }
}

// 4. SAVE / UPDATE DATA KE DB
const submitAccount = async () => {
  try {
    const payload = { ...formAccount.value }
    // Jika password kosong saat edit, hapus key agar tidak ikut terupdate kosong di backend
    if (isEditMode.value && !payload.password) {
      delete payload.password
    }

    if (isEditMode.value) {
      await api.put(`/users/${currentSelectedId.value}`, payload)
      alert('Akun berhasil diubah!')
    } else {
      await api.post('/users', payload)
      alert('Akun baru berhasil dibuat!')
    }
    fetchAccounts()
    closeModal()
  } catch (error) {
    console.error('Gagal menyimpan data akun:', error)
    alert(error.response?.data?.message || 'Terjadi kesalahan.')
  }
}

// 5. DELETE DARI BACKEND
const deleteAccount = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
    try {
      await api.delete(`/users/${id}`)
      alert('Akun berhasil dihapus!')
      fetchAccounts()
    } catch (error) {
      console.error('Gagal menghapus akun:', error)
      alert('Gagal menghapus akun dari server.')
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}
</script> -->

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
          <button @click="handleLogout" class="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-lg cursor-pointer transition-colors" title="Logout"><LogoutIcon height="1em" /></button>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Navigation</p>
          <button @click="router.push('/dashboardsuperadmin')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer"><WidgetMenuIcon height="1em" /> Overview</button>
          <button @click="router.push('/hotel')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer"><FamilyHomeIcon height="1em" /> Hotel</button>
          <button class="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium rounded-lg text-sm text-left transition-colors"><AccountBoxIcon height="1em" /> Account Management</button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-slate-50/50">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div class="flex w-full sm:max-w-md bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <input v-model="searchQuery" type="text" placeholder="Search name, email, or hotel..." class="flex-1 px-4 py-2 outline-none text-sm" />
          <div class="bg-blue-500 px-5 flex items-center justify-center text-white">🔍</div>
        </div>
        <button @click="openCreateModal" class="bg-[#1e293b] hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md">Create +</button>
      </div>

      <div v-if="isLoading" class="text-center py-8 text-gray-500">Loading data user...</div>

      <section v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full min-w-0 mb-4 md:mb-0">
        <div class="overflow-x-auto overflow-y-auto max-h-[400px] w-full block">
          <table class="w-full text-left border-collapse text-sm min-w-[750px]">
            <thead class="sticky top-0 z-10">
              <tr class="bg-[#2e3a50] text-white font-semibold">
                <th class="p-3.5 border-b border-gray-200 w-16 text-center">No</th>
                <th class="p-3.5 border-b border-gray-200">Name</th>
                <th class="p-3.5 border-b border-gray-200">Email</th>
                <th class="p-3.5 border-b border-gray-200">Role</th>
                <th class="p-3.5 border-b border-gray-200">Hotel</th>
                <th class="p-3.5 border-b border-gray-200 w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700 font-medium bg-white">
              <tr v-for="(accountItem, index) in filteredAccounts" :key="accountItem.id || index" class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-center text-gray-400">{{ index + 1 }}</td>
                <td class="p-3.5 font-bold text-gray-900">{{ accountItem.name }}</td> 
                <td class="p-3.5 text-gray-500">{{ accountItem.email }}</td>
                <td class="p-3.5">
                  <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase">{{ accountItem.role }}</span>
                </td>
                <td class="p-3.5 text-indigo-600">{{ accountItem.hotel_name || accountItem.hotel?.name || getHotelName(accountItem.hotel_id) || '-' }}</td>
                <td class="p-3.5 text-center">
                  <div class="flex justify-center items-center gap-2">
                    <button @click="deleteAccount(accountItem.id)" class="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer transition-colors shadow-sm" title="Delete"><RestoreFromTrashOutlineIcon height="1em" /></button>
                    <button @click="openEditModal(accountItem)" class="bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer transition-colors shadow-sm" title="Edit"><EditIcon height="1em" /></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAccounts.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400 italic bg-gray-50/50">No accounts found matching "{{ searchQuery }}"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity">
      <div class="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all">
        <div class="bg-[#2e3a50] text-white p-4 flex justify-between items-center">
          <h3 class="font-bold text-md flex items-center gap-2"><AccountBoxIcon height="1em" /> {{ isEditMode ? 'Edit Admin Accounts' : 'Add New Admin Accounts' }}</h3>
          <button @click="closeModal" class="text-white hover:text-gray-300 text-lg cursor-pointer">✕</button>
        </div>
        <form @submit.prevent="submitAccounts" class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</label> <input v-model="formAccounts.name" type="text" required placeholder="e.g. Ferdiyanto" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <input v-model="formAccounts.email" type="email" required placeholder="e.g. admin@hotel.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password {{ isEditMode ? '(Kosongkan jika tidak diubah)' : '' }}</label>
            <input v-model="formAccounts.password" type="password" :required="!isEditMode" placeholder="••••••••" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</label>
            <select v-model="formAccounts.role" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500">
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Managing Hotel</label>
            <select v-model="formAccounts.hotel_id" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500">
              <option :value="null">None (Super Admin / Regular Customer)</option>
              <option v-for="h in hotels" :key="h.id" :value="h.id">{{ h.name }}</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">Cancel</button>
            <button type="submit" class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-sm">{{ isEditMode ? 'Update Accounts' : 'Save Accounts' }}</button>
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

const formAccounts = ref({ name: '', email: '', password: '', role: 'admin', hotel_id: null })
const accounts = ref([])
const hotels = ref([])

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

// 1. FETCH ACCOUNTS & HOTELS DARI BACKEND
const fetchHotels = async () => {
  try {
    const response = await api.get('/hotels')
    hotels.value = extractArray(response)
  } catch (error) {
    console.error('Gagal mengambil data hotel:', error)
  }
}

const fetchAccounts = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/accounts') 
    
    const rawData = extractArray(response)

    accounts.value = rawData.map(user => ({
      id: user.id,
      name: user.name || 'No Name',
      email: user.email,
      role: user.role,
      hotel_id: user.hotel_id,
      hotel_name: user.hotel?.name || user.hotel_name || '-'
    }))

  } catch (error) {
    console.error('Gagal mengambil data akun:', error)
    alert('Gagal memuat data akun dari server.')
  } finally {
    isLoading.value = false
  }
}

const getHotelName = (hotelId) => {
  const h = hotels.value.find(item => item.id === hotelId)
  return h ? h.name : ''
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
  fetchAccounts()
})

// 2. SEARCH FILTER
const filteredAccounts = computed(() => {
  if (!searchQuery.value) return accounts.value
  const query = searchQuery.value.toLowerCase().trim()
  return accounts.value.filter(accountItem => {
    const hotelName = accountItem.hotel_name || getHotelName(accountItem.hotel_id)
    return accountItem.name.toLowerCase().includes(query) || 
           accountItem.email.toLowerCase().includes(query) ||
           (hotelName && hotelName.toLowerCase().includes(query))
  })
})

// 3. MODAL KONTROL
const openCreateModal = () => {
  isEditMode.value = false
  isModalOpen.value = true
}

const openEditModal = (accountItem) => {
  isEditMode.value = true
  currentSelectedId.value = accountItem.id
  formAccounts.value = {
    name: accountItem.name,
    email: accountItem.email,
    password: '', 
    role: accountItem.role,
    hotel_id: accountItem.hotel_id || null
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  currentSelectedId.value = null
  formAccounts.value = { name: '', email: '', password: '', role: 'admin', hotel_id: null }
}

// 4. SAVE / UPDATE DATA KE DB
const submitAccounts = async () => {
  try {
    const payload = {
      name: formAccounts.value.name,
      email: formAccounts.value.email,
      role: formAccounts.value.role,
      hotel_id: formAccounts.value.hotel_id
    }

    if (formAccounts.value.password) {
      payload.password = formAccounts.value.password
    }

    if (isEditMode.value) {
      await api.put(`/accounts/${currentSelectedId.value}`, payload)
      alert('Akun berhasil diubah!')
    } else {
      await api.post('/auth/register-admin', payload)
      alert('Akun baru berhasil dibuat!')
    }
    
    fetchAccounts()
    closeModal()
  } catch (error) {
    console.error('Gagal menyimpan data akun:', error)
    alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.')
  }
}

// 5. DELETE DARI BACKEND
const deleteAccount = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
    try {
      await api.delete(`/accounts/${id}`)
      alert('Akun berhasil dihapus!')
      fetchAccounts()
    } catch (error) {
      console.error('Gagal menghapus akun:', error)
      alert(error.response?.data?.message || 'Gagal menghapus akun dari server.')
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  router.push('/')
}
</script>