/**
 * Test Database Connection
 * 
 * Run this to check if database connection works
 */

import dotenv from 'dotenv';
dotenv.config();

import { testConnection } from './config/database.js';

console.log('Testing database connection...');
console.log('DB Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '***' : 'NOT SET',
});

testConnection()
    .then((success) => {
        if (success) {
            console.log('✅ Database connection successful!');
            process.exit(0);
        } else {
            console.log('❌ Database connection failed!');
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('❌ Database connection error:');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        console.error('\nPossible issues:');
        console.error('1. Database does not exist - Run: createdb travel_planner');
        console.error('2. Wrong password in .env file');
        console.error('3. PostgreSQL service not running');
        console.error('4. Wrong host/port in .env file');
        process.exit(1);
    });


