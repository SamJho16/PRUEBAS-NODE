// ==========================================================
// Servicio del modulo Publicaciones.
// Aplica la regla de visibilidad cruzada:
//  - Publicacion de ASESOR visible solo para CLIENTE
//  - Publicacion de CLIENTE visible solo para ASESOR
//  - El propio autor siempre puede ver su publicacion
// ==========================================================
import { prisma } from '../../common/prisma';
import { ApiError } from '../../common/utils/apiError';

/** Determina el rol "objetivo" que debe tener el lector segun el rol del autor */
function rolContrarioDe(rolAutor: 'ASESOR' | 'CLIENTE'): 'ASESOR' | 'CLIENTE' {
  return rolAutor === 'ASESOR' ? 'CLIENTE' : 'ASESOR';
}

/** Crea una publicacion; el autorRol se toma del rol actual del usuario autenticado */
export async function crearPublicacion(
  autorId: string,
  autorRol: 'ASESOR' | 'CLIENTE',
  datos: { titulo: string; contenido: string },
) {
  return prisma.publicacion.create({
    data: { autorId, autorRol, ...datos },
  });
}

/** Lista publicaciones visibles para el usuario segun su rol (regla de visibilidad cruzada) */
export async function listarPublicaciones(
  rolUsuario: 'ASESOR' | 'CLIENTE',
  pagina: number,
  limite: number,
) {
  const where = {
    estado: 'ACTIVA' as const,
    autorRol: rolContrarioDe(rolUsuario),
  };

  const [items, total] = await Promise.all([
    prisma.publicacion.findMany({
      where,
      include: { autor: { select: { id: true, nombre: true, fotoPerfil: true } } },
      skip: (pagina - 1) * limite,
      take: limite,
      orderBy: { creadoEn: 'desc' },
    }),
    prisma.publicacion.count({ where }),
  ]);

  return { items, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } };
}

/** Obtiene el detalle de una publicacion respetando la regla de visibilidad, salvo que sea el autor */
export async function obtenerPublicacion(
  publicacionId: string,
  usuarioId: string,
  rolUsuario: 'ASESOR' | 'CLIENTE',
) {
  const publicacion = await prisma.publicacion.findUnique({
    where: { id: publicacionId },
    include: {
      autor: { select: { id: true, nombre: true, fotoPerfil: true, perfilAsesor: true } },
    },
  });

  if (!publicacion || publicacion.estado === 'ELIMINADA') {
    throw ApiError.notFound('Publicacion no encontrada');
  }

  const esAutor = publicacion.autorId === usuarioId;
  // Es visible si el autor tiene el rol contrario al del lector (regla de visibilidad cruzada)
  const puedeVer = esAutor || publicacion.autorRol === rolContrarioDe(rolUsuario);

  if (!puedeVer) {
    throw ApiError.forbidden('No tiene permiso para ver esta publicacion');
  }

  return publicacion;
}

/** Verifica que el usuario sea el autor antes de editar/eliminar */
async function obtenerPublicacionPropia(publicacionId: string, usuarioId: string) {
  const publicacion = await prisma.publicacion.findUnique({ where: { id: publicacionId } });
  if (!publicacion || publicacion.estado === 'ELIMINADA') {
    throw ApiError.notFound('Publicacion no encontrada');
  }
  if (publicacion.autorId !== usuarioId) {
    throw ApiError.forbidden('Solo el autor puede modificar esta publicacion');
  }
  return publicacion;
}

export async function editarPublicacion(
  publicacionId: string,
  usuarioId: string,
  datos: { titulo?: string; contenido?: string },
) {
  await obtenerPublicacionPropia(publicacionId, usuarioId);
  return prisma.publicacion.update({ where: { id: publicacionId }, data: datos });
}

/** Elimina (soft delete) una publicacion propia, cambiando su estado a ELIMINADA */
export async function eliminarPublicacion(publicacionId: string, usuarioId: string) {
  await obtenerPublicacionPropia(publicacionId, usuarioId);
  await prisma.publicacion.update({
    where: { id: publicacionId },
    data: { estado: 'ELIMINADA' },
  });
}
