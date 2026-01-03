/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Manages user authentication, token storage, and auth status.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
  signup as signupAPI,
  login as loginAPI,
  getCurrentUser,
  setToken,
  removeToken,
  setAuthHeader,
  getToken,
} from '../services/authService.js';

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * Wraps the application and provides authentication context.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth state on mount
   * Checks if token exists and validates it
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        setAuthHeader(token);
        try {
          const response = await getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
          } else {
            // Invalid token, clear it
            removeToken();
            setAuthHeader(null);
          }
        } catch (err) {
          // Token invalid or expired
          removeToken();
          setAuthHeader(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Sign up a new user
   */
  const signup = async (email, password) => {
    try {
      setError(null);
      const response = await signupAPI(email, password);
      
      if (response.success) {
        const { user, token } = response.data;
        setToken(token);
        setAuthHeader(token);
        setUser(user);
        return { success: true };
      } else {
        setError(response.error?.message || 'Signup failed');
        return { success: false, error: response.error?.message || 'Signup failed' };
      }
    } catch (err) {
      console.error('AuthContext: Signup exception:', err);
      // Extract error message from axios error response
      let errorMessage = 'Signup failed. Please check your connection and try again.';
      
      // Check for network errors
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection.';
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      console.error('AuthContext: Setting error message:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage, details: err.error?.details || err.response?.data?.error?.details };
    }
  };

  /**
   * Log in a user
   */
  const login = async (email, password) => {
    try {
      setError(null);
      console.log('AuthContext: Attempting login for:', email);
      const response = await loginAPI(email, password);
      
      console.log('AuthContext: Login API response:', response);
      
      if (response && response.success) {
        const { user, token } = response.data;
        if (token) {
          setToken(token);
          setAuthHeader(token);
        }
        if (user) {
          setUser(user);
        }
        return { success: true };
      } else {
        const errorMsg = response?.error?.message || 'Login failed';
        console.error('AuthContext: Login failed -', errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('AuthContext: Login exception:', err);
      // Extract error message from axios error response
      let errorMessage = 'Login failed. Please check your connection and try again.';
      
      // Check for network errors
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection.';
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      console.error('AuthContext: Setting error message:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    removeToken();
    setAuthHeader(null);
    setUser(null);
    setError(null);
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


