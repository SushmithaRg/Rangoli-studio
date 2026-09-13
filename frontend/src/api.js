import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rangoli_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const signup = (username, password) =>
  api.post('/api/auth/signup', { username, password }).then((r) => r.data)

export const login = (username, password) =>
  api.post('/api/auth/login', { username, password }).then((r) => r.data)

export const getMe = () => api.get('/api/auth/me').then((r) => r.data)

export const updateAvatar = (avatar) =>
  api.put('/api/auth/avatar', { avatar }).then((r) => r.data)

export const listDesigns = () => api.get('/api/designs').then((r) => r.data)

export const createDesign = (design) =>
  api.post('/api/designs', design).then((r) => r.data)

export const deleteDesign = (id) =>
  api.delete(`/api/designs/${id}`).then((r) => r.data)

export default api
