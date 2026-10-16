// ==========================================================
// Esquemas de validacion (Zod) del modulo Usuarios.
// ==========================================================
import { z } from 'zod';

export const asignarRolSchema = z.object({
  rol: z.enum(['ASESOR', 'CLIENTE']),
});

export const editarPerfilSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  fotoPerfil: z.string().url().optional(),
});
