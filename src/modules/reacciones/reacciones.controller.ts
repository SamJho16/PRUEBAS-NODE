// ==========================================================
// Controlador del modulo Reacciones.
// ==========================================================
import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import * as reaccionesService from './reacciones.service';

export const agregar = asyncHandler(async (req: Request, res: Response) => {
  const reaccion = await reaccionesService.agregarReaccion(req.params.publicacionId, req.auth!.id);
  res.status(201).json(reaccion);
});

export const quitar = asyncHandler(async (req: Request, res: Response) => {
  await reaccionesService.quitarReaccion(req.params.publicacionId, req.auth!.id);
  res.status(204).send();
});
