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

// Course API - matches backend routes exactly
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
}

// Community API - matches backend routes exactly
export const communityAPI = {
  getPosts: () => api.get('/community'),
  createPost: (data) => api.post('/community', data),
  vote: (postId, voteType) => api.post(`/community/${postId}/vote`, { voteType }),
}

// Activity API - matches backend routes exactly
export const activityAPI = {
  getHeatmap: () => api.get('/activity/heatmap'),
  getStreaks: () => api.get('/activity/streaks'),
  logActivity: (topicId, actionType) => api.post('/activity/log', { topicId, actionType }),
}

// AI API - matches backend routes exactly
export const aiAPI = {
  askQuestion: (question, context) => api.post('/ai/ask', { question, context }),
}

// Analytics API (Admin) - matches backend routes exactly
export const analyticsAPI = {
  getDAU: (days = 30) => api.get('/analytics/dau', { params: { days } }),
  getTopics: (limit = 10) => api.get('/analytics/topics', { params: { limit } }),
  getDonations: () => api.get('/analytics/donations'),
  getTrending: (limit = 10) => api.get('/analytics/trending', { params: { limit } }),
}

export default api

