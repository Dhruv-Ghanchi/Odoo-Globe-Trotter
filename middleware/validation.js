/**
 * Validation Middleware
 * 
 * Wrapper for express-validator to handle validation errors consistently.
 * Can be extended with custom validation rules.
 */

import { validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

/**
 * Middleware to check validation results
 * Must be used after express-validator rules
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
        }));
        
        const error = new AppError('Validation failed', 400);
        error.details = errorMessages;
        return next(error);
    }
    
    next();
};


