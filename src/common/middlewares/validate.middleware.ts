// ==========================================================
// Middleware generico de validacion de esquemas Zod.
// Valida body/params/query y devuelve 400 con detalle si falla.
// ==========================================================
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

interface SchemaMap {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

export function validate(schemas: SchemaMap) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      if (schemas.query) req.query = schemas.query.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(ApiError.badRequest('Datos de entrada invalidos', error.flatten()));
      }
      next(error);
    }
  };
}
