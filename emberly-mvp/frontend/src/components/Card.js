import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform as RNPlatform } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

const Card = ({ 
  children, 
  style, 
  onPress, 
  disabled = false,
  withShadow = true 
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[
        styles.card,
        withShadow && styles.shadow,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  shadow: {
    ...RNPlatform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default Card; 