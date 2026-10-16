// ==========================================================
// Controlador del modulo Publicaciones.
// ==========================================================
import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { ApiError } from '../../common/utils/apiError';
import * as publicacionesService from './publicaciones.service';

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const rol = req.auth!.rol as 'ASESOR' | 'CLIENTE';
  if (!rol) throw ApiError.forbidden('Debe tener un rol asignado para publicar');

  const publicacion = await publicacionesService.crearPublicacion(req.auth!.id, rol, req.body);
  res.status(201).json(publicacion);
});

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const rol = req.auth!.rol as 'ASESOR' | 'CLIENTE';
  if (!rol) throw ApiError.forbidden('Debe tener un rol asignado');

  const { pagina, limite } = req.query as unknown as { pagina: number; limite: number };
  const resultado = await publicacionesService.listarPublicaciones(rol, pagina, limite);
  res.status(200).json(resultado);
});

export const obtener = asyncHandler(async (req: Request, res: Response) => {
  const rol = req.auth!.rol as 'ASESOR' | 'CLIENTE';
  if (!rol) throw ApiError.forbidden('Debe tener un rol asignado');

  const publicacion = await publicacionesService.obtenerPublicacion(
    req.params.id,
    req.auth!.id,
    rol,
  );
  res.status(200).json(publicacion);
});

export const editar = asyncHandler(async (req: Request, res: Response) => {
  const publicacion = await publicacionesService.editarPublicacion(
    req.params.id,
    req.auth!.id,
    req.body,
  );
  res.status(200).json(publicacion);
});

export const eliminar = asyncHandler(async (req: Request, res: Response) => {
  await publicacionesService.eliminarPublicacion(req.params.id, req.auth!.id);
  res.status(204).send();
});
