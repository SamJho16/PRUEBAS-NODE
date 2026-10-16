// ==========================================================
// Servicio de autenticacion: logica de negocio para login
// social (Google/Facebook), refresh y logout de sesion.
// ==========================================================
import { addDays } from '../../common/utils/date.util';
import { prisma } from '../../common/prisma';
import { ApiError } from '../../common/utils/apiError';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../common/utils/jwt.util';
import { hashToken } from '../../common/utils/hashToken.util';
import { DatosProveedorSocial } from './providers/google.provider';

type ProveedorAuth = 'GOOGLE' | 'FACEBOOK';

interface ResultadoLogin {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string | null;
    rolAsignado: boolean;
  };
}

/** Busca un usuario por proveedor social o lo crea si no existe (login/registro unificado) */
async function buscarOCrearUsuario(proveedor: ProveedorAuth, datos: DatosProveedorSocial) {
  let usuario = await prisma.usuario.findUnique({
    where: { proveedorAuth_proveedorId: { proveedorAuth: proveedor, proveedorId: datos.proveedorId } },
  });

  if (!usuario) {
    usuario = await prisma.usuario.create({
      data: {
        email: datos.email,
        nombre: datos.nombre,
        fotoPerfil: datos.fotoPerfil,
        proveedorAuth: proveedor,
        proveedorId: datos.proveedorId,
        rol: null, // el rol se asigna despues via PATCH /usuarios/me/rol
      },
    });
  }

  return usuario;
}

/** Genera el par de tokens y persiste el refresh token (hasheado) en BD */
async function emitirTokens(usuarioId: string, rol: string | null): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const accessToken = signAccessToken({ sub: usuarioId, rol });
  const refreshToken = signRefreshToken({ sub: usuarioId, rol });

  await prisma.refreshToken.create({
    data: {
      usuarioId,
      tokenHash: hashToken(refreshToken),
      expiraEn: addDays(new Date(), 7),
    },
  });

  return { accessToken, refreshToken };
}

export async function loginConProveedor(
  proveedor: ProveedorAuth,
  datos: DatosProveedorSocial,
): Promise<ResultadoLogin> {
  const usuario = await buscarOCrearUsuario(proveedor, datos);

  if (usuario.estado !== 'ACTIVO') {
    throw ApiError.forbidden('Usuario bloqueado o inactivo');
  }

  const { accessToken, refreshToken } = await emitirTokens(usuario.id, usuario.rol);

  return {
    accessToken,
    refreshToken,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      rolAsignado: usuario.rol !== null,
    },
  };
}

/** Renueva el accessToken validando el refreshToken recibido por cookie httpOnly */
export async function refrescarSesion(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Refresh token invalido o expirado');
  }

  const tokenHash = hashToken(refreshToken);
  const registro = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!registro || registro.revocado || registro.expiraEn < new Date()) {
    throw ApiError.unauthorized('Refresh token revocado o expirado');
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.sub } });
  if (!usuario || usuario.estado !== 'ACTIVO') {
    throw ApiError.unauthorized('Usuario no valido');
  }

  const accessToken = signAccessToken({ sub: usuario.id, rol: usuario.rol });
  return { accessToken };
}

/** Revoca el refresh token actual (logout) */
export async function cerrarSesion(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revocado: true },
  });
}

/** Devuelve los datos del usuario autenticado actual */
export async function obtenerUsuarioActual(usuarioId: string) {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) {
    throw ApiError.notFound('Usuario no encontrado');
  }
  return usuario;
}
