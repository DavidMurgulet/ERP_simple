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

// Auth API endpoints only
export const authAPI = {
  login: (credentials) => api.post('auth/login/', credentials),
  register: (userData) => api.post('auth/register/', userData),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return Promise.resolve();
  },
  getCurrentUser: () => api.get('/auth/user/'),
};

// Projects API endpoints
export const projectsAPI = {
  // Get all projects
  list: () => api.get('/projects/'),
  
  // Create a new project
  create: (projectData) => api.post('/projects/create/', projectData),
  
  // Get project details
  detail: (id) => api.get(`/projects/${id}/`),
  
  // Update project
  update: (id, projectData) => api.put(`/projects/${id}/update/`, projectData),
  
  // Delete project
  delete: (id) => api.delete(`/projects/${id}/delete/`),
  
  // Mark project as completed
  complete: (id) => api.post(`/projects/${id}/complete/`),
  
  // Get completed projects
  getCompleted: () => api.get('/projects/completed/'),
  
  // Get in-progress projects
  getInProgress: () => api.get('/projects/in-progress/'),
};

// Employees API endpoints
export const employeesAPI = {
  // Get all employees
  list: () => api.get('/employees/'),
  
  // Create a new employee
  create: (employeeData) => api.post('/employees/create/', employeeData),
  
  // Get employee details
  detail: (id) => api.get(`/employees/${id}/`),
  
  // Update employee
  update: (id, employeeData) => api.put(`/employees/${id}/update/`, employeeData),
  
  // Delete employee
  delete: (id) => api.delete(`/employees/${id}/delete/`),
  
  // Get employee statistics
  stats: () => api.get('/employees/stats/'),
  
  // Check manager permissions
  checkManagerPermissions: () => api.get('/employees/permissions/check/'),

};

export default api;
