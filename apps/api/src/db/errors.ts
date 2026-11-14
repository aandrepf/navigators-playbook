/** SQLSTATE de violação de unicidade no Postgres (padrão, em pg e PGlite). */
const UNIQUE_VIOLATION = '23505';

/**
 * Detecta violação de unicidade de forma portável entre os dois drivers que
 * implementam `Database`: `pg` (produção) e PGlite (testes). Ambos expõem
 * `err.code` com o SQLSTATE do Postgres.
 */
export function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: unknown }).code === UNIQUE_VIOLATION
  );
}
