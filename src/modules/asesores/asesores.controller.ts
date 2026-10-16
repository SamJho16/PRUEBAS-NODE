// ==========================================================
// Controlador del modulo Asesores.
// ==========================================================
import { Request, Response } from 'express';
import path from 'path';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { ApiError } from '../../common/utils/apiError';
import * as asesoresService from './asesores.service';

export const obtenerPerfilPublico = asyncHandler(async (req: Request, res: Response) => {
  const perfil = await asesoresService.obtenerPerfilPublico(req.params.id);
  res.status(200).json(perfil);
});

export const listarAsesores = asyncHandler(async (req: Request, res: Response) => {
  const { pagina, limite, busqueda } = req.query as unknown as {
    pagina: number;
    limite: number;
    busqueda?: string;
  };
  const resultado = await asesoresService.listarAsesores(pagina, limite, busqueda);
  res.status(200).json(resultado);
});

export const solicitarVerificacion = asyncHandler(async (req: Request, res: Response) => {
  const archivos = req.files as { [campo: string]: Express.Multer.File[] } | undefined;
  const frontal = archivos?.documentoFrontal?.[0];
  const sello = archivos?.documentoSello?.[0];

  if (!frontal || !sello) {
    throw ApiError.badRequest('Debe adjuntar ambos documentos: documentoFrontal y documentoSello');
  }

  const perfil = await asesoresService.solicitarVerificacion(req.auth!.id, {
    documentoFrontal: path.join('uploads', 'verificaciones', frontal.filename),
    documentoSello: path.join('uploads', 'verificaciones', sello.filename),
  });

  res.status(201).json(perfil);
});

export const obtenerEstadoVerificacion = asyncHandler(async (req: Request, res: Response) => {
  const perfil = await asesoresService.obtenerEstadoVerificacion(req.auth!.id);
  res.status(200).json(perfil);
});

export const actualizarVerificacionInterna = asyncHandler(async (req: Request, res: Response) => {
  const { estado, motivoRechazo } = req.body;
  const perfil = await asesoresService.actualizarVerificacionInterna(
    req.params.usuarioId,
    estado,
    motivoRechazo,
  );
  res.status(200).json(perfil);
});

export const crearEvaluacion = asyncHandler(async (req: Request, res: Response) => {
  const evaluacion = await asesoresService.crearEvaluacionAsesor(
    req.params.asesorId,
    req.auth!.id,
    req.body,
  );
  res.status(201).json(evaluacion);
});

export const listarEvaluaciones = asyncHandler(async (req: Request, res: Response) => {
  const evaluaciones = await asesoresService.listarEvaluacionesAsesor(req.params.asesorId);
  res.status(200).json(evaluaciones);
});
