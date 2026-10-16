// ==========================================================
// Controlador del modulo Usuarios.
// ==========================================================
import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import * as usuariosService from './usuarios.service';

export const asignarRol = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await usuariosService.asignarRolInicial(req.auth!.id, req.body.rol);
  res.status(200).json({ id: usuario.id, rol: usuario.rol });
});

export const obtenerMe = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await usuariosService.obtenerPerfilPropio(req.auth!.id);
  res.status(200).json(usuario);
});

export const editarMe = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await usuariosService.editarPerfilPropio(req.auth!.id, req.body);
  res.status(200).json(usuario);
});
