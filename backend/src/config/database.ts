import { Pool } from 'pg';
import { config } from './index';

export const pool = new Pool({
  connectionString: config.database.url,
});

export async function closePool() {
  await pool.end();
}
