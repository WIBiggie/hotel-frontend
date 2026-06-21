import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import DashboardSuperAdmin from './components/DashboardSuperAdmin.vue'
import Hotel from './components/SuperAdmin/Hotel.vue'
import Account from './components/SuperAdmin/Account.vue'
import DashboardAdmin from './components/DashboardAdmin.vue'
import DashboardUser from './components/DashboardUser.vue'

const routes = [
    // ini untuk bagian super admin
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboardsuperadmin',
    name: 'DashboardSuperAdmin',
    component: DashboardSuperAdmin
  },
  {
    path: '/hotel',
    name: 'Hotel',
    component: Hotel
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
  },

  // ini untuk bagian admin hotel
  {
    path: '/dashboardadmin',
    name: 'DashboardAdmin',
    component: DashboardAdmin
  },

  // ini untuk bagian pelanggan hotel
  {
    path: '/dashboarduser',
    name: 'DashboardUser',
    component: DashboardUser
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router