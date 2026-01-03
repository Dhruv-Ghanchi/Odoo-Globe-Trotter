/**
 * Database Connection Module
 * 
 * Establishes and manages PostgreSQL connection pool.
 * Uses environment variables for configuration.
 */

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'travel_planner',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection cannot be established
});

// Test database connection on startup
pool.on('connect', () => {
    console.log('✅ Database connection established');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
    process.exit(-1);
});

/**
 * Execute a database query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        
        // Log query in development only, or sanitize in production
        if (process.env.NODE_ENV === 'development') {
            console.log('Executed query', { text, duration, rows: res.rowCount });
        } else {
            // In production, log only query type and duration (no sensitive data)
            const queryType = text.trim().split(/\s+/)[0];
            console.log('Query executed', { type: queryType, duration, rows: res.rowCount });
        }
        
        return res;
    } catch (error) {
        // Always log errors, but sanitize in production
        if (process.env.NODE_ENV === 'development') {
            console.error('Database query error:', error);
        } else {
            console.error('Database query error:', {
                code: error.code,
                message: error.message,
                // Don't log query text or params in production
            });
        }
        throw error;
    }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
export const getClient = async () => {
    const client = await pool.connect();
    return client;
};

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
export const testConnection = async () => {
    try {
        const result = await query('SELECT NOW()');
        console.log('Database connection test successful:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
};

export default pool;

