import axios from 'axios'

// Auto-detect API URL based on current hostname
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    // If accessing from IP address, use that IP for API
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api`
    }
  }
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
