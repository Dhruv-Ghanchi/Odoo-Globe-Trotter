/**
 * Activity Service
 * 
 * Business logic and database operations for activity management.
 * Handles all PostgreSQL queries related to activities.
 */

import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTripById } from './tripService.js';

/**
 * Verify that a trip exists and belongs to the user
 * @param {number} tripId - Trip ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Trip object if valid
 * @throws {AppError} If trip not found or doesn't belong to user
 */
const verifyTripOwnership = async (tripId, userId) => {
    const trip = await getTripById(tripId);
    if (!trip) {
        throw new AppError('Trip not found', 404);
    }
    if (trip.user_id !== userId) {
        throw new AppError('You do not have permission to access this trip', 403);
    }
    return trip;
};

/**
 * Create a new activity
 * @param {number} tripId - Trip ID
 * @param {number} userId - User ID (for ownership verification)
 * @param {string} date - Activity date (YYYY-MM-DD)
 * @param {string} time - Activity time (HH:MM:SS)
 * @param {string} title - Activity title
 * @param {string|null} description - Activity description (optional)
 * @returns {Promise<Object>} Created activity object
 */
export const createActivity = async (tripId, userId, date, time, title, description = null) => {
    try {
        // Verify trip ownership
        await verifyTripOwnership(tripId, userId);

        // Validate and sanitize inputs
        const trimmedTitle = title?.trim() || '';
        if (!trimmedTitle || trimmedTitle.length === 0) {
            throw new AppError('Title is required', 400);
        }
        if (trimmedTitle.length > 255) {
            throw new AppError('Title must not exceed 255 characters', 400);
        }

        const trimmedDescription = description ? description.trim() : null;
        if (trimmedDescription && trimmedDescription.length > 2000) {
            throw new AppError('Description must not exceed 2000 characters', 400);
        }

        // Validate date
        const activityDate = new Date(date);
        if (isNaN(activityDate.getTime())) {
            throw new AppError('Invalid date', 400);
        }

        // Validate time format (HH:MM:SS or HH:MM)
        if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/.test(time)) {
            throw new AppError('Invalid time format', 400);
        }

        const result = await query(
            `INSERT INTO activities (trip_id, date, time, title, description) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, trip_id, date, time, title, description, created_at, updated_at`,
            [tripId, date, time, trimmedTitle, trimmedDescription]
        );

        if (result.rows.length === 0) {
            throw new AppError('Failed to create activity', 500);
        }

        return result.rows[0];
    } catch (error) {
        // Handle foreign key violation (invalid trip_id)
        if (error.code === '23503') {
            throw new AppError('Invalid trip reference', 400);
        }
        throw error;
    }
};

/**
 * Get all activities for a trip
 * @param {number} tripId - Trip ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<Array>} Array of activity objects
 */
export const getActivitiesByTripId = async (tripId, userId) => {
    try {
        // Verify trip ownership
        await verifyTripOwnership(tripId, userId);

        const result = await query(
            `SELECT id, trip_id, date, time, title, description, created_at, updated_at 
             FROM activities 
             WHERE trip_id = $1 
             ORDER BY date ASC, time ASC`,
            [tripId]
        );

        return result.rows;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Database error while fetching activities', 500);
    }
};

/**
 * Get an activity by ID
 * @param {number} activityId - Activity ID
 * @returns {Promise<Object|null>} Activity object or null if not found
 */
export const getActivityById = async (activityId) => {
    try {
        const result = await query(
            `SELECT id, trip_id, date, time, title, description, created_at, updated_at 
             FROM activities 
             WHERE id = $1`,
            [activityId]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        throw new AppError('Database error while fetching activity', 500);
    }
};

/**
 * Verify that an activity belongs to a trip owned by the user
 * @param {number} activityId - Activity ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Activity object if valid
 * @throws {AppError} If activity not found or doesn't belong to user's trip
 */
export const verifyActivityOwnership = async (activityId, userId) => {
    const activity = await getActivityById(activityId);
    if (!activity) {
        throw new AppError('Activity not found', 404);
    }

    // Verify the trip belongs to the user
    await verifyTripOwnership(activity.trip_id, userId);

    return activity;
};

/**
 * Update an activity
 * @param {number} activityId - Activity ID
 * @param {number} userId - User ID (for ownership verification)
 * @param {Object} updates - Object with fields to update (date, time, title, description)
 * @returns {Promise<Object>} Updated activity object
 */
export const updateActivity = async (activityId, userId, updates) => {
    try {
        // Verify ownership
        await verifyActivityOwnership(activityId, userId);

        // Build dynamic update query
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (updates.date !== undefined) {
            fields.push(`date = $${paramIndex++}`);
            values.push(updates.date);
        }
        if (updates.time !== undefined) {
            fields.push(`time = $${paramIndex++}`);
            values.push(updates.time);
        }
        if (updates.title !== undefined) {
            const trimmedTitle = updates.title?.trim() || '';
            if (trimmedTitle.length === 0) {
                throw new AppError('Title cannot be empty', 400);
            }
            if (trimmedTitle.length > 255) {
                throw new AppError('Title must not exceed 255 characters', 400);
            }
            fields.push(`title = $${paramIndex++}`);
            values.push(trimmedTitle);
        }
        if (updates.description !== undefined) {
            const trimmedDescription = updates.description ? updates.description.trim() : null;
            if (trimmedDescription && trimmedDescription.length > 2000) {
                throw new AppError('Description must not exceed 2000 characters', 400);
            }
            fields.push(`description = $${paramIndex++}`);
            values.push(trimmedDescription);
        }
        if (updates.date !== undefined) {
            const activityDate = new Date(updates.date);
            if (isNaN(activityDate.getTime())) {
                throw new AppError('Invalid date', 400);
            }
        }
        if (updates.time !== undefined) {
            if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/.test(updates.time)) {
                throw new AppError('Invalid time format', 400);
            }
        }

        if (fields.length === 0) {
            throw new AppError('No fields to update', 400);
        }

        // Add updated_at timestamp
        fields.push(`updated_at = NOW()`);
        
        // Add activity ID to values
        values.push(activityId);

        const updateQuery = `
            UPDATE activities 
            SET ${fields.join(', ')} 
            WHERE id = $${paramIndex} 
            RETURNING id, trip_id, date, time, title, description, created_at, updated_at
        `;

        const result = await query(updateQuery, values);

        if (result.rows.length === 0) {
            throw new AppError('Failed to update activity', 500);
        }

        return result.rows[0];
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Database error while updating activity', 500);
    }
};

/**
 * Delete an activity
 * @param {number} activityId - Activity ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteActivity = async (activityId, userId) => {
    try {
        // Verify ownership
        await verifyActivityOwnership(activityId, userId);

        const result = await query(
            `DELETE FROM activities 
             WHERE id = $1 
             RETURNING id`,
            [activityId]
        );

        return result.rows.length > 0;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Database error while deleting activity', 500);
    }
};

