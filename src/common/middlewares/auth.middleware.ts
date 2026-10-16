// ==========================================================
// Middleware de autenticacion: valida el Access Token JWT
// enviado en el header "Authorization: Bearer <token>".
// Adjunta el usuario decodificado en req.auth.
// ==========================================================
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import { verifyAccessToken } from '../utils/jwt.util';

export interface AuthPayload {
  id: string;
  rol: string | null;
}

// Extendemos el tipo Request de Express para incluir el usuario autenticado
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Token de acceso no proporcionado'));
  }

  const token = header.substring('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.auth = { id: payload.sub, rol: payload.rol };
    next();
  } catch {
    next(ApiError.unauthorized('Token de acceso invalido o expirado'));
  }
}
