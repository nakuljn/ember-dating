import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { COLORS, SPACING, TYPOGRAPHY } from '../../utils/theme';
import { authAPI } from '../../services/api';
import authService from '../../services/auth/authService';

// Make sure to initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the Google sign-in request hook
  const [request, response, promptAsync] = authService.initGoogleSignIn();
  
  // Log request and response state for debugging
  useEffect(() => {
    console.log('[Login] Google sign-in request state:', request ? 'Ready' : 'Not ready');
    console.log('[Login] Response:', response ? response.type : 'None');
  }, [request, response]);
  
  // Handle Google sign-in response
  useEffect(() => {
    if (response?.type === 'success') {
      console.log('[Login] Google sign-in success response');
      const { id_token } = response.params;
      handleGoogleAuth(id_token);
    } else if (response?.type === 'error') {
      console.error('[Login] Google sign-in error response:', response.error);
      Alert.alert('Login Error', response.error?.message || 'Failed to login with Google');
      setIsLoading(false);
    }
  }, [response]);

  const handleGoogleAuth = async (idToken) => {
    setIsLoading(true);
    console.log('[Login] Starting Google authentication flow');
    
    try {
      console.log('[Login] Authenticating with Firebase');
      // First authenticate with Firebase
      const userCredential = await authService.signInWithGoogle(idToken);
      console.log('[Login] Firebase auth successful, getting Firebase token');
      
      const firebaseToken = await userCredential.user.getIdToken();
      console.log('[Login] Firebase token received, authenticating with backend');
      
      // Mock backend authentication for now since backend might not be ready
      try {
        // Then authenticate with our backend
        const backendResponse = await authAPI.login(firebaseToken);
        
        console.log('[Login] Backend auth response:', backendResponse);
        
        if (backendResponse.is_new_user) {
          // If new user, navigate to profile creation
          console.log('[Login] New user, navigating to profile creation');
          navigation.navigate('ProfileCreate');
        } else {
          // If existing user, navigate to main app
          console.log('[Login] Existing user, navigating to main app');
          navigation.navigate('Main');
        }
      } catch (backendError) {
        console.error('[Login] Backend auth error:', backendError);
        // For development, continue to main app even if backend auth fails
        console.log('[Login] Continuing to main app despite backend error (development only)');
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('[Login] Authentication error:', error);
      console.error('[Login] Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Login Failed', 'Could not login with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    console.log('[Login] Starting Google login process');
    try {
      console.log('[Login] Prompting for Google authentication');
      await promptAsync();
      // The response will be handled in the useEffect hook
    } catch (error) {
      console.error('[Login] Google sign-in prompt error:', error);
      Alert.alert('Login Failed', 'Could not start Google login. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    // Similar to Google login but with Apple
    Alert.alert('Apple Login', 'Apple login would be implemented here');
  };

  const handlePhoneLogin = () => {
    // Navigate to phone login screen
    Alert.alert('Phone Login', 'Phone login would be implemented here');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Emberly</Text>
        <Text style={styles.tagline}>Fair dating for everyone</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Get Started</Text>
        
        <TouchableOpacity 
          style={[styles.loginButton, styles.googleButton]} 
          onPress={handleGoogleLogin}
          disabled={isLoading || !request}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Loading...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.loginButton, styles.appleButton]} 
          onPress={handleAppleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.loginButton, styles.phoneButton]} 
          onPress={handlePhoneLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Continue with Phone</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.large,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xlarge,
  },
  logo: {
    fontSize: TYPOGRAPHY.fontSize.xxlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.small,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSize.medium,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: SPACING.xlarge,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xlarge,
    fontWeight: 'bold',
    marginBottom: SPACING.xlarge,
    color: COLORS.textPrimary,
  },
  loginButton: {
    width: '100%',
    padding: SPACING.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  phoneButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: TYPOGRAPHY.fontSize.medium,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: SPACING.medium,
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.small,
    textAlign: 'center',
  },
});

export default LoginScreen; 