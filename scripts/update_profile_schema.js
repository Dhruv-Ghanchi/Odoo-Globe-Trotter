/**
 * Update Database Schema
 * 
 * Adds new columns to users table for enhanced profile support.
 */

import dotenv from 'dotenv';
dotenv.config();

import { query } from '../config/database.js';

async function updateSchema() {
    try {
        console.log('Updating database schema...\n');

        // Add full_name column
        console.log('Adding full_name column...');
        await query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)
        `);
        console.log('✅ full_name added');

        // Add avatar_url column
        console.log('Adding avatar_url column...');
        await query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS avatar_url TEXT
        `);
        console.log('✅ avatar_url added');

        // Add preferences column
        console.log('Adding preferences column...');
        await query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'
        `);
        console.log('✅ preferences added');

        console.log('\n✅ Schema update complete!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error updating schema:', error.message);
        process.exit(1);
    }
}

updateSchema();
