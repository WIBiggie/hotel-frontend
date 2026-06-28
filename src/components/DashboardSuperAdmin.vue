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
          
          <button @click="isSidebarOpen = false" class="w-full flex items-center gap-3 px-3 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium rounded-lg text-sm text-left transition-colors">
            📊 Overview
          </button>
          
          <button 
            @click="router.push('/hotel')" 
            class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer"
          >
            🏨 Hotel
          </button>
          
          <button 
            @click="router.push('/account')" 
            class="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg text-sm text-left transition-colors cursor-pointer"
          >
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

    <main class="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto bg-slate-50/50 min-w-0">
      
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div class="bg-[#1e293b] text-white p-5 rounded-xl shadow-sm border border-slate-700">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Hotel</p>
          <p class="text-3xl font-extrabold mt-1">4</p>
        </div>
        <div class="bg-[#1e293b] text-white p-5 rounded-xl shadow-sm border border-slate-700">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Number of Rooms</p>
          <p class="text-3xl font-extrabold mt-1">1150</p>
        </div>
        <div class="bg-[#1e293b] text-white p-5 rounded-xl shadow-sm border border-slate-700 sm:col-span-2 lg:col-span-1">
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transactions</p>
          <p class="text-3xl font-extrabold mt-1">500</p>
        </div>
      </section>

      <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 w-full min-w-0">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse text-sm min-w-[800px]">
            <thead>
              <tr class="bg-[#2e3a50] text-white font-semibold">
                <th class="p-3.5 border-b border-gray-200 w-16 text-center">No</th>
                <th class="p-3.5 border-b border-gray-200">Hotel</th>
                <th class="p-3.5 border-b border-gray-200">Address</th>
                <th class="p-3.5 border-b border-gray-200 w-24 text-center">Rooms</th>
                <th class="p-3.5 border-b border-gray-200">Administrator</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700 font-medium">
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-center text-gray-400">1</td>
                <td class="p-3.5 font-bold text-gray-900">One Hotel</td>
                <td class="p-3.5 text-gray-500">Tasikmalaya, Tawang Sari, jln.Khz.Mustofa,</td>
                <td class="p-3.5 text-center font-semibold">200</td>
                <td class="p-3.5 text-indigo-600">Admin1</td>
              </tr>
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-center text-gray-400">2</td>
                <td class="p-3.5 font-bold text-gray-900">Kehoncewang</td>
                <td class="p-3.5 text-gray-500">Tasikmalaya, Tawang Sari, jln.Khz.Mustofa,</td>
                <td class="p-3.5 text-center font-semibold">500</td>
                <td class="p-3.5 text-indigo-600">Admin2</td>
              </tr>
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-center text-gray-400">3</td>
                <td class="p-3.5 font-bold text-gray-900">Dewi Sartika</td>
                <td class="p-3.5 text-gray-500">Tasikmalaya, Tawang Sari, jln.Khz.Mustofa,</td>
                <td class="p-3.5 text-center font-semibold">300</td>
                <td class="p-3.5 text-indigo-600">Admin3</td>
              </tr>
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="p-3.5 text-center text-gray-400">4</td>
                <td class="p-3.5 font-bold text-gray-900">Grand Metro</td>
                <td class="p-3.5 text-gray-500">Tasikmalaya, Tawang Sari, jln.Khz.Mustofa,</td>
                <td class="p-3.5 text-center font-semibold">150</td>
                <td class="p-3.5 text-gray-400 italic font-normal">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>
</template>



<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api' 

const backgroundImageUrl = ref('src/assets/bg-login.jpg')
const currentForm = ref('login')
const router = useRouter()
const isLoading = ref(false) 

// 2. FUNGSI LOGIN (DISESUAIKAN STRUKTUR RESPONSE LARAVEL)
const handleLogin = async () => {
  try {
    isLoading.value = true
    
    const response = await api.post('/auth/login', {
      email: loginForm.email,
      password: loginForm.password
    })
    
    // CATATAN PENTING: Sesuaikan destruksi ini dengan isi JSON backend kamu.
    // Jika bentuknya { token: '...', role: '...' } gunakan baris di bawah:
    const { token, role } = response.data
    
    // JIKA bentuknya { data: { token: '...', user: { role: '...' } } }, ubah menjadi:
    // const token = response.data.data?.token || response.data.token
    // const role = response.data.data?.user?.role || response.data.role
    
    if (token) {
      // SIMPAN KE BROWSER
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      
      alert('Login Berhasil!')
      
      // Arahkan halaman sesuai hak akses role dari database backend
      if (role === 'super-admin') {
        router.push('/dashboardsuperadmin')
      } else if (role === 'admin') {
        router.push('/dashboardadmin')
      } else {
        router.push('/dashboarduser')
      }
    } else {
      alert('Gagal mendapatkan token otentikasi dari server.')
    }
  } catch (error) {
    console.error('Login Error:', error)
    const errorMsg = error.response?.data?.message || 'Email atau Password salah!'
    alert(errorMsg)
  } finally {
    isLoading.value = false
  }
}

// 3. FUNGSI GANTI PASSWORD (DIALIKKAN KE /auth/me ATAU ADAPTER KARENA ENDPOINT KHUSUS TIDAK ADA DI DOCS)
const handleChangePassword = async () => {
  if (changeForm.newPassword !== changeForm.confirmPassword) {
    alert('Konfirmasi password baru tidak cocok!')
    return
  }
  
  try {
    isLoading.value = true
    // Catatan: Karena di dokumen rute tidak ada /auth/change-password, 
    // jika backend kamu menggunakan PUT ke rute profile untuk ganti password, sesuaikan di sini.
    await api.post('/auth/change-password', {
      email: changeForm.email,
      currentPassword: changeForm.currentPassword,
      password: changeForm.newPassword
    })
    
    alert('Password berhasil diubah! Silakan login kembali.')
    currentForm.value = 'login'
    
    // Reset form
    changeForm.email = ''
    changeForm.currentPassword = ''
    changeForm.newPassword = ''
    changeForm.confirmPassword = ''
  } catch (error) {
    console.error('Change Password Error:', error)
    alert(error.response?.data?.message || 'Fitur ganti password belum didukung atau rute salah.')
  } finally {
    isLoading.value = false
  }
}

// 4. FUNGSI REGISTER (DISESUAIKAN PARAMETER DENGAN ENDPOINT /auth/register)
const handleRegister = async () => {
  if (registerForm.newPassword !== registerForm.confirmPassword) {
    alert('Konfirmasi password tidak cocok!')
    return
  }
  
  try {
    isLoading.value = true
    // Tembak endpoint registrasi sesuai dokumen (Public)
    await api.post('/auth/register', {
      name: registerForm.name, // disesuaikan dari username -> name jika backend Laravel menggunakan standar kolom 'name'
      email: registerForm.email,
      password: registerForm.newPassword
    })
    
    alert('Akun berhasil dibuat! Silakan masuk.')
    currentForm.value = 'login'
    
    // Reset form register
    registerForm.name = ''
    registerForm.email = ''
    registerForm.newPassword = ''
    registerForm.confirmPassword = ''
  } catch (error) {
    console.error('Register Error:', error)
    alert(error.response?.data?.message || 'Pendaftaran akun gagal.')
  } finally {
    isLoading.value = false
  }
}
</script>