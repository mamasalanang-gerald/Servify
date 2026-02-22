const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const getToken = () => {
  return localStorage.getItem('servify_token');
};

const handleError = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('servify_token');
    localStorage.removeItem('servify_role');
    localStorage.removeItem('servify_email');
    window.location.href = '/login';
    throw new Error('Unauthorized. Please login again.');
  }
  if (response.status === 403) {
    throw new Error('You do not have permission to perform this action.');
  }
  if (response.status === 404) {
    throw new Error('Resource not found.');
  }
  if (response.status >= 500) {
    throw new Error('Server error. Please try again later.');
  }
  
  try {
    const data = await response.json();
    throw new Error(data.message || 'An error occurred');
  } catch (e) {
    throw new Error('An error occurred');
  }
};

export const adminService = {
  // Dashboard
  getDashboardMetrics: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  // Users
  getUsers: async (params = {}) => {
    const { page = 1, limit = 10, role = null } = params;
    let url = `${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  activateUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/activate`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  deactivateUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/deactivate`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  verifyProvider: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/verify`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  // Services
  getServices: async (params = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await fetch(`${API_BASE_URL}/admin/services?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  getServiceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  toggleServiceStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  // Bookings
  getBookings: async (params = {}) => {
    const { page = 1, limit = 10, status = null } = params;
    let url = `${API_BASE_URL}/admin/bookings?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  getBookingById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  // Reviews
  getReviews: async (params = {}) => {
    const { page = 1, limit = 10, rating = null } = params;
    let url = `${API_BASE_URL}/admin/reviews?page=${page}&limit=${limit}`;
    if (rating) url += `&rating=${rating}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  getReviewById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  deleteReview: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  createCategory: async (data) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  updateCategory: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) await handleError(response);
    return response.json();
  },
};

export default adminService;
