/**
 * Server Entry Point
 * 
 * Starts the Express server and initializes database connection.
 */

import app from './app.js';
import config from './config/config.js';
import { testConnection } from './config/database.js';

const PORT = config.port;

// Start server
const server = app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
    
    // Test database connection
    await testConnection();
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});


