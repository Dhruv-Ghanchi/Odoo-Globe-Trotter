/**
 * Trip Routes
 * 
 * Defines trip management endpoints with validation rules.
 * All routes are protected by JWT authentication.
 * 
 * Endpoints:
 * - POST   /trips - Create new trip
 * - GET    /trips - Get all user's trips
 * - GET    /trips/:id - Get specific trip
 * - PUT    /trips/:id - Update trip
 * - DELETE /trips/:id - Delete trip
 */

import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import {
    createTripHandler,
    getTripsHandler,
    getTripHandler,
    updateTripHandler,
    deleteTripHandler,
    getItineraryHandler,
} from '../controllers/tripController.js';
import { getBudgetHandler } from '../controllers/budgetController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * Validation rules for trip creation/update
 */
const tripValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters'),
    
    body('destination')
        .trim()
        .notEmpty()
        .withMessage('Destination is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Destination must be between 1 and 255 characters'),
    
    body('start_date')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Start date must be a valid date (YYYY-MM-DD)')
        .toDate(),
    
    body('end_date')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('End date must be a valid date (YYYY-MM-DD)')
        .toDate()
        .custom((endDate, { req }) => {
            if (req.body.start_date && new Date(endDate) < new Date(req.body.start_date)) {
                throw new Error('End date must be greater than or equal to start date');
            }
            return true;
        }),
];

/**
 * Validation rules for trip update (all fields optional)
 */
const tripUpdateValidation = [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters'),
    
    body('destination')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Destination cannot be empty')
        .isLength({ min: 1, max: 255 })
        .withMessage('Destination must be between 1 and 255 characters'),
    
    body('start_date')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date (YYYY-MM-DD)')
        .toDate(),
    
    body('end_date')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date (YYYY-MM-DD)')
        .toDate()
        .custom((endDate, { req }) => {
            // If both dates are provided in the update, validate the relationship
            if (req.body.start_date && req.body.end_date) {
                if (new Date(endDate) < new Date(req.body.start_date)) {
                    throw new Error('End date must be greater than or equal to start date');
                }
            }
            return true;
        }),
];

/**
 * Validation for trip ID parameter
 */
const tripIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Trip ID must be a positive integer'),
];

/**
 * POST /trips
 * Create a new trip
 * 
 * Request Body:
 * {
 *   "title": "Summer Vacation",
 *   "destination": "Paris, France",
 *   "start_date": "2024-06-01",
 *   "end_date": "2024-06-15"
 * }
 * 
 * Success Response (201):
 * {
 *   "success": true,
 *   "message": "Trip created successfully",
 *   "data": {
 *     "trip": {
 *       "id": 1,
 *       "user_id": 1,
 *       "title": "Summer Vacation",
 *       "destination": "Paris, France",
 *       "start_date": "2024-06-01",
 *       "end_date": "2024-06-15",
 *       "created_at": "2024-01-15T10:30:00.000Z",
 *       "updated_at": "2024-01-15T10:30:00.000Z"
 *     }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error or invalid dates
 * - 401: Not authenticated
 */
router.post(
    '/',
    tripValidation,
    validate,
    createTripHandler
);

/**
 * GET /trips
 * Get all trips for the authenticated user
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "trips": [
 *       {
 *         "id": 1,
 *         "user_id": 1,
 *         "title": "Summer Vacation",
 *         "destination": "Paris, France",
 *         "start_date": "2024-06-01",
 *         "end_date": "2024-06-15",
 *         "created_at": "2024-01-15T10:30:00.000Z",
 *         "updated_at": "2024-01-15T10:30:00.000Z"
 *       }
 *     ],
 *     "count": 1
 *   }
 * }
 * 
 * Error Responses:
 * - 401: Not authenticated
 */
router.get(
    '/',
    getTripsHandler
);

/**
 * GET /trips/:id/itinerary
 * Get itinerary for a specific trip (read-only, activities ordered by date and time)
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Itinerary retrieved successfully",
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
 *         "trip_id": 1,
 *         "date": "2024-06-01",
 *         "time": "09:00:00",
 *         "title": "Breakfast",
 *         "description": "Hotel breakfast",
 *         "created_at": "2024-01-15T10:30:00.000Z",
 *         "updated_at": "2024-01-15T10:30:00.000Z"
 *       }
 *     ]
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Invalid trip ID
 * - 401: Not authenticated
 * - 403: Trip belongs to another user
 * - 404: Trip not found
 */
router.get(
    '/:id/itinerary',
    tripIdValidation,
    validate,
    getItineraryHandler
);

/**
 * GET /trips/:id/budget
 * Get budget breakdown for a specific trip
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Budget retrieved successfully",
 *   "data": {
 *     "trip": {
 *       "id": 1,
 *       "title": "Summer Vacation",
 *       "destination": "Paris, France",
 *       "start_date": "2024-06-01",
 *       "end_date": "2024-06-15",
 *       "total_days": 15
 *     },
 *     "summary": {
 *       "total_cost": 2500.00,
 *       "activity_count": 20,
 *       "average_cost_per_day": 166.67,
 *       "average_cost_per_active_day": 125.00,
 *       "days_with_activities": 20
 *     },
 *     "daily_breakdown": [
 *       {
 *         "date": "2024-06-01",
 *         "cost": 150.00,
 *         "activity_count": 3
 *       }
 *     ]
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Invalid trip ID
 * - 401: Not authenticated
 * - 403: Trip belongs to another user
 * - 404: Trip not found
 */
router.get(
    '/:id/budget',
    tripIdValidation,
    validate,
    getBudgetHandler
);

/**
 * GET /trips/:id
 * Get a specific trip by ID
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "trip": {
 *       "id": 1,
 *       "user_id": 1,
 *       "title": "Summer Vacation",
 *       "destination": "Paris, France",
 *       "start_date": "2024-06-01",
 *       "end_date": "2024-06-15",
 *       "created_at": "2024-01-15T10:30:00.000Z",
 *       "updated_at": "2024-01-15T10:30:00.000Z"
 *     }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Invalid trip ID
 * - 401: Not authenticated
 * - 403: Trip belongs to another user
 * - 404: Trip not found
 */
router.get(
    '/:id',
    tripIdValidation,
    validate,
    getTripHandler
);

/**
 * PUT /trips/:id
 * Update a trip
 * 
 * Request Body (all fields optional):
 * {
 *   "title": "Updated Title",
 *   "destination": "New Destination",
 *   "start_date": "2024-07-01",
 *   "end_date": "2024-07-15"
 * }
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Trip updated successfully",
 *   "data": {
 *     "trip": {
 *       "id": 1,
 *       "user_id": 1,
 *       "title": "Updated Title",
 *       "destination": "New Destination",
 *       "start_date": "2024-07-01",
 *       "end_date": "2024-07-15",
 *       "created_at": "2024-01-15T10:30:00.000Z",
 *       "updated_at": "2024-01-15T11:00:00.000Z"
 *     }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error, invalid trip ID, or invalid dates
 * - 401: Not authenticated
 * - 403: Trip belongs to another user
 * - 404: Trip not found
 */
router.put(
    '/:id',
    tripIdValidation,
    tripUpdateValidation,
    validate,
    updateTripHandler
);

/**
 * DELETE /trips/:id
 * Delete a trip
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Trip deleted successfully"
 * }
 * 
 * Error Responses:
 * - 400: Invalid trip ID
 * - 401: Not authenticated
 * - 403: Trip belongs to another user
 * - 404: Trip not found
 */
router.delete(
    '/:id',
    tripIdValidation,
    validate,
    deleteTripHandler
);

export default router;

