// ==========================================================
// Middleware RBAC: restringe el acceso a rutas segun el rol
// del usuario autenticado (ASESOR / CLIENTE).
// Debe usarse siempre despues de "authenticate".
// ==========================================================
import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export function authorize(...rolesPermitidos: Array<'ASESOR' | 'CLIENTE'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      return next(ApiError.unauthorized());
    }

    if (!req.auth.rol) {
      return next(ApiError.forbidden('Debe seleccionar un rol antes de continuar'));
    }

    if (!rolesPermitidos.includes(req.auth.rol as 'ASESOR' | 'CLIENTE')) {
      return next(ApiError.forbidden('Su rol no tiene acceso a este recurso'));
    }

    next();
  };
}
