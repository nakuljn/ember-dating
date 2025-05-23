import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../utils/theme';
import { likesAPI } from '../../services/api';

const MatchesScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    try {
      // For MVP, we'll use mock data instead of API call
      // const response = await likesAPI.getMatches();
      // setMatches(response.data.matches);
      
      // Mock matches
      const mockMatches = [
        {
          id: '1',
          user: {
            id: '101',
            name: 'Emma',
            age: 26,
            photos: ['https://randomuser.me/api/portraits/women/3.jpg'],
          },
          last_message: 'Hey, how are you?',
          last_message_time: '10:30 AM',
          unread_count: 2,
        },
        {
          id: '2',
          user: {
            id: '102',
            name: 'James',
            age: 30,
            photos: ['https://randomuser.me/api/portraits/men/2.jpg'],
          },
          last_message: 'Would you like to meet for coffee?',
          last_message_time: 'Yesterday',
          unread_count: 0,
        },
        {
          id: '3',
          user: {
            id: '103',
            name: 'Olivia',
            age: 27,
            photos: ['https://randomuser.me/api/portraits/women/10.jpg'],
          },
          last_message: null, // No messages yet
          last_message_time: null,
          unread_count: 0,
        },
      ];
      
      setMatches(mockMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
      Alert.alert('Error', 'Failed to load matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchPress = (match) => {
    // Navigate to chat screen with match id
    navigation.navigate('Chat', { matchId: match.id, matchName: match.user.name });
  };

  const renderMatchItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.matchItem}
        onPress={() => handleMatchPress(item)}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: item.user.photos[0] }}
            style={styles.avatar}
          />
          {item.unread_count > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{item.user.name}, {item.user.age}</Text>
            {item.last_message_time && (
              <Text style={styles.matchTime}>{item.last_message_time}</Text>
            )}
          </View>
          
          <Text style={styles.matchMessage} numberOfLines={1}>
            {item.last_message || 'Say hello!'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No matches yet</Text>
        <Text style={styles.emptyText}>
          When you match with someone, they will appear here.
        </Text>
        <Text style={styles.emptyText}>
          Start swiping to find new matches!
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

  const renderLikesButton = () => {
    return (
      <TouchableOpacity 
        style={styles.likesButton}
        onPress={() => navigation.navigate('Likes')}
      >
        <Text style={styles.likesButtonText}>View Likes</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      ) : (
        <>
          {renderLikesButton()}
          <FlatList
            data={matches}
            renderItem={renderMatchItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  likesButton: {
    backgroundColor: COLORS.cardBackground,
    margin: SPACING.medium,
    padding: SPACING.medium,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  likesButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.medium,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    padding: SPACING.medium,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.medium,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: COLORS.textLight,
    fontSize: TYPOGRAPHY.fontSize.tiny,
    fontWeight: 'bold',
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.tiny,
  },
  matchName: {
    fontSize: TYPOGRAPHY.fontSize.medium,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  matchTime: {
    fontSize: TYPOGRAPHY.fontSize.tiny,
    color: COLORS.textTertiary,
  },
  matchMessage: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.textSecondary,
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

export default MatchesScreen; 