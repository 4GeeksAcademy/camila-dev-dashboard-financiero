# Architecture Decisions Log

## AD-001: Frontend y backend desacoplados con proxy local

- Decision: usar React + Vite en frontend y FastAPI en backend, conectados por proxy de Vite para /api.
- Motivo: separacion de responsabilidades y DX simple en local/Codespaces.
- Impacto: facilita evolucion independiente de UI y API.

Evidencia:

- [frontend/vite.config.ts](../../frontend/vite.config.ts)
- [backend/app/main.py](../../backend/app/main.py)
- [README.md](../../README.md)

## AD-002: Datos mock deterministas para desarrollo y pruebas

- Decision: generar movimientos mock con semilla para resultados reproducibles.
- Motivo: estabilidad en pruebas y en revisiones funcionales del dashboard.
- Impacto: acelera iteracion, pero no reemplaza una capa real de persistencia.

Evidencia:

- [backend/app/routes.py](../../backend/app/routes.py)
- [backend/tests/test_routes.py](../../backend/tests/test_routes.py)

## AD-003: Componentizacion de dashboard y utilidades financieras separadas

- Decision: encapsular calculos en utilidades y reservar componentes para presentacion.
- Motivo: mejorar testabilidad y mantenibilidad.
- Impacto: reduce duplicacion de logica en UI.

Evidencia:

- [frontend/src/lib/financial-utils.ts](../../frontend/src/lib/financial-utils.ts)
- [frontend/src/components/dashboard/kpi-row.tsx](../../frontend/src/components/dashboard/kpi-row.tsx)
- [frontend/src/components/dashboard/income-outcome-chart.tsx](../../frontend/src/components/dashboard/income-outcome-chart.tsx)

## AD-004: Desarrollo containerizado

- Decision: ejecutar frontend y backend con Dockerfiles y docker compose.
- Motivo: entorno reproducible para contribuidores y estudiantes.
- Impacto: menor friccion de setup, costo extra de recursos locales.

Evidencia:

- [frontend/Dockerfile](../../frontend/Dockerfile)
- [backend/Dockerfile](../../backend/Dockerfile)
- [docker-compose.yml](../../docker-compose.yml)
