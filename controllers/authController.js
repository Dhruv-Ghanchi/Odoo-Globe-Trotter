/**
 * Authentication Controller
 * 
 * Handles HTTP request/response for authentication endpoints.
 * Coordinates between services and sends appropriate responses.
 */

import { createUser, findByEmail, findById } from '../services/userService.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * POST /auth/signup
 * Register a new user
 * 
 * Request body: { email, password }
 * Response: { success, data: { user, token } }
 */
export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await findByEmail(email);
        if (existingUser) {
            return next(new AppError('User Already Exists: Please Login', 409));
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await createUser(email, passwordHash);

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /auth/login
 * Authenticate user and return JWT token
 * 
 * Request body: { email, password }
 * Response: { success, data: { user, token } }
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await findByEmail(email);
        if (!user) {
            return next(new AppError('No User Exists: Sign Up first!', 401));
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password_hash);
        if (!isPasswordValid) {
            return next(new AppError('Invalid email or password', 401));
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /auth/me
 * Get current authenticated user's information
 * 
 * Requires: JWT token in Authorization header
 * Response: { success, data: { user } }
 */
export const getMe = async (req, res, next) => {
    try {
        // User info is attached by authenticate middleware
        const userId = req.user.userId;

        // Fetch fresh user data from database
        const user = await findById(userId);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /auth/profile
 * Get current user profile
 * 
 * Response: { success, data: { user } }
 */
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await findById(userId);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /auth/profile
 * Update user profile (email)
 * 
 * Request body: { email }
 * Response: { success, data: { user } }
 */
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { email } = req.body;

        if (!email) {
            return next(new AppError('Email is required', 400));
        }

        const updatedUser = await updateUserEmail(userId, email);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /auth/profile
 * Delete user account
 * 
 * Response: { success, message }
 */
export const deleteProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        await deleteUser(userId);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};


