import axios from 'axios'

// Luôn dùng biến môi trường NEXT_PUBLIC_API_URL
// - Trên local: http://localhost:5000/api (set trong .env.local)
// - Trên Vercel: URL backend Render (set trong Vercel env variables)
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
}

const baseURL = getApiUrl()

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
