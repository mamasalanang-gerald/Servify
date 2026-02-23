/**
 * Service Service
 * Handles service-related API operations
 */
import api from './api';

export const serviceService = {
  /**
   * Get all services with optional filters
   * @param {Object} params - Query parameters (category, location, price_min, price_max, search, page, limit)
   */
  async getServices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/services?${queryString}` : '/services';
    const response = await api.get(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return await response.json();
  },

  /**
   * Get service by ID
   */
  async getServiceById(id) {
    const response = await api.get(`/services/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    return await response.json();
  },

  /**
   * Create a new service (provider only)
   */
  async createService(serviceData) {
    const response = await api.post('/services/create', serviceData);
    if (!response.ok) {
      throw new Error('Failed to create service');
    }
    return await response.json();
  },

  /**
   * Update an existing service (provider only)
   */
  async updateService(id, serviceData) {
    const response = await api.put(`/services/edit/${id}`, serviceData);
    if (!response.ok) {
      throw new Error('Failed to update service');
    }
    return await response.json();
  },

  /**
   * Delete a service (provider only)
   */
  async deleteService(id) {
    const response = await api.delete(`/services/${id}`);
    if (!response.ok) {
      throw new Error('Failed to delete service');
    }
    return await response.json();
  },
};
