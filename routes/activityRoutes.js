/**
 * Activity Routes
 * 
 * Defines activity management endpoints with validation rules.
 * All routes are protected by JWT authentication.
 * 
 * Endpoints:
 * - POST   /trips/:id/activities - Create activity for a trip
 * - GET    /trips/:id/activities - Get all activities for a trip
 * - PUT    /activities/:id - Update activity
 * - DELETE /activities/:id - Delete activity
 */

import express from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import {
    createActivityHandler,
    getActivitiesHandler,
    updateActivityHandler,
    deleteActivityHandler,
} from '../controllers/activityController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * Validation rules for trip ID parameter
 */
const tripIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Trip ID must be a positive integer'),
];

/**
 * Validation rules for activity ID parameter
 */
const activityIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Activity ID must be a positive integer'),
];

/**
 * Validation rules for activity creation
 */
const activityValidation = [
    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid date (YYYY-MM-DD)')
        .toDate(),
    
    body('time')
        .notEmpty()
        .withMessage('Time is required')
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/)
        .withMessage('Time must be in HH:MM or HH:MM:SS format'),
    
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description must not exceed 2000 characters'),
];

/**
 * Validation rules for activity update (all fields optional)
 */
const activityUpdateValidation = [
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid date (YYYY-MM-DD)')
        .toDate(),
    
    body('time')
        .optional()
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/)
        .withMessage('Time must be in HH:MM or HH:MM:SS format'),
    
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ min: 1, max: 255 })
        .withMessage('Title must be between 1 and 255 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description must not exceed 2000 characters'),
];

/**
 * POST /trips/:id/activities
 * Create a new activity for a trip
 * 
 * Request Body:
 * {
 *   "date": "2024-06-05",
 *   "time": "09:00",
 *   "title": "Visit Eiffel Tower",
 *   "description": "Morning visit to avoid crowds"
 * }
 * 
 * Success Response (201):
 * {
 *   "success": true,
 *   "message": "Activity created successfully",
 *   "data": {
 *     "activity": {
 *       "id": 1,
 *       "trip_id": 1,
 *       "date": "2024-06-05",
 *       "time": "09:00:00",
 *       "title": "Visit Eiffel Tower",
 *       "description": "Morning visit to avoid crowds",
 *       "created_at": "2024-01-15T10:30:00.000Z",
 *       "updated_at": "2024-01-15T10:30:00.000Z"
 *     }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error or invalid trip ID
 * - 401: Not authenticated
 * - 403: Trip belongs to another user
 * - 404: Trip not found
 */
router.post(
    '/trips/:id/activities',
    tripIdValidation,
    activityValidation,
    validate,
    createActivityHandler
);

/**
 * GET /trips/:id/activities
 * Get all activities for a trip
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "activities": [
 *       {
 *         "id": 1,
 *         "trip_id": 1,
 *         "date": "2024-06-05",
 *         "time": "09:00:00",
 *         "title": "Visit Eiffel Tower",
 *         "description": "Morning visit to avoid crowds",
 *         "created_at": "2024-01-15T10:30:00.000Z",
 *         "updated_at": "2024-01-15T10:30:00.000Z"
 *       }
 *     ],
 *     "count": 1
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
    '/trips/:id/activities',
    tripIdValidation,
    validate,
    getActivitiesHandler
);

/**
 * PUT /activities/:id
 * Update an activity
 * 
 * Request Body (all fields optional):
 * {
 *   "date": "2024-06-06",
 *   "time": "10:00",
 *   "title": "Updated Activity",
 *   "description": "Updated description"
 * }
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Activity updated successfully",
 *   "data": {
 *     "activity": {
 *       "id": 1,
 *       "trip_id": 1,
 *       "date": "2024-06-06",
 *       "time": "10:00:00",
 *       "title": "Updated Activity",
 *       "description": "Updated description",
 *       "created_at": "2024-01-15T10:30:00.000Z",
 *       "updated_at": "2024-01-15T11:00:00.000Z"
 *     }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error or invalid activity ID
 * - 401: Not authenticated
 * - 403: Activity belongs to another user's trip
 * - 404: Activity not found
 */
router.put(
    '/activities/:id',
    activityIdValidation,
    activityUpdateValidation,
    validate,
    updateActivityHandler
);

/**
 * DELETE /activities/:id
 * Delete an activity
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Activity deleted successfully"
 * }
 * 
 * Error Responses:
 * - 400: Invalid activity ID
 * - 401: Not authenticated
 * - 403: Activity belongs to another user's trip
 * - 404: Activity not found
 */
router.delete(
    '/activities/:id',
    activityIdValidation,
    validate,
    deleteActivityHandler
);

export default router;


