/**
 * Admin Service
 * Handles admin-related API operations
 */
import api from './api';

export const adminService = {
  // Dashboard
  getDashboardMetrics: async () => {
    const response = await api.get('/admin/dashboard');
    if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
    return response.json();
  },

  // Users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    const response = await api.get(endpoint);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  activateUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/activate`);
    if (!response.ok) throw new Error('Failed to activate user');
    return response.json();
  },

  deactivateUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/deactivate`);
    if (!response.ok) throw new Error('Failed to deactivate user');
    return response.json();
  },

  verifyProvider: async (id) => {
    const response = await api.patch(`/admin/users/${id}/verify`);
    if (!response.ok) throw new Error('Failed to verify provider');
    return response.json();
  },

  // Services
  getServices: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/admin/services?${queryString}` : '/admin/services';
    const response = await api.get(endpoint);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  },

  getServiceById: async (id) => {
    const response = await api.get(`/admin/services/${id}`);
    if (!response.ok) throw new Error('Failed to fetch service');
    return response.json();
  },

  toggleServiceStatus: async (id) => {
    const response = await api.patch(`/admin/services/${id}/toggle`);
    if (!response.ok) throw new Error('Failed to toggle service status');
    return response.json();
  },

  getPendingServices: async () => {
    const response = await api.get('/admin/services/pending');
    if (!response.ok) throw new Error('Failed to fetch pending services');
    return response.json();
  },

  approveService: async (serviceId) => {
    const response = await api.patch(`/admin/services/${serviceId}/approve`);
    if (!response.ok) throw new Error('Failed to approve service');
    return response.json();
  },

  rejectService: async (serviceId, reason) => {
    const response = await api.patch(`/admin/services/${serviceId}/reject`, { reason });
    if (!response.ok) throw new Error('Failed to reject service');
    return response.json();
  },

  // Bookings
  getBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/admin/bookings?${queryString}` : '/admin/bookings';
    const response = await api.get(endpoint);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },

  getBookingById: async (id) => {
    const response = await api.get(`/admin/bookings/${id}`);
    if (!response.ok) throw new Error('Failed to fetch booking');
    return response.json();
  },

  // Reviews
  getReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/admin/reviews?${queryString}` : '/admin/reviews';
    const response = await api.get(endpoint);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  getReviewById: async (id) => {
    const response = await api.get(`/admin/reviews/${id}`);
    if (!response.ok) throw new Error('Failed to fetch review');
    return response.json();
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/admin/reviews/${id}`);
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
  },

  moderateReview: async (reviewId, action) => {
    const response = await api.patch(`/admin/reviews/${reviewId}/moderate`, { action });
    if (!response.ok) throw new Error('Failed to moderate review');
    return response.json();
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  createCategory: async (data) => {
    const response = await api.post('/admin/categories', data);
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
  },

  // Stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return response.json();
  },
};

export default adminService;
