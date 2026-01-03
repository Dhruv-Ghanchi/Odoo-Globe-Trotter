/**
 * Centralized Error Handling Middleware
 * 
 * Catches all errors and returns consistent error responses.
 * Handles different error types (validation, database, authentication, etc.)
 */

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Main error handling middleware
 * Must be used after all routes
 */
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle PostgreSQL errors
    if (err.code) {
        switch (err.code) {
            case '23505': // Unique violation
                statusCode = 409;
                message = 'Resource already exists';
                break;
            case '23503': // Foreign key violation
                statusCode = 400;
                message = 'Invalid reference to related resource';
                break;
            case '23502': // Not null violation
                statusCode = 400;
                message = 'Required field is missing';
                break;
            case '23514': // Check constraint violation
                statusCode = 400;
                message = 'Data validation failed';
                break;
            case '42P01': // Undefined table
                statusCode = 500;
                message = 'Database configuration error';
                break;
            default:
                // Keep original error for development
                if (process.env.NODE_ENV === 'development') {
                    message = err.message;
                }
        }
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid authentication token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication token has expired';
    }

    // Log error details (more verbose in development)
    if (process.env.NODE_ENV === 'development') {
        console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
            statusCode,
        });
    } else {
        console.error('Error:', message);
    }

    // Send error response
    const errorResponse = {
        success: false,
        error: {
            message,
            ...(err.details && { details: err.details }), // Include validation details if present
            ...(process.env.NODE_ENV === 'development' && { 
                stack: err.stack,
                originalError: err.message,
                code: err.code 
            }),
        },
    };

    // Ensure response is sent even if there's an issue
    if (!res.headersSent) {
        res.status(statusCode).json(errorResponse);
    }
};

/**
 * 404 Not Found handler
 * Must be used after all routes but before error handler
 */
export const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};

