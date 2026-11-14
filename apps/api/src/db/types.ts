/**
 * Seam de acesso a dados. O app fala com esta interface; em produção é
 * implementada por `pg` (node-postgres) e nos testes por PGlite (Postgres real
 * compilado para WASM, efêmero). Nenhuma linha de negócio toca SQL via string
 * fora dos módulos de dados.
 */

export interface QueryResult<T> {
  rows: T[];
  rowCount: number | null;
}

export interface Queryable {
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
}

export interface Database extends Queryable {
  /** Executa um lote SQL (várias instruções), usado pelas migrações. */
  exec(sql: string): Promise<void>;
  /** Transação; `fn` recebe um executor vinculado à transação. */
  transaction<T>(fn: (db: Queryable) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}
