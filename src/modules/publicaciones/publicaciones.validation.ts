// ==========================================================
// Esquemas de validacion (Zod) del modulo Publicaciones.
// ==========================================================
import { z } from 'zod';

export const crearPublicacionSchema = z.object({
  titulo: z.string().min(3).max(150),
  contenido: z.string().min(1).max(5000),
});

export const editarPublicacionSchema = z.object({
  titulo: z.string().min(3).max(150).optional(),
  contenido: z.string().min(1).max(5000).optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid('id invalido'),
});

export const listarPublicacionesQuerySchema = z.object({
  pagina: z.coerce.number().int().min(1).default(1),
  limite: z.coerce.number().int().min(1).max(100).default(10),
});
