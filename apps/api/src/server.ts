import pg from 'pg';
import { buildApp } from './app.js';
import { loadConfig } from './config.js';
import { runMigrations } from './db/migrate.js';
import { createPgDatabase } from './db/pg.js';
import { seedAll } from './db/seed.js';

async function main(): Promise<void> {
  const config = loadConfig();
  if (!config.databaseUrl) {
    console.error('DATABASE_URL não definido.');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: config.databaseUrl });
  const db = createPgDatabase(pool);

  await runMigrations(db);
  await seedAll(db, config);

  const app = await buildApp({ db, config });
  await app.listen({ port: config.port, host: config.host });
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
