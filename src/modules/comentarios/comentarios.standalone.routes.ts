// ==========================================================
// Rutas "planas" del modulo Comentarios: /api/v1/comentarios/:id
// (editar/eliminar un comentario propio, no depende de la publicacion)
// ==========================================================
import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { editarComentarioSchema, comentarioIdParamSchema } from './comentarios.validation';
import * as comentariosController from './comentarios.controller';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /comentarios/{id}:
 *   patch:
 *     summary: Edita un comentario propio
 *     tags: [Comentarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Comentario actualizado }
 *   delete:
 *     summary: Elimina un comentario propio
 *     tags: [Comentarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Comentario eliminado }
 */
router.patch(
  '/:id',
  validate({ params: comentarioIdParamSchema, body: editarComentarioSchema }),
  comentariosController.editar,
);
router.delete(
  '/:id',
  validate({ params: comentarioIdParamSchema }),
  comentariosController.eliminar,
);

export default router;
