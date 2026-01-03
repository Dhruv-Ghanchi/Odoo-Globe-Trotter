
import { query } from './config/database.js';

async function checkCostType() {
    try {
        const res = await query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'activities' AND column_name = 'cost';
        `);
        console.log('COST TYPE:', res.rows[0]?.data_type);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCostType();
