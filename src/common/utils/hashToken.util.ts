// ==========================================================
// Utilidades de hash simple (sha256) para almacenar el
// refresh token en BD sin guardar el valor en texto plano.
// ==========================================================
import crypto from 'crypto';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
