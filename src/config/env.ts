// ==========================================================
// Carga y valida las variables de entorno de la aplicacion.
// Centraliza el acceso a process.env en un solo objeto tipado.
// ==========================================================
import dotenv from 'dotenv';

dotenv.config();

/** Helper para exigir una variable de entorno obligatoria */
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',

  databaseUrl: required('DATABASE_URL'),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshSecret: required('JWT_REFRESH_SECRET'),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },

  cookie: {
    domain: process.env.COOKIE_DOMAIN ?? 'localhost',
    secure: process.env.COOKIE_SECURE === 'true',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  },

  facebook: {
    appId: process.env.FACEBOOK_APP_ID ?? '',
    appSecret: process.env.FACEBOOK_APP_SECRET ?? '',
  },

  internalApiKey: process.env.INTERNAL_API_KEY ?? '',

  corsOrigin: process.env.CORS_ORIGIN ?? '*',

  uploadsDir: process.env.UPLOADS_DIR ?? 'uploads',
};
