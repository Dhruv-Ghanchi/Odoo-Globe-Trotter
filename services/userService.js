/**
 * User Service
 * 
 * Business logic and database operations for user management.
 * Handles all PostgreSQL queries related to users.
 */

import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Create a new user
 * @param {string} email - User email (must be unique)
 * @param {string} passwordHash - Hashed password
 * @returns {Promise<Object>} Created user object (without password)
 */
export const createUser = async (email, passwordHash) => {
    try {
        const result = await query(
            `INSERT INTO users (email, password_hash) 
             VALUES ($1, $2) 
             RETURNING id, email, created_at`,
            [email.toLowerCase().trim(), passwordHash]
        );

        if (result.rows.length === 0) {
            throw new AppError('Failed to create user', 500);
        }

        return result.rows[0];
    } catch (error) {
        // Handle unique constraint violation (duplicate email)
        if (error.code === '23505') {
            throw new AppError('Email already exists', 409);
        }
        throw error;
    }
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object with password_hash, or null if not found
 */
export const findByEmail = async (email) => {
    try {
        const result = await query(
            `SELECT id, email, password_hash, created_at 
             FROM users 
             WHERE email = $1`,
            [email.toLowerCase().trim()]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        throw new AppError('Database error while finding user', 500);
    }
};

/**
 * Find user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User object (without password), or null if not found
 */
export const findById = async (userId) => {
    try {
        const result = await query(
            `SELECT id, email, created_at 
             FROM users 
             WHERE id = $1`,
            [userId]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        throw new AppError('Database error while finding user', 500);
    }
};


