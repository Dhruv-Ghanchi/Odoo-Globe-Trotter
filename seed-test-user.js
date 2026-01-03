/**
 * Seed Script: Create test@example.com user
 * 
 * Run this script to create the test user in your local database.
 * Usage: node seed-test-user.js
 */

import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'travel_planner',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function seedTestUser() {
  try {
    console.log('🌱 Seeding test user...\n');

    // Check if user already exists
    const checkResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      ['test@example.com']
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ User test@example.com already exists');
      console.log('   ID:', checkResult.rows[0].id);
      console.log('   Email:', checkResult.rows[0].email);
      console.log('\n🔧 Resetting password to: password123');
      
      const defaultPassword = 'password123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2',
        [passwordHash, 'test@example.com']
      );
      
      console.log('✅ Password reset successfully!');
    } else {
      console.log('📝 Creating new user: test@example.com');
      
      const defaultPassword = 'password123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);
      
      const insertResult = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
        ['test@example.com', passwordHash]
      );

      console.log('✅ User created successfully!');
      console.log('   ID:', insertResult.rows[0].id);
      console.log('   Email:', insertResult.rows[0].email);
      console.log('   Created:', insertResult.rows[0].created_at);
    }

    console.log('\n📝 Login Credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('\n✨ Seed completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error seeding test user:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Cannot connect to database. Make sure:');
      console.error('   1. PostgreSQL is running');
      console.error('   2. Database "travel_planner" exists');
      console.error('   3. .env file has correct database credentials');
    } else if (error.code === '42P01') {
      console.error('\n⚠️  Table "users" does not exist. Run schema.sql first!');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedTestUser();

