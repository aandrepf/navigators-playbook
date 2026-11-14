import pg from 'pg';
import { loadConfig } from '../config.js';
import { createPgDatabase } from './pg.js';
import { runMigrations } from './migrate.js';

async function main(): Promise<void> {
  const config = loadConfig();
  if (!config.databaseUrl) {
    console.error('DATABASE_URL não definido.');
    process.exit(1);
  }
  const pool = new pg.Pool({ connectionString: config.databaseUrl });
  const db = createPgDatabase(pool);
  try {
    const ran = await runMigrations(db);
    console.log(
      ran.length > 0
        ? `migrações aplicadas: ${ran.join(', ')}`
        : 'nenhuma migração nova.',
    );
  } finally {
    await db.close();
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
