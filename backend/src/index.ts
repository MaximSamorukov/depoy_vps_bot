import { createApp } from './app';
import { config } from './config';
import { pool, closePool } from './config/database';
import * as fs from 'fs';
import * as path from 'path';

async function initDatabase() {
  const migrationPath = path.join(__dirname, './migrations/001-create-messages-table.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  await pool.query(sql);
  console.log('Database initialized');
}

async function bootstrap() {
  await initDatabase();

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    console.log(`API docs available at http://localhost:${config.port}/api-docs`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed');
      await closePool();
      console.log('Database connections closed');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
