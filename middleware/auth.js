/**
 * Authentication Middleware
 * 
 * Validates JWT tokens and attaches user information to request object.
 * Protects routes that require authentication.
 */

import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { AppError } from './errorHandler.js';

/**
 * Middleware to verify JWT token and authenticate user
 * Attaches decoded token (user info) to req.user
 */
export const authenticate = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Authentication token required', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Attach user info to request object
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Invalid or expired authentication token', 401));
        }
    }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, config.jwt.secret);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // If token is invalid, just continue without user info
        next();
    }
};


