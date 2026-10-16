// ==========================================================
// Punto de entrada del servidor: levanta Express en el puerto configurado.
// ==========================================================
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`Servidor PROYECTOH escuchando en http://localhost:${env.port}`);
  console.log(`Documentacion Swagger disponible en http://localhost:${env.port}/docs`);
});
