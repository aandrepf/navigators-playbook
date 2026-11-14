import pg from 'pg';
import type { Database, Queryable, QueryResult } from './types.js';

/** Implementação de produção sobre node-postgres. */
export function createPgDatabase(pool: pg.Pool): Database {
  return {
    async query<T = Record<string, unknown>>(
      text: string,
      params?: unknown[],
    ): Promise<QueryResult<T>> {
      const result = await pool.query(text, (params ?? []) as never);
      return { rows: result.rows as T[], rowCount: result.rowCount };
    },
    async exec(sql: string): Promise<void> {
      // Consulta simples: node-postgres aceita múltiplas instruções sem params.
      await pool.query(sql);
    },
    async transaction<T>(fn: (db: Queryable) => Promise<T>): Promise<T> {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const tx: Queryable = {
          async query<T2 = Record<string, unknown>>(
            text: string,
            params?: unknown[],
          ): Promise<QueryResult<T2>> {
            const result = await client.query(text, (params ?? []) as never);
            return { rows: result.rows as T2[], rowCount: result.rowCount };
          },
        };
        const result = await fn(tx);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    },
    async close(): Promise<void> {
      await pool.end();
    },
  };
}
