import axios from 'axios';
import authService from '../auth/authService';

// API configuration
const API_BASE_URL = 'http://localhost:8000'; // Change to your API server URL

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Add request interceptor to attach auth token to requests
 */
api.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = await authService.getToken();
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Add response interceptor to handle common errors
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Sign out user on authentication errors
      await authService.signOut();
      
      // You could redirect to login screen here
      
      return Promise.reject(error);
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

export default api; 