// ==========================================================
// Configuracion de Swagger (OpenAPI) para documentar la API.
// Se genera a partir de comentarios JSDoc en los archivos de rutas.
// Disponible en /docs cuando el servidor esta corriendo.
// ==========================================================
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PROYECTOH API',
      version: '1.0.0',
      description:
        'API REST para la plataforma de Asesores y Clientes: publicaciones, comentarios, reacciones, evaluaciones y verificacion de perfil.',
    },
    servers: [{ url: `http://localhost:${env.port}${env.apiPrefix}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
    },
  },
  // Lee las anotaciones @swagger de todos los archivos de rutas
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
