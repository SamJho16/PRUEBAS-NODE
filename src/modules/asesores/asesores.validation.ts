// ==========================================================
// Esquemas de validacion (Zod) del modulo Asesores.
// ==========================================================
import { z } from 'zod';

export const listarAsesoresQuerySchema = z.object({
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(10),
  busqueda: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid('id invalido'),
});

export const asesorIdParamSchema = z.object({
  asesorId: z.string().uuid('asesorId invalido'),
});

export const usuarioIdParamSchema = z.object({
  usuarioId: z.string().uuid('usuarioId invalido'),
});

export const crearEvaluacionAsesorSchema = z.object({
  calificacion: z.number().int().min(1).max(5),
  confiabilidad: z.number().int().min(1).max(5),
  compromiso: z.number().int().min(1).max(5),
  eficiencia: z.number().int().min(1).max(5),
});

export const actualizarVerificacionSchema = z.object({
  estado: z.enum(['VERIFICADO', 'RECHAZADO']),
  motivoRechazo: z.string().nullable().optional(),
});
