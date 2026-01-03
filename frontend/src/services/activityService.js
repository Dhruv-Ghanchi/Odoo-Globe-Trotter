/**
 * Activity Service
 * 
 * Handles all activity-related API calls.
 */

import api from './authService.js';

/**
 * Get all activities for a trip
 * @param {number} tripId - Trip ID
 * @returns {Promise<Object>} Response with activities array
 */
export const getActivities = async (tripId) => {
  try {
    const response = await api.get(`/trips/${tripId}/activities`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to fetch activities' } };
  }
};

/**
 * Create a new activity
 * @param {number} tripId - Trip ID
 * @param {Object} activityData - Activity data (date, time, title, description)
 * @returns {Promise<Object>} Response with created activity
 */
export const createActivity = async (tripId, activityData) => {
  try {
    const response = await api.post(`/trips/${tripId}/activities`, activityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to create activity' } };
  }
};

/**
 * Update an activity
 * @param {number} activityId - Activity ID
 * @param {Object} activityData - Updated activity data
 * @returns {Promise<Object>} Response with updated activity
 */
export const updateActivity = async (activityId, activityData) => {
  try {
    const response = await api.put(`/activities/${activityId}`, activityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to update activity' } };
  }
};

/**
 * Delete an activity
 * @param {number} activityId - Activity ID
 * @returns {Promise<Object>} Response
 */
export const deleteActivity = async (activityId) => {
  try {
    const response = await api.delete(`/activities/${activityId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: { message: 'Failed to delete activity' } };
  }
};


