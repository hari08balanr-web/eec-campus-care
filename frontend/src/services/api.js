import axios from 'axios';

// Automatically detect API base URL:
// 1. If running locally (localhost:5173), route to local Spring Boot (http://localhost:8080/api)
// 2. If running on Render (eec-campus-care.onrender.com), route to same-origin (/api)
// 3. If running on Vercel (*.vercel.app), route to live Render backend (https://eec-campus-care.onrender.com/api)
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.startsWith('http') && !import.meta.env.VITE_API_URL.includes('localhost')) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    }
    if (hostname.includes('onrender.com')) {
      return '/api';
    }
    return 'https://eec-campus-care.onrender.com/api';
  }

  return 'http://localhost:8080/api';
};

const API_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth header
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('eec_user') || 'null');
  if (user && user.email) {
    config.headers['X-User-Email'] = user.email;
  }
  return config;
});

const api = {
  // User Routes
  registerUser: (data) => {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      return apiClient.post('/users/register', data, {
        headers: { 'Content-Type': undefined }
      });
    }
    return apiClient.post('/users/register', data);
  },
  studentLogin: (data) => apiClient.post('/users/login', data),
  googleAuth: (data) => apiClient.post('/users/google-auth', data),
  getProfile: () => apiClient.get('/users/profile'),

  // Complaint Routes
  createComplaint: (formData) => apiClient.post('/complaints', formData, {
    headers: { 'Content-Type': undefined }
  }),
  getMyComplaints: (email) => apiClient.get(`/complaints/my?email=${email}`),
  trackComplaint: (ticketCode) => apiClient.get(`/complaints/track/${ticketCode}`),
  getComplaintById: (id) => apiClient.get(`/complaints/${id}`),

  // Admin Routes
  adminLogin: (data) => apiClient.post('/admin/login', data),
  getAdminComplaints: (category, status) => {
    let url = '/admin/complaints?';
    if (category) url += `category=${category}&`;
    if (status) url += `status=${status}`;
    return apiClient.get(url);
  },
  getAdminComplaintDetail: (id) => apiClient.get(`/admin/complaints/${id}`),
  updateComplaintStatus: (id, data) => apiClient.put(`/admin/complaints/${id}/status`, data),
  deleteComplaint: (id) => apiClient.delete(`/admin/complaints/${id}`),
  getAdminStats: () => apiClient.get('/admin/stats'),
  addSubAdmin: (data) => apiClient.post('/admin/sub-admins', data),
};

export default api;
