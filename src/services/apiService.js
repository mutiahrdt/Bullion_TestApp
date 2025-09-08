// src/services/apiService.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // ... (fungsi register dan login tidak berubah)
  register(userData) {
    return apiClient.post('/api/v1/auth/register', userData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  login(credentials) {
    return apiClient.post('/api/v1/auth/login', credentials, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

export const userService = {
  getUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return apiClient.get(`/api/v1/admin?offset=${offset}&limit=${limit}`);
  },

  getUserById(id) {
    return apiClient.get(`/api/v1/admin/${id}`);
  },

  updateUser(id, userData) {
    // =======================================================
    // PERBAIKAN KRUSIAL DI SINI: Hapus `/update` dari URL
    // =======================================================
    userData.append('_method', 'PUT'); 
    return apiClient.post(`/api/v1/admin/${id}`, userData, { // <-- URL yang benar
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteUser(id) {
    return apiClient.delete(`/api/v1/admin/${id}`);
  },
};