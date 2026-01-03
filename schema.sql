-- ============================================
-- Travel Planning Application Database Schema
-- ============================================
-- PostgreSQL schema for Odoo Hiring Hackathon
-- 
-- Architecture Overview:
-- - users: Core authentication and user management
-- - trips: User's travel plans (1 user → many trips)
-- - activities: Individual activities within trips (1 trip → many activities)
--
-- Relationships:
-- users (1) → (many) trips
-- trips (1) → (many) activities
-- ============================================

-- Drop tables if they exist (for clean setup)
-- Note: Drop in reverse order of dependencies
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores user authentication and profile data
-- Primary use: Login, registration, user identification
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index on email for fast login lookups
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- TRIPS TABLE
-- ============================================
-- Stores user's travel plans
-- Primary use: List trips, create/edit trips, filter by user
-- Relationship: Each trip belongs to one user
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint: Cascade delete trips when user is deleted
    CONSTRAINT fk_trips_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Business logic constraint: End date must be >= start date
    CONSTRAINT chk_trips_dates 
        CHECK (end_date >= start_date),
    
    -- Length constraints to match application validation
    CONSTRAINT chk_trips_title_length 
        CHECK (LENGTH(TRIM(title)) > 0 AND LENGTH(title) <= 255),
    CONSTRAINT chk_trips_destination_length 
        CHECK (LENGTH(TRIM(destination)) > 0 AND LENGTH(destination) <= 255)
);

-- Index on user_id for fast queries like "get all trips for user X"
CREATE INDEX idx_trips_user_id ON trips(user_id);

-- Index on dates for filtering trips by date range
CREATE INDEX idx_trips_start_date ON trips(start_date);
CREATE INDEX idx_trips_end_date ON trips(end_date);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
-- Stores individual activities within a trip
-- Primary use: Schedule activities, view daily itinerary
-- Relationship: Each activity belongs to one trip
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraint: Cascade delete activities when trip is deleted
    CONSTRAINT fk_activities_trip 
        FOREIGN KEY (trip_id) 
        REFERENCES trips(id) 
        ON DELETE CASCADE,
    
    -- Length constraints to match application validation
    CONSTRAINT chk_activities_title_length 
        CHECK (LENGTH(TRIM(title)) > 0 AND LENGTH(title) <= 255),
    CONSTRAINT chk_activities_description_length 
        CHECK (description IS NULL OR LENGTH(description) <= 2000)
);

-- Index on trip_id for fast queries like "get all activities for trip X"
CREATE INDEX idx_activities_trip_id ON activities(trip_id);

-- Composite index on date and time for efficient sorting of activities within a trip
CREATE INDEX idx_activities_trip_date_time ON activities(trip_id, date, time);

-- ============================================
-- NOTES ON DESIGN DECISIONS:
-- ============================================
-- 1. SERIAL PRIMARY KEYS: Auto-incrementing integers for efficient indexing
-- 2. CASCADE DELETES: When user deleted → trips deleted → activities deleted
--    This maintains referential integrity automatically
-- 3. DATE/TIME SEPARATION: Activities use DATE + TIME (not TIMESTAMP) to allow
--    flexible scheduling (e.g., "9:00 AM" without timezone complexity)
-- 4. INDEXES: Added on foreign keys and frequently queried columns
-- 5. CHECK CONSTRAINT: Enforces business rule (end_date >= start_date) at DB level
-- 6. TIMESTAMPS: created_at/updated_at for audit trail and sorting
-- ============================================

