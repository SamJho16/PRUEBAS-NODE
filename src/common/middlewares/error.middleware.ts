// ==========================================================
// Middleware central de manejo de errores.
// Convierte cualquier error (conocido o inesperado) en una
// respuesta JSON consistente para el cliente.
// ==========================================================
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Error no controlado: se registra en consola y se responde generico (no exponer stack al cliente)
  console.error('[ERROR NO CONTROLADO]', err);
  res.status(500).json({
    error: { message: 'Error interno del servidor' },
  });
}
