// ==========================================================
// Rutas del modulo Clientes: /api/v1/clientes/*
// ==========================================================
import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { authorize } from '../../common/middlewares/rbac.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import {
  idParamSchema,
  clienteIdParamSchema,
  crearEvaluacionClienteSchema,
} from './clientes.validation';
import * as clientesController from './clientes.controller';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtiene perfil publico de un cliente
 *     tags: [Clientes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil publico del cliente }
 */
router.get(
  '/:id',
  authorize('ASESOR'),
  validate({ params: idParamSchema }),
  clientesController.obtenerPerfilPublico,
);

/**
 * @swagger
 * /clientes/{clienteId}/evaluaciones:
 *   post:
 *     summary: Asesor evalua a un cliente (unica vez)
 *     tags: [Evaluaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Evaluacion creada }
 *   get:
 *     summary: Lista evaluaciones recibidas por un cliente
 *     tags: [Evaluaciones]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Listado de evaluaciones }
 */
router.post(
  '/:clienteId/evaluaciones',
  authorize('ASESOR'),
  validate({ params: clienteIdParamSchema, body: crearEvaluacionClienteSchema }),
  clientesController.crearEvaluacion,
);

router.get(
  '/:clienteId/evaluaciones',
  validate({ params: clienteIdParamSchema }),
  clientesController.listarEvaluaciones,
);

export default router;
