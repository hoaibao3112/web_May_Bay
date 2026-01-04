import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
