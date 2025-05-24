import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - adjust for different environments
const API_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Get the token from storage
    const token = await AsyncStorage.getItem('token');
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Clear token from storage
      await AsyncStorage.removeItem('token');
      
      // Redirect to login screen - we'll implement this later
      // navigation.navigate('Login');
    }
    
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: (token) => api.post('/auth/login', { token }),
  register: (token) => api.post('/auth/register', { token }),
};

// Profile API calls
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', { profile: profileData }),
  uploadPhoto: (formData) => api.post('/profile/photos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Swipe API calls
export const swipeAPI = {
  getProfiles: () => api.get('/profiles/discover'),
  swipe: (profileId, action) => api.post('/swipe', { profile_id: profileId, action }),
};

// Likes & Matches API calls
export const likesAPI = {
  getLikes: () => api.get('/likes/received'),
  getMatches: () => api.get('/matches'),
};

// Chat API calls
export const chatAPI = {
  getMessages: (matchId) => api.get(`/matches/${matchId}/messages`),
};

export default api; 