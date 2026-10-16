// ==========================================================
// Servicio del modulo Asesores: perfil publico, listado,
// verificacion de identidad y evaluaciones recibidas.
// ==========================================================
import { prisma } from '../../common/prisma';
import { ApiError } from '../../common/utils/apiError';

/** Calcula promedios de evaluacion de un asesor a partir de sus EvaluacionAsesor */
async function calcularPromediosAsesor(asesorId: string) {
  const agregados = await prisma.evaluacionAsesor.aggregate({
    where: { asesorId },
    _avg: { calificacion: true, confiabilidad: true, compromiso: true, eficiencia: true },
    _count: true,
  });

  return {
    promedios: {
      calificacion: agregados._avg.calificacion ?? 0,
      confiabilidad: agregados._avg.confiabilidad ?? 0,
      compromiso: agregados._avg.compromiso ?? 0,
      eficiencia: agregados._avg.eficiencia ?? 0,
    },
    totalEvaluaciones: agregados._count,
  };
}

/** Obtiene el perfil publico de un asesor (para clientes) */
export async function obtenerPerfilPublico(asesorId: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: asesorId },
    include: { perfilAsesor: true },
  });

  if (!usuario || usuario.rol !== 'ASESOR' || !usuario.perfilAsesor) {
    throw ApiError.notFound('Asesor no encontrado');
  }

  const { promedios, totalEvaluaciones } = await calcularPromediosAsesor(asesorId);

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    fotoPerfil: usuario.fotoPerfil,
    verificado: usuario.perfilAsesor.estadoVerificacion === 'VERIFICADO',
    promedios,
    totalEvaluaciones,
  };
}

/** Lista/busca asesores de forma paginada (solo visible para CLIENTE) */
export async function listarAsesores(pagina: number, limite: number, busqueda?: string) {
  const where = {
    rol: 'ASESOR' as const,
    ...(busqueda ? { nombre: { contains: busqueda, mode: 'insensitive' as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.usuario.findMany({
      where,
      include: { perfilAsesor: true },
      skip: (pagina - 1) * limite,
      take: limite,
      orderBy: { creadoEn: 'desc' },
    }),
    prisma.usuario.count({ where }),
  ]);

  return {
    items: items.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      fotoPerfil: u.fotoPerfil,
      verificado: u.perfilAsesor?.estadoVerificacion === 'VERIFICADO',
    })),
    paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
  };
}

/** Sube documentos de verificacion y cambia el estado a PENDIENTE */
export async function solicitarVerificacion(
  usuarioId: string,
  rutas: { documentoFrontal: string; documentoSello: string },
) {
  const perfil = await prisma.perfilAsesor.findUnique({ where: { usuarioId } });
  if (!perfil) {
    throw ApiError.notFound('Perfil de asesor no encontrado');
  }
  if (perfil.estadoVerificacion === 'VERIFICADO') {
    throw ApiError.conflict('El perfil ya se encuentra verificado');
  }
  if (perfil.estadoVerificacion === 'PENDIENTE') {
    throw ApiError.conflict('Ya existe una solicitud de verificacion en tramite');
  }

  return prisma.perfilAsesor.update({
    where: { usuarioId },
    data: {
      documentoIdentidadFrontal: rutas.documentoFrontal,
      documentoIdentidadSello: rutas.documentoSello,
      estadoVerificacion: 'PENDIENTE',
      fechaSolicitudVerificacion: new Date(),
      motivoRechazo: null,
    },
  });
}

/** Consulta el estado actual de verificacion del asesor autenticado */
export async function obtenerEstadoVerificacion(usuarioId: string) {
  const perfil = await prisma.perfilAsesor.findUnique({ where: { usuarioId } });
  if (!perfil) {
    throw ApiError.notFound('Perfil de asesor no encontrado');
  }
  return perfil;
}

/** Webhook interno: la plataforma externa de administracion actualiza el estado de verificacion */
export async function actualizarVerificacionInterna(
  usuarioId: string,
  estado: 'VERIFICADO' | 'RECHAZADO',
  motivoRechazo?: string | null,
) {
  const perfil = await prisma.perfilAsesor.findUnique({ where: { usuarioId } });
  if (!perfil) {
    throw ApiError.notFound('Perfil de asesor no encontrado o sin solicitud');
  }
  if (perfil.estadoVerificacion !== 'PENDIENTE') {
    throw ApiError.conflict('No existe una solicitud de verificacion pendiente');
  }

  return prisma.perfilAsesor.update({
    where: { usuarioId },
    data: {
      estadoVerificacion: estado,
      fechaVerificacion: estado === 'VERIFICADO' ? new Date() : null,
      motivoRechazo: estado === 'RECHAZADO' ? (motivoRechazo ?? 'No especificado') : null,
    },
  });
}

/** Un CLIENTE evalua a un ASESOR (una sola vez, 4 criterios) */
export async function crearEvaluacionAsesor(
  asesorId: string,
  clienteId: string,
  datos: { calificacion: number; confiabilidad: number; compromiso: number; eficiencia: number },
) {
  if (asesorId === clienteId) {
    throw ApiError.forbidden('No puede evaluarse a si mismo');
  }

  const asesor = await prisma.usuario.findUnique({ where: { id: asesorId } });
  if (!asesor || asesor.rol !== 'ASESOR') {
    throw ApiError.notFound('Asesor no encontrado');
  }

  const yaExiste = await prisma.evaluacionAsesor.findUnique({
    where: { asesorId_clienteId: { asesorId, clienteId } },
  });
  if (yaExiste) {
    throw ApiError.conflict('Ya existe una evaluacion de este cliente hacia este asesor');
  }

  return prisma.evaluacionAsesor.create({
    data: { asesorId, clienteId, ...datos },
  });
}

/** Lista las evaluaciones recibidas por un asesor */
export async function listarEvaluacionesAsesor(asesorId: string) {
  return prisma.evaluacionAsesor.findMany({
    where: { asesorId },
    orderBy: { creadoEn: 'desc' },
  });
}
