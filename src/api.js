import axios from 'axios'

const api = axios.create({
  // Ubah port dari :8001 menjadi :8000
  baseURL: 'http://192.168.18.8:8001/', 
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor untuk menyisipkan Token JWT otomatis di setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api