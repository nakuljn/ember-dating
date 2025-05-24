import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

const Avatar = ({ 
  source, 
  size = 'medium', 
  style,
  borderColor = COLORS.primary,
  withBorder = false
}) => {
  let avatarSize;
  
  switch (size) {
    case 'small':
      avatarSize = 40;
      break;
    case 'large':
      avatarSize = 80;
      break;
    case 'xlarge':
      avatarSize = 120;
      break;
    default: // medium
      avatarSize = 60;
  }
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          width: avatarSize, 
          height: avatarSize,
          borderRadius: avatarSize / 2,
          borderWidth: withBorder ? 2 : 0,
          borderColor: borderColor
        },
        style
      ]}
    >
      {source ? (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={[
            styles.image,
            { 
              width: withBorder ? avatarSize - 4 : avatarSize, 
              height: withBorder ? avatarSize - 4 : avatarSize,
              borderRadius: avatarSize / 2 
            }
          ]}
          resizeMode="cover"
        />
      ) : (
        <View 
          style={[
            styles.placeholder,
            { 
              width: withBorder ? avatarSize - 4 : avatarSize, 
              height: withBorder ? avatarSize - 4 : avatarSize,
              borderRadius: avatarSize / 2 
            }
          ]} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: COLORS.cardBackground,
  },
  placeholder: {
    backgroundColor: COLORS.border,
  },
});

export default Avatar; 