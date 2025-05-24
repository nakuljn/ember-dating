import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.error = null;
    },
    fetchProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.error = null;
      
      // Save profile to AsyncStorage
      AsyncStorage.setItem('userProfile', JSON.stringify(action.payload));
    },
    updateProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetProfile: (state) => {
      state.profile = null;
      
      // Remove profile from AsyncStorage
      AsyncStorage.removeItem('userProfile');
    },
    updateSwipeCount: (state, action) => {
      if (state.profile) {
        state.profile.likes_given += action.payload;
        
        // Update profile in AsyncStorage
        AsyncStorage.setItem('userProfile', JSON.stringify(state.profile));
      }
    }
  },
});

export const { 
  fetchProfileStart, 
  fetchProfileSuccess, 
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  resetProfile,
  updateSwipeCount
} = profileSlice.actions;

export default profileSlice.reducer; 