/**
 * Main Routes Index
 * 
 * Central router that combines all route modules.
 * Add new route modules here as they are created.
 */

import express from 'express';
import authRoutes from './authRoutes.js';
import tripRoutes from './tripRoutes.js';
import activityRoutes from './activityRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// Authentication routes
router.use('/auth', authRoutes);

// Activity routes (mounted at root, registered before trip routes to handle /trips/:id/activities)
// Must be before trip routes to avoid route conflicts
router.use('/', activityRoutes);

// Trip routes
router.use('/trips', tripRoutes);

export default router;

