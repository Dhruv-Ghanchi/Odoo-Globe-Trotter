
import { query } from './config/database.js';

async function listColumns() {
    try {
        const res = await query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'activities';
        `);
        console.log('COLUMNS IN ACTIVITIES TABLE:');
        console.table(res.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listColumns();
