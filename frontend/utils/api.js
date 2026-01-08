import axios from 'axios';

// Базовый URL API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Создание экземпляра axios с настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен недействителен - очищаем и редиректим на логин
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    if (error.response?.status === 403) {
      // Premium required - редиректим на логин с сообщением
      if (typeof window !== 'undefined') {
        window.location.href = '/login?premium=required';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Habits API
export const habitsAPI = {
  getAll: () => api.get('/habits'),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.patch(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
  complete: (id) => api.post(`/habits/${id}/complete`),
};

// Diary API
export const diaryAPI = {
  getAll: (limit) => api.get('/diary', { params: { limit } }),
  getOne: (id) => api.get(`/diary/${id}`),
  create: (data) => api.post('/diary', data),
  update: (id, data) => api.patch(`/diary/${id}`, data),
};

// Beauty API
export const beautyAPI = {
  getAll: (category) => api.get('/beauty', { params: { category } }),
  create: (data) => api.post('/beauty', data),
  update: (id, data) => api.patch(`/beauty/${id}`, data),
  delete: (id) => api.delete(`/beauty/${id}`),
};

// Goals API
export const goalsAPI = {
  getAll: (category) => api.get('/goals', { params: { category } }),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.patch(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Progress API
export const progressAPI = {
  getAll: (params) => api.get('/progress', { params }),
  save: (data) => api.post('/progress', data),
  getStats: () => api.get('/progress/stats'),
};

// Payments API (заглушка)
export const paymentsAPI = {
  getStatus: () => api.get('/payments/status'),
  create: (data) => api.post('/payments/create', data),
};

export default api;

