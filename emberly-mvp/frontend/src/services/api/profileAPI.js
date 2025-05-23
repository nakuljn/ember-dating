import api from './apiClient';

/**
 * Profile API service
 */
class ProfileAPI {
  /**
   * Get current user's profile
   * @returns {Promise} Profile data
   */
  async getProfile() {
    try {
      const response = await api.get('/profile');
      return response.data.profile;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/profile', {
        profile: profileData
      });
      return response.data.profile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Upload profile photo
   * @param {Object} photo - Photo object (URI, type, etc.)
   * @returns {Promise} URL of uploaded photo
   */
  async uploadPhoto(photo) {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        type: photo.type || 'image/jpeg',
        name: photo.fileName || 'profile_photo.jpg'
      });

      // Custom config for file upload
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await api.post('/profile/photos', formData, config);
      return response.data.url;
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  }
}

export default new ProfileAPI(); 