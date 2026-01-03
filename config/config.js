/**
 * Application Configuration
 * 
 * Centralized configuration management using environment variables.
 * Provides default values and validates required settings.
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
    // Server configuration
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database configuration
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'travel_planner',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
    },
    
    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    
    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
    },
};

// Validate required environment variables
const requiredEnvVars = ['DB_PASSWORD', 'JWT_SECRET'];

if (config.nodeEnv === 'production') {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }
}

export default config;


