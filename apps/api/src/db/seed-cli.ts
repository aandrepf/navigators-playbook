import pg from 'pg';
import { loadConfig } from '../config.js';
import { createPgDatabase } from './pg.js';
import { seedHeadCoach } from './seed.js';

async function main(): Promise<void> {
  const config = loadConfig();
  if (!config.databaseUrl) {
    console.error('DATABASE_URL não definido.');
    process.exit(1);
  }
  const pool = new pg.Pool({ connectionString: config.databaseUrl });
  const db = createPgDatabase(pool);
  try {
    await seedHeadCoach(db, config);
    console.log('seed concluído (idempotente).');
  } finally {
    await db.close();
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
