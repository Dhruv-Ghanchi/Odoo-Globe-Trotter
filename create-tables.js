/**
 * Create Database Tables
 * 
 * This script creates all required tables for the application.
 */

import dotenv from 'dotenv';
dotenv.config();

import { query } from './config/database.js';

async function createTables() {
    try {
        console.log('Creating database tables...\n');

        // Drop tables if they exist (in reverse order of dependencies)
        console.log('Dropping existing tables (if any)...');
        await query('DROP TABLE IF EXISTS activities CASCADE');
        await query('DROP TABLE IF EXISTS trips CASCADE');
        await query('DROP TABLE IF EXISTS users CASCADE');
        console.log('✅ Tables dropped\n');

        // Create users table
        console.log('Creating users table...');
        await query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);
        await query('CREATE INDEX idx_users_email ON users(email)');
        console.log('✅ users table created');

        // Create trips table
        console.log('Creating trips table...');
        await query(`
            CREATE TABLE trips (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                destination VARCHAR(255) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_trips_user 
                    FOREIGN KEY (user_id) 
                    REFERENCES users(id) 
                    ON DELETE CASCADE,
                CONSTRAINT chk_trips_dates 
                    CHECK (end_date >= start_date),
                CONSTRAINT chk_trips_title_length 
                    CHECK (LENGTH(TRIM(title)) > 0 AND LENGTH(title) <= 255),
                CONSTRAINT chk_trips_destination_length 
                    CHECK (LENGTH(TRIM(destination)) > 0 AND LENGTH(destination) <= 255)
            )
        `);
        await query('CREATE INDEX idx_trips_user_id ON trips(user_id)');
        await query('CREATE INDEX idx_trips_start_date ON trips(start_date)');
        await query('CREATE INDEX idx_trips_end_date ON trips(end_date)');
        console.log('✅ trips table created');

        // Create activities table
        console.log('Creating activities table...');
        await query(`
            CREATE TABLE activities (
                id SERIAL PRIMARY KEY,
                trip_id INTEGER NOT NULL,
                date DATE NOT NULL,
                time TIME NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT fk_activities_trip 
                    FOREIGN KEY (trip_id) 
                    REFERENCES trips(id) 
                    ON DELETE CASCADE,
                CONSTRAINT chk_activities_title_length 
                    CHECK (LENGTH(TRIM(title)) > 0 AND LENGTH(title) <= 255),
                CONSTRAINT chk_activities_description_length 
                    CHECK (description IS NULL OR LENGTH(description) <= 2000)
            )
        `);
        await query('CREATE INDEX idx_activities_trip_id ON activities(trip_id)');
        await query('CREATE INDEX idx_activities_trip_date_time ON activities(trip_id, date, time)');
        console.log('✅ activities table created\n');

        // Verify tables were created
        console.log('Verifying tables...');
        const tablesResult = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);

        console.log('\n✅ All tables created successfully!');
        console.log('Tables in database:');
        tablesResult.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating tables:');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        if (error.stack) {
            console.error('Stack:', error.stack);
        }
        process.exit(1);
    }
}

createTables();

