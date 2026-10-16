// ==========================================================
// Servicio del modulo Comentarios.
// Regla de negocio: el listado de comentarios solo lo puede
// ver el dueno de la publicacion. El conteo si es publico
// (se mantiene desnormalizado en Publicacion.totalComentarios).
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

/** Crea un comentario y actualiza el contador desnormalizado de la publicacion */
export async function crearComentario(
  publicacionId: string,
  autorId: string,
  contenido: string,
) {
  await obtenerPublicacionOFallar(publicacionId);

  return prisma.$transaction(async (tx) => {
    const comentario = await tx.comentario.create({
      data: { publicacionId, autorId, contenido },
    });
    await tx.publicacion.update({
      where: { id: publicacionId },
      data: { totalComentarios: { increment: 1 } },
    });
    return comentario;
  });
}

/** Lista los comentarios de una publicacion; solo permitido al dueno de la publicacion */
export async function listarComentarios(publicacionId: string, usuarioId: string) {
  const publicacion = await obtenerPublicacionOFallar(publicacionId);

  if (publicacion.autorId !== usuarioId) {
    throw ApiError.forbidden('Solo el dueno de la publicacion puede ver los comentarios');
  }

  return prisma.comentario.findMany({
    where: { publicacionId },
    include: { autor: { select: { id: true, nombre: true, fotoPerfil: true } } },
    orderBy: { creadoEn: 'asc' },
  });
}

async function obtenerComentarioPropio(comentarioId: string, usuarioId: string) {
  const comentario = await prisma.comentario.findUnique({ where: { id: comentarioId } });
  if (!comentario) {
    throw ApiError.notFound('Comentario no encontrado');
  }
  if (comentario.autorId !== usuarioId) {
    throw ApiError.forbidden('Solo el autor puede modificar este comentario');
  }
  return comentario;
}

export async function editarComentario(comentarioId: string, usuarioId: string, contenido: string) {
  await obtenerComentarioPropio(comentarioId, usuarioId);
  return prisma.comentario.update({ where: { id: comentarioId }, data: { contenido } });
}

/** Elimina un comentario propio y decrementa el contador desnormalizado */
export async function eliminarComentario(comentarioId: string, usuarioId: string) {
  const comentario = await obtenerComentarioPropio(comentarioId, usuarioId);

  await prisma.$transaction(async (tx) => {
    await tx.comentario.delete({ where: { id: comentarioId } });
    await tx.publicacion.update({
      where: { id: comentario.publicacionId },
      data: { totalComentarios: { decrement: 1 } },
    });
  });
}
