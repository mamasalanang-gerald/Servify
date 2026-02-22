/**
 * Category Service
 * Handles category-related API operations
 */
import api from './api';

export const categoryService = {
  /**
   * Get all categories
   */
  async getAllCategories() {
    const response = await api.get('/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    return await response.json();
  },

  /**
   * Create a new category (admin only)
   */
  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return await response.json();
  },

  /**
   * Update an existing category (admin only)
   */
  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    return await response.json();
  },

  /**
   * Delete a category (admin only)
   */
  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
    return await response.json();
  },
};
