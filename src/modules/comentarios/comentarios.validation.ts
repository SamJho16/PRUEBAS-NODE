// ==========================================================
// Esquemas de validacion (Zod) del modulo Comentarios.
// ==========================================================
import { z } from 'zod';

export const crearComentarioSchema = z.object({
  contenido: z.string().min(1).max(2000),
});

export const editarComentarioSchema = z.object({
  contenido: z.string().min(1).max(2000),
});

export const publicacionIdParamSchema = z.object({
  publicacionId: z.string().uuid('publicacionId invalido'),
});

export const comentarioIdParamSchema = z.object({
  id: z.string().uuid('id invalido'),
});
