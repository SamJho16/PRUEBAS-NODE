// ==========================================================
// Esquemas de validacion (Zod) del modulo Reacciones.
// ==========================================================
import { z } from 'zod';

export const crearReaccionSchema = z.object({
  tipo: z.literal('ME_INTERESA'),
});

export const publicacionIdParamSchema = z.object({
  publicacionId: z.string().uuid('publicacionId invalido'),
});
