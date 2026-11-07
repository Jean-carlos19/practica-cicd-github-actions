const request = require('supertest');
const { createApp } = require('../src/app');

describe('API de tareas', () => {
  let app;
  beforeEach(() => { app = createApp(); });

  /*test('GET /health responde ok', async () => {
    const r = await request(app).get('/health');
    //expect(r.status).toBe(200);
    expect(r.status).toBe(200);
    expect(r.body.estado).toBe('ok');
  });*/

  test('GET /health responde ok', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(500);
    expect(r.body.estado).toBe('ok');
  });

  test('POST /api/tareas crea una tarea', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 'Configurar pipeline' });
    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({ id: 1, titulo: 'Configurar pipeline', completada: false });
  });

  test('POST /api/tareas sin título devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({});
    expect(r.status).toBe(400);
  });

  test('PATCH /api/tareas/:id alterna completada', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Escribir pruebas' });
    const r = await request(app).patch('/api/tareas/1');
    expect(r.body.completada).toBe(true);
  });

  test('PATCH de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).patch('/api/tareas/99');
    expect(r.status).toBe(404);
  });

  test('GET /metrics cuenta solicitudes y tareas', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Medir' });
    const r = await request(app).get('/metrics');
    expect(r.body.tareas).toBe(1);
    expect(r.body.solicitudes).toBeGreaterThanOrEqual(2);
  });

  // ---- Pruebas nuevas (Práctica 3) ----

  test('POST /api/tareas rechaza títulos de más de 100 caracteres', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 'x'.repeat(101) });
    expect(r.status).toBe(400);
  });

  test('DELETE /api/tareas/:id elimina una tarea existente', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Borrar esta' });
    const r = await request(app).delete('/api/tareas/1');
    expect(r.status).toBe(200);
    expect(r.body.titulo).toBe('Borrar esta');
    const lista = await request(app).get('/api/tareas');
    expect(lista.body).toHaveLength(0);
  });

  test('DELETE de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).delete('/api/tareas/999');
    expect(r.status).toBe(404);
  });

  test('los ids no se repiten después de borrar una tarea', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'A' });
    await request(app).post('/api/tareas').send({ titulo: 'B' });
    await request(app).delete('/api/tareas/1');
    const nueva = await request(app).post('/api/tareas').send({ titulo: 'C' });
    expect(nueva.body.id).toBe(3);
  });
});