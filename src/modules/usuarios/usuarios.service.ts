// ==========================================================
// Servicio del modulo Usuarios: gestion de perfil propio y
// asignacion de rol inicial (solo una vez).
// ==========================================================
import { prisma } from '../../common/prisma';
import { ApiError } from '../../common/utils/apiError';

/** Asigna el rol inicial del usuario (ASESOR/CLIENTE) y crea su perfil extendido. Solo permitido una vez. */
export async function asignarRolInicial(usuarioId: string, rol: 'ASESOR' | 'CLIENTE') {
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) {
    throw ApiError.notFound('Usuario no encontrado');
  }
  if (usuario.rol !== null) {
    throw ApiError.conflict('El rol ya fue asignado previamente');
  }

  return prisma.$transaction(async (tx) => {
    const usuarioActualizado = await tx.usuario.update({
      where: { id: usuarioId },
      data: { rol },
    });

    if (rol === 'ASESOR') {
      await tx.perfilAsesor.create({ data: { usuarioId } });
    } else {
      await tx.perfilCliente.create({ data: { usuarioId } });
    }

    return usuarioActualizado;
  });
}

/** Obtiene el perfil propio, incluyendo el perfil extendido segun el rol */
export async function obtenerPerfilPropio(usuarioId: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: { perfilAsesor: true, perfilCliente: true },
  });
  if (!usuario) {
    throw ApiError.notFound('Usuario no encontrado');
  }
  return usuario;
}

/** Edita datos basicos del perfil (nombre, foto) */
export async function editarPerfilPropio(
  usuarioId: string,
  datos: { nombre?: string; fotoPerfil?: string },
) {
  return prisma.usuario.update({ where: { id: usuarioId }, data: datos });
}
