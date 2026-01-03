/**
 * Database Initialization Script
 * 
 * Runs the schema.sql file to set up the database.
 * Usage: node scripts/init-db.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { query } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
    try {
        console.log('📦 Initializing database...');
        
        // Read schema file
        const schemaPath = join(__dirname, '..', 'schema.sql');
        const schema = readFileSync(schemaPath, 'utf8');
        
        // Execute schema (split by semicolons for multiple statements)
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (const statement of statements) {
            if (statement.trim()) {
                await query(statement);
            }
        }
        
        console.log('✅ Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

initDatabase();


