/**
 * Public Service
 * 
 * Handles public API calls that don't require authentication.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get public itinerary for a trip (no authentication required)
 * @param {number} tripId - Trip ID
 * @returns {Promise<Object>} Response with public itinerary data
 */
export const getPublicItinerary = async (tripId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public/trips/${tripId}/itinerary`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to fetch public itinerary' } };
  }
};

