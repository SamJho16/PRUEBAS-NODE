// ==========================================================
// Esquemas de validacion (Zod) del modulo Clientes.
// ==========================================================
import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().uuid('id invalido'),
});

export const clienteIdParamSchema = z.object({
  clienteId: z.string().uuid('clienteId invalido'),
});

export const crearEvaluacionClienteSchema = z.object({
  calificacion: z.number().int().min(1).max(5),
});
