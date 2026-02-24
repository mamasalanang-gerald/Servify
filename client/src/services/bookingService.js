/**
 * Booking Service
 * Handles booking-related API operations
 */
import api from './api';

export const bookingService = {
  /**
   * Get all bookings (admin only)
   */
  async getAllBookings() {
    const response = await api.get('/bookings');
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  },

  /**
   * Create a new booking
   */
  async createBooking(bookingData) {
    const response = await api.post('/bookings/createBooking', bookingData);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create booking');
    }

    return data;
  },

  /**
   * Get bookings for a specific client
   */
  async getClientBookings(clientId) {
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    
    const response = await api.get(`/bookings/client/${clientId}`);
    
    // Read the response body once
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.message || 'Failed to fetch client bookings';
      throw new Error(errorMessage);
    }
    
    return Array.isArray(data) ? data : [];
  },

  /**
   * Get bookings for a specific provider
   */
  async getProviderBookings(providerId) {
    const response = await api.get(`/bookings/provider/${providerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch provider bookings');
    }
    return await response.json();
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(id, status) {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    if (!response.ok) {
      throw new Error('Failed to update booking status');
    }
    return await response.json();
  },

  /**
   * Delete a booking
   */
  async deleteBooking(id) {
    const response = await api.delete(`/bookings/${id}`);
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
    return await response.json();
  },
};
