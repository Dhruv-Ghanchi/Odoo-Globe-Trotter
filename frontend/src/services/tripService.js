/**
 * Trip Service
 * 
 * Handles all trip-related API calls.
 */

import api from './authService.js';

/**
 * Get all trips for the authenticated user
 * @returns {Promise<Object>} Response with trips array
 */
export const getTrips = async () => {
  try {
    const response = await api.get('/trips');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to fetch trips' } };
  }
};

/**
 * Get a specific trip by ID
 * @param {number} tripId - Trip ID
 * @returns {Promise<Object>} Response with trip data
 */
export const getTrip = async (tripId) => {
  try {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to fetch trip' } };
  }
};

/**
 * Create a new trip
 * @param {Object} tripData - Trip data (title, destination, start_date, end_date)
 * @returns {Promise<Object>} Response with created trip
 */
export const createTrip = async (tripData) => {
  try {
    const response = await api.post('/trips', tripData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to create trip' } };
  }
};

/**
 * Update a trip
 * @param {number} tripId - Trip ID
 * @param {Object} tripData - Updated trip data
 * @returns {Promise<Object>} Response with updated trip
 */
export const updateTrip = async (tripId, tripData) => {
  try {
    const response = await api.put(`/trips/${tripId}`, tripData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to update trip' } };
  }
};

/**
 * Delete a trip
 * @param {number} tripId - Trip ID
 * @returns {Promise<Object>} Response
 */
export const deleteTrip = async (tripId) => {
  try {
    const response = await api.delete(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to delete trip' } };
  }
};

/**
 * Get itinerary for a trip (read-only)
 * @param {number} tripId - Trip ID
 * @returns {Promise<Object>} Response with trip and activities
 */
export const getItinerary = async (tripId) => {
  try {
    const response = await api.get(`/trips/${tripId}/itinerary`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to fetch itinerary' } };
  }
};

/**
 * Get budget breakdown for a trip
 * @param {number} tripId - Trip ID
 * @returns {Promise<Object>} Response with budget data
 */
export const getBudget = async (tripId) => {
  try {
    const response = await api.get(`/trips/${tripId}/budget`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to fetch budget' } };
  }
};


