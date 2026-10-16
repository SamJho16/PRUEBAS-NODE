// ==========================================================
// Controlador del modulo Comentarios.
// ==========================================================
import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import * as comentariosService from './comentarios.service';

export const crear = asyncHandler(async (req: Request, res: Response) => {
  const comentario = await comentariosService.crearComentario(
    req.params.publicacionId,
    req.auth!.id,
    req.body.contenido,
  );
  res.status(201).json(comentario);
});

export const listar = asyncHandler(async (req: Request, res: Response) => {
  const comentarios = await comentariosService.listarComentarios(
    req.params.publicacionId,
    req.auth!.id,
  );
  res.status(200).json(comentarios);
});

export const editar = asyncHandler(async (req: Request, res: Response) => {
  const comentario = await comentariosService.editarComentario(
    req.params.id,
    req.auth!.id,
    req.body.contenido,
  );
  res.status(200).json(comentario);
});

export const eliminar = asyncHandler(async (req: Request, res: Response) => {
  await comentariosService.eliminarComentario(req.params.id, req.auth!.id);
  res.status(204).send();
});
