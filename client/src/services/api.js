/**
 * Centralized API Client for Servify
 * Handles all HTTP requests with automatic authentication and token refresh
 */
class APIClient {
  constructor(baseURL) {
    // Use environment variable or default to relative path for dev proxy
    this.baseURL = baseURL || import.meta.env.VITE_API_URL || '/api/v1';
  }

  /**
   * Core request method with token refresh logic
   */
  async request(endpoint, options = {}) {
    const token = this.getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include', // Include cookies for refresh token
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    // Handle 401 - attempt token refresh (but not for auth endpoints)
    if (response.status === 401 && !endpoint.includes('/auth/')) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
        const retryResponse = await fetch(`${this.baseURL}${endpoint}`, { ...config, headers });
        return retryResponse;
      } else {
        // Refresh failed - redirect to login
        this.handleAuthFailure();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }

  /**
   * HTTP GET method
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * HTTP POST method
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * HTTP PUT method
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * HTTP PATCH method
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * HTTP DELETE method
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken() {
    return localStorage.getItem('servify_token');
  }

  /**
   * Set access token in localStorage
   */
  setAccessToken(token) {
    localStorage.setItem('servify_token', token);
  }

  /**
   * Attempt to refresh the access token using the refresh token cookie
   */
  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include refresh token cookie
      });

      if (response.ok) {
        const data = await response.json();
        this.setAccessToken(data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Handle authentication failure by clearing state and redirecting
   */
  handleAuthFailure() {
    localStorage.removeItem('servify_token');
    localStorage.removeItem('servify_role');
    localStorage.removeItem('servify_email');
    localStorage.removeItem('servify_user_id');
    localStorage.removeItem('servify_full_name');
    window.location.href = '/login';
  }

  /**
   * Handle API response and extract data or throw error
   */
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      
      switch (response.status) {
        case 400:
          throw new Error(error.message || 'Invalid request');
        case 401:
          throw new Error('Unauthorized');
        case 403:
          throw new Error("You don't have permission to perform this action.");
        case 404:
          throw new Error('Resource not found');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(error.message || 'An error occurred');
      }
    }
    
    return response.json();
  }
}

// Export singleton instance
export default new APIClient();
