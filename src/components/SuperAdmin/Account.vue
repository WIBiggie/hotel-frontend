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
            🚪
          </button>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Navigation</p>
          
          <button @click="isSidebarOpen = false; router.push('/dashboardsuperadmin')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer">
            📊 Overview
          </button>
          
          <button @click="isSidebarOpen = false; router.push('/hotel')" class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer">
            🏨 Hotel
          </button>
          
          <button class="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium rounded-lg text-sm text-left transition-colors">
            👤 Account Management
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

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-slate-50/50">
      
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div class="flex w-full sm:max-w-md bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search username, email, or hotel..." 
            class="flex-1 px-4 py-2 outline-none text-sm" 
          />
          <div class="bg-blue-500 px-5 flex items-center justify-center text-white">
            🔍
          </div>
        </div>
        <button 
          @click="openCreateModal"
          class="bg-[#1e293b] hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          Create +
        </button>
      </div>

      <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full min-w-0 mb-4 md:mb-0">
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
              <tr v-for="(account, index) in filteredAccounts" :key="index" class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-center text-gray-400">{{ index + 1 }}</td>
                <td class="p-3.5 font-bold text-gray-900">{{ account.username }}</td>
                <td class="p-3.5 text-gray-500">{{ account.email }}</td>
                <td class="p-3.5">
                  <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                    {{ account.role }}
                  </span>
                </td>
                <td class="p-3.5 text-indigo-600">{{ account.hotel || '-' }}</td>
                <td class="p-3.5 text-center">
                  <div class="flex justify-center items-center gap-2">
                    <button @click="deleteAccount(index)" class="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-xs cursor-pointer transition-colors shadow-sm" title="Delete">
                      🗑️
                    </button>
                    <button @click="openEditModal(index)" class="bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded text-white text-xs cursor-pointer transition-colors shadow-sm" title="Edit">
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAccounts.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400 italic bg-gray-50/50">
                  No accounts found matching "{{ searchQuery }}"
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>

    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 transition-opacity"
    >
      <div class="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all">
        <div class="bg-[#2e3a50] text-white p-4 flex justify-between items-center">
          <h3 class="font-bold text-md flex items-center gap-2">
            👤 {{ isEditMode ? 'Edit Admin Account' : 'Add New Admin Account' }}
          </h3>
          <button @click="closeModal" class="text-white hover:text-gray-300 text-lg cursor-pointer">✕</button>
        </div>
        
        <form @submit.prevent="submitAccount" class="p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
            <input 
              v-model="formAccount.username"
              type="text" 
              required
              placeholder="e.g. Admin4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              v-model="formAccount.email"
              type="email" 
              required
              placeholder="e.g. admin4@hotel.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Password {{ isEditMode ? '(Leave blank to keep old)' : '' }}
            </label>
            <input 
              v-model="formAccount.password"
              type="password" 
              :required="!isEditMode"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</label>
            <select 
              v-model="formAccount.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Managing Hotel</label>
            <input 
              v-model="formAccount.hotel"
              type="text" 
              placeholder="e.g. Grand Metro (or leave blank if Super Admin)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              {{ isEditMode ? 'Update Account' : 'Save Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// UI State
const isSidebarOpen = ref(false)
const isModalOpen = ref(false)
const isEditMode = ref(false)
const currentEditIndex = ref(null)

// Search State
const searchQuery = ref('')

// Form State Object (Ditambahkan properti password)
const formAccount = ref({
  username: '',
  email: '',
  password: '',
  role: 'admin',
  hotel: ''
})

// Data Utama Array Accounts (Disertakan data default password tersembunyi)
const accounts = ref([
  { username: 'Admin1', email: 'admin1@gmail.com', password: 'password123', role: 'admin', hotel: 'One Hotel' },
  { username: 'Admin2', email: 'admin2@gmail.com', password: 'password123', role: 'admin', hotel: 'Kehoncewang' },
  { username: 'Admin3', email: 'admin3@gmail.com', password: 'password123', role: 'admin', hotel: 'Dewi Sartika' }
])

// 1. FITUR SEARCH ACCOUNTS
const filteredAccounts = computed(() => {
  if (!searchQuery.value) return accounts.value
  
  const query = searchQuery.value.toLowerCase().trim()
  return accounts.value.filter(account => {
    return account.username.toLowerCase().includes(query) || 
           account.email.toLowerCase().includes(query) ||
           (account.hotel && account.hotel.toLowerCase().includes(query))
  })
})

// 2. KONTROL FORM MODAL (CREATE / EDIT)
const openCreateModal = () => {
  isEditMode.value = false
  isModalOpen.value = true
}

const openEditModal = (index) => {
  isEditMode.value = true
  currentEditIndex.value = index
  
  const selectedAccount = accounts.value[index]
  formAccount.value = {
    username: selectedAccount.username,
    email: selectedAccount.email,
    password: '', // Dikosongkan saat edit demi keamanan, diisi hanya jika ingin diubah
    role: selectedAccount.role,
    hotel: selectedAccount.hotel
  }
  
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  currentEditIndex.value = null
  formAccount.value = { username: '', email: '', password: '', role: 'admin', hotel: '' }
}

// 3. SIMPAN ATAU UPDATE DATA ACCOUNT
const submitAccount = () => {
  if (isEditMode.value) {
    // Cari tahu password lama jika field password dikosongkan saat mengedit
    const oldPassword = accounts.value[currentEditIndex.value].password
    const finalPassword = formAccount.value.password ? formAccount.value.password : oldPassword

    accounts.value[currentEditIndex.value] = {
      username: formAccount.value.username,
      email: formAccount.value.email,
      password: finalPassword,
      role: formAccount.value.role,
      hotel: formAccount.value.hotel
    }
  } else {
    // Mode Create Akun Baru
    accounts.value.push({
      username: formAccount.value.username,
      email: formAccount.value.email,
      password: formAccount.value.password,
      role: formAccount.value.role,
      hotel: formAccount.value.hotel
    })
  }
  
  closeModal()
}

// 4. FITUR DELETE ACCOUNT
const deleteAccount = (index) => {
  if (confirm('Are you sure you want to delete this account?')) {
    accounts.value.splice(index, 1)
  }
}

const handleLogout = () => {
  router.push('/')
}
</script>