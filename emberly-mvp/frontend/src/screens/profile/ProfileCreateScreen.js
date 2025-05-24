import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Platform as RNPlatform
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../utils/theme';
import { profileAPI, authAPI } from '../../services/api';
import authService from '../../services/auth/authService';

const ProfileCreateScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    gender: '',
    interested_in: [],
    bio: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user data on component load
  useEffect(() => {
    loadUserData();
  }, []);
  
  // Load user data from auth service
  const loadUserData = async () => {
    try {
      const user = await authService.getUserData();
      if (user) {
        setUserData(user);
        // Pre-fill name if available
        if (user.displayName) {
          setFormData(prev => ({ ...prev, name: user.displayName }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleCreateProfile = async () => {
    const { name, birthdate, gender, interested_in, bio } = formData;
    
    if (!name || !birthdate || !gender || !interested_in || interested_in.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      // Get Firebase token for backend authentication
      const firebaseToken = await authService.getToken();
      
      if (!firebaseToken) {
        throw new Error('Authentication token not found');
      }
      
      // Prepare profile data in the format expected by the backend
      const profileData = {
        name,
        birthdate,
        gender,
        interested_in: Array.isArray(interested_in) ? interested_in : [interested_in],
        bio,
        photos: [],
        location: { 
          type: "Point", 
          coordinates: [0, 0]  // Default coordinates, would be replaced with actual location
        }
      };
      
      // Register the user with our backend
      const response = await authAPI.register(firebaseToken, profileData);
      
      // Navigate to main app
      navigation.navigate('Main');
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine if a specific gender option is selected
  const isInterestSelected = (interest) => {
    if (Array.isArray(formData.interested_in)) {
      return formData.interested_in.includes(interest);
    }
    return formData.interested_in === interest;
  };

  // Toggle interest selection (allows multiple interests)
  const toggleInterest = (interest) => {
    let newInterests = Array.isArray(formData.interested_in) 
      ? [...formData.interested_in] 
      : formData.interested_in ? [formData.interested_in] : [];
    
    if (newInterests.includes(interest)) {
      newInterests = newInterests.filter(i => i !== interest);
    } else {
      newInterests.push(interest);
    }
    
    handleChange('interested_in', newInterests);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>
      </View>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth (MM/DD/YYYY)</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            value={formData.birthdate}
            onChangeText={(text) => handleChange('birthdate', text)}
            keyboardType="numbers-and-punctuation"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                formData.gender === 'male' && styles.selectedOption
              ]}
              onPress={() => handleChange('gender', 'male')}
            >
              <Text 
                style={[
                  styles.optionText, 
                  formData.gender === 'male' && styles.selectedOptionText
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                formData.gender === 'female' && styles.selectedOption
              ]}
              onPress={() => handleChange('gender', 'female')}
            >
              <Text 
                style={[
                  styles.optionText, 
                  formData.gender === 'female' && styles.selectedOptionText
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                formData.gender === 'other' && styles.selectedOption
              ]}
              onPress={() => handleChange('gender', 'other')}
            >
              <Text 
                style={[
                  styles.optionText, 
                  formData.gender === 'other' && styles.selectedOptionText
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Interested In (select one or more)</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                isInterestSelected('male') && styles.selectedOption
              ]}
              onPress={() => toggleInterest('male')}
            >
              <Text 
                style={[
                  styles.optionText, 
                  isInterestSelected('male') && styles.selectedOptionText
                ]}
              >
                Men
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                isInterestSelected('female') && styles.selectedOption
              ]}
              onPress={() => toggleInterest('female')}
            >
              <Text 
                style={[
                  styles.optionText, 
                  isInterestSelected('female') && styles.selectedOptionText
                ]}
              >
                Women
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                isInterestSelected('other') && styles.selectedOption
              ]}
              onPress={() => toggleInterest('other')}
            >
              <Text 
                style={[
                  styles.optionText, 
                  isInterestSelected('other') && styles.selectedOptionText
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Write a short bio about yourself"
            value={formData.bio}
            onChangeText={(text) => handleChange('bio', text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateProfile}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Profile...' : 'Create Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.large,
  },
  header: {
    marginTop: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xlarge,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.medium,
    color: COLORS.textSecondary,
  },
  form: {
    marginTop: SPACING.small,
  },
  inputContainer: {
    marginBottom: SPACING.medium,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.tiny,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: SPACING.medium,
    fontSize: TYPOGRAPHY.fontSize.regular,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.medium,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: SPACING.medium,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.textPrimary,
  },
  selectedOptionText: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.medium,
    alignItems: 'center',
    marginTop: SPACING.large,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: TYPOGRAPHY.fontSize.medium,
    fontWeight: '600',
  },
});

export default ProfileCreateScreen; 