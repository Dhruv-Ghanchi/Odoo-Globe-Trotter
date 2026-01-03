/**
 * JWT Utility Functions
 * 
 * Helper functions for generating and managing JWT tokens.
 */

import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Generate JWT token for user
 * @param {Object} payload - Data to encode in token (typically { userId, email })
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
    return jwt.verify(token, config.jwt.secret);
};


