
import { query } from './config/database.js';

async function checkSchema() {
    try {
        const res = await query(`
            SELECT column_name, data_type, udt_name
            FROM information_schema.columns 
            WHERE table_name = 'activities'
            ORDER BY column_name;
        `);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
