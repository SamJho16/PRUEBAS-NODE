// ==========================================================
// Configura variables de entorno minimas para el entorno de pruebas
// (Jest) antes de que se importen los modulos de la app.
// ==========================================================
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? 'file:./test.db';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret';
process.env.INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? 'test-internal-api-key';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? 'test-google-client-id';
