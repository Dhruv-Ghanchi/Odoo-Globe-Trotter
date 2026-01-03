/**
 * Password Utility Functions
 * 
 * Helper functions for password hashing and verification.
 */

import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};


