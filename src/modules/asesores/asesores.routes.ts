// ==========================================================
// Rutas del modulo Asesores: /api/v1/asesores/* y
// /internal/v1/verificaciones/* (webhook service-to-service)
// ==========================================================
import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { apiKeyAuth } from '../../common/middlewares/apiKey.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { uploadVerificacion } from '../../common/middlewares/upload.middleware';
import {
  listarAsesoresQuerySchema,
  idParamSchema,
  asesorIdParamSchema,
  usuarioIdParamSchema,
  crearEvaluacionAsesorSchema,
  actualizarVerificacionSchema,
} from './asesores.validation';
import * as asesoresController from './asesores.controller';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /asesores:
 *   get:
 *     summary: Lista/busca asesores (paginado, filtros)
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Listado paginado de asesores }
 */
router.get(
  '/',
  authorize('CLIENTE'),
  validate({ query: listarAsesoresQuerySchema }),
  asesoresController.listarAsesores,
);

/**
 * @swagger
 * /asesores/me/verificacion:
 *   post:
 *     summary: Sube documentos (frontal + sello) y pasa a estado PENDIENTE
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Solicitud de verificacion creada }
 */
router.post(
  '/me/verificacion',
  authorize('ASESOR'),
  uploadVerificacion.fields([
    { name: 'documentoFrontal', maxCount: 1 },
    { name: 'documentoSello', maxCount: 1 },
  ]),
  asesoresController.solicitarVerificacion,
);

/**
 * @swagger
 * /asesores/me/verificacion:
 *   get:
 *     summary: Consulta el estado actual de su verificacion
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Estado de verificacion }
 */
router.get('/me/verificacion', authorize('ASESOR'), asesoresController.obtenerEstadoVerificacion);

/**
 * @swagger
 * /asesores/{id}:
 *   get:
 *     summary: Obtiene perfil publico de un asesor
 *     tags: [Asesores]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil publico del asesor }
 */
router.get('/:id', validate({ params: idParamSchema }), asesoresController.obtenerPerfilPublico);

/**
 * @swagger
 * /asesores/{asesorId}/evaluaciones:
 *   post:
 *     summary: Cliente evalua a un asesor (unica vez)
 *     tags: [Evaluaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Evaluacion creada }
 *   get:
 *     summary: Lista evaluaciones recibidas por un asesor
 *     tags: [Evaluaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Listado de evaluaciones }
 */
router.post(
  '/:asesorId/evaluaciones',
  authorize('CLIENTE'),
  validate({ params: asesorIdParamSchema, body: crearEvaluacionAsesorSchema }),
  asesoresController.crearEvaluacion,
);

router.get(
  '/:asesorId/evaluaciones',
  validate({ params: asesorIdParamSchema }),
  asesoresController.listarEvaluaciones,
);

// ---- Ruta interna (webhook service-to-service, protegida por API Key) ----
const internalRouter = Router();

/**
 * @swagger
 * /internal/v1/verificaciones/{usuarioId}:
 *   patch:
 *     summary: Webhook interno - actualiza el estado de verificacion (VERIFICADO/RECHAZADO)
 *     tags: [Verificacion Interna]
 *     security: [{ apiKeyAuth: [] }]
 *     responses:
 *       200: { description: Estado actualizado }
 */
internalRouter.patch(
  '/verificaciones/:usuarioId',
  apiKeyAuth,
  validate({ params: usuarioIdParamSchema, body: actualizarVerificacionSchema }),
  asesoresController.actualizarVerificacionInterna,
);

export { internalRouter };
export default router;
