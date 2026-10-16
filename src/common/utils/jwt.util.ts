// ==========================================================
// Utilidades para generar y verificar JWT (access + refresh)
// Access token: corta duracion, viaja en memoria del cliente.
// Refresh token: mayor duracion, viaja en cookie httpOnly.
// ==========================================================
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

/** Payload embebido dentro del Access Token */
export interface JwtPayload {
  sub: string; // id del usuario
  rol: string | null;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
}
