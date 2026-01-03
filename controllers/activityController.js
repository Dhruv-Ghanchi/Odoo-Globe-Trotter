/**
 * Activity Controller
 * 
 * Handles HTTP request/response for activity management endpoints.
 * Coordinates between services and sends appropriate responses.
 */

import {
    createActivity,
    getActivitiesByTripId,
    updateActivity,
    deleteActivity,
} from '../services/activityService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * POST /trips/:id/activities
 * Create a new activity for a trip
 * 
 * Request body: { date, time, title, description? }
 * Response: { success, data: { activity } }
 */
export const createActivityHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const tripId = parseInt(req.params.id);
        const { date, time, title, description } = req.body;

        if (isNaN(tripId)) {
            return next(new AppError('Invalid trip ID', 400));
        }

        const activity = await createActivity(tripId, userId, date, time, title, description);

        res.status(201).json({
            success: true,
            message: 'Activity created successfully',
            data: {
                activity,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /trips/:id/activities
 * Get all activities for a trip
 * 
 * Response: { success, data: { activities } }
 */
export const getActivitiesHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const tripId = parseInt(req.params.id, 10);

        if (isNaN(tripId) || tripId <= 0 || !Number.isInteger(tripId)) {
            return next(new AppError('Invalid trip ID', 400));
        }

        const activities = await getActivitiesByTripId(tripId, userId);

        res.status(200).json({
            success: true,
            message: 'Activities retrieved successfully',
            data: {
                activities,
                count: activities.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /activities/:id
 * Update an activity
 * 
 * Request body: { date?, time?, title?, description? }
 * Response: { success, data: { activity } }
 */
export const updateActivityHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const activityId = parseInt(req.params.id, 10);

        if (isNaN(activityId) || activityId <= 0 || !Number.isInteger(activityId)) {
            return next(new AppError('Invalid activity ID', 400));
        }

        const { date, time, title, description } = req.body;

        // Build updates object (only include provided fields)
        const updates = {};
        if (date !== undefined) updates.date = date;
        if (time !== undefined) updates.time = time;
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;

        if (Object.keys(updates).length === 0) {
            return next(new AppError('No fields provided to update', 400));
        }

        const activity = await updateActivity(activityId, userId, updates);

        res.status(200).json({
            success: true,
            message: 'Activity updated successfully',
            data: {
                activity,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /activities/:id
 * Delete an activity
 * 
 * Response: { success, message }
 */
export const deleteActivityHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const activityId = parseInt(req.params.id, 10);

        if (isNaN(activityId) || activityId <= 0 || !Number.isInteger(activityId)) {
            return next(new AppError('Invalid activity ID', 400));
        }

        await deleteActivity(activityId, userId);

        res.status(200).json({
            success: true,
            message: 'Activity deleted successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

