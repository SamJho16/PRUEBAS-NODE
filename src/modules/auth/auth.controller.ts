// ==========================================================
// Controlador del modulo Auth: adapta HTTP <-> Servicio.
// Gestiona la cookie httpOnly del refresh token.
// ==========================================================
import { Request, Response } from 'express';
import { env } from '../../config/env';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { ApiError } from '../../common/utils/apiError';
import * as authService from './auth.service';
import { verificarGoogleIdToken } from './providers/google.provider';
import { verificarFacebookAccessToken } from './providers/facebook.provider';

const REFRESH_COOKIE_NAME = 'refreshToken';

/** Setea la cookie httpOnly/secure/sameSite=strict con el refresh token */
function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: 'strict',
    domain: env.cookie.domain,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });
}

export const loginGoogle = asyncHandler(async (req: Request, res: Response) => {
  const datos = await verificarGoogleIdToken(req.body.idToken);
  const resultado = await authService.loginConProveedor('GOOGLE', datos);

  setRefreshCookie(res, resultado.refreshToken);
  res.status(200).json({ accessToken: resultado.accessToken, usuario: resultado.usuario });
});

export const loginFacebook = asyncHandler(async (req: Request, res: Response) => {
  const datos = await verificarFacebookAccessToken(req.body.accessToken);
  const resultado = await authService.loginConProveedor('FACEBOOK', datos);

  setRefreshCookie(res, resultado.refreshToken);
  res.status(200).json({ accessToken: resultado.accessToken, usuario: resultado.usuario });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    throw ApiError.unauthorized('No se encontro el refresh token');
  }

  const { accessToken } = await authService.refrescarSesion(refreshToken);
  res.status(200).json({ accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (refreshToken) {
    await authService.cerrarSesion(refreshToken);
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { domain: env.cookie.domain });
  res.status(204).send();
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await authService.obtenerUsuarioActual(req.auth!.id);
  res.status(200).json({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    fotoPerfil: usuario.fotoPerfil,
    rol: usuario.rol,
    rolAsignado: usuario.rol !== null,
  });
});
