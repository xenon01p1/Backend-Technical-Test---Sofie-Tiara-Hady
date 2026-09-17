import fs from 'fs';
import path from 'path';
import { db } from '../src/config/database.js';

async function runMigrations() {
  console.log('🚀 Starting database migration...');

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await db.query(
      'SELECT name FROM migrations'
    );

    const executedMigrations = (rows as { name: string }[])
      .map((row) => row.name);

    const migrationsPath = path.join(
      process.cwd(),
      'database',
      'migrations'
    );

    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (executedMigrations.includes(file)) {
        console.log(`⏩ Skipping: ${file}`);
        continue;
      }

      console.log(`⏳ Running: ${file}`);

      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await db.query(sql);

      await db.query(
        'INSERT INTO migrations (name) VALUES (?)',
        [file]
      );

      console.log(`✅ Completed: ${file}`);
    }

    console.log('🎉 Migration completed!');
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    console.error('❌ Migration failed:', message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

runMigrations();