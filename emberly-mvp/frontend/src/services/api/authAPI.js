import api from './apiClient';
import authService from '../auth/authService';

// Set to true to use mock responses (for development without backend)
const USE_MOCK_API = true;

/**
 * Authentication API service
 */
class AuthAPI {
  /**
   * Login with Firebase token
   * @param {string} firebaseToken - Firebase ID token
   * @returns {Promise} Response data with access token and user info
   */
  async login(firebaseToken) {
    try {
      console.log('[AuthAPI] Login attempt with token:', firebaseToken ? 'Provided' : 'Missing');
      
      if (USE_MOCK_API) {
        console.log('[AuthAPI] Using mock API response for login');
        // Create mock response for development without backend
        const mockResponse = {
          access_token: "mock_jwt_token_" + Date.now(),
          user: {
            id: "mock_user_id",
            email: "mock@example.com",
            auth_provider: "google",
          },
          is_new_user: false // Set to true to test profile creation flow
        };
        
        // Store the mock JWT token
        await authService.saveUserData(mockResponse.user, mockResponse.access_token);
        
        console.log('[AuthAPI] Mock login successful');
        return mockResponse;
      }
      
      // Real API call
      const response = await api.post('/auth/login', {
        token: firebaseToken
      });
      
      // Store the JWT token from our backend
      const { access_token, user } = response.data;
      await authService.saveUserData(user, access_token);
      
      console.log('[AuthAPI] Login successful');
      return response.data;
    } catch (error) {
      console.error('[AuthAPI] Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {string} firebaseToken - Firebase ID token
   * @param {Object} profile - User profile data
   * @returns {Promise} Response data with access token, user, and profile
   */
  async register(firebaseToken, profile) {
    try {
      console.log('[AuthAPI] Register attempt with profile:', profile);
      
      if (USE_MOCK_API) {
        console.log('[AuthAPI] Using mock API response for registration');
        // Create mock response for development without backend
        const mockResponse = {
          access_token: "mock_jwt_token_" + Date.now(),
          user: {
            id: "mock_user_id",
            email: profile.email || "mock@example.com",
            auth_provider: "google",
          },
          profile: {
            ...profile,
            id: "mock_profile_id"
          }
        };
        
        // Store the mock JWT token
        await authService.saveUserData(mockResponse.user, mockResponse.access_token);
        
        console.log('[AuthAPI] Mock registration successful');
        return mockResponse;
      }
      
      // Real API call
      const response = await api.post('/auth/register', {
        token: firebaseToken,
        profile: profile
      });
      
      // Store the JWT token from our backend
      const { access_token, user } = response.data;
      await authService.saveUserData(user, access_token);
      
      console.log('[AuthAPI] Registration successful');
      return response.data;
    } catch (error) {
      console.error('[AuthAPI] Registration error:', error);
      throw error;
    }
  }
}

export default new AuthAPI(); 