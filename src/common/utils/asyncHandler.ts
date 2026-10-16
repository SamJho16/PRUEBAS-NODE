// ==========================================================
// Envuelve controladores async para propagar errores a Express
// sin necesidad de try/catch repetido en cada controller.
// ==========================================================
import { NextFunction, Request, Response } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (fn: AsyncFn) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
