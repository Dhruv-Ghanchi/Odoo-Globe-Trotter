/**
 * Public Controller
 * 
 * Handles public (unauthenticated) endpoints.
 * Returns only safe, non-sensitive data.
 */

import { getTripById } from '../services/tripService.js';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /public/trips/:id/itinerary
 * Get public itinerary for a trip (read-only, no authentication)
 * 
 * Response: { success, data: { trip, activities } }
 * Only returns safe data (no user IDs, emails, or internal metadata)
 */
export const getPublicItineraryHandler = async (req, res, next) => {
    try {
        const tripId = parseInt(req.params.id, 10);
        
        if (isNaN(tripId) || tripId <= 0 || !Number.isInteger(tripId)) {
            return next(new AppError('Invalid trip ID', 400));
        }

        // Get trip to verify existence (no ownership check for public endpoint)
        const trip = await getTripById(tripId);
        if (!trip) {
            return next(new AppError('Trip not found', 404));
        }

        // Get activities ordered by date and time
        // Direct query (no ownership check for public endpoint)
        const activitiesResult = await query(
            `SELECT id, trip_id, date, time, title, description, created_at, updated_at 
             FROM activities 
             WHERE trip_id = $1 
             ORDER BY date ASC, time ASC`,
            [tripId]
        );

        // Return only safe, public data
        res.status(200).json({
            success: true,
            message: 'Public itinerary retrieved successfully',
            data: {
                trip: {
                    id: trip.id,
                    title: trip.title,
                    destination: trip.destination, // This is the "city"
                    start_date: trip.start_date,
                    end_date: trip.end_date,
                    // Explicitly exclude: user_id, created_at, updated_at
                },
                activities: activitiesResult.rows.map(activity => ({
                    id: activity.id,
                    date: activity.date,
                    time: activity.time,
                    title: activity.title,
                    description: activity.description,
                    // Explicitly exclude: trip_id, created_at, updated_at
                })),
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Error retrieving public itinerary', 500));
        }
    }
};

