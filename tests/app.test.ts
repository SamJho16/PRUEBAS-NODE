// ==========================================================
// Prueba basica de humo (smoke test): verifica que la app
// levanta y responde en /health y devuelve 404 controlado
// para rutas inexistentes.
// ==========================================================
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Aplicacion Express', () => {
  it('GET /health responde 200 con status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /ruta-inexistente responde 404 con formato de error consistente', async () => {
    const res = await request(app).get('/ruta-inexistente');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/v1/auth/me sin token responde 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
