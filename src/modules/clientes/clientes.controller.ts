// ==========================================================
// Controlador del modulo Clientes.
// ==========================================================
import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import * as clientesService from './clientes.service';

export const obtenerPerfilPublico = asyncHandler(async (req: Request, res: Response) => {
  const perfil = await clientesService.obtenerPerfilPublico(req.params.id);
  res.status(200).json(perfil);
});

export const crearEvaluacion = asyncHandler(async (req: Request, res: Response) => {
  const evaluacion = await clientesService.crearEvaluacionCliente(
    req.params.clienteId,
    req.auth!.id,
    req.body.calificacion,
  );
  res.status(201).json(evaluacion);
});

export const listarEvaluaciones = asyncHandler(async (req: Request, res: Response) => {
  const evaluaciones = await clientesService.listarEvaluacionesCliente(req.params.clienteId);
  res.status(200).json(evaluaciones);
});
