/**
 * Admin Application Service
 * Handles admin-specific provider application operations
 */
import api from './api';

export const adminApplicationService = {
  /**
   * Get all applications with filters
   * @param {Object} params - Query parameters (status, search, page, limit)
   * @returns {Promise<Object>} Applications list with pagination
   */
  async getApplications(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const endpoint = `/admin/applications${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(endpoint);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch applications');
    }
    return await response.json();
  },

  /**
   * Approve a provider application
   * @param {number} applicationId - Application ID
   * @returns {Promise<Object>} Updated application
   */
  async approveApplication(applicationId) {
    const response = await api.patch(`/admin/applications/${applicationId}/approve`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to approve application');
    }
    return await response.json();
  },

  /**
   * Reject a provider application
   * @param {number} applicationId - Application ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Updated application
   */
  async rejectApplication(applicationId, reason) {
    const response = await api.patch(`/admin/applications/${applicationId}/reject`, { reason });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reject application');
    }
    return await response.json();
  },
};
