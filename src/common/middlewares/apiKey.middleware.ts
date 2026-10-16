// ==========================================================
// Middleware para rutas "internas" (service-to-service), como
// el webhook de verificacion. Exige un header "x-api-key"
// que coincida con INTERNAL_API_KEY, en vez de JWT de usuario.
// ==========================================================
import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { ApiError } from '../utils/apiError';

export function apiKeyAuth(req: Request, _res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];

  if (!env.internalApiKey || apiKey !== env.internalApiKey) {
    return next(ApiError.forbidden('API Key invalida'));
  }

  next();
}
