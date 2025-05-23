import api from './apiClient';

/**
 * Swipe API service
 */
class SwipeAPI {
  /**
   * Get profiles to discover
   * @returns {Promise} Profiles data and remaining swipes
   */
  async getProfiles() {
    try {
      const response = await api.get('/profiles/discover');
      return response.data;
    } catch (error) {
      console.error('Get profiles error:', error);
      throw error;
    }
  }

  /**
   * Submit a swipe action (like/dislike)
   * @param {string} profileId - ID of the profile being swiped
   * @param {string} action - Action ('like' or 'dislike')
   * @returns {Promise} Response with match (if any) and remaining swipes
   */
  async swipe(profileId, action) {
    try {
      const response = await api.post('/swipe', {
        profile_id: profileId,
        action: action
      });
      return response.data;
    } catch (error) {
      console.error('Swipe error:', error);
      throw error;
    }
  }

  /**
   * Get profiles who have liked the user
   * @returns {Promise} Profiles data
   */
  async getLikes() {
    try {
      const response = await api.get('/likes/received');
      return response.data;
    } catch (error) {
      console.error('Get likes error:', error);
      throw error;
    }
  }

  /**
   * Get user's matches
   * @returns {Promise} Matches data with profile information
   */
  async getMatches() {
    try {
      const response = await api.get('/matches');
      return response.data;
    } catch (error) {
      console.error('Get matches error:', error);
      throw error;
    }
  }
}

export default new SwipeAPI(); 