import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // <-- Pastikan tulisannya '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})