// ==========================================================
// Configura y exporta la instancia de Express (sin levantar el servidor).
// Separado de server.ts para facilitar las pruebas con Supertest.
// ==========================================================
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import apiRoutes from './routes';
import { internalRouter as verificacionInternalRoutes } from './modules/asesores/asesores.routes';
import { notFoundHandler, errorHandler } from './common/middlewares/error.middleware';

export function createApp(): Application {
  const app = express();

  // --- Seguridad y utilidades basicas ---
  app.use(helmet()); // cabeceras HTTP seguras (OWASP)
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true, // permite el envio de la cookie httpOnly del refresh token
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  // --- Documentacion Swagger ---
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // --- Archivos estaticos subidos (documentos de verificacion) ---
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.uploadsDir)));

  // --- Endpoint de salud (util para el despliegue y monitoreo) ---
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  // --- Rutas de negocio ---
  app.use(env.apiPrefix, apiRoutes);
  // Ruta interna service-to-service (webhook de verificacion), fuera de /api/v1
  app.use('/internal/v1', verificacionInternalRoutes);

  // --- Manejo de errores (siempre al final) ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
