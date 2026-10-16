// ==========================================================
// Esquemas de validacion (Zod) del modulo Auth.
// ==========================================================
import { z } from 'zod';

export const loginGoogleSchema = z.object({
  idToken: z.string().min(10, 'idToken requerido'),
});

export const loginFacebookSchema = z.object({
  accessToken: z.string().min(10, 'accessToken requerido'),
});
