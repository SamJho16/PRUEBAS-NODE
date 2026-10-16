// ==========================================================
// Rutas del modulo Reacciones (anidadas bajo /publicaciones/:publicacionId/reacciones)
// ==========================================================
import { Router } from 'express';
import { validate } from '../../common/middlewares/validate.middleware';
import { crearReaccionSchema, publicacionIdParamSchema } from './reacciones.validation';
import * as reaccionesController from './reacciones.controller';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /publicaciones/{publicacionId}/reacciones:
 *   post:
 *     summary: Agrega reaccion (ME_INTERESA) del usuario a la publicacion
 *     tags: [Reacciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Reaccion agregada }
 *   delete:
 *     summary: Quita su propia reaccion
 *     tags: [Reacciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Reaccion eliminada }
 */
router.post(
  '/',
  validate({ params: publicacionIdParamSchema, body: crearReaccionSchema }),
  reaccionesController.agregar,
);
router.delete(
  '/',
  validate({ params: publicacionIdParamSchema }),
  reaccionesController.quitar,
);

export default router;
