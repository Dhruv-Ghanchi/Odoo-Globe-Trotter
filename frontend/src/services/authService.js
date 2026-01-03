/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls.
 */

import axios from 'axios';
import API_BASE_URL from '../config/api.js';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get stored token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Store token in localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Set authorization header for axios instance
 */
export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize auth header if token exists
const token = getToken();
if (token) {
  setAuthHeader(token);
}

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with user and token
 */
export const signup = async (email, password) => {
  try {
    const response = await api.post('/auth/signup', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Signup failed' } };
  }
};

/**
 * Log in a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response with user and token
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    console.error('Error response:', error.response);
    console.error('Error response data:', error.response?.data);
    throw error.response?.data || { error: { message: 'Login failed' } };
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to get user' } };
  }
};

/**
 * Log out user (clears token)
 */
export const logout = () => {
  removeToken();
  setAuthHeader(null);
};

/**
 * Get user profile
 * @returns {Promise<Object>} Response with user profile
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to fetch profile' } };
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data (email)
 * @returns {Promise<Object>} Response with updated user
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to update profile' } };
  }
};

/**
 * Delete user account
 * @returns {Promise<Object>} Response
 */
export const deleteAccount = async () => {
  try {
    const response = await api.delete('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to delete account' } };
  }
};

/**
 * Upload an image
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} Response with file URL
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    // We need to pass the headers specifically for this request
    // or rely on the instance. However, keeping Content-Type undefined
    // lets the browser set it with the boundary automatically.
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to upload image' } };
  }
};

/**
 * Change password
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<Object>} Response
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to change password' } };
  }
};

export default api;


