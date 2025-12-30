import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add token to requests
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

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Course API
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  getProgress: (id) => api.get(`/courses/${id}/progress`),
  updateProgress: (id, data) => api.put(`/courses/${id}/progress`, data),
}

// Community API
export const communityAPI = {
  getPosts: (params) => api.get('/community/posts', { params }),
  getPostById: (id) => api.get(`/community/posts/${id}`),
  createPost: (data) => api.post('/community/posts', data),
  updatePost: (id, data) => api.put(`/community/posts/${id}`, data),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  vote: (id, type) => api.post(`/community/posts/${id}/vote`, { type }),
  getComments: (id) => api.get(`/community/posts/${id}/comments`),
  addComment: (id, data) => api.post(`/community/posts/${id}/comments`, data),
}

// Activity API
export const activityAPI = {
  getActivity: () => api.get('/activity'),
  getStreaks: () => api.get('/activity/streaks'),
  getHeatmap: (year) => api.get(`/activity/heatmap?year=${year}`),
}

// AI API
export const aiAPI = {
  askQuestion: (question) => api.post('/ai/ask', { question }),
  getChatHistory: () => api.get('/ai/chat-history'),
  clearHistory: () => api.delete('/ai/chat-history'),
}

// Analytics API (Admin)
export const analyticsAPI = {
  getDashboard: () => api.get('/admin/analytics/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getCourses: (params) => api.get('/admin/courses', { params }),
  getEngagement: () => api.get('/admin/analytics/engagement'),
}

export default api

