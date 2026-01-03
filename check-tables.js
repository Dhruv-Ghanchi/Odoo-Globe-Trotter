/**
 * Check what tables exist in the database
 */

import dotenv from 'dotenv';
dotenv.config();

import { query } from './config/database.js';

async function checkTables() {
    try {
        console.log('Checking what tables exist...');
        
        // List all tables
        const tablesResult = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        console.log('\nTables found:');
        if (tablesResult.rows.length === 0) {
            console.log('❌ No tables found in the database!');
        } else {
            tablesResult.rows.forEach(row => {
                console.log(`  - ${row.table_name}`);
            });
        }
        
        // Check if we're in the right database
        const dbResult = await query('SELECT current_database()');
        console.log('\nCurrent database:', dbResult.rows[0].current_database);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Error code:', error.code);
        process.exit(1);
    }
}

checkTables();

