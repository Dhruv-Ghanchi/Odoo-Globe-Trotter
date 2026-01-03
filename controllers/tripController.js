/**
 * Trip Controller
 * 
 * Handles HTTP request/response for trip management endpoints.
 * Coordinates between services and sends appropriate responses.
 */

import {
    createTrip,
    getTripsByUserId,
    getTripById,
    updateTrip,
    deleteTrip,
} from '../services/tripService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * POST /trips
 * Create a new trip
 * 
 * Request body: { title, destination, start_date, end_date }
 * Response: { success, data: { trip } }
 */
export const createTripHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { title, destination, start_date, end_date } = req.body;

        const trip = await createTrip(userId, title, destination, start_date, end_date);

        res.status(201).json({
            success: true,
            message: 'Trip created successfully',
            data: {
                trip,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /trips
 * Get all trips for the authenticated user
 * 
 * Response: { success, data: { trips } }
 */
export const getTripsHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const trips = await getTripsByUserId(userId);

        res.status(200).json({
            success: true,
            message: 'Trips retrieved successfully',
            data: {
                trips,
                count: trips.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /trips/:id
 * Get a specific trip by ID
 * 
 * Response: { success, data: { trip } }
 */
export const getTripHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const tripId = parseInt(req.params.id, 10);

        if (isNaN(tripId) || tripId <= 0 || !Number.isInteger(parseFloat(req.params.id))) {
            return next(new AppError('Invalid trip ID', 400));
        }

        const trip = await getTripById(tripId);

        if (!trip) {
            return next(new AppError('Trip not found', 404));
        }

        // Verify ownership
        if (trip.user_id !== userId) {
            return next(new AppError('You do not have permission to access this trip', 403));
        }

        res.status(200).json({
            success: true,
            message: 'Trip retrieved successfully',
            data: {
                trip,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /trips/:id
 * Update a trip
 * 
 * Request body: { title?, destination?, start_date?, end_date? }
 * Response: { success, data: { trip } }
 */
export const updateTripHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const tripId = parseInt(req.params.id, 10);

        if (isNaN(tripId) || tripId <= 0 || !Number.isInteger(tripId)) {
            return next(new AppError('Invalid trip ID', 400));
        }

        const { title, destination, start_date, end_date } = req.body;

        // Build updates object (only include provided fields)
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (destination !== undefined) updates.destination = destination;
        if (start_date !== undefined) updates.start_date = start_date;
        if (end_date !== undefined) updates.end_date = end_date;

        if (Object.keys(updates).length === 0) {
            return next(new AppError('No fields provided to update', 400));
        }

        const trip = await updateTrip(tripId, userId, updates);

        res.status(200).json({
            success: true,
            message: 'Trip updated successfully',
            data: {
                trip,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /trips/:id
 * Delete a trip
 * 
 * Response: { success, message }
 */
export const deleteTripHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const tripId = parseInt(req.params.id, 10);

        if (isNaN(tripId) || tripId <= 0 || !Number.isInteger(tripId)) {
            return next(new AppError('Invalid trip ID', 400));
        }

        await deleteTrip(tripId, userId);

        res.status(200).json({
            success: true,
            message: 'Trip deleted successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

