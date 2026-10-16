// ==========================================================
// Rutas del modulo Comentarios.
// Este router se monta anidado bajo /publicaciones/:publicacionId/comentarios
// (mergeParams:true para heredar el parametro publicacionId).
// ==========================================================
import { Router } from 'express';
import { validate } from '../../common/middlewares/validate.middleware';
import {
  crearComentarioSchema,
  publicacionIdParamSchema,
} from './comentarios.validation';
import * as comentariosController from './comentarios.controller';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /publicaciones/{publicacionId}/comentarios:
 *   post:
 *     summary: Crea un comentario
 *     tags: [Comentarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Comentario creado }
 *   get:
 *     summary: Lista comentarios de la publicacion (solo dueno)
 *     tags: [Comentarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Listado de comentarios }
 */
router.post(
  '/',
  validate({ params: publicacionIdParamSchema, body: crearComentarioSchema }),
  comentariosController.crear,
);
router.get(
  '/',
  validate({ params: publicacionIdParamSchema }),
  comentariosController.listar,
);

export default router;
