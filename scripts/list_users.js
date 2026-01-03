/**
 * List Users
 * 
 * Lists all users in the database to verify credentials.
 * MASKS PASSWORD HASHES FOR SECURITY.
 */

import dotenv from 'dotenv';
dotenv.config();

import { query } from '../config/database.js';

async function listUsers() {
    try {
        console.log('Fetching users...\n');

        const result = await query('SELECT id, email, full_name, created_at FROM users ORDER BY id');

        if (result.rows.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.log('Found users:');
            console.table(result.rows);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        process.exit(1);
    }
}

listUsers();
