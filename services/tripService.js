/**
 * Trip Service
 * 
 * Business logic and database operations for trip management.
 * Handles all PostgreSQL queries related to trips.
 */

import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Create a new trip
 * @param {number} userId - User ID (owner of the trip)
 * @param {string} title - Trip title
 * @param {string} destination - Trip destination
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Created trip object
 */
export const createTrip = async (userId, title, destination, startDate, endDate) => {
    try {
        // Validate and sanitize inputs
        const trimmedTitle = title?.trim() || '';
        const trimmedDestination = destination?.trim() || '';

        if (!trimmedTitle || trimmedTitle.length === 0) {
            throw new AppError('Title is required', 400);
        }
        if (!trimmedDestination || trimmedDestination.length === 0) {
            throw new AppError('Destination is required', 400);
        }
        if (trimmedTitle.length > 255) {
            throw new AppError('Title must not exceed 255 characters', 400);
        }
        if (trimmedDestination.length > 255) {
            throw new AppError('Destination must not exceed 255 characters', 400);
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime())) {
            throw new AppError('Invalid start date', 400);
        }
        if (isNaN(end.getTime())) {
            throw new AppError('Invalid end date', 400);
        }
        if (end < start) {
            throw new AppError('End date must be greater than or equal to start date', 400);
        }

        const result = await query(
            `INSERT INTO trips (user_id, title, destination, start_date, end_date) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, user_id, title, destination, start_date, end_date, created_at, updated_at`,
            [userId, trimmedTitle, trimmedDestination, startDate, endDate]
        );

        if (result.rows.length === 0) {
            throw new AppError('Failed to create trip', 500);
        }

        return result.rows[0];
    } catch (error) {
        // Handle check constraint violation (end_date < start_date)
        if (error.code === '23514') {
            throw new AppError('End date must be greater than or equal to start date', 400);
        }
        throw error;
    }
};

/**
 * Get all trips for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of trip objects
 */
export const getTripsByUserId = async (userId) => {
    try {
        const result = await query(
            `SELECT id, user_id, title, destination, start_date, end_date, created_at, updated_at 
             FROM trips 
             WHERE user_id = $1 
             ORDER BY start_date DESC, created_at DESC`,
            [userId]
        );

        return result.rows;
    } catch (error) {
        throw new AppError('Database error while fetching trips', 500);
    }
};

/**
 * Get a trip by ID
 * @param {number} tripId - Trip ID
 * @returns {Promise<Object|null>} Trip object or null if not found
 */
export const getTripById = async (tripId) => {
    try {
        const result = await query(
            `SELECT id, user_id, title, destination, start_date, end_date, created_at, updated_at 
             FROM trips 
             WHERE id = $1`,
            [tripId]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        throw new AppError('Database error while fetching trip', 500);
    }
};

/**
 * Update a trip
 * @param {number} tripId - Trip ID
 * @param {number} userId - User ID (for ownership verification)
 * @param {Object} updates - Object with fields to update (title, destination, start_date, end_date)
 * @returns {Promise<Object>} Updated trip object
 */
export const updateTrip = async (tripId, userId, updates) => {
    try {
        // First verify ownership
        const trip = await getTripById(tripId);
        if (!trip) {
            throw new AppError('Trip not found', 404);
        }
        if (trip.user_id !== userId) {
            throw new AppError('You do not have permission to update this trip', 403);
        }

        // Validate dates if both are being updated
        if (updates.start_date && updates.end_date) {
            if (new Date(updates.end_date) < new Date(updates.start_date)) {
                throw new AppError('End date must be greater than or equal to start date', 400);
            }
        } else if (updates.start_date && trip.end_date) {
            // Only start_date is being updated, check against existing end_date
            if (new Date(trip.end_date) < new Date(updates.start_date)) {
                throw new AppError('End date must be greater than or equal to start date', 400);
            }
        } else if (updates.end_date && trip.start_date) {
            // Only end_date is being updated, check against existing start_date
            if (new Date(updates.end_date) < new Date(trip.start_date)) {
                throw new AppError('End date must be greater than or equal to start date', 400);
            }
        }

        // Build dynamic update query
        const fields = [];
        const values = [];
        let paramIndex = 1;

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
        if (updates.destination !== undefined) {
            const trimmedDestination = updates.destination?.trim() || '';
            if (trimmedDestination.length === 0) {
                throw new AppError('Destination cannot be empty', 400);
            }
            if (trimmedDestination.length > 255) {
                throw new AppError('Destination must not exceed 255 characters', 400);
            }
            fields.push(`destination = $${paramIndex++}`);
            values.push(trimmedDestination);
        }
        if (updates.start_date !== undefined) {
            fields.push(`start_date = $${paramIndex++}`);
            values.push(updates.start_date);
        }
        if (updates.end_date !== undefined) {
            fields.push(`end_date = $${paramIndex++}`);
            values.push(updates.end_date);
        }

        if (fields.length === 0) {
            throw new AppError('No fields to update', 400);
        }

        // Add updated_at timestamp
        fields.push(`updated_at = NOW()`);
        
        // Add trip ID to values
        values.push(tripId);

        const updateQuery = `
            UPDATE trips 
            SET ${fields.join(', ')} 
            WHERE id = $${paramIndex} 
            RETURNING id, user_id, title, destination, start_date, end_date, created_at, updated_at
        `;

        const result = await query(updateQuery, values);

        if (result.rows.length === 0) {
            throw new AppError('Failed to update trip', 500);
        }

        return result.rows[0];
    } catch (error) {
        if (error.code === '23514') {
            throw new AppError('End date must be greater than or equal to start date', 400);
        }
        throw error;
    }
};

/**
 * Delete a trip
 * @param {number} tripId - Trip ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteTrip = async (tripId, userId) => {
    try {
        // First verify ownership
        const trip = await getTripById(tripId);
        if (!trip) {
            throw new AppError('Trip not found', 404);
        }
        if (trip.user_id !== userId) {
            throw new AppError('You do not have permission to delete this trip', 403);
        }

        const result = await query(
            `DELETE FROM trips 
             WHERE id = $1 
             RETURNING id`,
            [tripId]
        );

        return result.rows.length > 0;
    } catch (error) {
        throw new AppError('Database error while deleting trip', 500);
    }
};

