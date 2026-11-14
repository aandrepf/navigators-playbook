import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

/** Token opaco para sessão (base64url). */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url');
}

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/** Código numérico de uso único (sem zeros à esquerda). */
export function generateOtpCode(length = 6): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(randomInt(min, max + 1));
}

/** Comparação em tempo constante para hashes de código. */
export function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
