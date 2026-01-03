/**
 * Public Routes
 * 
 * Unauthenticated routes for public/shared content.
 * These endpoints do not require JWT authentication.
 */

import express from 'express';
import { param } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { getPublicItineraryHandler } from '../controllers/publicController.js';

const router = express.Router();

/**
 * Validation for trip ID parameter
 */
const tripIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Trip ID must be a positive integer'),
];

/**
 * GET /public/trips/:id/itinerary
 * Get public itinerary for a trip (read-only, no authentication required)
 * 
 * This endpoint allows sharing trip itineraries without requiring authentication.
 * Returns only safe, non-sensitive data.
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Public itinerary retrieved successfully",
 *   "data": {
 *     "trip": {
 *       "id": 1,
 *       "title": "Summer Vacation",
 *       "destination": "Paris, France",
 *       "start_date": "2024-06-01",
 *       "end_date": "2024-06-15"
 *     },
 *     "activities": [
 *       {
 *         "id": 1,
 *         "date": "2024-06-01",
 *         "time": "09:00:00",
 *         "title": "Breakfast",
 *         "description": "Hotel breakfast"
 *       }
 *     ]
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Invalid trip ID
 * - 404: Trip not found
 * - 500: Server error
 */
router.get(
    '/trips/:id/itinerary',
    tripIdValidation,
    validate,
    getPublicItineraryHandler
);

export default router;

