import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  PanResponder,
  Animated,
  Alert,
  Platform as RNPlatform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, TYPOGRAPHY } from '../../utils/theme';
import { swipeAPI } from '../../services/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const DiscoverScreen = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSwipes, setRemainingSwipes] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  
  const position = new Animated.ValueXY();
  
  useEffect(() => {
    loadProfiles();
  }, []);
  
  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      // For MVP, we'll use mock data instead of API call
      // const response = await swipeAPI.getProfiles();
      // setProfiles(response.data.profiles);
      // setRemainingSwipes(response.data.remaining_swipes);
      
      // Mock profiles
      const mockProfiles = [
        {
          id: '1',
          name: 'Sarah',
          age: 28,
          bio: 'Coffee lover, bookworm, and outdoor enthusiast.',
          photos: ['https://randomuser.me/api/portraits/women/1.jpg'],
          gender: 'female',
        },
        {
          id: '2',
          name: 'James',
          age: 30,
          bio: 'Photographer and travel addict. Ask me about my last trip!',
          photos: ['https://randomuser.me/api/portraits/men/2.jpg'],
          gender: 'male',
        },
        {
          id: '3',
          name: 'Emma',
          age: 26,
          bio: 'Food blogger, yoga instructor, and dog mom.',
          photos: ['https://randomuser.me/api/portraits/women/3.jpg'],
          gender: 'female',
        },
        {
          id: '4',
          name: 'Michael',
          age: 31,
          bio: 'Software engineer by day, musician by night.',
          photos: ['https://randomuser.me/api/portraits/men/4.jpg'],
          gender: 'male',
        },
      ];
      
      setProfiles(mockProfiles);
      
      // Get user profile to check remaining swipes
      const userProfileString = await AsyncStorage.getItem('userProfile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        setRemainingSwipes(userProfile.daily_swipe_limit - userProfile.likes_given);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      Alert.alert('Error', 'Failed to load profiles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    }
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false
    }).start();
  };

  const swipeLeft = async () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      handleSwipe('dislike', profiles[currentIndex].id);
    });
  };

  const swipeRight = async () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      handleSwipe('like', profiles[currentIndex].id);
    });
  };

  const handleSwipe = async (action, profileId) => {
    try {
      if (action === 'like') {
        // For MVP, we'll mock the API call
        // const response = await swipeAPI.swipe(profileId, action);
        
        // Update remaining swipes locally
        const newRemainingSwipes = remainingSwipes - 1;
        setRemainingSwipes(newRemainingSwipes);
        
        // Update likes_given in local storage
        const userProfileString = await AsyncStorage.getItem('userProfile');
        if (userProfileString) {
          const userProfile = JSON.parse(userProfileString);
          userProfile.likes_given += 1;
          await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
        
        // Check if it's a match (for demo, let's say every 3rd like is a match)
        if (currentIndex % 3 === 0) {
          Alert.alert('Match!', `You and ${profiles[currentIndex].name} liked each other!`);
        }
      }
      
      // Move to the next profile
      setCurrentIndex(prevIndex => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
    } catch (error) {
      console.error('Error recording swipe:', error);
      Alert.alert('Error', 'Failed to record your choice. Please try again.');
      resetPosition();
    }
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  };

  const renderNoMoreCards = () => {
    return (
      <View style={styles.noMoreCardsContainer}>
        <Text style={styles.noMoreCardsText}>No more profiles to show!</Text>
        <Text style={styles.checkBackText}>Check back later for new matches</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadProfiles}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCard = () => {
    if (currentIndex >= profiles.length) {
      return renderNoMoreCards();
    }

    const profile = profiles[currentIndex];

    return (
      <Animated.View
        style={[styles.card, getCardStyle()]}
        {...panResponder.panHandlers}
      >
        <Image
          source={{ uri: profile.photos[0] }}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{profile.name}, {profile.age}</Text>
          <Text style={styles.cardBio}>{profile.bio}</Text>
        </View>
        
        <View style={styles.swipeLabels}>
          <View style={[styles.swipeLabel, styles.nopeLabel]}>
            <Text style={styles.swipeLabelText}>NOPE</Text>
          </View>
          <View style={[styles.swipeLabel, styles.likeLabel]}>
            <Text style={styles.swipeLabelText}>LIKE</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.remainingText}>
          Swipes: {remainingSwipes} left today
        </Text>
      </View>
      
      <View style={styles.cardContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profiles...</Text>
          </View>
        ) : (
          renderCard()
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.dislikeButton]}
          onPress={swipeLeft}
          disabled={currentIndex >= profiles.length || remainingSwipes <= 0}
        >
          <Text style={styles.buttonIcon}>✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.likeButton]}
          onPress={swipeRight}
          disabled={currentIndex >= profiles.length || remainingSwipes <= 0}
        >
          <Text style={styles.buttonIcon}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.medium,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  remainingText: {
    fontSize: TYPOGRAPHY.fontSize.regular,
    color: COLORS.textSecondary,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.medium,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - SPACING.large * 2,
    height: '100%',
    borderRadius: 10,
    backgroundColor: COLORS.cardBackground,
    overflow: 'hidden',
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
  cardImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: SPACING.medium,
  },
  cardName: {
    fontSize: TYPOGRAPHY.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.small,
  },
  cardBio: {
    fontSize: TYPOGRAPHY.fontSize.regular,
    color: COLORS.textSecondary,
  },
  swipeLabels: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: SPACING.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  swipeLabel: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    opacity: 0,  // Hidden by default, revealed on swipe
  },
  nopeLabel: {
    borderColor: COLORS.error,
    transform: [{ rotate: '-10deg' }],
  },
  likeLabel: {
    borderColor: COLORS.success,
    transform: [{ rotate: '10deg' }],
  },
  swipeLabelText: {
    fontSize: TYPOGRAPHY.fontSize.large,
    fontWeight: 'bold',
  },
  noMoreCardsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  noMoreCardsText: {
    fontSize: TYPOGRAPHY.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.medium,
  },
  checkBackText: {
    fontSize: TYPOGRAPHY.fontSize.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: COLORS.textLight,
    fontSize: TYPOGRAPHY.fontSize.medium,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.regular,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: SPACING.large,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
  dislikeButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  likeButton: {
    backgroundColor: COLORS.primary,
  },
  buttonIcon: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default DiscoverScreen; 