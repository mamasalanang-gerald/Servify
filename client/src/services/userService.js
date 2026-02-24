/**
 * User Service
 * Handles user-related API operations
 */
import api from './api';

export const userService = {
  /**
   * Get current user (minimal auth info)
   */
  async getCurrentUser() {
    const response = await api.get('/users/me');
    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }
    return await response.json();
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await api.get('/users/profile');
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return await response.json();
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    return await response.json();
  },

  /**
   * Promote user to provider role
   */
  async promoteToProvider() {
    const response = await api.patch('/users/promote');
    if (!response.ok) {
      throw new Error('Failed to promote user');
    }
    return await response.json();
  },
};
