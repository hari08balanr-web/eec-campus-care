import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
  registerUser: (data) => apiClient.post('/users/register', data),
  googleAuth: (data) => apiClient.post('/users/google-auth', data),
  getProfile: () => apiClient.get('/users/profile'),

  // Complaint Routes
  createComplaint: (formData) => apiClient.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
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
  getAdminStats: () => apiClient.get('/admin/stats'),
  addSubAdmin: (data) => apiClient.post('/admin/sub-admins', data),
};

export default api;
