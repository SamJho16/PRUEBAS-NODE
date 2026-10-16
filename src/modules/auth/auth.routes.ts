// ==========================================================
// Rutas del modulo Auth: /api/v1/auth/*
// ==========================================================
import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import { loginGoogleSchema, loginFacebookSchema } from './auth.validation';
import * as authController from './auth.controller';

const router = Router();

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login/registro con Google (recibe idToken)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken: { type: string }
 *     responses:
 *       200: { description: Login exitoso }
 */
router.post('/google', validate({ body: loginGoogleSchema }), authController.loginGoogle);

/**
 * @swagger
 * /auth/facebook:
 *   post:
 *     summary: Login/registro con Facebook (recibe accessToken)
 *     tags: [Auth]
 *     responses:
 *       200: { description: Login exitoso }
 */
router.post('/facebook', validate({ body: loginFacebookSchema }), authController.loginFacebook);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renueva el accessToken usando el refreshToken (cookie httpOnly)
 *     tags: [Auth]
 *     responses:
 *       200: { description: Nuevo accessToken }
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Invalida el refreshToken
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Sesion cerrada }
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna el usuario autenticado actual
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Usuario actual }
 */
router.get('/me', authenticate, authController.me);

export default router;
