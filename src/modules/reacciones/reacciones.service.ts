// ==========================================================
// Servicio del modulo Reacciones.
// Regla: 1 reaccion por usuario por publicacion (unique constraint).
// ==========================================================
import { prisma } from '../../common/prisma';
import { ApiError } from '../../common/utils/apiError';

async function obtenerPublicacionOFallar(publicacionId: string) {
  const publicacion = await prisma.publicacion.findUnique({ where: { id: publicacionId } });
  if (!publicacion || publicacion.estado === 'ELIMINADA') {
    throw ApiError.notFound('Publicacion no encontrada');
  }
  return publicacion;
}

/** Agrega la reaccion del usuario a la publicacion (falla si ya reacciono: 409) */
export async function agregarReaccion(publicacionId: string, usuarioId: string) {
  await obtenerPublicacionOFallar(publicacionId);

  const yaReacciono = await prisma.reaccion.findUnique({
    where: { publicacionId_usuarioId: { publicacionId, usuarioId } },
  });
  if (yaReacciono) {
    throw ApiError.conflict('Ya reacciono a esta publicacion');
  }

  return prisma.$transaction(async (tx) => {
    const reaccion = await tx.reaccion.create({
      data: { publicacionId, usuarioId, tipo: 'ME_INTERESA' },
    });
    await tx.publicacion.update({
      where: { id: publicacionId },
      data: { totalReacciones: { increment: 1 } },
    });
    return reaccion;
  });
}

/** Quita la reaccion propia del usuario sobre la publicacion */
export async function quitarReaccion(publicacionId: string, usuarioId: string) {
  const reaccion = await prisma.reaccion.findUnique({
    where: { publicacionId_usuarioId: { publicacionId, usuarioId } },
  });
  if (!reaccion) {
    throw ApiError.notFound('No existe una reaccion previa de este usuario');
  }

  await prisma.$transaction(async (tx) => {
    await tx.reaccion.delete({ where: { id: reaccion.id } });
    await tx.publicacion.update({
      where: { id: publicacionId },
      data: { totalReacciones: { decrement: 1 } },
    });
  });
}
