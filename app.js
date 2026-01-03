/**
 * Express Application Setup
 * 
 * Configures Express app with middleware, routes, and error handling.
 * This is the main application file (not the server entry point).
 */

import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// CORS configuration
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (simple version)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve uploaded files statically
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Public routes (no authentication required)
import publicRoutes from './routes/publicRoutes.js';
app.use('/api/public', publicRoutes);

// API routes (authentication required)
// API routes (authentication required)
import uploadRoutes from './routes/uploadRoutes.js';
app.use('/api/upload', uploadRoutes);
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Travel Planner API',
        version: '1.0.0',
    });
});

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;


