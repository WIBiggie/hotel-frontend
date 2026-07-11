import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.33.111:8001/', 
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