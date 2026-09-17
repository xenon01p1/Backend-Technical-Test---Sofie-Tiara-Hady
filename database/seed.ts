import fs from 'fs';
import path from 'path';
import { db } from '../src/config/database.js';

async function runSeeds() {
  console.log('🌱 Starting Seeder Process...');

  try {
    const seedsDir = path.join(process.cwd(), 'database', 'seeds');

    if (!fs.existsSync(seedsDir)) {
      console.log('⚠️ Directory database/seeds does not exist.');
      return;
    }

    const files = fs
      .readdirSync(seedsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`⏳ Executing seed: ${file}...`);

      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await db.query(sql);

      console.log(`✅ Successfully executed seed: ${file}`);
    }

    console.log('🎉 Seeder process completed!');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Seeder Failed:', message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

runSeeds();