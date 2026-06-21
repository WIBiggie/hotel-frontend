<template>
  <div 
    class="w-screen h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
  >
    
    <div v-if="currentForm === 'login'" class="bg-black/75 p-10 rounded-lg w-full max-w-[400px] shadow-2xl text-white text-center backdrop-blur-sm">
      <h2 class="text-2xl font-semibold mb-7">Log in</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-5 text-left">
          <label for="email" class="block text-sm mb-2 text-gray-300">Email</label>
          <input 
            v-model="loginForm.email"
            type="email" 
            id="email" 
            required
            class="w-full px-4 py-2.5 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <div class="mb-5 text-left">
          <label for="password" class="block text-sm mb-2 text-gray-300">Password</label>
          <input 
            v-model="loginForm.password"
            type="password" 
            id="password" 
            required
            class="w-full px-4 py-2.5 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <div class="text-right -mt-2 mb-6">
          <button type="button" @click="currentForm = 'changePassword'" class="text-xs text-white hover:underline cursor-pointer">
            Change Password
          </button>
        </div>
        
        <button type="submit" class="w-full py-3 bg-[#512da8] hover:bg-[#43248e] rounded-lg text-white font-bold text-base transition-colors">
          Login
        </button>
      </form>
      
      <div class="mt-6 text-xs text-gray-300">
        <p>Don't have an account? 
          <button type="button" @click="currentForm = 'register'" class="text-white font-bold hover:underline cursor-pointer ml-1">
            Register Now
          </button>
        </p>
      </div>
    </div>

    <div v-else-if="currentForm === 'changePassword'" class="bg-black/75 p-10 rounded-lg w-full max-w-[400px] shadow-2xl text-white backdrop-blur-sm">
      <div class="flex items-center gap-3 mb-7">
        <button type="button" @click="currentForm = 'login'" class="text-white text-xl hover:text-gray-300 cursor-pointer">
          &lt;
        </button>
        <h2 class="text-2xl font-semibold">Change Password</h2>
      </div>
      
      <form @submit.prevent="handleChangePassword">
        <div class="mb-4">
          <label class="block text-sm mb-1.5 text-gray-300">Email</label>
          <input 
            v-model="changeForm.email"
            type="email" 
            required
            class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-sm mb-1.5 text-gray-300">Your Password</label>
          <input 
            v-model="changeForm.currentPassword"
            type="password" 
            required
            class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-sm mb-1.5 text-gray-300">New Password</label>
          <input 
            v-model="changeForm.newPassword"
            type="password" 
            required
            class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-sm mb-1.5 text-gray-300">Confirm Password</label>
          <input 
            v-model="changeForm.confirmPassword"
            type="password" 
            required
            class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <button type="submit" class="w-full py-3 bg-[#512da8] hover:bg-[#43248e] rounded-lg text-white font-bold text-base transition-colors">
          Change Now
        </button>
      </form>
    </div>

    <div v-else-if="currentForm === 'register'" class="bg-black/75 p-10 rounded-lg w-full max-w-[400px] shadow-2xl text-white backdrop-blur-sm">
      <div class="flex items-center gap-3 mb-7">
        <button type="button" @click="currentForm = 'login'" class="text-white text-xl hover:text-gray-300 cursor-pointer">
          &lt;
        </button>
        <h2 class="text-2xl font-semibold">Create Account</h2>
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-sm mb-1.5 text-gray-300">Username</label>
          <input 
            v-model="registerForm.username"
            type="text" 
            required
            class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm mb-1.5 text-gray-300">Email</label>
          <input 
            v-model="registerForm.email"
            type="email" 
            required
            class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-sm mb-1.5 text-gray-300">New Password</label>
          <input 
            v-model="registerForm.newPassword"
            type="password" 
            required
            class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-sm mb-1.5 text-gray-300">Confirm Password</label>
          <input 
            v-model="registerForm.confirmPassword"
            type="password" 
            required
            class="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-full text-white text-base outline-none focus:border-indigo-600 transition-colors"
          >
        </div>
        
        <button type="submit" class="w-full py-3 bg-[#512da8] hover:bg-[#43248e] rounded-lg text-white font-bold text-base transition-colors">
          Create Now
        </button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router' // <-- 1. Import useRouter

// background login
const backgroundImageUrl = ref('src/assets/bg-login.jpg')


// Menggunakan string state ('login', 'changePassword', 'register') untuk kontrol multi-form
const currentForm = ref('login')
const router = useRouter() // <-- 2. Inisialisasi fungsi router

// Data form login
const loginForm = reactive({
  email: '',
  password: ''
})

// Data form change password
const changeForm = reactive({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Data form register
const registerForm = reactive({
  username: '',
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const handleLogin = () => {
  console.log('Login:', loginForm)
  
  // 1. Kondisi untuk Super Admin
  if (loginForm.email === 'superadmin@example.com' && loginForm.password === 'superadmin') {
    // Jika Super Admin, pindah ke halaman khusus Super Admin
    router.push('/dashboardsuperadmin')
    
  // 2. Kondisi untuk Admin Hotel (Admin1) yang baru kita tambahkan
  } else if (loginForm.email === 'admin1@gmail.com' && loginForm.password === 'admin1') {
    // Jika Admin1, arahkan ke halaman khusus Admin Hotel
    // Catatan: Pastikan kamu sudah membuat route '/dashboardadmin' atau nama halaman admin hotelmu di router kamu
    router.push('/dashboardadmin') 
    
  } else if (loginForm.email === 'user1@gmail.com' && loginForm.password === 'user1') {
    // Jika user1, arahkan ke halaman khusus pelanggan Hotel
    // Catatan: Pastikan kamu sudah membuat route '/dashboarduser' atau nama halaman admin hotelmu di router kamu
    router.push('/dashboarduser') 

  } else {
    // Jika akun tidak terdaftar / salah input
    alert('Email atau Password salah! Periksa kembali akun Anda.')
  }
}

const handleChangePassword = () => {
  if (changeForm.newPassword !== changeForm.confirmPassword) {
    alert('Konfirmasi password baru tidak cocok!')
    return
  }
  console.log('Proses ganti password:', changeForm)
  currentForm.value = 'login'
}

const handleRegister = () => {
  if (registerForm.newPassword !== registerForm.confirmPassword) {
    alert('Konfirmasi password tidak cocok!')
    return
  }
  console.log('Proses pendaftaran akun:', registerForm)
  alert('Akun berhasil dibuat!')
  currentForm.value = 'login' // Otomatis balik ke form login setelah sukses register
}
</script>