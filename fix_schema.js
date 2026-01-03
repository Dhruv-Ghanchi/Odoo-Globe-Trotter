
import { query } from './config/database.js';

async function fixSchema() {
    try {
        console.log('Fixing schema...');

        // Add cost column
        await query(`
            ALTER TABLE activities 
            ADD COLUMN IF NOT EXISTS cost DECIMAL(10, 2) DEFAULT 0;
        `);
        console.log('Added cost column.');

        // Add time column if missing (Itinerary needs it)
        await query(`
            ALTER TABLE activities 
            ADD COLUMN IF NOT EXISTS time TIME;
        `);
        console.log('Added time column.');

        // Add city/location column if missing
        await query(`
            ALTER TABLE activities 
            ADD COLUMN IF NOT EXISTS location VARCHAR(255);
        `);
        console.log('Added location column.');

        process.exit(0);
    } catch (err) {
        console.error('Error fixing schema:', err);
        process.exit(1);
    }
}

fixSchema();
