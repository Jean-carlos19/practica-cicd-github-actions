// Aplicación web mínima: lista de tareas en memoria + endpoints de salud y métricas.
const express = require('express');
const path = require('path');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const tareas = [];
  let siguienteId = 1;
  const metricas = { solicitudes: 0, errores: 0, inicio: Date.now() };

  // Registro (log) simple de cada solicitud: base para el monitoreo.
  app.use((req, res, next) => {
    metricas.solicitudes++;
    const t0 = Date.now();
    res.on('finish', () => {
      if (res.statusCode >= 500) metricas.errores++;
      if (process.env.NODE_ENV !== 'test') console.log(JSON.stringify({ nivel: 'info', metodo: req.method, ruta: req.path, estado: res.statusCode, ms: Date.now() - t0 }));
    });
    next();
  });

  app.get('/health', (req, res) => res.json({ estado: 'ok' }));

  app.get('/metrics', (req, res) => res.json({
    solicitudes: metricas.solicitudes,
    errores: metricas.errores,
    tareas: tareas.length,
    segundosActivo: Math.round((Date.now() - metricas.inicio) / 1000)
  }));

  app.get('/api/tareas', (req, res) => res.json(tareas));

  app.post('/api/tareas', (req, res) => {
    const titulo = (req.body && typeof req.body.titulo === 'string') ? req.body.titulo.trim() : '';
    if (!titulo) return res.status(400).json({ error: 'El título es obligatorio' });
    if (titulo.length > 100) return res.status(400).json({ error: 'El título no puede superar 100 caracteres' });
    const tarea = { id: siguienteId++, titulo, completada: false };
    tareas.push(tarea);
    res.status(201).json(tarea);
  });

  app.patch('/api/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === Number(req.params.id));
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    tarea.completada = !tarea.completada;
    res.json(tarea);
  });

  app.delete('/api/tareas/:id', (req, res) => {
    const indice = tareas.findIndex(t => t.id === Number(req.params.id));
    if (indice === -1) return res.status(404).json({ error: 'Tarea no encontrada' });
    const [eliminada] = tareas.splice(indice, 1);
    res.json(eliminada);
  });

  return app;
}

module.exports = { createApp };