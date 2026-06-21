import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <-- Tambahkan import ini
import './style.css'

const app = createApp(App)
app.use(router) // <-- Pasang router di aplikasi Vue
app.mount('#app')