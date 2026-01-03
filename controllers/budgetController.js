/**
 * Budget Controller
 * 
 * Handles HTTP request/response for budget endpoints.
 */

import { getTripBudget } from '../services/budgetService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /trips/:id/budget
 * Get budget breakdown for a specific trip
 * 
 * Response: { success, data: { trip, summary, daily_breakdown } }
 */
export const getBudgetHandler = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const tripId = parseInt(req.params.id, 10);
        
        if (isNaN(tripId) || tripId <= 0 || !Number.isInteger(tripId)) {
            return next(new AppError('Invalid trip ID', 400));
        }

        const budget = await getTripBudget(tripId, userId);

        res.status(200).json({
            success: true,
            message: 'Budget retrieved successfully',
            data: budget,
        });
    } catch (error) {
        next(error);
    }
};

