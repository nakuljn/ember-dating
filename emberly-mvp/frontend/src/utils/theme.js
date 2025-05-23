/**
 * Emberly app theme
 * 
 * This file contains colors, spacing, and other styling constants
 * used throughout the app to maintain a consistent visual identity.
 */

// Color palette
export const COLORS = {
  // Primary colors
  primary: '#FF6B6B',     // Ember red/orange
  secondary: '#FFD166',   // Warm yellow
  tertiary: '#06D6A0',    // Success green

  // Background colors
  background: '#FFFFFF',
  cardBackground: '#F9F9F9',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textLight: '#FFFFFF',
  
  // Status colors
  success: '#06D6A0',
  error: '#EF476F',
  warning: '#FFD166',
  info: '#118AB2',
  
  // UI colors
  border: '#EEEEEE',
  divider: '#E0E0E0',
  disabled: '#CCCCCC',
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    tiny: 12,
    small: 14,
    regular: 16,
    medium: 18,
    large: 20,
    xlarge: 24,
    xxlarge: 30,
  },
};

// Spacing
export const SPACING = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
};

// Border radius
export const BORDER_RADIUS = {
  small: 4,
  medium: 8,
  large: 16,
  round: 999,
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
}; 