import { 
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseAuthStateChanged
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/config'; // Ensure this imports the auth from our config.js

// Initialize WebBrowser for OAuth redirect
WebBrowser.maybeCompleteAuthSession();

// Constants for AsyncStorage
const USER_TOKEN_KEY = '@emberly_user_token';
const USER_DATA_KEY = '@emberly_user_data';

/**
 * Authentication service for handling user authentication
 */
class AuthService {
  /**
   * Initialize Google OAuth sign-in
   * @returns {Object} Google sign-in hooks
   */
  initGoogleSignIn() {
    console.log('[Auth] Initializing Google Sign-in');
    return Google.useIdTokenAuthRequest({
      clientId: 'YOUR_WEB_CLIENT_ID',
      iosClientId: '813363621612-hlqcqouqluqr1qt56og9belgbf64hfch.apps.googleusercontent.com',
      androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    });
  }

  /**
   * Sign in with Google
   * @param {string} idToken - Google ID token
   * @returns {Promise} User credentials
   */
  async signInWithGoogle(idToken) {
    console.log('[Auth] Starting Google sign-in with ID token');
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      console.log('[Auth] Signing in to Firebase with Google credential');
      const userCredential = await signInWithCredential(auth, credential);
      console.log('[Auth] Sign-in successful:', userCredential.user.uid);
      const token = await userCredential.user.getIdToken();
      console.log('[Auth] Saving user data to AsyncStorage');
      await this.saveUserData(userCredential.user, token);
      return userCredential;
    } catch (error) {
      console.error('[Auth] Google sign-in error:', error);
      console.error('[Auth] Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  /**
   * Sign out the current user
   * @returns {Promise} Void
   */
  async signOut() {
    try {
      console.log('[Auth] Signing out user');
      await firebaseSignOut(auth);
      console.log('[Auth] Clearing local storage');
      await AsyncStorage.multiRemove([USER_TOKEN_KEY, USER_DATA_KEY]);
      console.log('[Auth] Sign out successful');
      return true;
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
      throw error;
    }
  }

  /**
   * Save user data to AsyncStorage
   * @param {Object} user - User object
   * @param {string} token - Authentication token
   * @returns {Promise} Void
   */
  async saveUserData(user, token) {
    try {
      const userData = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        auth_provider: this.getProviderFromUser(user),
        created_at: user.metadata.creationTime,
        last_active: user.metadata.lastSignInTime
      };
      console.log('[Auth] Saving user data:', { ...userData, token: '***' });
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(USER_TOKEN_KEY, token);
      return userData;
    } catch (error) {
      console.error('[Auth] Save user data error:', error);
      throw error;
    }
  }

  /**
   * Get user data from AsyncStorage
   * @returns {Promise<Object|null>} User data or null
   */
  async getUserData() {
    try {
      console.log('[Auth] Getting user data from AsyncStorage');
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      const parsed = userData ? JSON.parse(userData) : null;
      console.log('[Auth] Got user data:', parsed ? 'Found' : 'Not found');
      return parsed;
    } catch (error) {
      console.error('[Auth] Get user data error:', error);
      return null;
    }
  }

  /**
   * Get authentication token from AsyncStorage
   * @returns {Promise<string|null>} Token or null
   */
  async getToken() {
    try {
      console.log('[Auth] Getting authentication token');
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
      console.log('[Auth] Token found:', !!token);
      return token;
    } catch (error) {
      console.error('[Auth] Get token error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} Authentication status
   */
  async isAuthenticated() {
    console.log('[Auth] Checking authentication status');
    const token = await this.getToken();
    console.log('[Auth] Is authenticated:', !!token);
    return !!token;
  }

  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Function to call on auth state change
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChanged(callback) {
    console.log('[Auth] Setting up auth state change listener');
    return firebaseAuthStateChanged(auth, (user) => {
      console.log('[Auth] Auth state changed, user:', user ? 'Logged in' : 'Logged out');
      callback(user);
    });
  }

  /**
   * Get the auth provider from a user object
   * @param {Object} user - Firebase user object
   * @returns {string} Provider name (google, apple, phone)
   */
  getProviderFromUser(user) {
    if (!user.providerData || user.providerData.length === 0) {
      return 'unknown';
    }
    const providerId = user.providerData[0].providerId;
    console.log('[Auth] Provider ID:', providerId);
    if (providerId.includes('google')) return 'google';
    if (providerId.includes('apple')) return 'apple';
    if (providerId.includes('phone')) return 'phone';
    return 'unknown';
  }
}

export default new AuthService(); 