/**
 * Test Database Tables
 */

import dotenv from 'dotenv';
dotenv.config();

import { query } from './config/database.js';

async function testTables() {
    try {
        console.log('Testing if tables exist...');
        
        // Test users table
        const usersResult = await query('SELECT COUNT(*) as count FROM users');
        console.log('✅ users table exists. Row count:', usersResult.rows[0].count);
        
        // Test trips table
        const tripsResult = await query('SELECT COUNT(*) as count FROM trips');
        console.log('✅ trips table exists. Row count:', tripsResult.rows[0].count);
        
        // Test activities table
        const activitiesResult = await query('SELECT COUNT(*) as count FROM activities');
        console.log('✅ activities table exists. Row count:', activitiesResult.rows[0].count);
        
        // Test a simple query that signup uses
        const testEmail = 'test@example.com';
        const findResult = await query(
            'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
            [testEmail.toLowerCase().trim()]
        );
        console.log('✅ findByEmail query works. Found:', findResult.rows.length, 'users');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testTables();

