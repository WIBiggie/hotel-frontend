import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Menghubungkan ke file konfigurasi router kamu
import './style.css'

const app = createApp(App)
app.use(router) 
app.mount('#app')