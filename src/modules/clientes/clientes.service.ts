// ==========================================================
// Servicio del modulo Clientes: perfil publico y evaluaciones
// que los asesores realizan sobre los clientes.
// ==========================================================
import { prisma } from '../../common/prisma';
import { ApiError } from '../../common/utils/apiError';

/** Obtiene el perfil publico de un cliente (para asesores), con promedio de calificacion */
export async function obtenerPerfilPublico(clienteId: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: clienteId },
    include: { perfilCliente: true },
  });

  if (!usuario || usuario.rol !== 'CLIENTE' || !usuario.perfilCliente) {
    throw ApiError.notFound('Cliente no encontrado');
  }

  const agregado = await prisma.evaluacionCliente.aggregate({
    where: { clienteId },
    _avg: { calificacion: true },
    _count: true,
  });

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    fotoPerfil: usuario.fotoPerfil,
    promedioCalificacion: agregado._avg.calificacion ?? 0,
    totalEvaluaciones: agregado._count,
  };
}

/** Un ASESOR evalua a un CLIENTE (una sola vez, solo Calificacion) */
export async function crearEvaluacionCliente(
  clienteId: string,
  asesorId: string,
  calificacion: number,
) {
  if (asesorId === clienteId) {
    throw ApiError.forbidden('No puede evaluarse a si mismo');
  }

  const cliente = await prisma.usuario.findUnique({ where: { id: clienteId } });
  if (!cliente || cliente.rol !== 'CLIENTE') {
    throw ApiError.notFound('Cliente no encontrado');
  }

  const yaExiste = await prisma.evaluacionCliente.findUnique({
    where: { clienteId_asesorId: { clienteId, asesorId } },
  });
  if (yaExiste) {
    throw ApiError.conflict('Ya existe una evaluacion de este asesor hacia este cliente');
  }

  return prisma.evaluacionCliente.create({
    data: { clienteId, asesorId, calificacion },
  });
}

/** Lista las evaluaciones recibidas por un cliente */
export async function listarEvaluacionesCliente(clienteId: string) {
  return prisma.evaluacionCliente.findMany({
    where: { clienteId },
    orderBy: { creadoEn: 'desc' },
  });
}
