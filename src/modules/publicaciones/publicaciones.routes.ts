// ==========================================================
// Rutas del modulo Publicaciones: /api/v1/publicaciones/*
// ==========================================================
import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import {
  crearPublicacionSchema,
  editarPublicacionSchema,
  idParamSchema,
  listarPublicacionesQuerySchema,
} from './publicaciones.validation';
import * as publicacionesController from './publicaciones.controller';
import comentariosRouter from '../comentarios/comentarios.routes';
import reaccionesRouter from '../reacciones/reacciones.routes';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /publicaciones:
 *   post:
 *     summary: Crea una publicacion
 *     tags: [Publicaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Publicacion creada }
 *   get:
 *     summary: Lista publicaciones visibles segun rol cruzado (paginado)
 *     tags: [Publicaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Listado paginado }
 */
router.post('/', validate({ body: crearPublicacionSchema }), publicacionesController.crear);
router.get(
  '/',
  validate({ query: listarPublicacionesQuerySchema }),
  publicacionesController.listar,
);

/**
 * @swagger
 * /publicaciones/{id}:
 *   get:
 *     summary: Detalle de una publicacion (respeta regla de visibilidad, salvo autor)
 *     tags: [Publicaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Detalle de la publicacion }
 *   patch:
 *     summary: Edita una publicacion propia
 *     tags: [Publicaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Publicacion actualizada }
 *   delete:
 *     summary: Elimina (soft delete) una publicacion propia
 *     tags: [Publicaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Publicacion eliminada }
 */
router.get('/:id', validate({ params: idParamSchema }), publicacionesController.obtener);
router.patch(
  '/:id',
  validate({ params: idParamSchema, body: editarPublicacionSchema }),
  publicacionesController.editar,
);
router.delete('/:id', validate({ params: idParamSchema }), publicacionesController.eliminar);

// Sub-rutas anidadas: comentarios y reacciones de una publicacion especifica
router.use('/:publicacionId/comentarios', comentariosRouter);
router.use('/:publicacionId/reacciones', reaccionesRouter);

export default router;
