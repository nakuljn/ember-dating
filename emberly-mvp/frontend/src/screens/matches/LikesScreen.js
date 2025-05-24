import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Platform as RNPlatform
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../utils/theme';
import { likesAPI } from '../../services/api';

const LikesScreen = ({ navigation }) => {
  const [likes, setLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    setIsLoading(true);
    try {
      // For MVP, we'll use mock data instead of API call
      // const response = await likesAPI.getLikes();
      // setLikes(response.data.profiles);
      
      // Mock likes
      const mockLikes = [
        {
          id: '101',
          name: 'Sophia',
          age: 25,
          bio: 'Adventure seeker and coffee enthusiast.',
          photos: ['https://randomuser.me/api/portraits/women/5.jpg'],
          likedAt: '2 hours ago',
        },
        {
          id: '102',
          name: 'Noah',
          age: 29,
          bio: 'Music lover and fitness enthusiast.',
          photos: ['https://randomuser.me/api/portraits/men/7.jpg'],
          likedAt: '1 day ago',
        },
        {
          id: '103',
          name: 'Ava',
          age: 27,
          bio: 'Artist, traveler, and foodie.',
          photos: ['https://randomuser.me/api/portraits/women/8.jpg'],
          likedAt: '3 days ago',
        },
      ];
      
      setLikes(mockLikes);
    } catch (error) {
      console.error('Error loading likes:', error);
      Alert.alert('Error', 'Failed to load likes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeBack = async (profile) => {
    try {
      // For MVP, we'll just mock the match creation
      // await swipeAPI.swipe(profile.id, 'like');
      
      // Show match alert
      Alert.alert('It\'s a Match!', `You and ${profile.name} liked each other!`, [
        { text: 'Message', onPress: () => navigation.navigate('Chat', { matchId: profile.id, matchName: profile.name }) },
        { text: 'Continue', onPress: () => {
          // Remove the liked profile from the list
          setLikes(likes.filter(like => like.id !== profile.id));
        }}
      ]);
    } catch (error) {
      console.error('Error liking profile:', error);
      Alert.alert('Error', 'Could not like this profile. Please try again.');
    }
  };

  const renderLikeItem = ({ item }) => {
    return (
      <View style={styles.likeItem}>
        <Image source={{ uri: item.photos[0] }} style={styles.likeImage} />
        
        <View style={styles.likeContent}>
          <View style={styles.likeHeader}>
            <Text style={styles.likeName}>{item.name}, {item.age}</Text>
            <Text style={styles.likeTime}>{item.likedAt}</Text>
          </View>
          
          <Text style={styles.likeBio} numberOfLines={2}>{item.bio}</Text>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dismissButton]}
              onPress={() => setLikes(likes.filter(like => like.id !== item.id))}
            >
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeBackButton]}
              onPress={() => handleLikeBack(item)}
            >
              <Text style={styles.likeBackButtonText}>Like Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No likes yet</Text>
        <Text style={styles.emptyText}>
          When someone likes your profile, they will appear here.
        </Text>
        <Text style={styles.emptyText}>
          Keep swiping to increase your chances of getting matches!
        </Text>
        <TouchableOpacity 
          style={styles.discoverButton}
          onPress={() => navigation.navigate('Discover')}
        >
          <Text style={styles.discoverButtonText}>Discover Profiles</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Who Liked You</Text>
        <Text style={styles.headerSubtitle}>
          Like them back to create a match and start chatting
        </Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading likes...</Text>
        </View>
      ) : (
        <FlatList
          data={likes}
          renderItem={renderLikeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.tiny,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  loadingText: {
    marginTop: SPACING.medium,
    fontSize: TYPOGRAPHY.fontSize.regular,
    color: COLORS.textSecondary,
  },
  listContent: {
    flexGrow: 1,
    padding: SPACING.medium,
  },
  likeItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SPACING.medium,
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
  likeImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
  },
  likeContent: {
    flex: 1,
    padding: SPACING.medium,
  },
  likeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  likeName: {
    fontSize: TYPOGRAPHY.fontSize.medium,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  likeTime: {
    fontSize: TYPOGRAPHY.fontSize.tiny,
    color: COLORS.textTertiary,
  },
  likeBio: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.medium,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: SPACING.small,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: SPACING.tiny,
  },
  dismissButton: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  likeBackButton: {
    backgroundColor: COLORS.primary,
  },
  dismissButtonText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.small,
    fontWeight: '600',
  },
  likeBackButtonText: {
    color: COLORS.textLight,
    fontSize: TYPOGRAPHY.fontSize.small,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.large,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.large,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.medium,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  discoverButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: 8,
    marginTop: SPACING.medium,
  },
  discoverButtonText: {
    color: COLORS.textLight,
    fontSize: TYPOGRAPHY.fontSize.medium,
    fontWeight: '600',
  },
});

export default LikesScreen; 