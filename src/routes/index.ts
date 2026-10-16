// ==========================================================
// Agregador central de rutas de la API bajo el prefijo /api/v1
// ==========================================================
import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import usuariosRoutes from '../modules/usuarios/usuarios.routes';
import asesoresRoutes from '../modules/asesores/asesores.routes';
import clientesRoutes from '../modules/clientes/clientes.routes';
import publicacionesRoutes from '../modules/publicaciones/publicaciones.routes';
import comentariosStandaloneRoutes from '../modules/comentarios/comentarios.standalone.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/asesores', asesoresRoutes);
router.use('/clientes', clientesRoutes);
router.use('/publicaciones', publicacionesRoutes);
// Rutas planas de comentarios: PATCH/DELETE /api/v1/comentarios/:id
router.use('/comentarios', comentariosStandaloneRoutes);

export default router;
