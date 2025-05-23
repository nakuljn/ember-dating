import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

// Import screens as we create them
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileCreateScreen from '../screens/profile/ProfileCreateScreen';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import LikesScreen from '../screens/matches/LikesScreen';
import MatchesScreen from '../screens/matches/MatchesScreen';
import ChatScreen from '../screens/chat/ChatScreen';

// Create stack navigators
const AuthStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const DiscoverStack = createStackNavigator();
const MatchesStack = createStackNavigator();
const ChatStack = createStackNavigator();
const RootStack = createStackNavigator();

// Create tab navigator
const MainTab = createBottomTabNavigator();

// Auth Stack
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Profile Stack
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="CreateProfile" component={ProfileCreateScreen} options={{ title: 'Create Profile' }} />
  </ProfileStack.Navigator>
);

// Discover Stack
const DiscoverStackScreen = () => (
  <DiscoverStack.Navigator>
    <DiscoverStack.Screen name="Discover" component={DiscoverScreen} options={{ title: 'Discover' }} />
  </DiscoverStack.Navigator>
);

// Matches Stack (includes Likes)
const MatchesStackScreen = () => (
  <MatchesStack.Navigator>
    <MatchesStack.Screen name="Matches" component={MatchesScreen} />
    <MatchesStack.Screen name="Likes" component={LikesScreen} />
  </MatchesStack.Navigator>
);

// Chat Stack
const ChatStackScreen = () => (
  <ChatStack.Navigator>
    <ChatStack.Screen 
      name="Chat" 
      component={ChatScreen} 
      options={({ route }) => ({ 
        title: route.params?.matchName || 'Chat'
      })} 
    />
  </ChatStack.Navigator>
);

// Main Tab Navigator (after auth)
const MainTabScreen = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Discover') {
          iconName = focused ? 'flame' : 'flame-outline';
        } else if (route.name === 'Matches') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'Chat') {
          iconName = focused ? 'chatbubble' : 'chatbubble-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textTertiary,
      tabBarStyle: {
        paddingVertical: 5,
      }
    })}
  >
    <MainTab.Screen name="Discover" component={DiscoverStackScreen} />
    <MainTab.Screen name="Matches" component={MatchesStackScreen} />
    <MainTab.Screen name="Chat" component={ChatStackScreen} />
  </MainTab.Navigator>
);

// Main App Navigation
const AppNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const bootstrapAsync = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem('token');
        // We would also check if user has created a profile
        const profile = await AsyncStorage.getItem('userProfile');
        setHasProfile(!!profile);
      } catch (e) {
        console.log('Error restoring token', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    // We could show a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          // No token found, user isn't signed in
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        ) : !hasProfile ? (
          // User is signed in but has no profile
          <RootStack.Screen name="Profile" component={ProfileStackScreen} />
        ) : (
          // User is signed in and has a profile
          <RootStack.Screen name="Main" component={MainTabScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation; 