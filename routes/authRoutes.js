/**
 * Authentication Routes
 * 
 * Defines authentication endpoints with validation rules.
 * 
 * Endpoints:
 * - POST /auth/signup - Register new user
 * - POST /auth/login - Authenticate user
 * - GET  /auth/me - Get current user (protected)
 */

import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { signup, login, getMe } from '../controllers/authController.js';
import { customEmailValidator } from '../utils/emailValidator.js';

const router = express.Router();

/**
 * Validation rules for email
 * Includes comprehensive domain validation
 */
const emailValidation = body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .custom(customEmailValidator)
    .normalizeEmail();

/**
 * Validation rules for password
 */
const passwordValidation = body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long');

/**
 * POST /auth/signup
 * Register a new user
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Success Response (201):
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": {
 *       "id": 1,
 *       "email": "user@example.com",
 *       "created_at": "2024-01-01T00:00:00.000Z"
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error
 * - 409: Email already exists
 */
router.post(
    '/signup',
    [emailValidation, passwordValidation, validate],
    signup
);

/**
 * POST /auth/login
 * Authenticate user and get JWT token
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": {
 *       "id": 1,
 *       "email": "user@example.com",
 *       "created_at": "2024-01-01T00:00:00.000Z"
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error
 * - 401: Invalid email or password
 */
router.post(
    '/login',
    [emailValidation, passwordValidation, validate],
    login
);

/**
 * GET /auth/me
 * Get current authenticated user's information
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": 1,
 *       "email": "user@example.com",
 *       "created_at": "2024-01-01T00:00:00.000Z"
 *     }
 *   }
 * }
 * 
 * Error Responses:
 * - 401: Missing or invalid token
 * - 404: User not found
 */
router.get(
    '/me',
    authenticate,
    getMe
);

export default router;


