# Arquitectura y Stack Tecnologico

## Resumen de arquitectura

- Frontend: React + TypeScript + Vite + Tailwind CSS + Recharts.
- Backend: FastAPI con modelos Pydantic y rutas REST.
- Orquestacion local: Docker Compose con servicios frontend y backend.

Evidencia:

- [frontend/package.json](../../frontend/package.json)
- [backend/app/main.py](../../backend/app/main.py)
- [backend/app/routes.py](../../backend/app/routes.py)
- [docker-compose.yml](../../docker-compose.yml)

## Stack detallado

### Frontend

- Framework: react, react-dom.
- Build/dev server: vite.
- Lenguaje: typescript.
- Estilos: tailwindcss + @tailwindcss/vite.
- Graficos: recharts.
- Testing: vitest.

Evidencia:

- [frontend/package.json](../../frontend/package.json)
- [frontend/src/index.css](../../frontend/src/index.css)

### Backend

- API framework: fastapi.
- Runtime server: uvicorn.
- Debug local: debugpy.
- Testing: pytest, pytest-cov, httpx.

Evidencia:

- [backend/requirements.txt](../../backend/requirements.txt)
- [backend/Dockerfile](../../backend/Dockerfile)

### Infraestructura y tooling

- Contenedores: Dockerfiles separados para frontend y backend.
- Orquestacion: docker compose.
- Proxy local de API en Vite hacia backend.
- Alias de imports frontend con @ -> src.

Evidencia:

- [frontend/Dockerfile](../../frontend/Dockerfile)
- [backend/Dockerfile](../../backend/Dockerfile)
- [docker-compose.yml](../../docker-compose.yml)
- [frontend/vite.config.ts](../../frontend/vite.config.ts)
- [frontend/tsconfig.app.json](../../frontend/tsconfig.app.json)

## Endpoints de API implementados

- GET /health
- GET /api/metrics
- GET /api/metrics/facets
- GET /api/metrics/summary
- GET /api/metrics/categories/top
- GET /api/metrics/comparison
- GET /api/metrics/alerts
- GET /api/metrics/b2b
- GET /api/metrics/b2c

Evidencia:

- [backend/app/routes.py](../../backend/app/routes.py)

## Flujo de datos (alto nivel)

1. Frontend solicita datos a /api/metrics usando fetch en App.
2. Vite proxy redirige /api al servicio backend.
3. Backend genera dataset mock deterministico y aplica filtros.
4. Frontend transforma movimientos a KPIs y serie mensual.
5. Componentes de dashboard renderizan tarjetas y graficos.

Evidencia:

- [frontend/src/App.tsx](../../frontend/src/App.tsx)
- [frontend/src/lib/financial-utils.ts](../../frontend/src/lib/financial-utils.ts)
- [backend/app/routes.py](../../backend/app/routes.py)
- [frontend/vite.config.ts](../../frontend/vite.config.ts)
