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

export default api;


