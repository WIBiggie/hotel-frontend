import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import DashboardSuperAdmin from './components/DashboardSuperAdmin.vue'
import Hotel from './components/SuperAdmin/Hotel.vue'
import Account from './components/SuperAdmin/Account.vue'
import DashboardAdmin from './components/DashboardAdmin.vue'
import DashboardUser from './components/DashboardUser.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  // --- HALAMAN SUPER ADMIN ---
  {
    path: '/dashboardsuperadmin',
    name: 'DashboardSuperAdmin',
    component: DashboardSuperAdmin,
    meta: { requiresAuth: true, role: 'super-admin' } // <-- PERBAIKAN: Ubah jadi 'superadmin' tanpa strip
  },
  {
    path: '/hotel',
    name: 'Hotel',
    component: Hotel,
    meta: { requiresAuth: true, role: 'super-admin' } // <-- PERBAIKAN: Ubah jadi 'superadmin' tanpa strip
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: { requiresAuth: true, role: 'super-admin' } // <-- PERBAIKAN: Ubah jadi 'superadmin' tanpa strip
  },

  // --- HALAMAN ADMIN HOTEL ---
  {
    path: '/dashboardadmin',
    name: 'DashboardAdmin',
    component: DashboardAdmin,
    meta: { requiresAuth: true, role: 'admin' }
  },

  // --- HALAMAN PELANGGAN HOTEL ---
  {
    path: '/dashboarduser',
    name: 'DashboardUser',
    component: DashboardUser,
    meta: { requiresAuth: true, role: 'customer' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  if (to.meta.requiresAuth) {
    if (!token) {
      alert('Akses ditolak! Silakan login terlebih dahulu.')
      return next('/')
    }

    if (to.meta.role) {
      const cleanMetaRole = String(to.meta.role).trim().toLowerCase();
      const cleanUserRole = userRole ? String(userRole).trim().toLowerCase() : '';

      if (cleanMetaRole !== cleanUserRole) {
        alert(`Akses ditolak! Role Anda adalah "${userRole}", tidak diizinkan masuk ke halaman "${to.meta.role}".`)
        return next('/')
      }
    }
  }

  next()
})

export default router