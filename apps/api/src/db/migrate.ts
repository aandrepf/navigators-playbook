import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { Database } from './types.js';

const migrationsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'migrations',
);

/**
 * Aplica migrações SQL versionadas (arquivos `NNNN_nome.sql` em ordem) e
 * registra cada uma em `schema_migrations`. Idempotente: migrações já aplicadas
 * são puladas.
 */
export async function runMigrations(db: Database): Promise<string[]> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const appliedResult = await db.query<{ id: string }>(
    'SELECT id FROM schema_migrations',
  );
  const applied = new Set(appliedResult.rows.map((r) => r.id));

  const ran: string[] = [];
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await readFile(path.join(migrationsDir, file), 'utf8');
    await db.exec(sql);
    await db.query('INSERT INTO schema_migrations (id) VALUES ($1)', [file]);
    ran.push(file);
  }
  return ran;
}
