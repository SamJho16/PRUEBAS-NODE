// ==========================================================
// Rutas del modulo Usuarios: /api/v1/usuarios/*
// ==========================================================
import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { asignarRolSchema, editarPerfilSchema } from './usuarios.validation';
import * as usuariosController from './usuarios.controller';

const router = Router();

router.use(authenticate); // todas las rutas de este modulo requieren autenticacion

/**
 * @swagger
 * /usuarios/me/rol:
 *   patch:
 *     summary: Asigna el rol inicial (solo una vez, si no fue definido)
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Rol asignado }
 *       409: { description: El rol ya fue asignado }
 */
router.patch('/me/rol', validate({ body: asignarRolSchema }), usuariosController.asignarRol);

/**
 * @swagger
 * /usuarios/me:
 *   get:
 *     summary: Obtiene perfil propio + datos de perfil extendido
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil del usuario }
 */
router.get('/me', usuariosController.obtenerMe);

/**
 * @swagger
 * /usuarios/me:
 *   patch:
 *     summary: Edita datos basicos (nombre, foto)
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil actualizado }
 */
router.patch('/me', validate({ body: editarPerfilSchema }), usuariosController.editarMe);

export default router;
