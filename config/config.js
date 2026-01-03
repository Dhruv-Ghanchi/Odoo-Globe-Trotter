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
        origin: (() => {
            // In development, always allow common localhost ports for flexibility
            if (process.env.NODE_ENV !== 'production') {
                const devOrigins = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'];
                const envOrigin = process.env.CORS_ORIGIN;
                if (envOrigin) {
                    // If multiple origins are specified (comma-separated), split and add to dev origins
                    if (envOrigin.includes(',')) {
                        const envOrigins = envOrigin.split(',').map(origin => origin.trim());
                        return [...new Set([...devOrigins, ...envOrigins])]; // Remove duplicates
                    }
                    // If single origin, add it to dev origins if not already present
                    const origin = envOrigin.trim();
                    if (!devOrigins.includes(origin)) {
                        devOrigins.push(origin);
                    }
                    return devOrigins;
                }
                return devOrigins;
            }
            // In production, use environment variable or default to wildcard
            const envOrigin = process.env.CORS_ORIGIN;
            if (envOrigin) {
                if (envOrigin.includes(',')) {
                    return envOrigin.split(',').map(origin => origin.trim());
                }
                return envOrigin;
            }
            return '*';
        })(),
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


