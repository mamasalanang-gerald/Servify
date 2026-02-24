/**
 * Application Service
 * Handles provider application-related API operations
 */
import api from './api';

export const applicationService = {
  /**
   * Submit a provider application
   * @param {Object} applicationData - Application form data
   * @returns {Promise<Object>} Created application
   */
  async submitApplication(applicationData) {
    const response = await api.post('/applications', applicationData);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit application');
    }
    return await response.json();
  },

  /**
   * Get the current user's application status
   * @returns {Promise<Object>} Application status
   */
  async getMyApplicationStatus() {
    const response = await api.get('/applications/my-status');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch application status');
    }
    return await response.json();
  },
};
