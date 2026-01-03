
import { query } from './config/database.js';

async function checkSchema() {
    try {
        console.log('Checking activities table schema...');
        const res = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'activities';
        `);
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    }
}

checkSchema();
