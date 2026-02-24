/**
 * Authentication Service
 * Handles user authentication operations
 */
import api from './api';

export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    const response = await api.post('/auth/register', {
      full_name: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone || null,
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // If response is not JSON (e.g., HTML error page), use default message
        errorMessage = `Registration failed (${response.status})`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  },

  /**
   * Login user with credentials
   */
  async login(credentials) {
    console.log('authService.login called with:', credentials.email);
    const response = await api.post('/auth/login', credentials);
    console.log('Login response status:', response.status, response.ok);

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // If response is not JSON (e.g., HTML error page), use default message
        errorMessage = `Login failed (${response.status})`;
      }
      console.error('Login failed:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Login successful, data:', data);
    
    // Store auth data in localStorage (ID is a UUID string)
    api.setAccessToken(data.accessToken);
    localStorage.setItem('servify_role', data.user.user_type);
    localStorage.setItem('servify_email', data.user.email);
    localStorage.setItem('servify_user_id', data.user.id); // Store UUID as string
    localStorage.setItem('servify_full_name', data.user.full_name);
    
    // Fetch full profile to get profile_image
    try {
      const profileRes = await api.get('/users/profile');
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile.profile_image) {
          localStorage.setItem('servify_profile_image', profile.profile_image);
        }
      }
    } catch (e) {
      // Non-critical, continue
    }
    
    console.log('Stored in localStorage:', {
      role: data.user.user_type,
      email: data.user.email,
      id: data.user.id
    });
    
    return data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call backend logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('servify_token');
      localStorage.removeItem('servify_role');
      localStorage.removeItem('servify_email');
      localStorage.removeItem('servify_user_id');
      localStorage.removeItem('servify_full_name');
      localStorage.removeItem('servify_profile_image');
    }
  },

  /**
   * Get current user from localStorage
   */
  getUser() {
    const role = localStorage.getItem('servify_role');
    const email = localStorage.getItem('servify_email');
    const id = localStorage.getItem('servify_user_id');
    const full_name = localStorage.getItem('servify_full_name');
    const profile_image = localStorage.getItem('servify_profile_image');
    
    if (!role) return null;
    
    return { 
      role, 
      email, 
      id: id || null, // ID is a UUID string, not an integer
      full_name,
      profile_image: profile_image || null,
    };
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('servify_token') && !!localStorage.getItem('servify_role');
  },
};
