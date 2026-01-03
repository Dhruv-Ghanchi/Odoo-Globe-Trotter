/**
 * Budget Service
 * 
 * Business logic for trip budget calculations.
 * Uses SQL aggregation to compute totals without storing calculated values.
 */

import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { getTripById } from './tripService.js';

/**
 * Get budget breakdown for a trip
 * @param {number} tripId - Trip ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<Object>} Budget breakdown with totals and daily breakdown
 */
export const getTripBudget = async (tripId, userId) => {
    try {
        // Verify trip ownership
        const trip = await getTripById(tripId);
        if (!trip) {
            throw new AppError('Trip not found', 404);
        }
        if (trip.user_id !== userId) {
            throw new AppError('You do not have permission to access this trip', 403);
        }

        // Calculate total trip cost using SUM
        const totalResult = await query(
            `SELECT COALESCE(SUM(cost), 0) as total_cost,
                    COUNT(*) as activity_count
             FROM activities 
             WHERE trip_id = $1`,
            [tripId]
        );

        const totalCost = parseFloat(totalResult.rows[0].total_cost) || 0;
        const activityCount = parseInt(totalResult.rows[0].activity_count, 10) || 0;

        // Calculate cost grouped by date (daily breakdown)
        const dailyBreakdownResult = await query(
            `SELECT date,
                    COALESCE(SUM(cost), 0) as daily_cost,
                    COUNT(*) as activity_count
             FROM activities 
             WHERE trip_id = $1
             GROUP BY date
             ORDER BY date ASC`,
            [tripId]
        );

        const dailyBreakdown = dailyBreakdownResult.rows.map(row => ({
            date: row.date,
            cost: parseFloat(row.daily_cost) || 0,
            activity_count: parseInt(row.activity_count, 10) || 0,
        }));

        // Calculate average cost per day
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);
        const daysDiff = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
        const averageCostPerDay = totalCost / daysDiff;

        // Calculate average cost per day with activities (only days that have activities)
        const daysWithActivities = dailyBreakdown.length;
        const averageCostPerActiveDay = daysWithActivities > 0 ? totalCost / daysWithActivities : 0;

        return {
            trip: {
                id: trip.id,
                title: trip.title,
                destination: trip.destination,
                start_date: trip.start_date,
                end_date: trip.end_date,
                total_days: daysDiff,
            },
            summary: {
                total_cost: totalCost,
                activity_count: activityCount,
                average_cost_per_day: parseFloat(averageCostPerDay.toFixed(2)),
                average_cost_per_active_day: parseFloat(averageCostPerActiveDay.toFixed(2)),
                days_with_activities: daysWithActivities,
            },
            daily_breakdown: dailyBreakdown,
        };
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        console.error('Budget calculation error:', error);
        throw new AppError('Database error while calculating budget', 500);
    }
};

