# Plantilla DevOps — Electiva 1 (ITLA 2026-C-3)

Aplicación web mínima (lista de tareas) con todo lo necesario para practicar un pipeline **CI/CD** sin cuentas pagas ni Azure:

| Pieza | Archivo | Para qué sirve |
|---|---|---|
| App Node.js/Express | `src/app.js`, `src/server.js` | API de tareas + `/health` y `/metrics` |
| Frontend estático | `public/index.html` | Se publica en GitHub Pages |
| Pruebas automatizadas | `tests/app.test.js` | Jest + Supertest con cobertura |
| Contenedor | `Dockerfile` | Imagen de producción con *healthcheck* |
| Pipeline | `.github/workflows/ci.yml` | Lint → pruebas → build Docker → deploy a Pages |

## Requisitos (gratis)
- Cuenta de **GitHub** (usa un repositorio **público**: GitHub Actions es gratuito).
- **Git** y **Node.js 20+**. Opcional para probar el contenedor en tu PC: **Docker Desktop**.

## Ejecutar en tu computadora
```bash
npm install
npm test          # pruebas + cobertura
npm start         # http://localhost:3000
```
Endpoints: `GET /health`, `GET /metrics`, `GET/POST /api/tareas`, `PATCH /api/tareas/:id`.

Con Docker:
```bash
docker build -t tareas-devops .
docker run -p 3000:3000 tareas-devops
```

## Subirlo a GitHub y activar el pipeline
1. Crea un repositorio **público** vacío en GitHub (sin README).
2. En la carpeta de la plantilla:
   ```bash
   git init
   git add .
   git commit -m "Plantilla inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: GitHub Actions**.
4. Abre la pestaña **Actions**: verás el workflow *CI/CD* ejecutándose. Cuando termine, la URL de tu página aparece en el job *Despliegue a GitHub Pages*.

## Práctica 3 — qué debes agregar
- Al menos **2 pruebas nuevas** (por ejemplo: borrar tareas, validar títulos largos).
- Una funcionalidad nueva pequeña con su prueba (ej. `DELETE /api/tareas/:id`).
- Provocar a propósito una prueba fallida, mostrar que el pipeline se pone en **rojo**, corregirla y mostrarlo en **verde**.
- Completar este README con la explicación de cada etapa del pipeline.

## Proyecto Final — cómo extenderla
- Persistencia con **SQLite** (o MongoDB) en lugar del arreglo en memoria.
- Publicar la imagen en **GitHub Container Registry** (`ghcr.io`) desde el pipeline.
- Análisis estático real (ESLint) y umbral de cobertura mínima.
- Monitoreo: usar `/metrics` y los logs JSON; definir al menos una **alerta** (ej. errores > 0).
- Documentar: guía de instalación, manual de operaciones y lecciones aprendidas.
