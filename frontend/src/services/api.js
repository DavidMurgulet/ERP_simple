import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return Promise.resolve();
  },
  getCurrentUser: () => api.get('/auth/user/'),
};

// Tasks API endpoints
export const tasksAPI = {
  getTasks: (params) => api.get('/tasks/', { params }),
  getTask: (id) => api.get(`/tasks/${id}/`),
  createTask: (taskData) => api.post('/tasks/', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
};

// Employees API endpoints
export const employeesAPI = {
  getEmployees: (params) => api.get('/employees/', { params }),
  getEmployee: (id) => api.get(`/employees/${id}/`),
  createEmployee: (employeeData) => api.post('/employees/', employeeData),
  updateEmployee: (id, employeeData) => api.put(`/employees/${id}/`, employeeData),
  deleteEmployee: (id) => api.delete(`/employees/${id}/`),
};

// Calendar API endpoints
export const calendarAPI = {
  getEvents: (params) => api.get('/calendar/', { params }),
  getEvent: (id) => api.get(`/calendar/${id}/`),
  createEvent: (eventData) => api.post('/calendar/', eventData),
  updateEvent: (id, eventData) => api.put(`/calendar/${id}/`, eventData),
  deleteEvent: (id) => api.delete(`/calendar/${id}/`),
};

export default api;
